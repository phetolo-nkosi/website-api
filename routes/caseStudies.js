const express = require("express");
const axios = require("axios");
const { getAccessToken } = require("../services/zoho");

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const token = await getAccessToken();

        const response = await axios.get(
            `https://www.zohoapis.com/creator/v2.1/data/${process.env.ZOHO_OWNER}/${process.env.ZOHO_APP}/report/${process.env.ZOHO_REPORT}`,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${token}`,
                    Accept: "application/json"

                }
            }
        );

        res.json(response.data);

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.status(500).json(err.response?.data || err.message);

    }

});

module.exports = router;