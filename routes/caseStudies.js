const express = require("express");
const axios = require("axios");
const path = require("path");

const {
    getAccessToken,
    downloadFile
} = require("../services/zoho");

const router = express.Router();

const MOCK_CASE_STUDIES = [
    {
        id: "mock-1",
        title: "Cloud Architecture & SIS Modernisation",
        description: "Audited and modernised the legacy Student Information System (SIS) for a major African university, migrating key operations to AWS and integrating workflow automation.",
        service: "Digital Services",
        industry: "Education",
        solution: "Designed a secure multi-region AWS landing zone. Developed real-time database replication pipelines to eliminate legacy bottlenecks. Automated student enrolment steps via serverless workflows, reducing processing times by 65%.",
        author: "Edge Analytics Digital Team",
        date: "2026-06-15",
        stat1: "65% Faster Enrolment",
        stat2: "99.99% Cloud Uptime",
        stat3: "12k+ Students Migrated",
        image: "/api/case-studies/mock-1/image",
        pdf: "/api/case-studies/mock-1/pdf"
    },
    {
        id: "mock-2",
        title: "Automated Enterprise Risk & Compliance Portal",
        description: "Implemented an automated regulatory compliance tracking system for a regional bank, mapping policies to key business units and automating internal audit checklists.",
        service: "Risk Management",
        industry: "Financial Services",
        solution: "Configured custom compliance workflows tracking cross-border transactions. Built automated alert systems mapped to national central bank regulations, reducing human error in filing reports by 80%.",
        author: "Edge Analytics Risk Advisory",
        date: "2026-05-10",
        stat1: "80% Error Reduction",
        stat2: "100% Audit Readiness",
        stat3: "24/7 Real-Time Alerts",
        image: "/api/case-studies/mock-2/image",
        pdf: "/api/case-studies/mock-2/pdf"
    },
    {
        id: "mock-3",
        title: "Enterprise Cyber Security Assessment & Remediation",
        description: "Conducted a comprehensive security audit of a national public sector department, designing a NIST-aligned remediation roadmap and deploying active threat monitoring.",
        service: "Managed Services",
        industry: "Government & Public Sector",
        solution: "Identified critical vulnerabilities in legacy endpoints. Implemented multi-factor authentication, segment-based firewall policies, and conducted employee threat simulation training.",
        author: "Edge Analytics Cyber Security Division",
        date: "2026-04-20",
        stat1: "94% Threat Mitigation",
        stat2: "Zero Data Breaches",
        stat3: "NIST-Aligned Security",
        image: "/api/case-studies/mock-3/image",
        pdf: "/api/case-studies/mock-3/pdf"
    },
    {
        id: "mock-4",
        title: "Cloud Scale Data Engineering & BI Dashboards",
        description: "Helped a pan-African logistics firm aggregate operational data across 14 hubs into a central modern data warehouse, building live analytics dashboards.",
        service: "Advisory Services",
        industry: "Logistics & Supply Chain",
        solution: "Constructed robust ETL data pipelines connecting fleet telemetry and warehouse management software. Designed responsive BI dashboards showing hub productivity in real-time.",
        author: "Edge Analytics Advisory Group",
        date: "2026-03-05",
        stat1: "35% Fuel Optimization",
        stat2: "14 Hubs Centralized",
        stat3: "Real-Time Tracking",
        image: "/api/case-studies/mock-4/image",
        pdf: "/api/case-studies/mock-4/pdf"
    }
];

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

        // Log the Zoho/API error and fallback to mock data
        console.error(
            "CASE STUDIES ERROR (falling back to mock data):",
            err.response?.data || err.message
        );

        res.json(MOCK_CASE_STUDIES);

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

    // Return mock data immediately if it's a mock ID
    if (String(req.params.id).startsWith("mock-")) {
        const mockStudy = MOCK_CASE_STUDIES.find(
            study => String(study.id) === String(req.params.id)
        );
        if (mockStudy) {
            return res.json(mockStudy);
        }
    }

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

        // Log the error and try fallback
        console.error(
            "CASE STUDY ERROR (trying fallback to mock data):",
            err.response?.data || err.message
        );

        const fallbackStudy = MOCK_CASE_STUDIES.find(
            study => String(study.id) === String(req.params.id)
        );

        if (fallbackStudy) {
            return res.json(fallbackStudy);
        }

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

    const serveMockPdf = () => {
        const base64Pdf = "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA1OQo+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjcyIDcyMCBUZCAoRWRnZSBBbmFseXRpY3MgQ2FzZSBTdHVkeSBQcmV2aWV3KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMDc3IDAwMDAwIG4gCjAwMDAwMDAxMzYgMDAwMDAgbSAKMDAwMDAwMDIzMyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjM0MAolJUVPRg==";
        const buffer = Buffer.from(base64Pdf, "base64");
        res.setHeader("Content-Type", "application/pdf");
        res.send(buffer);
    };

    if (String(req.params.id).startsWith("mock-")) {
        return serveMockPdf();
    }

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
            console.error("PDF STREAM ERROR (falling back to mock PDF):", err);
            if (!res.headersSent) {
                serveMockPdf();
            }
        });

    } catch (err) {
        console.error("PDF ERROR (falling back to mock PDF):", err.message);
        if (!res.headersSent) {
            serveMockPdf();
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

    const serveMockImage = () => {
        // Return a single static placeholder instead of assigning different images based on ID
        const imagePath = path.join(__dirname, "../images", "insight_security.png");
        res.sendFile(imagePath);
    };

    if (String(req.params.id).startsWith("mock-")) {
        return serveMockImage();
    }

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

        console.error("IMAGE ERROR (falling back to mock image):", err.message);
        if (!res.headersSent) {
            serveMockImage();
        }

    }

});


/**
 * Export the router so it can be registered
 * in the main Express application.
 */
module.exports = router;