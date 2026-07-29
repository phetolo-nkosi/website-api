const axios = require("axios");

async function getAccessToken() {

    try {

        const response = await axios.post(
            "https://accounts.zoho.com/oauth/v2/token",
            null,
            {
                params: {
                    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
                    client_id: process.env.ZOHO_CLIENT_ID,
                    client_secret: process.env.ZOHO_CLIENT_SECRET,
                    grant_type: "refresh_token"
                }
            }
        );

        return response.data.access_token;

    } catch (err) {

        console.log(err.response?.data || err.message);

        throw err;

    }

}

async function downloadFile(recordId, fieldName) {

    const token = await getAccessToken();

    const url =
        `https://www.zohoapis.com/creator/v2.1/data/` +
        `${(process.env.ZOHO_OWNER || '').trim()}/` +
        `${(process.env.ZOHO_APP || '').trim()}/` +
        `report/${(process.env.ZOHO_REPORT || '').trim()}/` +
        `${(recordId || '').toString().trim()}/` +
        `${(fieldName || '').trim()}/download`;

    console.log(url);

    return axios.get(url, {
        headers: {
            Authorization: `Zoho-oauthtoken ${token}`
        },
        responseType: "stream"
    });

}


module.exports = {
    getAccessToken,
    downloadFile
};