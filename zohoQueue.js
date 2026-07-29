const PQueue = require("p-queue").default;

const zohoQueue = new PQueue({
    concurrency: 2
});

module.exports = zohoQueue;