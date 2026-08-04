const express = require("express");
const axios = require("axios");
const path = require("path");

const {
    getAccessToken,
    downloadFile
} = require("../services/zoho");

const router = express.Router();

/**
 * Zoho Creator API endpoint used to retrieve
 * case study records from the configured report.
 */
const BASE_URL =
    `https://www.zohoapis.com/creator/v2.1/data/` +
    `${process.env.ZOHO_OWNER}/` +
    `${process.env.ZOHO_APP}/` +
    `report/${process.env.ZOHO_REPORT}`;


/**
 * ============================================================
 * GET ALL CASE STUDIES
 * ============================================================
 *
 * Retrieves all case studies from Zoho Creator and returns
 * only the fields required by the website.
 *
 * The image and PDF are not retrieved directly from Zoho here.
 * Instead, the API provides URLs that the website can call
 * when the image or PDF is required.
 */
router.get("/", async (req, res) => {

    try {

        console.log("Fetching case studies from Zoho...");

        // Generate a Zoho OAuth access token
        const token = await getAccessToken();

        // Retrieve case study records from Zoho Creator
        const response = await axios.get(BASE_URL, {
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`,
                Accept: "application/json"
            }
        });

        // Extract the records returned by Zoho
        const records = response.data.data || [];

        /**
         * Convert Zoho records into a simplified structure
         * that can be consumed by the website.
         */
        const caseStudies = records.map(record => ({

            // Basic case study information
            id: record.ID,
            title: record.Title,
            description: record.Description,

            // Classification
            service: record.Service,
            industry: record.Industry,

            // Case study content
            solution: record.Solution,
            author: record.Author,
            date: record.Date_field1,

            // Statistics displayed on the website
            stat1: record.Stat_1,
            stat2: record.Stat_2,
            stat3: record.Stat_3,

            /**
             * File endpoints.
             *
             * These routes are handled by this Express API
             * and retrieve the actual files from Zoho.
             */
            image: `/api/case-studies/${record.ID}/image`,
            pdf: `/api/case-studies/${record.ID}/pdf`
        }));

        // Return the case studies as JSON
        res.json(caseStudies);

    } catch (err) {

        // Log the Zoho/API error and notify frontend
        console.error(
            "CASE STUDIES ERROR:",
            err.response?.data || err.message
        );

        res.status(503).json({
            error: "Service Unavailable",
            message: "The case studies will load shortly."
        });

    }

});


/**
 * ============================================================
 * GET SINGLE CASE STUDY
 * ============================================================
 *
 * Retrieves a specific case study using its record ID.
 */
router.get("/:id", async (req, res) => {

    try {

        console.log(
            `Fetching case study ${req.params.id} from Zoho...`
        );

        // Generate a Zoho OAuth access token
        const token = await getAccessToken();

        // Retrieve case study records
        const response = await axios.get(BASE_URL, {
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`,
                Accept: "application/json"
            }
        });

        // Extract records from Zoho response
        const records = response.data.data || [];

        // Convert Zoho records into website-friendly objects
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

            // File endpoints
            image: `/api/case-studies/${record.ID}/image`,
            pdf: `/api/case-studies/${record.ID}/pdf`

        }));

        /**
         * Find the case study matching the ID
         * provided in the URL.
         */
        const caseStudy = caseStudies.find(
            study => String(study.id) === String(req.params.id)
        );

        // Return 404 if the case study does not exist
        if (!caseStudy) {

            return res.status(404).json({
                success: false,
                message: "Case study not found."
            });

        }

        // Return the requested case study
        res.json(caseStudy);

    } catch (err) {

        // Log the error
        console.error(
            "CASE STUDY ERROR:",
            err.response?.data || err.message
        );

        // Return an appropriate API error
        res.status(500).json({
            success: false,
            message: "Unable to retrieve case study."
        });

    }

});


/**
 * ============================================================
 * GET CASE STUDY PDF
 * ============================================================
 *
 * Retrieves the PDF file from Zoho Creator and streams it
 * through the Express server to the website.
 *
 * The PDF is not stored on the website server.
 */
router.get("/:id/pdf", async (req, res) => {

    try {

        console.log(
            `Downloading PDF ${req.params.id} from Zoho...`
        );

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
            console.error("PDF STREAM ERROR:", err);
            if (!res.headersSent) {
                res.status(500).end();
            }
        });

    } catch (err) {
        console.error("PDF ERROR:", err.message);
        if (!res.headersSent) {
            res.status(500).end();
        }
    }

});

/**
 * ============================================================
 * GET CASE STUDY IMAGE
 * ============================================================
 *
 * Retrieves the case study image from Zoho Creator and
 * sends it through the Express server to the website.
 *
 * The image is not stored on the website server.
 */
router.get("/:id/image", async (req, res) => {

    try {

        console.log(
            `Downloading image ${req.params.id} from Zoho...`
        );

        const response = await downloadFile(
            req.params.id,
            "Image"
        );

        const contentType =
            response.headers["content-type"] || "image/jpeg";

        res.setHeader("Content-Type", contentType);

        response.data.pipe(res);

    } catch (err) {

        console.error("IMAGE ERROR:", err.message);
        if (!res.headersSent) {
            res.status(500).end();
        }

    }

});


/**
 * Export the router so it can be registered
 * in the main Express application.
 */
module.exports = router;