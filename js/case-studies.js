/**
 * ============================================================
 * CASE STUDIES - CENTRAL JAVASCRIPT
 * ============================================================
 *
 * This single file handles:
 *
 * 1. Latest 4 case studies on the Index page
 * 2. Case studies grouped by Industry on the Services page
 * 3. Full Case Study page
 *
 * The script automatically determines which page it is
 * running on by checking for specific HTML elements.
 */


/**
 * ============================================================
 * CONFIGURATION
 * ============================================================
 */

const CASE_STUDIES_API =
    "https://website-api-m3wi.onrender.com/api/case-studies";


/**
 * ============================================================
 * PAGE INITIALISATION
 * ============================================================
 *
 * Determine which case-study functionality should run.
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /**
         * Index page
         */
        if (
            document.getElementById(
                "latest-case-studies-grid"
            )
        ) {

            loadLatestCaseStudies();

        }


        /**
         * Services page
         */
        if (
            document.getElementById(
                "industry-case-studies-container"
            )
        ) {

            loadIndustryCaseStudies();

        }


        /**
         * Full case study page
         */
        if (
            document.getElementById(
                "case-study-content"
            )
        ) {

            loadFullCaseStudy();

        }


        /**
         * Case Studies listing page
         */
        if (
            document.getElementById(
                "cs-all-grid"
            )
        ) {

            loadCaseStudiesPage();

        }

    }
);


/**
 * ============================================================
 * GET ALL CASE STUDIES
 * ============================================================
 *
 * All pages use this same function.
 *
 * The Node.js backend handles the Zoho API and caching.
 */
async function getCaseStudies() {

    // Check session cache first
    const cached = sessionStorage.getItem("ea_case_studies");

    if (cached) {

        const data = JSON.parse(cached);

        if (!window.allCaseStudiesData) {
            window.allCaseStudiesData = new Map();
        }

        data.forEach(cs => {
            window.allCaseStudiesData.set(cs.id, cs);
        });

        return data;
    }

    // Fetch from Render API
    const response = await fetch(CASE_STUDIES_API);

    if (!response.ok) {
        throw new Error("Unable to retrieve case studies.");
    }

    const data = await response.json();

    // Save to session storage
    try {

        sessionStorage.setItem(
            "ea_case_studies",
            JSON.stringify(data)
        );

    } catch (err) {

        console.warn("Unable to cache case studies.", err);

    }

    // Rebuild the lookup Map
    if (!window.allCaseStudiesData) {
        window.allCaseStudiesData = new Map();
    }

    data.forEach(cs => {
        window.allCaseStudiesData.set(cs.id, cs);
    });

    return data;
}


/**
 * ============================================================
 * INDEX PAGE
 * ============================================================
 *
 * Displays the latest four case studies based on
 * Published Date.
 */


/**
 * Load latest case studies.
 */
async function loadLatestCaseStudies() {

    const grid =
        document.getElementById(
            "latest-case-studies-grid"
        );

    const loading =
        document.getElementById(
            "latest-case-studies-loading"
        );

    const error =
        document.getElementById(
            "latest-case-studies-error"
        );


    try {

        if (loading) {
            loading.hidden = false;
        }


        if (error) {
            error.hidden = true;
        }


        /**
         * Get case studies from Node.js.
         */
        const caseStudies =
            await getCaseStudies();


        /**
         * Sort by published date.
         *
         * Newest first.
         */
        caseStudies.sort(
            (a, b) => {

                return (
                    new Date(b.date) -
                    new Date(a.date)
                );

            }
        );


        /**
         * Only display the latest four.
         */
        const latestFour =
            caseStudies.slice(0, 4);


        /**
         * Render cards.
         */
        renderCaseStudyCards(
            latestFour,
            grid
        );


    } catch (err) {

        console.error(
            "Latest case studies error:",
            err
        );


        if (error) {
            error.hidden = false;
        }


    } finally {

        if (loading) {
            loading.hidden = true;
        }

    }

}


/**
 * ============================================================
 * SERVICES PAGE
 * ============================================================
 *
 * Displays case studies grouped by Industry.
 */


/**
 * Load case studies by industry.
 */
