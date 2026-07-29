require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/hello", (req, res) => {
    res.send("Hello World");
});

// Serve your existing website
app.use(express.static(path.join(__dirname)));

const caseStudies = require("./routes/caseStudies");
app.use("/api/case-studies", caseStudies);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});