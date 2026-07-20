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

        console.log("Fetching Image:", zohoUrl);

        const response = await axios({
            method: "GET",
            url: zohoUrl,
            responseType: "stream",
            headers: {
                Authorization: `Zoho-oauthtoken ${token}`
            }
        });

        res.setHeader(
            "Content-Type",
            response.headers["content-type"]
        );

        response.data.pipe(res);

    } catch (err) {

        console.error(err.response?.data || err.message);

        res.status(500).json({
            error: "Unable to retrieve image"
        });

    }

});

module.exports = router;