async function loadIndustryCaseStudies() {

    const container =
        document.getElementById(
            "industry-case-studies-container"
        );

    const loading =
        document.getElementById(
            "industry-case-studies-loading"
        );

    const error =
        document.getElementById(
            "industry-case-studies-error"
        );


    try {

        if (loading) {
            loading.hidden = false;
        }


        if (error) {
            error.hidden = true;
        }


        /**
         * Get all case studies.
         */
        const caseStudies =
            await getCaseStudies();


        /**
         * Sort newest first.
         */
        caseStudies.sort(
            (a, b) => {

                return (
                    new Date(b.date) -
                    new Date(a.date)
                );

            }
        );


        /**
         * Group by Industry.
         */
        const grouped =
            groupByIndustry(
                caseStudies
            );


        /**
         * Render industries.
         */
        renderIndustries(
            grouped,
            container
        );


    } catch (err) {

        console.error(
            "Industry case studies error:",
            err
        );


        if (error) {
            error.hidden = false;
        }


    } finally {

        if (loading) {
            loading.hidden = true;
        }

    }

}


/**
 * ============================================================
 * CASE STUDIES LISTING PAGE
 * ============================================================
 *
 * Handles:  case-studies.html
 *
 *   - Hero stat counters
 *   - Featured (latest 2) section
 *   - Filter pill bar (per industry)
 *   - Search input
 *   - Full card grid with live filter+search
 */
async function loadCaseStudiesPage() {

    // Element refs
    const featuredGrid = document.getElementById("cs-featured-grid");
    const featuredLoading = document.getElementById("cs-featured-loading");
    const featuredError = document.getElementById("cs-featured-error");

    const allGrid = document.getElementById("cs-all-grid");
    const allLoading = document.getElementById("cs-all-loading");
    const allError = document.getElementById("cs-all-error");
    const noResults = document.getElementById("cs-no-results");
    const resetBtn = document.getElementById("cs-reset-btn");
    const searchInput = document.getElementById("cs-search");

    const industrySelect = document.getElementById("cs-filter-industry");
    const serviceSelect = document.getElementById("cs-filter-service");
    const solutionSelect = document.getElementById("cs-filter-solution");

    const totalCountEl = document.getElementById("cs-total-count");
    const industryCountEl = document.getElementById("cs-industry-count");

    // State
    let allCaseStudies = [];
    let activeIndustry = "all";
    let activeService = "all";
    let activeSolution = "all";
    let searchQuery = "";

    // Check for ?filter= in URL (Optional legacy support)
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilter = urlParams.get("filter");

    try {

        // ── Fetch ──────────────────────────────────────────────
        allCaseStudies = await getCaseStudies();

        // Sort newest first
        allCaseStudies.sort((a, b) => new Date(b.date) - new Date(a.date));

        // ── Hero stats ─────────────────────────────────────────
        if (totalCountEl) totalCountEl.textContent = allCaseStudies.length;

        // ── Populate Select Dropdowns ────────────────────────

        // Helper to extract unique sorted values
        const getUnique = (key) => [...new Set(allCaseStudies.map(cs => cs[key]?.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));

        const industries = getUnique("industry");
        const services = getUnique("service");
        const solutions = getUnique("solution");

        if (industryCountEl) industryCountEl.textContent = industries.length;

        // Populate Industry
        if (industrySelect) {
            industries.forEach(val => {
                const opt = document.createElement("option");
                opt.value = val;
                opt.textContent = val;
                industrySelect.appendChild(opt);
            });
            industrySelect.addEventListener("change", (e) => {
                activeIndustry = e.target.value;
                renderFiltered();
            });
        }

        // Populate Service
        if (serviceSelect) {
            services.forEach(val => {
                const opt = document.createElement("option");
                opt.value = val;
                opt.textContent = val;
                serviceSelect.appendChild(opt);
            });
            serviceSelect.addEventListener("change", (e) => {
                activeService = e.target.value;
                renderFiltered();
            });
        }

        // Populate Solution
        if (solutionSelect) {
            solutions.forEach(val => {
                const opt = document.createElement("option");
                opt.value = val;
                opt.textContent = val;
                solutionSelect.appendChild(opt);
            });
            solutionSelect.addEventListener("change", (e) => {
                activeSolution = e.target.value;
                renderFiltered();
            });
        }

        // ── Search ─────────────────────────────────────────────
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                searchQuery = searchInput.value.trim().toLowerCase();
                renderFiltered();
            });
        }

        // ── Featured cards (latest 2) ──────────────────────────
        if (featuredLoading) featuredLoading.hidden = true;

        if (featuredGrid) {
            const featured = allCaseStudies.slice(0, 2);
            featured.forEach(cs => {
                featuredGrid.appendChild(createCaseStudyCard(cs));
            });
        }

        // ── Reset button ───────────────────────────────────────
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                activeIndustry = "all";
                activeService = "all";
                activeSolution = "all";
                searchQuery = "";

                if (searchInput) searchInput.value = "";
                if (industrySelect) industrySelect.value = "all";
                if (serviceSelect) serviceSelect.value = "all";
                if (solutionSelect) solutionSelect.value = "all";

                renderFiltered();
            });
        }

        // ── Apply ?filter= from URL ────────────────────────────
        if (urlFilter) {
            if (industries.includes(urlFilter)) {
                activeIndustry = urlFilter;
                if (industrySelect) industrySelect.value = urlFilter;
            } else if (services.includes(urlFilter)) {
                activeService = urlFilter;
                if (serviceSelect) serviceSelect.value = urlFilter;
            }
        }

        // ── Initial render ─────────────────────────────────────
        if (allLoading) allLoading.hidden = true;
        renderFiltered();

    } catch (err) {

        console.error("Case studies page error:", err);

        if (featuredLoading) featuredLoading.hidden = true;
        if (featuredError) featuredError.hidden = false;
        if (allLoading) allLoading.hidden = true;
        if (allError) allError.hidden = false;

    }


    // ── Render filtered + searched grid ─────────────────────────
    function renderFiltered() {

        if (!allGrid) return;

        let filtered = allCaseStudies;

        if (activeIndustry && activeIndustry !== "all") {
            filtered = filtered.filter(cs => (cs.industry?.trim() || "") === activeIndustry);
        }

        if (activeService && activeService !== "all") {
            filtered = filtered.filter(cs => (cs.service?.trim() || "") === activeService);
        }

        if (activeSolution && activeSolution !== "all") {
            filtered = filtered.filter(cs => (cs.solution?.trim() || "") === activeSolution);
        }

        if (searchQuery) {
            filtered = filtered.filter(cs =>
                [cs.title, cs.description, cs.industry, cs.service, cs.solution]
                    .join(" ").toLowerCase()
                    .includes(searchQuery)
            );
        }

        allGrid.innerHTML = "";

        if (!filtered.length) {
            if (noResults) noResults.hidden = false;
            return;
        }

        if (noResults) noResults.hidden = true;

        filtered.forEach(cs => {
            allGrid.appendChild(createCaseStudyCard(cs));
        });

    }

}


