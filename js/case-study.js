const API_BASE = "/api/case-studies";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadCaseStudy() {
  if (!id) {
    document.getElementById("title").textContent = "Case Study Not Found";
    document.getElementById("description").textContent = "No valid case study ID was provided in the URL.";
    return;
  }

  try {
    let response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) {
      response = await fetch(`http://localhost:3000/api/case-studies/${id}`);
    }

    const study = await response.json();

    const heroImage = document.getElementById("heroImage");
    if (heroImage) {
      heroImage.src = study.image || "images/insight_education.png";
      heroImage.onerror = () => { heroImage.src = "images/insight_education.png"; };
    }

    const title = document.getElementById("title");
    if (title) title.textContent = study.title || "Case Study";

    const service = document.getElementById("service");
    if (service) service.textContent = study.service || "Case Study";

    const solution = document.getElementById("solution");
    if (solution) solution.innerHTML = study.solution || "Solution details pending.";

    const description = document.getElementById("description");
    if (description) description.innerHTML = study.description || "Description pending.";

    const stat1 = document.getElementById("stat1");
    if (stat1) {
      stat1.innerHTML = study.stat1 ? `<span>${study.stat1}</span>` : "Proven Data Accuracy";
    }

    const stat2 = document.getElementById("stat2");
    if (stat2) {
      stat2.innerHTML = study.stat2 ? `<span>${study.stat2}</span>` : "Automated Workflow";
    }

    const stat3 = document.getElementById("stat3");
    if (stat3) {
      stat3.innerHTML = study.stat3 ? `<span>${study.stat3}</span>` : "Enterprise Scalability";
    }

    const pdfViewer = document.getElementById("pdfViewer");
    if (pdfViewer && study.pdf) {
      pdfViewer.src = study.pdf;
    }
  } catch (err) {
    console.error("Error loading single case study:", err);
    document.getElementById("title").textContent = "Unable to Load Case Study";
    document.getElementById("description").textContent = "An error occurred while communicating with the Zoho server. Please check your connection.";
  }
}

document.addEventListener("DOMContentLoaded", loadCaseStudy);