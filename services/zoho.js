const axios = require("axios");

/**
 * ============================================================
 * ZOHO CONFIGURATION
 * ============================================================
 */

const ZOHO_OAUTH_URL =
    "https://accounts.zoho.com/oauth/v2/token";

const TOKEN_EXPIRY_BUFFER = 60 * 1000; // 1 minute


/**
 * ============================================================
 * ACCESS TOKEN CACHE
 * ============================================================
 *
 * Instead of requesting a new OAuth access token every time
 * a Zoho API request is made, we keep the current token in
 * memory and reuse it until it is close to expiring.
 */

let cachedAccessToken = null;
let tokenExpiresAt = 0;


/**
 * Keeps track of an access-token request that is already
 * in progress.
 *
 * This prevents multiple simultaneous requests from generating
 * multiple OAuth tokens.
 */
let tokenRequestPromise = null;


/**
 * ============================================================
 * GENERATE / GET ACCESS TOKEN
 * ============================================================
 *
 * Returns a valid Zoho OAuth access token.
 *
 * If a valid cached token exists, it is reused.
 * A new token is only requested when the cached token has
 * expired or is about to expire.
 */
async function getAccessToken() {

    // Check whether the cached token is still valid
    if (
        cachedAccessToken &&
        Date.now() < tokenExpiresAt
    ) {
        return cachedAccessToken;
    }


    /**
     * If another request is already generating a token,
     * wait for that request instead of creating another one.
     */
    if (tokenRequestPromise) {
        return tokenRequestPromise;
    }


    /**
     * Create the token request.
     */
    tokenRequestPromise = (async () => {

        try {

            console.log("Requesting new Zoho access token...");

            const response = await axios.post(
                ZOHO_OAUTH_URL,
                null,
                {
                    params: {
                        refresh_token:
                            process.env.ZOHO_REFRESH_TOKEN,

                        client_id:
                            process.env.ZOHO_CLIENT_ID,

                        client_secret:
                            process.env.ZOHO_CLIENT_SECRET,

                        grant_type:
                            "refresh_token"
                    }
                }
            );


            /**
             * Store the new access token.
             */
            cachedAccessToken =
                response.data.access_token;


            /**
             * Zoho normally returns expires_in.
             *
             * If it is not returned, use 1 hour as a fallback.
             */
            const expiresIn =
                Number(response.data.expires_in) ||
                3600;


            /**
             * Refresh the token slightly before
             * the actual expiry time.
             */
            tokenExpiresAt =
                Date.now() +
                (expiresIn * 1000) -
                TOKEN_EXPIRY_BUFFER;


            console.log(
                "Zoho access token cached."
            );


            return cachedAccessToken;

        } catch (err) {

            console.error(
                "Failed to generate Zoho access token:",
                err.response?.data ||
                err.message
            );

            throw err;

        } finally {

            /**
             * Clear the promise so a future request
             * can generate a new token if necessary.
             */
            tokenRequestPromise = null;
        }

    })();


    return tokenRequestPromise;
}


/**
 * ============================================================
 * CLEAR ACCESS TOKEN
 * ============================================================
 *
 * Used when Zoho tells us that the current token is invalid
 * or expired.
 */
function clearAccessToken() {

    cachedAccessToken = null;
    tokenExpiresAt = 0;

}


/**
 * ============================================================
 * WAIT / BACKOFF
 * ============================================================
 *
 * Used when Zoho responds with HTTP 429 (Too Many Requests).
 */
function wait(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });

}


/**
 * ============================================================
 * DOWNLOAD FILE
 * ============================================================
 *
 * Downloads an image or PDF from a Zoho Creator record.
 *
 * The access token is reused instead of generating a new
 * token for every file.
 */
async function downloadFile(
    recordId,
    fieldName,
    retryCount = 0
) {

    const token =
        await getAccessToken();


    /**
     * Construct Zoho Creator file-download URL.
     */
    const url =
        `https://www.zohoapis.com/creator/v2.1/data/` +
        `${(process.env.ZOHO_OWNER || "").trim()}/` +
        `${(process.env.ZOHO_APP || "").trim()}/` +
        `report/${(process.env.ZOHO_REPORT || "").trim()}/` +
        `${(recordId || "").toString().trim()}/` +
        `${(fieldName || "").trim()}/download`;


    try {

        console.log(
            `Downloading Zoho file: ${recordId} / ${fieldName}`
        );


        const response = await axios.get(
            url,
            {
                headers: {
                    Authorization:
                        `Zoho-oauthtoken ${token}`
                },

                responseType: "stream",

                /**
                 * Do not keep the connection waiting forever.
                 */
                timeout: 30000
            }
        );


        return response;


    } catch (err) {

        const status =
            err.response?.status;


        /**
         * ====================================================
         * TOKEN EXPIRED / INVALID
         * ====================================================
         *
         * If Zoho rejects the token, clear the cached token
         * and retry once with a newly generated token.
         */
        if (
            (status === 401 || status === 403) &&
            retryCount < 1
        ) {

            console.log(
                "Zoho access token expired. Refreshing..."
            );


            clearAccessToken();


            return downloadFile(
                recordId,
                fieldName,
                retryCount + 1
            );
        }


        /**
         * ====================================================
         * THROTTLE / RATE LIMIT
         * ====================================================
         *
         * HTTP 429 means Zoho is asking us to slow down.
         *
         * Retry using exponential backoff.
         */
        if (
            status === 429 &&
            retryCount < 3
        ) {

            const delay =
                Math.pow(2, retryCount) * 1000;


            console.warn(
                `Zoho throttle detected. ` +
                `Retrying in ${delay / 1000} seconds...`
            );


            await wait(delay);


            return downloadFile(
                recordId,
                fieldName,
                retryCount + 1
            );
        }


        /**
         * Log other errors.
         */
        console.error(
            "Zoho file download failed:",
            err.response?.data ||
            err.message
        );


        throw err;
    }
}


/**
 * ============================================================
 * EXPORTS
 * ============================================================
 */

module.exports = {
    getAccessToken,
    downloadFile,
    clearAccessToken
};