/**
 * ============================================================
 * GROUP BY INDUSTRY
 * ============================================================
 */
function groupByIndustry(
    caseStudies
) {

    return caseStudies.reduce(
        (groups, caseStudy) => {

            const industry =
                caseStudy.industry?.trim() ||
                "Other";


            if (!groups[industry]) {

                groups[industry] = [];

            }


            groups[industry].push(
                caseStudy
            );


            return groups;

        },
        {}
    );

}


/**
 * ============================================================
 * RENDER INDUSTRIES  (dark single-card carousel)
 * ============================================================
 *
 * Layout:
 *   - Left sidebar: vertical industry tab pills
 *   - Right: a single-card carousel (one case study at a time)
 *   - Navigation arrows + progress counter
 */
function renderIndustries(groupedCaseStudies, container) {

    if (!container) return;

    container.innerHTML = "";

    const industries = Object.keys(groupedCaseStudies);

    if (!industries.length) {
        container.innerHTML = `<p style="color:#94a3b8;">No case studies are currently available.</p>`;
        return;
    }

    industries.sort((a, b) => a.localeCompare(b));

    // ── Outer shell ───────────────────────────────────────────
    const shell = document.createElement("div");
    shell.className = "idc-shell";

    // ── Sidebar: industry tabs ─────────────────────────────────
    const sidebar = document.createElement("div");
    sidebar.className = "idc-sidebar";

    // ── Main panel ────────────────────────────────────────────
    const panel = document.createElement("div");
    panel.className = "idc-panel";

    // Viewport (clips the visible card)
    const viewport = document.createElement("div");
    viewport.className = "idc-viewport";

    // Navigation bar
    const navBar = document.createElement("div");
    navBar.className = "idc-nav";
    navBar.innerHTML = `
        <div class="idc-counter">
            <span class="idc-cur">1</span>
            <span class="idc-sep">/</span>
            <span class="idc-tot">1</span>
        </div>
        <div class="idc-arrows">
            <button class="idc-arrow" id="idc-prev" aria-label="Previous">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button class="idc-arrow" id="idc-next" aria-label="Next">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
        </div>
    `;

    panel.appendChild(viewport);
    panel.appendChild(navBar);

    shell.appendChild(sidebar);
    shell.appendChild(panel);
    container.appendChild(shell);

    // Cached refs
    const curEl = navBar.querySelector(".idc-cur");
    const totEl = navBar.querySelector(".idc-tot");
    const prevBtn = navBar.querySelector("#idc-prev");
    const nextBtn = navBar.querySelector("#idc-next");

    // ── State ────────────────────────────────────────────────
    let activeIndustry = 0;
    let activeCard = 0;
    const tabs = [];

    // ── Build sidebar tabs ───────────────────────────────────
    industries.forEach((industry, idx) => {
        const tab = document.createElement("button");
        tab.className = "idc-tab" + (idx === 0 ? " active" : "");
        tab.innerHTML = `
            <span class="idc-tab-label">${escapeHtml(industry)}</span>
            <svg class="idc-tab-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        `;
        tab.addEventListener("click", () => switchIndustry(idx));
        sidebar.appendChild(tab);
        tabs.push(tab);
    });

    // ── Render helpers ───────────────────────────────────────
    function renderCard(caseStudy) {
        const el = document.createElement("div");
        el.className = "idc-card";
        el.innerHTML = `
            <div class="idc-card-img" style="background-image:url('${escapeHtml(`${CASE_STUDIES_API}/${caseStudy.id}/image` || '')}')">
                <div class="idc-card-img-overlay"></div>
            </div>
            <div class="idc-card-body">
                <div class="idc-card-tags">
                    <span class="idc-tag">${escapeHtml(caseStudy.industry || '')}</span>
                    <span class="idc-tag idc-tag--service">${escapeHtml(caseStudy.service || '')}</span>
                </div>
                <h3 class="idc-card-title">${escapeHtml(caseStudy.title || '')}</h3>
                <p class="idc-card-desc">${escapeHtml(caseStudy.description || '')}</p>
                <div class="idc-card-footer">
                    <span class="idc-card-date">${formatDate(caseStudy.date)}</span>
                    <button type="button" class="case-study-link" onclick="openCaseStudyModal('${encodeURIComponent(caseStudy.id)}')">
                    Read case study &rarr;
                </button>
                </div>
            </div>
        `;
        return el;
    }

    function showCard() {
        const cards = groupedCaseStudies[industries[activeIndustry]];
        const cs = cards[activeCard];

        // Fade old out, new in
        const old = viewport.querySelector(".idc-card");
        const fresh = renderCard(cs);
        fresh.classList.add("idc-entering");
        viewport.appendChild(fresh);

        if (old) {
            old.classList.add("idc-leaving");
            setTimeout(() => old.remove(), 350);
        }

        setTimeout(() => fresh.classList.remove("idc-entering"), 20);

        // Update counter
        curEl.textContent = activeCard + 1;
        totEl.textContent = cards.length;

        // Arrow states
        prevBtn.disabled = activeCard === 0;
        nextBtn.disabled = activeCard === cards.length - 1;
    }

    function switchIndustry(idx) {
        tabs[activeIndustry].classList.remove("active");
        activeIndustry = idx;
        activeCard = 0;
        tabs[activeIndustry].classList.add("active");
        showCard();
    }

    prevBtn.addEventListener("click", () => {
        if (activeCard > 0) { activeCard--; showCard(); }
    });

    nextBtn.addEventListener("click", () => {
        const total = groupedCaseStudies[industries[activeIndustry]].length;
        if (activeCard < total - 1) { activeCard++; showCard(); }
    });

    // Initial render
    showCard();

}


