/**
 * ============================================================
 * INSIGHTS PAGE — case-studies.js
 * ============================================================
 *
 * Retrieves case studies from the Express/Zoho backend and
 * renders the full Insights page:
 *   1. Latest Highlights  — 2 most-recent case studies
 *   2. Filter Bar         — Industry / Service / Solution
 *   3. All Case Studies   — filterable card grid
 *   4. PDF Viewer Modal   — full-screen PDF.js canvas viewer
 */

const API_URL = "https://website-api-m3wi.onrender.com/api/case-studies";

/** Shared state */
let allStudies = [];

/* ============================================================
   DOM-READY ENTRY POINT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  // ── Filter controls ──────────────────────────────────────
  const filterIndustry = document.getElementById("filterIndustry");
  const filterService = document.getElementById("filterService");
  const filterSolution = document.getElementById("filterSolution");
  const btnResetFilters = document.getElementById("btnResetFilters");
  const activeFilterBanner = document.getElementById("active-filter-banner");
  const activeFilterText = document.getElementById("active-filter-text");
  const btnClearFilter = document.getElementById("btn-clear-active-filter");

  // ── PDF Modal elements ────────────────────────────────────
  const pdfModal = document.getElementById("pdfViewerModal");
  const closePdfBtn = document.getElementById("closePdfModal");
  const pdfModalBody = document.getElementById("pdfModalBody");
  const pdfModalTitle = document.getElementById("pdfModalTitle");

  // ── Initialise PDF.js worker ──────────────────────────────
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
  }

  /* ----------------------------------------------------------
     SCROLL LISTENER FOR STICKY FILTER
  ---------------------------------------------------------- */
  const filterSection = document.getElementById("filters");
  if (filterSection) {
    window.addEventListener("scroll", () => {
      // Offset can be adjusted. 150px is when it typically detaches from the header
      if (window.scrollY > 150) {
        filterSection.classList.add("is-scrolled");
      } else {
        filterSection.classList.remove("is-scrolled");
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     UTILITY HELPERS
  ---------------------------------------------------------- */

  /** Safely escape HTML to prevent XSS */
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /** Truncate text to maxLength and append ellipsis */
  function truncate(str, maxLen) {
    if (!str) return "";
    return str.length <= maxLen ? str : str.substring(0, maxLen) + "…";
  }

  /** Return first value from string-or-array field */
  function getFirstVal(val) {
    if (!val) return null;
    if (Array.isArray(val)) return val.length > 0 ? String(val[0]).trim() : null;
    return String(val).trim();
  }

  /** Return display string from string-or-array field */
  function getDisplayVal(val) {
    if (!val) return "";
    return Array.isArray(val) ? val.join(", ") : String(val);
  }

  /** Add value(s) to a Set, handles string or array */
  function addToSet(set, val) {
    if (!val) return;
    if (Array.isArray(val)) val.forEach(v => { if (v && String(v).trim()) set.add(String(v).trim()); });
    else if (String(val).trim()) set.add(String(val).trim());
  }

  /* ----------------------------------------------------------
     LOADING SKELETON
  ---------------------------------------------------------- */
  function showLoadingSkeleton(containerId, count = 4) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = Array(count).fill(`
      <div class="cs-skeleton-card">
        <div class="cs-skeleton-img skeleton-pulse"></div>
        <div class="cs-skeleton-body">
          <div class="cs-skeleton-tag skeleton-pulse"></div>
          <div class="cs-skeleton-title skeleton-pulse"></div>
          <div class="cs-skeleton-line skeleton-pulse"></div>
          <div class="cs-skeleton-line cs-skeleton-line--short skeleton-pulse"></div>
          <div class="cs-skeleton-btn skeleton-pulse"></div>
        </div>
      </div>
    `).join("");
  }

  /* ----------------------------------------------------------
     FETCH CASE STUDIES
  ---------------------------------------------------------- */
  async function loadStudies() {
    showLoadingSkeleton("caseStudies", 4);

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      allStudies = await res.json();
      // Validate — API errors return {error:...} not an array
      if (!Array.isArray(allStudies)) throw new Error("Unexpected response");
    } catch (err) {
      console.error("Could not load case studies:", err.message);
      renderError();
      return;
    }

    // Cache in sessionStorage so the index page can read it without a second API call
    if (Array.isArray(allStudies) && allStudies.length) {
      try {
        sessionStorage.setItem("ea_case_studies", JSON.stringify(allStudies));
      } catch (_) { /* storage quota exceeded – silently ignore */ }
    }

    updateStatsStrip(allStudies);
    populateFilters(allStudies);
    renderHighlights(allStudies);
    renderGrid(allStudies);
  }

  /* ----------------------------------------------------------
     STATS STRIP
  ---------------------------------------------------------- */
  function updateStatsStrip(studies) {
    const totalEl = document.getElementById("cs-total-count");
    const industryEl = document.getElementById("cs-industry-count");
    const serviceEl = document.getElementById("cs-service-count");

    const industries = new Set();
    const services = new Set();
    studies.forEach(s => {
      addToSet(industries, s.industry);
      addToSet(services, s.service);
    });

    animateCounter(totalEl, studies.length);
    animateCounter(industryEl, industries.size);
    animateCounter(serviceEl, services.size);
  }

  function animateCounter(el, target) {
    if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  }

  /* ----------------------------------------------------------
     POPULATE FILTER DROPDOWNS
  ---------------------------------------------------------- */
  function populateFilters(studies) {
    if (!filterIndustry && !filterService && !filterSolution) return;

    const industries = new Set();
    const services = new Set();
    const solutions = new Set();

    studies.forEach(s => {
      addToSet(industries, s.industry);
      addToSet(services, s.service);
      addToSet(solutions, s.solution);
    });

    const buildOptions = (set, defaultLabel) => {
      const opts = [`<option value="all">${defaultLabel}</option>`];
      Array.from(set).sort().forEach(v => {
        opts.push(`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`);
      });
      return opts.join("");
    };

    // Save current selections before rebuilding
    const curInd = filterIndustry ? filterIndustry.value : "all";
    const curSrv = filterService ? filterService.value : "all";
    const curSol = filterSolution ? filterSolution.value : "all";

    if (filterIndustry) {
      filterIndustry.innerHTML = buildOptions(industries, "All Industries");
      if (industries.has(curInd)) filterIndustry.value = curInd;
    }
    if (filterService) {
      filterService.innerHTML = buildOptions(services, "All Services");
      if (services.has(curSrv)) filterService.value = curSrv;
    }
    if (filterSolution) {
      filterSolution.innerHTML = buildOptions(solutions, "All Solutions");
      if (solutions.has(curSol)) filterSolution.value = curSol;
    }
  }

  /* ----------------------------------------------------------
     LATEST HIGHLIGHTS  (top 2 by date)
  ---------------------------------------------------------- */
  function renderHighlights(studies) {
    const section = document.getElementById("featured-section");
    const grid = document.getElementById("highlights-grid");
    if (!section || !grid) return;

    if (!studies.length) {
      section.style.display = "none";
      return;
    }

    const sorted = [...studies].sort((a, b) => {
      return new Date(b.date || 0) - new Date(a.date || 0);
    });

    const top2 = sorted.slice(0, 2);
    section.style.display = "block";

    grid.innerHTML = top2.map((study, idx) => {
      const industry = escapeHtml(getDisplayVal(study.industry));
      const service = escapeHtml(getDisplayVal(study.service));
      const solution = escapeHtml(getDisplayVal(study.solution));

      const delay = idx * 0.1;
      return `
        <article class="case-card animate-fade-in" style="animation-delay: ${delay}s" id="highlight-cs-card-${study.id}">
          <div class="case-image-wrapper">
            <img
              src="https://website-api-m3wi.onrender.com/api/case-studies/${study.id}/image"
              alt="${escapeHtml(study.title)}"
              class="case-image"
              onerror="this.src='images/insight_education.png'"
              loading="lazy"
            >
          </div>
          <div class="case-content">
            <div>
              <div class="case-header">
                ${industry ? `<span class="case-tag case-tag-industry">${industry}</span>` : ""}
                ${service ? `<span class="case-tag case-tag-service">${service}</span>` : ""}
                ${solution ? `<span class="case-tag cs-tag--solution-light">${solution}</span>` : ""}
              </div>
              <h2>${escapeHtml(study.title)}</h2>
              <p class="summary">${escapeHtml(truncate(study.description, 160))}</p>
              ${study.date ? `<p class="cs-card-date">${escapeHtml(study.date)}</p>` : ""}
            </div>
            <div class="footer">
              <span class="author">${escapeHtml(study.author || "Edge Analytics")}</span>
              <button
                onclick="openPdfModal('${study.id}', '${escapeHtml(study.title).replace(/'/g, "\\'")}')"
                class="read-more"
                id="view-highlight-${study.id}"
                aria-label="View case study: ${escapeHtml(study.title)}"
              >
                View Case Study
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  /* ----------------------------------------------------------
     CASE STUDIES GRID
  ---------------------------------------------------------- */
  function renderGrid(studies) {
    const grid = document.getElementById("caseStudies");
    const countBadge = document.getElementById("cs-grid-count");
    if (!grid) return;

    // Apply active filters
    const indVal = filterIndustry ? filterIndustry.value : "all";
    const srvVal = filterService ? filterService.value : "all";
    const solVal = filterSolution ? filterSolution.value : "all";

    const matchField = (fieldVal, filterVal) => {
      if (!fieldVal) return false;
      const lower = filterVal.toLowerCase();
      if (Array.isArray(fieldVal)) return fieldVal.some(v => String(v).toLowerCase().includes(lower));
      return String(fieldVal).toLowerCase().includes(lower);
    };

    let filtered = studies;
    if (indVal !== "all") filtered = filtered.filter(s => matchField(s.industry, indVal));
    if (srvVal !== "all") filtered = filtered.filter(s => matchField(s.service, srvVal));
    if (solVal !== "all") filtered = filtered.filter(s => matchField(s.solution, solVal));

    if (countBadge) {
      countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`;
    }

    // Empty state
    if (filtered.length === 0) {
      const label = indVal !== "all" && filterIndustry
        ? filterIndustry.options[filterIndustry.selectedIndex]?.text || indVal
        : srvVal !== "all" && filterService
          ? filterService.options[filterService.selectedIndex]?.text || srvVal
          : "your criteria";

      grid.innerHTML = `
        <div class="cs-empty-state" style="grid-column: 1 / -1;">
          <div class="cs-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3>No case studies found</h3>
          <p>No results match <strong>${escapeHtml(label)}</strong>.<br>We are constantly growing our portfolio — please check back soon.</p>
          <button id="emptyResetBtn" class="cs-btn cs-btn--teal">
            View All Case Studies
          </button>
        </div>
      `;
      document.getElementById("emptyResetBtn")?.addEventListener("click", () => {
        if (filterIndustry) filterIndustry.value = "all";
        if (filterService) filterService.value = "all";
        if (filterSolution) filterSolution.value = "all";
        hideFilterBanner();
        renderGrid(allStudies);
      });
      return;
    }

    grid.innerHTML = filtered.map((study, idx) => {
      const industry = escapeHtml(getDisplayVal(study.industry));
      const service = escapeHtml(getDisplayVal(study.service));
      const solution = escapeHtml(getDisplayVal(study.solution));

      const delay = idx * 0.1;
      return `
        <article class="case-card animate-fade-in" style="animation-delay: ${delay}s" id="cs-card-${study.id}">
          <div class="case-image-wrapper">
            <img
              src="https://website-api-m3wi.onrender.com/api/case-studies/${study.id}/image"
              alt="${escapeHtml(study.title)}"
              class="case-image"
              onerror="this.src='images/insight_education.png'"
              loading="lazy"
            >
          </div>
          <div class="case-content">
            <div>
              <div class="case-header">
                ${industry ? `<span class="case-tag case-tag-industry">${industry}</span>` : ""}
                ${service ? `<span class="case-tag case-tag-service">${service}</span>` : ""}
                ${solution ? `<span class="case-tag cs-tag--solution-light">${solution}</span>` : ""}
              </div>
              <h2>${escapeHtml(study.title)}</h2>
              <p class="summary">${escapeHtml(truncate(study.description, 160))}</p>
              ${study.date ? `<p class="cs-card-date">${escapeHtml(study.date)}</p>` : ""}
            </div>
            <div class="footer">
              <span class="author">${escapeHtml(study.author || "Edge Analytics")}</span>
              <button
                onclick="openPdfModal('${study.id}', '${escapeHtml(study.title).replace(/'/g, "\\'")}')"
                class="read-more"
                id="cs-view-${study.id}"
                aria-label="View case study: ${escapeHtml(study.title)}"
              >
                View Case Study
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  /* ----------------------------------------------------------
     ERROR STATE
  ---------------------------------------------------------- */
  function renderError() {
    const grid = document.getElementById("caseStudies");
    if (grid) {
      grid.innerHTML = `
        <div class="modern-error-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>Case Studies Updating</h3>
          <p>The case studies will load shortly.<br>
          Please check back in a few moments.</p>
          <button onclick="location.reload()" class="cs-btn">Refresh Page</button>
        </div>
      `;
    }
    const section = document.getElementById("featured-section");
    if (section) section.style.display = "none";
  }

  /* ----------------------------------------------------------
     PDF VIEWER MODAL
  ---------------------------------------------------------- */
  let currentPdfTask = null;

  async function openPdfModal(studyId, studyTitle) {
    if (!pdfModal || !pdfModalBody) return;

    pdfModal.classList.add("active");
    document.body.style.overflow = "hidden";
    if (pdfModalTitle) pdfModalTitle.textContent = studyTitle || "Case Study";

    pdfModalBody.innerHTML = `
      <div class="pdf-loading">
        <div class="pdf-loading-spinner"></div>
        <p>Loading document…</p>
      </div>
    `;

    try {
      if (!window.pdfjsLib) throw new Error("PDF.js is not loaded.");
      const pdfUrl = `https://website-api-m3wi.onrender.com/api/case-studies/${studyId}/pdf`;
      currentPdfTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await currentPdfTask.promise;

      pdfModalBody.innerHTML = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const scale = window.innerWidth < 700 ? 1.0 : 1.5;
        const viewport = page.getViewport({ scale });

        const wrapper = document.createElement("div");
        wrapper.className = "pdf-page-wrapper";

        const pageLabel = document.createElement("div");
        pageLabel.className = "pdf-page-label";
        pageLabel.textContent = `Page ${pageNum} of ${pdf.numPages}`;

        const canvas = document.createElement("canvas");
        canvas.className = "pdf-page-canvas";
        const ctx = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: ctx, viewport }).promise;

        wrapper.appendChild(pageLabel);
        wrapper.appendChild(canvas);
        pdfModalBody.appendChild(wrapper);
      }
    } catch (err) {
      console.error("PDF load error:", err);
      pdfModalBody.innerHTML = `
        <div class="modern-error-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>Document Updating</h3>
          <p>The case study document will load shortly.<br>
          Please check back in a few moments.</p>
          <a href="case-study.html?id=${studyId}" class="cs-btn">
            Open Case Study Page
          </a>
        </div>
      `;
    }
  }

  function closePdfModal() {
    if (!pdfModal) return;
    pdfModal.classList.remove("active");
    document.body.style.overflow = "";
    if (currentPdfTask) { currentPdfTask.destroy?.(); currentPdfTask = null; }
    setTimeout(() => { if (pdfModalBody) pdfModalBody.innerHTML = ""; }, 300);
  }

  // Expose globally for inline onclick handlers
  window.openPdfModal = openPdfModal;

  // Attach modal close handlers
  closePdfBtn?.addEventListener("click", closePdfModal);
  pdfModal?.addEventListener("click", e => { if (e.target === pdfModal) closePdfModal(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && pdfModal?.classList.contains("active")) closePdfModal();
  });

  /* ----------------------------------------------------------
     FILTER BANNER
  ---------------------------------------------------------- */
  function showFilterBanner(label, value) {
    if (!activeFilterBanner || !activeFilterText) return;
    activeFilterText.textContent = `Showing results filtered by ${label}: ${value}`;
    activeFilterBanner.style.display = "flex";
  }

  function hideFilterBanner() {
    if (activeFilterBanner) activeFilterBanner.style.display = "none";
  }

  // Clear filter banner
  btnClearFilter?.addEventListener("click", () => {
    if (filterIndustry) filterIndustry.value = "all";
    if (filterService) filterService.value = "all";
    if (filterSolution) filterSolution.value = "all";
    hideFilterBanner();
    renderGrid(allStudies);
    // Clean URL without reload
    const clean = `${location.protocol}//${location.host}${location.pathname}`;
    history.replaceState({}, "", clean);
  });

  /* ----------------------------------------------------------
     FILTER CHANGE HANDLERS
  ---------------------------------------------------------- */
  const applyFilters = () => renderGrid(allStudies);

  filterIndustry?.addEventListener("change", () => {
    applyFilters();
    if (filterIndustry.value !== "all") {
      showFilterBanner("Industry", filterIndustry.options[filterIndustry.selectedIndex].text);
    } else hideFilterBanner();
  });

  filterService?.addEventListener("change", () => {
    applyFilters();
    if (filterService.value !== "all") {
      showFilterBanner("Service", filterService.options[filterService.selectedIndex].text);
    } else hideFilterBanner();
  });

  filterSolution?.addEventListener("change", () => {
    applyFilters();
    if (filterSolution.value !== "all") {
      showFilterBanner("Solution", filterSolution.options[filterSolution.selectedIndex].text);
    } else hideFilterBanner();
  });

  btnResetFilters?.addEventListener("click", () => {
    if (filterIndustry) filterIndustry.value = "all";
    if (filterService) filterService.value = "all";
    if (filterSolution) filterSolution.value = "all";
    hideFilterBanner();
    renderGrid(allStudies);
  });

  /* ----------------------------------------------------------
     URL PARAMETER HANDLING
     Supports ?industry=X, ?service=X, ?solution=X, ?openId=X
  ---------------------------------------------------------- */
  function handleUrlParams() {
    const params = new URLSearchParams(location.search);
    const openId = params.get("openId");
    const paramInd = params.get("industry");
    const paramSrv = params.get("service");
    const paramSol = params.get("solution");

    let filtersChanged = false;

    // Apply explicit filter params
    const applyDropdown = (el, val, label) => {
      if (!el || !val) return;
      const opt = Array.from(el.options).find(
        o => o.value.toLowerCase() === val.toLowerCase() ||
          o.textContent.toLowerCase() === val.toLowerCase()
      );
      if (opt) {
        el.value = opt.value;
        showFilterBanner(label, opt.textContent);
        filtersChanged = true;
      }
    };

    if (paramInd) applyDropdown(filterIndustry, paramInd, "Industry");
    if (paramSrv) applyDropdown(filterService, paramSrv, "Service");
    if (paramSol) applyDropdown(filterSolution, paramSol, "Solution");

    if (filtersChanged) renderGrid(allStudies);

    // Scroll to and highlight a specific card
    if (openId) {
      const study = allStudies.find(s => String(s.id) === String(openId));
      if (study && !paramInd && !paramSrv && !paramSol) {
        // Auto-set filters to match this study
        const ind = getFirstVal(study.industry);
        if (filterIndustry && ind) {
          const opt = Array.from(filterIndustry.options)
            .find(o => o.value.toLowerCase() === ind.toLowerCase());
          if (opt) { filterIndustry.value = opt.value; filtersChanged = true; }
        }
        if (filtersChanged) renderGrid(allStudies);
      }

      // Scroll to the card
      setTimeout(() => {
        const card = document.getElementById(`cs-card-${openId}`);
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
          card.classList.add("cs-card--highlighted");
          setTimeout(() => card.classList.remove("cs-card--highlighted"), 2500);
        }
      }, 300);
    }
  }

  /* ----------------------------------------------------------
     BOOT
  ---------------------------------------------------------- */
  loadStudies().then(() => {
    handleUrlParams();
  });
});
