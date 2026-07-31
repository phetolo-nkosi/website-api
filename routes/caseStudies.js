const express = require("express");
const axios = require("axios");
const { getAccessToken, downloadFile } = require("../services/zoho");


const router = express.Router();

const BASE_URL = `https://www.zohoapis.com/creator/v2.1/data/${process.env.ZOHO_OWNER}/${process.env.ZOHO_APP}/report/${process.env.ZOHO_REPORT}`;


/**
 * GET ALL CASE STUDIES
 */
router.get("/", async (req, res) => {

    try {

        console.log("Fetching case studies from Zoho");

        const token = await getAccessToken();

        const response = await axios.get(BASE_URL, {
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`,
                Accept: "application/json"
            }
        });

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

        console.log("Fetching from Zoho");

        const token = await getAccessToken();

        const response = await axios.get(BASE_URL, {
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`,
                Accept: "application/json"
            }
        });

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

        console.log(`Downloading Image ${req.params.id} from Zoho`);

        // Assuming the Zoho field is named "Image"
        const response = await downloadFile(
            req.params.id,
            "Image" 
        );

        const chunks = [];

        response.data.on("data", chunk => {
            chunks.push(chunk);
        });

        response.data.on("end", () => {
            const buffer = Buffer.concat(chunks);
            // Using a generic image type, browsers can sniff the actual type
            res.setHeader("Content-Type", "image/jpeg");
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

        console.log(`Downloading PDF ${req.params.id} from Zoho`);

        const response = await downloadFile(
            req.params.id,
            "File_upload"
        );

        const chunks = [];

        response.data.on("data", chunk => {
            chunks.push(chunk);
        });

        response.data.on("end", () => {

            const buffer = Buffer.concat(chunks);

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