/**
 * ============================================================
 * CREATE CASE STUDY CARD
 * ============================================================
 *
 * Used by BOTH:
 *
 * - Index page
 * - Services page
 */
function createCaseStudyCard(
    caseStudy
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "case-study-card";


    card.innerHTML = `

        <div class="case-study-image-wrapper">
            <img src="${escapeHtml(`${CASE_STUDIES_API}/${caseStudy.id}/image`)}" alt="${escapeHtml(caseStudy.title)}" class="case-study-image" loading="lazy">
        </div>

        <div class="case-study-content">
            <div class="case-study-meta">
                <span class="case-study-tag">${escapeHtml(caseStudy.industry || "Industry")}</span>
                <span class="case-study-tag">${escapeHtml(caseStudy.service || "Service")}</span>
            </div>

            <h3 class="case-study-title">${escapeHtml(caseStudy.title)}</h3>
            
            <p class="case-study-description">${escapeHtml(caseStudy.description || "")}</p>

            ${(caseStudy.stat1 || caseStudy.stat2 || caseStudy.stat3) ? `
            <div class="case-study-stats-row">
                ${caseStudy.stat1 ? `<div class="cs-stat-box">${escapeHtml(caseStudy.stat1)}</div>` : ''}
                ${caseStudy.stat2 ? `<div class="cs-stat-box">${escapeHtml(caseStudy.stat2)}</div>` : ''}
                ${caseStudy.stat3 ? `<div class="cs-stat-box">${escapeHtml(caseStudy.stat3)}</div>` : ''}
            </div>
            ` : ''}

            <div class="case-study-footer">
                <span class="case-study-author">Edge Analytics</span>
                <button type="button" class="case-study-link" onclick="openCaseStudyModal('${encodeURIComponent(caseStudy.id)}')">
                    View Case Study &rarr;
                </button>
            </div>
        </div>

    `;


    return card;

}


