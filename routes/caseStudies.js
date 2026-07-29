const express = require("express");
const axios = require("axios");
const { getAccessToken, downloadFile } = require("../services/zoho");
const cache = require("../cache");
const zohoQueue = require("../zohoQueue");
const zohoRequest = require("../zohoRequest");

const router = express.Router();

const BASE_URL = `https://www.zohoapis.com/creator/v2.1/data/${process.env.ZOHO_OWNER}/${process.env.ZOHO_APP}/report/${process.env.ZOHO_REPORT}`;


/**
 * GET ALL CASE STUDIES
 */
router.get("/", async (req, res) => {

    try {

        // Check cache first
        const cached = cache.get("caseStudies");

        if (cached) {
            console.log("Serving case studies from cache");
            return res.json(cached);
        }

        console.log("Fetching case studies from Zoho");

        const token = await getAccessToken();

        const response = await zohoRequest(() =>
            axios.get(BASE_URL, {
                headers: {
                    Authorization: `Zoho-oauthtoken ${token}`,
                    Accept: "application/json"
                }
            })
        );

        const records = response.data.data || [];

        const caseStudies = records.map(record => ({
            id: record.ID,
            title: record.Title,
            description: record.Description,
            service: record.Service,
            industry: record.Industry,
            solution: record.Solution,
            author: record.Author,
            date: record.Date_field1,
            stat1: record.Stat_1,
            stat2: record.Stat_2,
            stat3: record.Stat_3,
            image: `/api/case-studies/${record.ID}/image`,
            pdf: `/api/case-studies/${record.ID}/pdf`
        }));

        // Save in cache
        cache.set("caseStudies", caseStudies);

        res.json(caseStudies);

    } catch (err) {

        console.error(err.response?.data || err.message);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve case studies."
        });

    }

});

/**
 * GET SINGLE CASE STUDY
 */

router.get("/:id", async (req, res) => {

    try {

        let caseStudies = cache.get("caseStudies");

        if (!caseStudies) {

            console.log("Cache empty - fetching from Zoho");

            const token = await getAccessToken();

            const response = await zohoRequest(() =>
                axios.get(BASE_URL, {
                    headers: {
                        Authorization: `Zoho-oauthtoken ${token}`,
                        Accept: "application/json"
                    }
                })
            );

            const records = response.data.data || [];

            caseStudies = records.map(record => ({
                id: record.ID,
                title: record.Title,
                description: record.Description,
                service: record.Service,
                industry: record.Industry,
                solution: record.Solution,
                author: record.Author,
                date: record.Date_field1,
                stat1: record.Stat_1,
                stat2: record.Stat_2,
                stat3: record.Stat_3,
                image: `/api/case-studies/${record.ID}/image`,
                pdf: `/api/case-studies/${record.ID}/pdf`
            }));

            cache.set("caseStudies", caseStudies);

        }

        const caseStudy = caseStudies.find(
            c => String(c.id) === req.params.id
        );

        if (!caseStudy) {
            return res.status(404).json({
                success: false,
                message: "Case study not found."
            });
        }

        res.json(caseStudy);

    } catch (err) {

        console.error(err.response?.data || err.message);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve case study."
        });

    }

});

/**
 * GET CASE STUDY IMAGE
 */
router.get("/:id/image", async (req, res) => {

    try {

        const cacheKey = `image-${req.params.id}`;

        // Check if image is already cached
        const cachedImage = cache.get(cacheKey);

        if (cachedImage) {

            console.log(`Serving image ${req.params.id} from cache`);

            res.setHeader("Content-Type", cachedImage.contentType);

            return res.send(cachedImage.buffer);

        }

        console.log(`Downloading image ${req.params.id} from Zoho`);

        const response = await zohoRequest(() =>
            downloadFile(
                req.params.id,
                "Image"
            )
        );

        // Convert stream to a buffer
        const chunks = [];

        response.data.on("data", chunk => chunks.push(chunk));

        response.data.on("end", () => {

            const buffer = Buffer.concat(chunks);

            // Store in cache
            cache.set(cacheKey, {
                buffer,
                contentType: response.headers["content-type"] || "image/jpeg"
            });

            res.setHeader(
                "Content-Type",
                response.headers["content-type"] || "image/jpeg"
            );

            res.send(buffer);

        });

        response.data.on("error", err => {
            throw err;
        });

    } catch (err) {

        console.error("IMAGE ERROR");
        console.error(err.response?.status);
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json({
            success: false,
            message: err.message
        });

    }

});

/**
 * GET CASE STUDY PDF
 */
router.get("/:id/pdf", async (req, res) => {

    try {

        const cacheKey = `pdf-${req.params.id}`;

        // Check cache first
        const cachedPdf = cache.get(cacheKey);

        if (cachedPdf) {

            console.log(`Serving PDF ${req.params.id} from cache`);

            res.setHeader("Content-Type", "application/pdf");

            return res.send(cachedPdf.buffer);

        }

        console.log(`Downloading PDF ${req.params.id} from Zoho`);

        const response = await zohoRequest(() =>
            downloadFile(
                req.params.id,
                "File_upload"
            )
        );

        const chunks = [];

        response.data.on("data", chunk => {
            chunks.push(chunk);
        });

        response.data.on("end", () => {

            const buffer = Buffer.concat(chunks);

            // Cache the PDF
            cache.set(cacheKey, {
                buffer
            });

            res.setHeader("Content-Type", "application/pdf");

            res.send(buffer);

        });

        response.data.on("error", err => {
            throw err;
        });

    } catch (err) {

        console.error("PDF ERROR");
        console.error(err.response?.status);
        console.error(err.response?.data || err.message);

        res.status(err.response?.status || 500).json({
            success: false,
            message: err.message
        });

    }

});
module.exports = router;