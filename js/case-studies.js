const API_URL = "/api/case-studies";

let allStudies = [];

document.addEventListener("DOMContentLoaded", () => {
  const filterIndustry = document.getElementById("filterIndustry");
  const filterService = document.getElementById("filterService");
  const filterSolution = document.getElementById("filterSolution");
  const btnResetFilters = document.getElementById("btnResetFilters");

  // Set up PDF.js worker
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  }

  // Populate filter dropdowns dynamically based on available data
  function populateFilters(studies) {
    if (!filterIndustry || !filterService || !filterSolution) return;

    // Use Sets to keep unique values, ignoring empty or null
    const industries = new Set();
    const services = new Set();
    const solutions = new Set();
    // Helper to safely add values (handles strings or arrays of strings)
    const addValues = (set, val) => {
      if (!val) return;
      if (Array.isArray(val)) {
        val.forEach(v => {
          if (typeof v === 'string' && v.trim() !== "") set.add(v.trim());
        });
      } else if (typeof val === 'string' && val.trim() !== "") {
        set.add(val.trim());
      }
    };

    studies.forEach(s => {
      addValues(industries, s.industry);
      addValues(services, s.service);
      addValues(solutions, s.solution);
    });
    // Helper to generate options
    const generateOptions = (set, defaultText) => {
      const options = [`<option value="all">${defaultText}</option>`];
      Array.from(set).sort().forEach(val => {
        // use the exact original case for display, but lower-case for value matching
        options.push(`<option value="${val}">${escapeHtml(val)}</option>`);
      });
      return options.join("");
    };

    // Remember current selected values so they don't reset if already selected
    const currIndustry = filterIndustry.value;
    const currService = filterService.value;
    const currSolution = filterSolution.value;

    filterIndustry.innerHTML = generateOptions(industries, "All Industries");
    filterService.innerHTML = generateOptions(services, "All Services");
    filterSolution.innerHTML = generateOptions(solutions, "All Solutions");

    // Restore selections if they still exist in the new options (comparing by exact string)
    if (industries.has(currIndustry)) filterIndustry.value = currIndustry;
    if (services.has(currService)) filterService.value = currService;
    if (solutions.has(currSolution)) filterSolution.value = currSolution;
  }

  // Fetch case studies from Zoho API
  async function loadStudies() {
    const grid = document.getElementById("caseStudies");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allStudies = await response.json();
      updateStatsStrip(allStudies);
      populateFilters(allStudies);
      displayStudies(allStudies);
    } catch (err) {
      console.error("Failed to load case studies from Zoho:", err);
      try {
        const fallbackRes = await fetch("https://edgeanalytics-website.onrender.com/api/case-studies");
        allStudies = await fallbackRes.json();
        updateStatsStrip(allStudies);
        displayStudies(allStudies);
      } catch (fallbackErr) {
        console.error("Fallback API fetch also failed:", fallbackErr);
        if (grid) {
          grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #ef4444;">
              <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Unable to load case studies at this moment.</p>
              <p style="font-size: 0.85rem; color: #94a3b8;">Please ensure the backend server is running and Zoho credentials are configured.</p>
            </div>
          `;
        }
      }
    }
  }

  // Populate stats strip with real counts
  function updateStatsStrip(studies) {
    const totalEl = document.getElementById('cs-total-count');
    const industryEl = document.getElementById('cs-industry-count');
    const serviceEl = document.getElementById('cs-service-count');

    if (totalEl) totalEl.textContent = studies.length;

    const industries = new Set();
    const services = new Set();
    studies.forEach(s => {
      const addToSet = (set, val) => {
        if (!val) return;
        if (Array.isArray(val)) val.forEach(v => v && set.add(v.trim()));
        else if (typeof val === 'string') set.add(val.trim());
      };
      addToSet(industries, s.industry);
      addToSet(services, s.service);
    });

    if (industryEl) industryEl.textContent = industries.size || '—';
    if (serviceEl) serviceEl.textContent = services.size || '—';
  }

  // Display case studies in the grid matching insights.html design
  function displayStudies(studies) {
    const grid = document.getElementById("caseStudies");
    const featuredSection = document.getElementById("featured-section");
    const highlightsGrid = document.getElementById("highlights-grid");

    if (!grid) return;

    // Filter by active select filters
    let filtered = studies;

    const industryVal = filterIndustry ? filterIndustry.value.toLowerCase() : "all";
    const serviceVal = filterService ? filterService.value.toLowerCase() : "all";
    const solutionVal = filterSolution ? filterSolution.value.toLowerCase() : "all";

    // Helper to check if a field contains the filter value
    const matchesFilter = (fieldValue, filterVal) => {
      if (!fieldValue) return false;
      if (Array.isArray(fieldValue)) {
        return fieldValue.some(v => typeof v === 'string' && v.toLowerCase().includes(filterVal));
      }
      return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(filterVal);
    };

    if (industryVal !== "all") {
      filtered = filtered.filter(s => matchesFilter(s.industry, industryVal));
    }

    if (serviceVal !== "all") {
      filtered = filtered.filter(s => matchesFilter(s.service, serviceVal));
    }

    if (solutionVal !== "all") {
      filtered = filtered.filter(s => matchesFilter(s.solution, solutionVal));
    }

    const isAnyFilterActive = (industryVal !== "all" || serviceVal !== "all" || solutionVal !== "all");

    // Populate Featured Section (always display latest 2 based on date)
    if (highlightsGrid && featuredSection) {
      if (studies.length > 0) {
        // Sort all studies by date (newest first)
        const sortedStudies = [...studies].sort((a, b) => {
          const dateA = new Date(a.date || 0);
          const dateB = new Date(b.date || 0);
          return dateB - dateA;
        });

        const featuredStudies = sortedStudies.slice(0, 2);
        featuredSection.style.display = "block";

        highlightsGrid.innerHTML = featuredStudies.map(study => {
          const getDisplayVal = (val) => Array.isArray(val) ? val.join(", ") : val;
          const industryDisplay = study.industry ? escapeHtml(getDisplayVal(study.industry)) : "";

          return `
            <div class="case-card">
              <div class="case-image-wrapper">
                <img src="${study.image || 'images/insight_education.png'}" alt="${escapeHtml(study.title)}" class="case-image" onerror="this.src='images/insight_education.png'">
              </div>
              <div class="case-content">
                <div>
                  <div class="case-header">
                    ${industryDisplay ? `<span class="case-tag case-tag-industry">${industryDisplay}</span>` : ''}
                    <span class="case-tag case-tag-service">${escapeHtml(study.service || 'Case Study')}</span>
                  </div>
                  <h2>${escapeHtml(study.title)}</h2>
                  <p class="summary">${escapeHtml(truncate(study.description, 160))}</p>
                  ${study.date ? `<p style="color:#94a3b8; font-size:0.82rem; margin-top:0.4rem;">${escapeHtml(study.date)}</p>` : ''}
                </div>
                <div class="footer">
                  <span class="author">${escapeHtml(study.author || 'Edge Analytics')}</span>
                  <a href="#" class="read-more open-pdf-modal" data-id="${study.id}">
                    View case study
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          `;
        }).join('');
      } else {
        featuredSection.style.display = "none";
      }
    }

    // Populate Main Cards Grid
    // Update count badge
    const countBadge = document.getElementById('cs-grid-count');
    if (countBadge) {
      countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'result' : 'results'}`;
    }

    if (filtered.length === 0) {
      let emptyMsg = "No case studies found matching your criteria.";
      if (industryVal !== "all") {
        const displayInd = filterIndustry && filterIndustry.options[filterIndustry.selectedIndex] ? filterIndustry.options[filterIndustry.selectedIndex].text : industryVal;
        emptyMsg = `No case studies found for the <strong>${escapeHtml(displayInd)}</strong> industry. We are constantly updating our portfolio, please check back soon.`;
      }
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: #ffffff; border-radius: 16px; border: 1px dashed #cbd5e1; color: #64748b; margin-top: 2rem;">
          <svg style="margin: 0 auto 1.5rem; color: #94a3b8;" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <p style="font-size: 1.15rem; max-width: 600px; margin: 0 auto; line-height: 1.6;">${emptyMsg}</p>
          <button onclick="document.getElementById('btnResetFilters').click()" style="margin-top: 1.5rem; background: #0db39e; color: #ffffff; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.95rem; transition: background 0.2s;">View All Case Studies</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(study => {
      const getDisplayVal = (val) => Array.isArray(val) ? val.join(", ") : val;
      const industryDisplay = study.industry ? escapeHtml(getDisplayVal(study.industry)) : "";

      return `
        <div class="case-card">
          <div class="case-image-wrapper">
            <img src="${study.image || 'images/insight_education.png'}" alt="${escapeHtml(study.title)}" class="case-image" onerror="this.src='images/insight_education.png'">
          </div>
          <div class="case-content">
            <div>
              <div class="case-header">
                ${industryDisplay ? `<span class="case-tag case-tag-industry">${industryDisplay}</span>` : ''}
                <span class="case-tag case-tag-service">${escapeHtml(study.service || 'Case Study')}</span>
              </div>
              <h2>${escapeHtml(study.title)}</h2>
              <p class="summary">${escapeHtml(truncate(study.description, 160))}</p>
              ${study.date ? `<p style="color:#94a3b8; font-size:0.82rem; margin-top:0.4rem;">${escapeHtml(study.date)}</p>` : ''}
            </div>
            <div class="footer">
              <span class="author">${escapeHtml(study.author || 'Edge Analytics')}</span>
              <a href="#" class="read-more open-pdf-modal" data-id="${study.id}">
                View case study
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Modal logic removed, directly uses href in HTML.

  // Modal Logic
  const pdfModal = document.getElementById('pdfViewerModal');
  const closePdfModal = document.getElementById('closePdfModal');
  const pdfModalBody = document.getElementById('pdfModalBody');

  if (pdfModal && closePdfModal && pdfModalBody) {
    // Open Modal via event delegation
    document.addEventListener('click', async (e) => {
      const link = e.target.closest('.open-pdf-modal');
      if (link) {
        e.preventDefault();
        const id = link.getAttribute('data-id');
        if (id) {
          pdfModal.classList.add('active');
          pdfModalBody.innerHTML = '<div style="color:#94a3b8; font-size:1.2rem;">Loading Document...</div>';

          try {
            const pdfUrl = `/api/case-studies/${id}/pdf`;
            const loadingTask = pdfjsLib.getDocument(pdfUrl);
            const pdf = await loadingTask.promise;

            pdfModalBody.innerHTML = ''; // clear loading

            // Render all pages
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const scale = 1.5; // Good balance for readability
              const viewport = page.getViewport({ scale });

              const canvas = document.createElement('canvas');
              canvas.className = 'pdf-page-canvas';
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };

              await page.render(renderContext).promise;
              pdfModalBody.appendChild(canvas);
            }
          } catch (error) {
            console.error("Error loading PDF:", error);
            pdfModalBody.innerHTML = '<div style="color:#ef4444; font-size:1.2rem;">Error loading document.</div>';
          }
        }
      }
    });

    // Close Modal
    const closeModal = () => {
      pdfModal.classList.remove('active');
      setTimeout(() => {
        pdfModalBody.innerHTML = ''; // Clear canvases
      }, 300);
    };

    closePdfModal.addEventListener('click', closeModal);

    // Close on overlay click
    pdfModal.addEventListener('click', (e) => {
      if (e.target === pdfModal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Advanced Filter change handlers
  const applyFilters = () => displayStudies(allStudies);

  if (filterIndustry) filterIndustry.addEventListener("change", applyFilters);
  if (filterService) filterService.addEventListener("change", applyFilters);
  if (filterSolution) filterSolution.addEventListener("change", applyFilters);
  if (btnResetFilters) {
    btnResetFilters.addEventListener("click", () => {
      if (filterIndustry) filterIndustry.value = "all";
      if (filterService) filterService.value = "all";
      if (filterSolution) filterSolution.value = "all";
      applyFilters();
    });
  }

  // Helper functions
  function parseStat(statStr) {
    if (!statStr) return { num: "", text: "" };
    const match = statStr.match(/^([\d%\+\-><\s]+(?:%|\b))(.+)$/) || statStr.match(/^([^\s]+)\s+(.+)$/);
    if (match) {
      return {
        num: match[1].trim(),
        text: match[2].trim()
      };
    }
    return { num: "", text: statStr };
  }

  function truncate(str, maxLength) {
    if (!str) return "";
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + "...";
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Helper to show active filter banner
  const activeFilterBanner = document.getElementById('active-filter-banner');
  const activeFilterText = document.getElementById('active-filter-text');
  const btnClearActiveFilter = document.getElementById('btn-clear-active-filter');

  function showActiveFilterBanner(filterName, value) {
    if (activeFilterBanner && activeFilterText) {
      activeFilterText.textContent = `Showing results filtered by ${filterName}: ${value}`;
      activeFilterBanner.style.display = 'flex';
    }
  }

  if (btnClearActiveFilter) {
    btnClearActiveFilter.addEventListener('click', () => {
      if (filterIndustry) filterIndustry.value = "all";
      if (filterService) filterService.value = "all";
      if (filterSolution) filterSolution.value = "all";
      applyFilters();
      activeFilterBanner.style.display = 'none';

      // Clean up the URL without refreshing
      if (window.history && window.history.replaceState) {
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
      }
    });
  }

  // Initial load call
  loadStudies().then(() => {
    // Check URL parameters to see if a specific case study should be highlighted or filtered
    const urlParams = new URLSearchParams(window.location.search);
    const openId = urlParams.get('openId');
    const paramIndustry = urlParams.get('industry');

    let filtersApplied = false;

    if (openId) {
      // Find the specific case study to get its filters
      const study = allStudies.find(s => String(s.id) === String(openId));
      if (study) {
        // Set the filters to match this case study
        const getFirstVal = (val) => {
          if (!val) return null;
          if (Array.isArray(val)) return val.length > 0 ? String(val[0]).trim() : null;
          return String(val).trim();
        };

        // If industry param is explicitly provided in URL, prioritize that, otherwise use study's industry
        let indVal = paramIndustry ? paramIndustry : getFirstVal(study.industry);

        // Find matching option in dropdown (case-insensitive)
        if (filterIndustry && indVal) {
          const options = Array.from(filterIndustry.options);
          const match = options.find(opt => opt.value.toLowerCase() === indVal.toLowerCase() || opt.textContent.toLowerCase() === indVal.toLowerCase());
          if (match) {
            filterIndustry.value = match.value;
            showActiveFilterBanner("Industry", match.textContent);
            filtersApplied = true;
          } else {
            // Fallback if not found, just use exact string
            filterIndustry.value = indVal;
          }
        }

        const srvVal = getFirstVal(study.service);
        if (filterService && srvVal && !paramIndustry) filterService.value = srvVal; // only auto-filter service if we aren't explicitly linking from an industry page

        const solVal = getFirstVal(study.solution);
        if (filterSolution && solVal && !paramIndustry) filterSolution.value = solVal;

        // Apply the filters to the background grid
        displayStudies(allStudies);

        // Scroll to the matching card and highlight it
        setTimeout(() => {
          const card = document.querySelector(`.highlight-card a[data-id="${openId}"]`)?.closest('.highlight-card');
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('highlight-target');
            setTimeout(() => card.classList.remove('highlight-target'), 2500);
          }
        }, 200);
      }
    } else if (paramIndustry) {
      // Just industry filter applied (from Digital Services tabs)
      if (filterIndustry) {
        const options = Array.from(filterIndustry.options);
        const match = options.find(opt => opt.value.toLowerCase() === paramIndustry.toLowerCase() || opt.textContent.toLowerCase() === paramIndustry.toLowerCase());
        if (match) {
          filterIndustry.value = match.value;
          showActiveFilterBanner("Industry", match.textContent);
          filtersApplied = true;
        }
      }
      displayStudies(allStudies);
    }
  });
});