/**
 * ============================================================
 * RENDER CASE STUDY CARDS
 * ============================================================
 */
function renderCaseStudyCards(
    caseStudies,
    container
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!caseStudies.length) {

        container.innerHTML = `
            <p>
                No case studies are currently available.
            </p>
        `;

        return;

    }


    caseStudies.forEach(
        caseStudy => {

            const card =
                createCaseStudyCard(
                    caseStudy
                );


            container.appendChild(
                card
            );

        }
    );

}


/**
 * ============================================================
 * FULL CASE STUDY PAGE
 * ============================================================
 */


/**
 * Load a single case study.
 */
async function loadFullCaseStudy() {

    const loading =
        document.getElementById(
            "case-study-loading"
        );

    const error =
        document.getElementById(
            "case-study-error"
        );

    const content =
        document.getElementById(
            "case-study-content"
        );


    /**
     * Get ID from URL.
     *
     * Example:
     *
     * case-study.html?id=123
     */
    const params =
        new URLSearchParams(
            window.location.search
        );


    const caseStudyId =
        params.get("id");


    /**
     * Check that an ID exists.
     */
    if (!caseStudyId) {

        showCaseStudyError();

        return;

    }


    try {

        loading.hidden = false;
        error.hidden = true;
        content.hidden = true;


        /**
         * Retrieve the individual case study.
         *
         * This uses the Node.js cached endpoint.
         */
        const response =
            await fetch(
                `${CASE_STUDIES_API}/${encodeURIComponent(
                    caseStudyId
                )}`
            );


        if (!response.ok) {

            throw new Error(
                "Case study not found."
            );

        }


        const caseStudy =
            await response.json();


        /**
         * Populate the page.
         */
        renderFullCaseStudy(
            caseStudy
        );


        /**
         * Display the page.
         */
        content.hidden = false;


    } catch (err) {

        console.error(
            "Full case study error:",
            err
        );


        showCaseStudyError();


    } finally {

        loading.hidden = true;

    }

}


/**
 * ============================================================
 * RENDER FULL CASE STUDY
 * ============================================================
 */
function renderFullCaseStudy(
    caseStudy
) {

    /**
     * Browser title.
     */
    document.title =
        `${caseStudy.title} | Case Study`;


    /**
     * Industry.
     */
    setText(
        "case-study-industry",
        caseStudy.industry
    );


    /**
     * Service.
     */
    setText(
        "case-study-service",
        caseStudy.service
    );


    /**
     * Title.
     */
    setText(
        "case-study-title",
        caseStudy.title
    );


    /**
     * Published date.
     */
    setText(
        "case-study-date",
        formatDate(
            caseStudy.date
        )
    );


    /**
     * Main image.
     */
    const image =
        document.getElementById(
            "case-study-image"
        );


    if (image) {

        image.src =
            `${CASE_STUDIES_API}/${caseStudy.id}/image`;

        image.alt =
            caseStudy.title ||
            "Case study";

    }


    /**
     * Description.
     */
    setText(
        "case-study-description",
        caseStudy.description
    );


    /**
     * Solution.
     */
    setText(
        "case-study-solution",
        caseStudy.solution
    );


    /**
     * Statistics.
     */
    renderStatistic(
        "case-study-stat1",
        caseStudy.stat1
    );


    renderStatistic(
        "case-study-stat2",
        caseStudy.stat2
    );


    renderStatistic(
        "case-study-stat3",
        caseStudy.stat3
    );


    /**
     * PDF viewer.
     */
    const pdf =
        document.getElementById(
            "case-study-pdf"
        );


    if (pdf) {

        pdf.src =
            pdf.src = `${CASE_STUDIES_API}/${caseStudy.id}/pdf`;

    }

}


