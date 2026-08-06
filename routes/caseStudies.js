const express = require("express");
const axios = require("axios");

const {
    getAccessToken,
    downloadFile
} = require("../services/zoho");

const router = express.Router();


/**
 * ============================================================
 * ZOHO CONFIGURATION
 * ============================================================
 */

const BASE_URL =
    `https://www.zohoapis.com/creator/v2.1/data/` +
    `${process.env.ZOHO_OWNER}/` +
    `${process.env.ZOHO_APP}/` +
    `report/${process.env.ZOHO_REPORT}`;


/**
 * ============================================================
 * CACHE CONFIGURATION
 * ============================================================
 */

/**
 * Case-study data will remain cached for 10 minutes.
 *
 * This means your website does NOT need to call Zoho every
 * time somebody opens the Insights page.
 */
const CASE_STUDY_CACHE_DURATION = 10 * 60 * 1000;


/**
 * Files will remain cached in Node.js memory for 30 minutes.
 *
 * This prevents the same image/PDF from repeatedly being
 * downloaded from Zoho.
 */
const FILE_CACHE_DURATION = 30 * 60 * 1000;


/**
 * ============================================================
 * MEMORY CACHE
 * ============================================================
 */


/**
 * Stores the case-study data returned from Zoho.
 */
let caseStudyCache = {
    data: null,
    expiresAt: 0
};


/**
 * Stores downloaded images and PDFs.
 *
 * Structure:
 *
 * fileCache.set("123-image", {
 *     buffer: <Buffer>,
 *     contentType: "image/jpeg",
 *     expiresAt: 123456789
 * });
 */
const fileCache = new Map();


/**
 * ============================================================
 * REQUEST DEDUPLICATION
 * ============================================================
 *
 * These maps prevent multiple users from triggering the same
 * Zoho request at exactly the same time.
 */


/**
 * If a request for case studies is already running,
 * other requests will wait for the same request.
 */
let caseStudyRequestPromise = null;


/**
 * Keeps track of files currently being downloaded.
 *
 * Example:
 *
 * User 1 requests PDF 123
 * User 2 requests PDF 123
 * User 3 requests PDF 123
 *
 * Instead of making 3 Zoho requests, all three wait for
 * the same request.
 */
const fileRequestPromises = new Map();


/**
 * ============================================================
 * HELPER: MAP ZOHO RECORD
 * ============================================================
 *
 * Converts a Zoho record into the structure expected by
 * the website.
 */
function mapCaseStudy(record) {

    return {

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

        image:
            `/api/case-studies/${record.ID}/image`,

        pdf:
            `/api/case-studies/${record.ID}/pdf`
    };
}


/**
 * ============================================================
 * FETCH CASE STUDIES FROM ZOHO
 * ============================================================
 */
