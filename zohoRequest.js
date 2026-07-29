const zohoQueue = require("./zohoQueue");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function zohoRequest(fn, retries = 3) {

    return zohoQueue.add(async () => {

        let attempt = 0;

        while (true) {

            try {

                return await fn();

            } catch (err) {

                const status = err.response?.status;

                if (status !== 429 || attempt >= retries) {
                    throw err;
                }

                const wait = 1000 * Math.pow(2, attempt);

                console.log(`Zoho throttled. Waiting ${wait} ms`);

                await sleep(wait);

                attempt++;

            }

        }

    });

}

module.exports = zohoRequest;