/**
 * ============================================================
 * RENDER STATISTIC
 * ============================================================
 */
function renderStatistic(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        element.parentElement.style.display =
            "none";

        return;

    }


    element.textContent =
        value;

}


/**
 * ============================================================
 * SET TEXT
 * ============================================================
 */
function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    element.textContent =
        value || "";

}


/**
 * ============================================================
 * FORMAT DATE
 * ============================================================
 */
function formatDate(
    dateValue
) {

    if (!dateValue) {

        return "";

    }


    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateValue;

    }


    return date.toLocaleDateString(
        "en-ZA",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/**
 * ============================================================
 * ERROR HANDLING
 * ============================================================
 */
function showCaseStudyError() {

    const loading =
        document.getElementById(
            "case-study-loading"
        );

    const error =
        document.getElementById(
            "case-study-error"
        );

    const content =
        document.getElementById(
            "case-study-content"
        );


    if (loading) {
        loading.hidden = true;
    }


    if (content) {
        content.hidden = true;
    }


    if (error) {
        error.hidden = false;
    }

}


/**
 * ============================================================
 * HTML ESCAPING
 * ============================================================
 *
 * Used when creating HTML cards.
 */
function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}

/**
 * ============================================================
 * READ-ONLY CASE STUDY MODAL
 * ============================================================
 */

/* ============================================================
   PDF MODAL
============================================================ */

function openCaseStudyModal(id) {

    if (!window.allCaseStudiesData) return;

    const cs = window.allCaseStudiesData.get(decodeURIComponent(id));

    if (!cs) return;

    let modal = document.getElementById("cs-modal-overlay");

    if (!modal) {

        modal = document.createElement("div");

        modal.id = "cs-modal-overlay";

        modal.className = "cs-modal-overlay";

        modal.innerHTML = `
            <div class="cs-pdf-modal">

                <div class="cs-pdf-toolbar">

                    <div class="cs-pdf-title">
                        ${escapeHtml(cs.title)}
                    </div>

                    <div class="cs-pdf-buttons">

                        <a
                            id="cs-open-tab"
                            class="cs-pdf-btn"
                            target="_blank">
                            Open in New Tab
                        </a>

                        <button
                            id="cs-fullscreen"
                            class="cs-pdf-btn">
                            Full Screen
                        </button>

                        <button
                            class="cs-pdf-close"
                            onclick="closeCaseStudyModal()">

                            ✕

                        </button>

                    </div>

                </div>

                <div class="cs-pdf-container">

                    <iframe
    id="cs-pdf-frame"
    class="cs-pdf-frame"
    loading="lazy"
    allowfullscreen
    referrerpolicy="no-referrer">
</iframe>

                </div>

            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener("click", function (e) {

            if (e.target === modal) {

                closeCaseStudyModal();

            }

        });

        document.addEventListener("keydown", function (e) {

            if (
                e.key === "Escape" &&
                modal.classList.contains("active")
            ) {

                closeCaseStudyModal();

            }

        });

    }

    const pdfFrame = document.getElementById("cs-pdf-frame");

    // Hide the PDF viewer toolbar where supported
    const pdfUrl = `${CASE_STUDIES_API}/${cs.id}/pdf`;
    pdfFrame.src = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
    document.getElementById("cs-open-tab").href = pdfUrl;


    document.getElementById("cs-fullscreen").onclick = function () {

        const frame = document.getElementById("cs-pdf-frame");

        if (frame.requestFullscreen) {

            frame.requestFullscreen();

        }

    };

    document.body.style.overflow = "hidden";

    modal.classList.add("active");

}

function closeCaseStudyModal() {

    const modal = document.getElementById("cs-modal-overlay");

    if (!modal) return;

    modal.classList.remove("active");

    document.body.style.overflow = "";

    document.getElementById("cs-pdf-frame").src = "";

}