async function fetchCaseStudiesFromZoho() {

    /**
     * Check whether the cache is still valid.
     */
    if (
        caseStudyCache.data &&
        Date.now() < caseStudyCache.expiresAt
    ) {

        console.log(
            "Returning case studies from cache."
        );

        return caseStudyCache.data;
    }


    /**
     * If another request is already fetching the data,
     * wait for that request.
     */
    if (caseStudyRequestPromise) {

        console.log(
            "Waiting for existing Zoho case-study request..."
        );

        return caseStudyRequestPromise;
    }


    /**
     * Start a new Zoho request.
     */
    caseStudyRequestPromise = (async () => {

        try {

            console.log(
                "Fetching case studies from Zoho..."
            );


            /**
             * Get cached/reusable OAuth token.
             */
            const token =
                await getAccessToken();


            /**
             * Retrieve case studies from Zoho.
             */
            const response =
                await axios.get(
                    BASE_URL,
                    {
                        headers: {
                            Authorization:
                                `Zoho-oauthtoken ${token}`,

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );


            /**
             * Extract records.
             */
            const records =
                response.data.data || [];


            /**
             * Convert Zoho records.
             */
            const caseStudies =
                records.map(mapCaseStudy);


            /**
             * Store the result in cache.
             */
            caseStudyCache = {

                data: caseStudies,

                expiresAt:
                    Date.now() +
                    CASE_STUDY_CACHE_DURATION
            };


            console.log(
                `Cached ${caseStudies.length} case studies.`
            );


            return caseStudies;


        } catch (err) {

            console.error(
                "ZOHO CASE STUDIES ERROR:",
                err.response?.data ||
                err.message
            );

            throw err;

        } finally {

            /**
             * Allow another request after this request
             * has completed.
             */
            caseStudyRequestPromise = null;
        }

    })();


    return caseStudyRequestPromise;
}


/**
 * ============================================================
 * GET ALL CASE STUDIES
 * ============================================================
 *
 * Returns cached case studies whenever possible.
 *
 * Zoho is only contacted when the cache has expired.
 */
router.get("/", async (req, res) => {

    try {

        const caseStudies =
            await fetchCaseStudiesFromZoho();


        /**
         * Tell the browser that the response can be cached
         * for 5 minutes.
         */
        res.setHeader(
            "Cache-Control",
            "public, max-age=300"
        );


        res.json(caseStudies);


    } catch (err) {

        console.error(
            "CASE STUDIES ERROR:",
            err.response?.data ||
            err.message
        );


        res.status(503).json({

            error:
                "Service Unavailable",

            message:
                "The case studies will load shortly."
        });

    }

});


/**
 * ============================================================
 * GET SINGLE CASE STUDY
 * ============================================================
 *
 * IMPORTANT:
 *
 * This no longer calls Zoho directly.
 *
 * It uses the cached case-study collection.
 */
router.get("/:id", async (req, res) => {

    try {

        const caseStudies =
            await fetchCaseStudiesFromZoho();


        const caseStudy =
            caseStudies.find(
                study =>
                    String(study.id) ===
                    String(req.params.id)
            );


        if (!caseStudy) {

            return res.status(404).json({

                success: false,

                message:
                    "Case study not found."
            });

        }


        /**
         * Allow the browser to cache this response.
         */
        res.setHeader(
            "Cache-Control",
            "public, max-age=300"
        );


        res.json(caseStudy);


    } catch (err) {

        console.error(
            "CASE STUDY ERROR:",
            err.response?.data ||
            err.message
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to retrieve case study."
        });

    }

});


/**
 * ============================================================
 * DOWNLOAD FILE FROM ZOHO WITH CACHE
 * ============================================================
 *
 * Used by both image and PDF endpoints.
 */
async function getCachedFile(
    recordId,
    fieldName
) {

    const cacheKey =
        `${recordId}-${fieldName}`;


    /**
     * --------------------------------------------------------
     * CHECK FILE CACHE
     * --------------------------------------------------------
     */
    const cachedFile =
        fileCache.get(cacheKey);


    if (
        cachedFile &&
        Date.now() < cachedFile.expiresAt
    ) {

        console.log(
            `Returning cached file: ${cacheKey}`
        );

        return cachedFile;
    }


    /**
     * --------------------------------------------------------
     * CHECK FOR EXISTING DOWNLOAD
     * --------------------------------------------------------
     *
     * If another user is already downloading this exact file,
     * wait for that request instead of starting another Zoho
     * request.
     */
    if (fileRequestPromises.has(cacheKey)) {

        console.log(
            `Waiting for existing file request: ${cacheKey}`
        );

        return fileRequestPromises.get(cacheKey);
    }


    /**
     * --------------------------------------------------------
     * DOWNLOAD FILE
     * --------------------------------------------------------
     */
    const downloadPromise =
        (async () => {

            try {

                console.log(
                    `Downloading ${fieldName} ` +
                    `for record ${recordId} from Zoho...`
                );


                const response =
                    await downloadFile(
                        recordId,
                        fieldName
                    );


                /**
                 * Convert the stream into a Buffer.
                 *
                 * This is necessary because we want to cache
                 * the downloaded file.
                 */
                const chunks = [];


                response.data.on(
                    "data",
                    chunk => {
                        chunks.push(chunk);
                    }
                );


                const buffer =
                    await new Promise(
                        (resolve, reject) => {

                            response.data.on(
                                "end",
                                () => {

                                    resolve(
                                        Buffer.concat(chunks)
                                    );

                                }
                            );


                            response.data.on(
                                "error",
                                reject
                            );

                        }
                    );


                const contentType =
                    response.headers[
                    "content-type"
                    ] ||
                    (
                        fieldName === "File_upload"
                            ? "application/pdf"
                            : "image/jpeg"
                    );


                const file = {

                    buffer,

                    contentType,

                    expiresAt:
                        Date.now() +
                        FILE_CACHE_DURATION
                };


                /**
                 * Store the file in cache.
                 */
                fileCache.set(
                    cacheKey,
                    file
                );


                console.log(
                    `Cached file: ${cacheKey}`
                );


                return file;


            } finally {

                /**
                 * Remove the in-progress request.
                 */
                fileRequestPromises.delete(
                    cacheKey
                );

            }

        })();


    /**
     * Store the promise so simultaneous requests
     * can reuse it.
     */
    fileRequestPromises.set(
        cacheKey,
        downloadPromise
    );


    return downloadPromise;
}


/**
 * ============================================================
 * GET CASE STUDY PDF
 * ============================================================
 */
router.get("/:id/pdf", async (req, res) => {

    try {

        const file =
            await getCachedFile(
                req.params.id,
                "File_upload"
            );


        /**
         * Tell the browser to cache the PDF.
         *
         * This prevents repeated requests when the user
         * revisits the same case study.
         */
        res.setHeader(
            "Cache-Control",
            "public, max-age=1800"
        );


        res.setHeader(
            "Content-Type",
            file.contentType
        );


        res.setHeader(
            "Content-Length",
            file.buffer.length
        );


        res.send(file.buffer);


    } catch (err) {

        console.error(
            "PDF ERROR:",
            err.response?.data ||
            err.message
        );


        if (!res.headersSent) {

            res.status(500).json({

                error:
                    "Unable to load PDF."
            });

        }

    }

});


/**
 * ============================================================
 * GET CASE STUDY IMAGE
 * ============================================================
 */
router.get("/:id/image", async (req, res) => {

    try {

        const file =
            await getCachedFile(
                req.params.id,
                "Image"
            );


        /**
         * Tell the browser to cache the image.
         */
        res.setHeader(
            "Cache-Control",
            "public, max-age=1800"
        );


        res.setHeader(
            "Content-Type",
            file.contentType
        );


        res.setHeader(
            "Content-Length",
            file.buffer.length
        );


        res.send(file.buffer);


    } catch (err) {

        console.error(
            "IMAGE ERROR:",
            err.response?.data ||
            err.message
        );


        if (!res.headersSent) {

            res.status(500).json({

                error:
                    "Unable to load image."
            });

        }

    }

});


/**
 * ============================================================
 * OPTIONAL CACHE CLEAR FUNCTION
 * ============================================================
 *
 * Useful if you want to force the website to retrieve the
 * latest case studies from Zoho immediately.
 */
function clearCaseStudyCache() {

    caseStudyCache = {

        data: null,

        expiresAt: 0
    };


    fileCache.clear();


    console.log(
        "Case-study and file caches cleared."
    );
}


/**
 * ============================================================
 * EXPORTS
 * ============================================================
 */

module.exports = router;