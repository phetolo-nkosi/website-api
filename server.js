require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve your existing website
app.use(express.static(path.join(__dirname)));

// =========================
// API Routes
// =========================

const caseStudies = require("./routes/caseStudies");
app.use("/api/case-studies", caseStudies);

const imageProxy = require("./routes/imageProxy");
app.use("/api/image-proxy", imageProxy);

const pdfProxy = require("./routes/pdfProxy");
app.use("/api/pdf-proxy", pdfProxy);

// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});