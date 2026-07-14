require("dotenv").config();

const { getAccessToken } = require("./services/zoho");

(async () => {

    try {

        const token = await getAccessToken();

        console.log(token);

    } catch (err) {

        console.log(err);

    }

})();