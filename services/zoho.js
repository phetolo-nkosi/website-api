const axios = require("axios");

/**
 * Generate a new Zoho OAuth access token using the stored refresh token.
 *
 * The access token is required when making authenticated requests
 * to the Zoho Creator API.
 */
async function getAccessToken() {
    try {
        // Request a new access token from Zoho OAuth
        const response = await axios.post(
            "https://accounts.zoho.com/oauth/v2/token",
            null,
            {
                params: {
                    // OAuth refresh token stored in environment variables
                    refresh_token: process.env.ZOHO_REFRESH_TOKEN,

                    // OAuth client credentials stored in environment variables
                    client_id: process.env.ZOHO_CLIENT_ID,
                    client_secret: process.env.ZOHO_CLIENT_SECRET,

                    // Specifies that the refresh token should be used
                    // to generate a new access token
                    grant_type: "refresh_token"
                }
            }
        );

        // Return the newly generated access token
        return response.data.access_token;

    } catch (err) {
        // Log Zoho's response if available; otherwise log the error message
        console.error(
            "Failed to generate Zoho access token:",
            err.response?.data || err.message
        );

        // Pass the error back to the calling function
        throw err;
    }
}


/**
 * Download a file from a Zoho Creator record.
 *
 * @param {string} recordId  - The Zoho Creator record ID
 * @param {string} fieldName - The file-upload field containing the file
 *
 * @returns {Promise<Object>} Axios response containing the file stream
 */
async function downloadFile(recordId, fieldName) {

    // Generate a valid Zoho OAuth access token
    const token = await getAccessToken();

    /**
     * Construct the Zoho Creator file-download endpoint.
     *
     * Expected structure:
     *
     * https://www.zohoapis.com/creator/v2.1/data/
     * {owner}/{app}/report/{report}/{recordId}/{fieldName}/download
     *
     * trim() is used on environment variables and parameters
     * to prevent accidental spaces from breaking the URL.
     */
    const url =
        `https://www.zohoapis.com/creator/v2.1/data/` +
        `${(process.env.ZOHO_OWNER || "").trim()}/` +
        `${(process.env.ZOHO_APP || "").trim()}/` +
        `report/${(process.env.ZOHO_REPORT || "").trim()}/` +
        `${(recordId || "").toString().trim()}/` +
        `${(fieldName || "").trim()}/download`;

    // Log the URL for debugging purposes
    console.log("Zoho file download URL:", url);

    /**
     * Request the file from Zoho Creator.
     *
     * responseType: "stream" is important because the file
     * should be returned as a stream rather than loaded entirely
     * into server memory.
     */
    return axios.get(url, {
        headers: {
            // Authenticate the request using the Zoho OAuth access token
            Authorization: `Zoho-oauthtoken ${token}`
        },

        // Return the file as a readable stream
        responseType: "stream"
    });
}


/**
 * Export the functions so they can be used by other files
 * in the application.
 */
module.exports = {
    getAccessToken,
    downloadFile
};