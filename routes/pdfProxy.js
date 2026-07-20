const express = require("express");
const axios = require("axios");
const { getAccessToken } = require("../services/zoho");

const router = express.Router();

router.get("/", async (req, res) => {
    try {

        const filePath = req.query.path;

        if (!filePath) {
            return res.status(400).json({
                error: "Missing path parameter"
            });
        }

        const token = await getAccessToken();

        const zohoUrl = `https://www.zohoapis.com${filePath}`;

        console.log("Fetching PDF:", zohoUrl);

        const response = await axios({
            method: "GET",
            url: zohoUrl,
            responseType: "stream",
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`
            }
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");

        response.data.pipe(res);

    } catch (err) {

        console.error(err.response?.data || err.message);

        res.status(500).json({
            error: "Unable to retrieve PDF"
        });

    }
});

module.exports = router;