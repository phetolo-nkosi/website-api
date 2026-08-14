document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile navigation menu toggle
  const burgerMenu = document.getElementById('burger-menu');
  const navList = document.getElementById('nav-list');

  // Create backdrop overlay
  let navBackdrop = document.getElementById('nav-backdrop');
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.id = 'nav-backdrop';
    navBackdrop.style.cssText = `
      position: fixed; inset: 0; top: 70px;
      background: rgba(0,0,0,0.45);
      z-index: 98999;
      opacity: 0; visibility: hidden; pointer-events: none;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    `;
    document.body.appendChild(navBackdrop);
  }

  function openMobileNav() {
    burgerMenu.classList.add('active');
    navList.classList.add('active');
    navBackdrop.style.opacity = '1';
    navBackdrop.style.visibility = 'visible';
    navBackdrop.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    burgerMenu.classList.remove('active');
    navList.classList.remove('active');
    navBackdrop.style.opacity = '0';
    navBackdrop.style.visibility = 'hidden';
    navBackdrop.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    // Close all open submenus
    document.querySelectorAll('.nav-item-dropdown.open').forEach(el => el.classList.remove('open'));
  }

  if (burgerMenu && navList) {
    burgerMenu.addEventListener('click', () => {
      if (navList.classList.contains('active')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Backdrop click closes menu
    navBackdrop.addEventListener('click', closeMobileNav);

    // Submenu accordion on mobile — toggle open class on parent li
    document.querySelectorAll('.nav-item-dropdown .dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 || (navList && navList.classList.contains('active'))) {
          e.preventDefault();
          const parent = toggle.closest('.nav-item-dropdown');
          if (parent) {
            // Close any other open dropdowns
            document.querySelectorAll('.nav-item-dropdown.open').forEach(el => {
              if (el !== parent) el.classList.remove('open');
            });
            parent.classList.toggle('open');
          }
        }
      });
    });

    // Close menu when a non-toggle link is clicked
    document.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          closeMobileNav();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('active')) {
        closeMobileNav();
      }
    });
  }

  // 2. Active nav link state switcher
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // 3. Header background transition on scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 4. Stats counter count-up animation
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / target));
    const suffix = element.getAttribute('data-suffix') || '';
    let current = 0;
    
    // Safety check for tiny numbers (like 6) to make it smooth
    const increment = target > 50 ? Math.ceil(target / 100) : 1;
    const intervalTime = target > 50 ? 20 : stepTime * increment;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = current + suffix;
      }
    }, intervalTime);
  };

  // Setup Intersection Observer to animate only when visible
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger counter for each element in the card
        const elementsToAnimate = entry.target.querySelectorAll('.stat-number');
        elementsToAnimate.forEach(el => {
          // Prevent double animation
          if (!el.classList.contains('animated')) {
            el.classList.add('animated');
            countUp(el);
          }
        });

        // Animate the progress bar width
        const progressBar = entry.target.querySelector('.stat-progress-bar');
        if (progressBar) {
          progressBar.style.width = progressBar.getAttribute('data-progress') + '%';
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const statsCard = document.querySelector('.stats-card');
  if (statsCard) {
    statsObserver.observe(statsCard);
  }

  // 5. Video play overlay handler
  const playOverlay = document.getElementById('video-play-overlay');
  const video = document.getElementById('about-video');
  
  if (playOverlay && video) {
    playOverlay.addEventListener('click', () => {
      video.play();
      playOverlay.classList.add('hidden');
      video.setAttribute('controls', 'true');
    });
    
    video.addEventListener('pause', () => {
      playOverlay.classList.remove('hidden');
    });
    
    video.addEventListener('ended', () => {
      playOverlay.classList.remove('hidden');
    });
  }

  // 6. What We Do Section (Interactive Tabbed Services - Creative HUD Redesign)
  const servicesTabsList = document.getElementById('category-pillars-grid');
  if (servicesTabsList) {
    const icons = {
      cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
      database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>`,
      brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z"></path></svg>`,
      gear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
      shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
      lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
      radar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 12L16 8"></path><path d="M12 3a9 9 0 0 1 9 9"></path><path d="M12 6a6 6 0 0 1 6 6"></path></svg>`,
      fileCheck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><polyline points="9 15 11 17 15 13"></polyline></svg>`,
      roadmap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 15 9 18 3 15"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>`,
      network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><path d="M12 8v8"></path><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path></svg>`,
      workflow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
      key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`,
      server: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
      backup: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>`
    };

    const servicesData = {
      digital: {
        title: "Digital Services",
        exploreUrl: "#",
        buttonText: "Explore Digital Services",
        items: [
          {
            num: "01",
            title: "Automation",
            desc: "Our Automation Services help organisations streamline operations, reduce manual effort, and improve accuracy across critical business processes. We design and implement intelligent automation solutions—from robotic process automation to AI-driven workflows—that enhance efficiency and enable faster, more informed decision-making. The result is a more agile, cost-effective organisation, equipped to scale and focus on higher-value activities.",
            icon: "gear",
            meta1Label: "Error Rate",
            meta1Val: "Approach Zero",
            meta2Label: "Efficiency",
            meta2Val: "90% Time Saved",
            progress1: 100,
            progress2: 90
          },
          {
            num: "02",
            title: "Cloud",
            desc: "Our Cloud Services help organisations design comprehensive, future-proof cloud strategies. From selecting public, private, or hybrid clouds to calculating ROI and mapping migration paths, our consulting services align infrastructure transformation directly with your business goals.",
            icon: "cloud",
            meta1Label: "SLA Focus",
            meta1Val: "ROI Targeted",
            meta2Label: "Approach",
            meta2Val: "Framework Aligned",
            progress1: 90,
            progress2: 85
          },
          {
            num: "03",
            title: "Data, Analytics & AI",
            desc: "Unlock the value of your business data with robust, modern analytics platforms and deploy intelligence at scale. Our AI/ML and analytics solutions deliver advanced predictive analytics, natural language processing, and automated decision engines that optimize operations and enhance customer engagement.",
            icon: "brain",
            meta1Label: "Performance",
            meta1Val: "Real-time Capable",
            meta2Label: "Scalability",
            meta2Val: "Petabyte Scale",
            progress1: 99,
            progress2: 95
          },
          {
            num: "04",
            title: "Student Information Management",
            desc: "Our Student Information Management Services help educational institutions streamline student records, manage admissions, track academic progress, and automate administrative workflows. We implement modern, secure, and user-friendly platforms that enhance collaboration between students, faculty, and administrators.",
            icon: "fileCheck",
            meta1Label: "Integration",
            meta1Val: "Unified System",
            meta2Label: "Accuracy",
            meta2Val: "99.9% Reliable",
            progress1: 95,
            progress2: 99
          }
        ]
      },
      risk: {
        title: "Risk Management",
        exploreUrl: "#",
        buttonText: "Explore Risk Management",
        items: [
          {
            num: "01",
            title: "Enterprise Risk Management (ERM)",
            desc: "Design and implement comprehensive ERM frameworks to identify, assess, and prioritize enterprise-wide risks. We help your executive leadership align risk tolerance with corporate strategy, ensuring a resilient foundation for long-term growth.",
            icon: "shield",
            meta1Label: "Coverage",
            meta1Val: "Enterprise-wide",
            meta2Label: "Framework",
            meta2Val: "ISO 31000/COSO",
            progress1: 100,
            progress2: 95
          },
          {
            num: "02",
            title: "Cybersecurity & Threat Mitigation",
            desc: "Protect your infrastructure from ever-evolving threats. Our cybersecurity advisory services deliver threat modeling, security architecture reviews, and robust mitigation strategies designed to protect intellectual property and customer trust.",
            icon: "lock",
            meta1Label: "Threat Intel",
            meta1Val: "Active 24/7",
            meta2Label: "Compliance",
            meta2Val: "NIST Aligned",
            progress1: 95,
            progress2: 100
          },
          {
            num: "03",
            title: "Fraud & Financial Crime Analytics",
            desc: "Incorporate intelligent surveillance and detection models. We utilize machine learning algorithms to scan transactions, identify anomalous behavior patterns, and proactively flag fraudulent activity before it impacts your bottom line.",
            icon: "radar",
            meta1Label: "Alert Time",
            meta1Val: "Near Instant",
            meta2Label: "Model Accuracy",
            meta2Val: "98.7% Precision",
            progress1: 98,
            progress2: 90
          },
          {
            num: "04",
            title: "Regulatory Compliance & AML",
            desc: "Ensure complete compliance with financial regulatory demands. We implement automated Anti-Money Laundering (AML) checks, Know Your Customer (KYC) workflows, and regulatory reporting engines to keep your organization clear of operational and compliance risks.",
            icon: "fileCheck",
            meta1Label: "Compliance",
            meta1Val: "100% Audit Ready",
            meta2Label: "Rule Updates",
            meta2Val: "Real-time Dynamic",
            progress1: 100,
            progress2: 100
          }
        ]
      },
      advisory: {
        title: "Advisory Services",
        exploreUrl: "#",
        buttonText: "Explore Advisory Services",
        items: [
          {
            num: "01",
            title: "Digital Strategy & Roadmap",
            desc: "Create an actionable digital blueprint to drive technology modernisation. We evaluate your current systems, benchmark against industry leaders, and build a phased implementation roadmap to guide your digital transformation journey.",
            icon: "roadmap",
            meta1Label: "Timeline",
            meta1Val: "Structured Phasing",
            meta2Label: "Impact",
            meta2Val: "Long-term Value",
            progress1: 95,
            progress2: 90
          },
          {
            num: "02",
            title: "Target Operating Model Design",
            desc: "Structure your organization to operate with optimal speed and efficiency. We align structure, roles, governance, and technology workflows to improve process efficiency, reduce communication silos, and scale operations smoothly.",
            icon: "network",
            meta1Label: "Goal",
            meta1Val: "Frictionless Flow",
            meta2Label: "Metric",
            meta2Val: "Structure Optimised",
            progress1: 90,
            progress2: 85
          },
          {
            num: "03",
            title: "Business Process Re-engineering",
            desc: "Analyze and optimize core operational workflows. Our team removes operational bottlenecks, streamlines process steps, and integrates automated tooling to significantly lower operational overhead and boost service delivery speeds.",
            icon: "workflow",
            meta1Label: "Overhead Reduction",
            meta1Val: "30% Average",
            meta2Label: "Cycle Time",
            meta2Val: "Cut by Half",
            progress1: 100,
            progress2: 95
          },
          {
            num: "04",
            title: "Information Security & Governance",
            desc: "Establish clear data governance and security compliance standards. We design policies, assign clear data stewardship, and prepare teams for standard certifications (like ISO 27001 or SOC 2) to maintain data privacy and compliance.",
            icon: "key",
            meta1Label: "Governance",
            meta1Val: "ISO 27001 Ready",
            meta2Label: "Data Control",
            meta2Val: "Granular Privacy",
            progress1: 100,
            progress2: 100
          }
        ]
      },
      managed: {
        title: "Managed Services",
        exploreUrl: "#",
        buttonText: "Explore Managed Services",
        items: [
          {
            num: "01",
            title: "Cloud Management and Migration",
            desc: "Our Managed Cloud Management and Migration Services ensure your cloud environment is continuously optimised, secure, and aligned to evolving business needs. We oversee the full lifecycle—from seamless migration to ongoing performance monitoring, cost optimisation, and governance—so you can focus on core operations. The result is a resilient, scalable cloud platform that delivers sustained value and supports long-term growth.",
            icon: "cloud",
            meta1Label: "SLA Target",
            meta1Val: "99.99% Uptime",
            meta2Label: "Coverage",
            meta2Val: "24/7 Monitoring",
            progress1: 99.99,
            progress2: 100
          },
          {
            num: "02",
            title: "Cybersecurity Services",
            desc: "Our Managed Cybersecurity Services provide end-to-end protection against ever-evolving threat landscapes. We deliver 24/7 security monitoring, vulnerability assessments, threat hunting, and incident response to safeguard your critical data and digital assets, ensuring business continuity and maintaining customer trust.",
            icon: "lock",
            meta1Label: "Incident SLA",
            meta1Val: "< 15 Min Response",
            meta2Label: "Operations",
            meta2Val: "Full SOC Access",
            progress1: 95,
            progress2: 100
          },
          {
            num: "03",
            title: "Application Monitoring and Maintenance",
            desc: "Our Managed Application Monitoring and Maintenance Services ensure that your mission-critical applications run at peak performance with zero friction. We proactively track application health, resolve bottlenecks, deploy patches, and implement incremental enhancements, maximizing uptime and user satisfaction.",
            icon: "server",
            meta1Label: "Response",
            meta1Val: "Proactive Patches",
            meta2Label: "Fix Speed",
            meta2Val: "Immediate Tuning",
            progress1: 99,
            progress2: 100
          },
          {
            num: "04",
            title: "Data Back-up and Disaster Recovery",
            desc: "Our Managed Data Back-up and Disaster Recovery Services shield your organization from data loss and unforeseen disruptions. We implement automated, encrypted backups and robust recovery protocols to ensure your data is rapidly restorable in the event of an outage, system failure, or cyberattack.",
            icon: "backup",
            meta1Label: "RTO Target",
            meta1Val: "< 4 Hours",
            meta2Label: "Security",
            meta2Val: "AES-256 Encrypted",
            progress1: 85,
            progress2: 100
          }
        ]
      }
    };

    const tabButtons = servicesTabsList.querySelectorAll('.corp-tab-card');
    const subServicesList = document.getElementById('sub-services-list');
    const exploreBtn = document.getElementById('explore-services-btn');
    
    // Details card elements
    const detailCard = document.getElementById('service-detail-card');
    const detailBadge = document.getElementById('card-detail-badge');
    const detailIcon = document.getElementById('card-detail-icon');
    const detailTitle = document.getElementById('card-detail-title');
    const detailDesc = document.getElementById('card-detail-desc');
    const metaValue1 = document.getElementById('card-meta-value-1');
    const metaValue2 = document.getElementById('card-meta-value-2');
    const metaLabel1 = document.getElementById('card-meta-label-1');
    const metaLabel2 = document.getElementById('card-meta-label-2');

    function updateDetailCard(categoryName, titleText, descText, iconKey, mLabel1, mVal1, mLabel2, mVal2, prog1, prog2) {
      if (!detailCard || !detailTitle || !detailDesc || !detailBadge || !detailIcon || !metaValue1 || !metaValue2) return;
      
      detailCard.classList.add('updating');
      setTimeout(() => {
        detailBadge.textContent = categoryName;
        detailTitle.textContent = titleText;
        detailDesc.textContent = descText;
        detailIcon.innerHTML = icons[iconKey] || '';
        
        if (metaLabel1 && mLabel1) metaLabel1.textContent = mLabel1;
        if (metaValue1 && mVal1) metaValue1.textContent = mVal1;
        if (metaLabel2 && mLabel2) metaLabel2.textContent = mLabel2;
        if (metaValue2 && mVal2) metaValue2.textContent = mVal2;
        
        // Update progress bar widths inside HUD card
        const progBar1 = document.getElementById('card-meta-progress-1');
        const progBar2 = document.getElementById('card-meta-progress-2');
        if (progBar1) progBar1.style.width = prog1 ? `${prog1}%` : '0%';
        if (progBar2) progBar2.style.width = prog2 ? `${prog2}%` : '0%';
        
        detailCard.classList.remove('updating');
      }, 300);
    }

    function renderSubServices(categoryKey) {
      const categoryData = servicesData[categoryKey];
      if (!categoryData || !subServicesList || !exploreBtn) return;

      subServicesList.innerHTML = '';
      exploreBtn.textContent = categoryData.buttonText + ' ';

      // Add SVG arrow to the button
      const svgArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgArrow.setAttribute('width', '18');
      svgArrow.setAttribute('height', '18');
      svgArrow.setAttribute('viewBox', '0 0 24 24');
      svgArrow.setAttribute('fill', 'none');
      svgArrow.setAttribute('stroke', 'currentColor');
      svgArrow.setAttribute('stroke-width', '2.5');
      svgArrow.setAttribute('stroke-linecap', 'round');
      svgArrow.setAttribute('stroke-linejoin', 'round');
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '5');
      line.setAttribute('y1', '12');
      line.setAttribute('x2', '19');
      line.setAttribute('y2', '12');
      
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', '12 5 19 12 12 19');
      
      svgArrow.appendChild(line);
      svgArrow.appendChild(polyline);
      exploreBtn.appendChild(svgArrow);
      exploreBtn.href = categoryData.exploreUrl;

      categoryData.items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `corp-menu-item${index === 0 ? ' active' : ''}`;
        li.setAttribute('data-index', index);

        li.innerHTML = `
          <span class="node-num">${item.num}</span>
          <h4 class="node-name">${item.title}</h4>
        `;

        li.addEventListener('click', () => {
          subServicesList.querySelectorAll('.corp-menu-item').forEach(el => el.classList.remove('active'));
          li.classList.add('active');
          updateDetailCard(
            categoryData.title,
            item.title,
            item.desc,
            item.icon,
            item.meta1Label,
            item.meta1Val,
            item.meta2Label,
            item.meta2Val,
            item.progress1,
            item.progress2
          );
        });

        subServicesList.appendChild(li);
      });

      const firstItem = categoryData.items[0];
      if (firstItem) {
        // Direct assignment on first load to prevent flash/transition wait
        if (detailBadge) detailBadge.textContent = categoryData.title;
        if (detailTitle) detailTitle.textContent = firstItem.title;
        if (detailDesc) detailDesc.textContent = firstItem.desc;
        if (detailIcon) detailIcon.innerHTML = icons[firstItem.icon] || '';
        
        if (metaLabel1 && firstItem.meta1Label) metaLabel1.textContent = firstItem.meta1Label;
        if (metaValue1 && firstItem.meta1Val) metaValue1.textContent = firstItem.meta1Val;
        if (metaLabel2 && firstItem.meta2Label) metaLabel2.textContent = firstItem.meta2Label;
        if (metaValue2 && firstItem.meta2Val) metaValue2.textContent = firstItem.meta2Val;
        
        const progBar1 = document.getElementById('card-meta-progress-1');
        const progBar2 = document.getElementById('card-meta-progress-2');
        if (progBar1) progBar1.style.width = firstItem.progress1 ? `${firstItem.progress1}%` : '0%';
        if (progBar2) progBar2.style.width = firstItem.progress2 ? `${firstItem.progress2}%` : '0%';
      }
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;

        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');
        renderSubServices(category);
      });
    });

    // Initialize list items properly from data
    const activeTab = servicesTabsList.querySelector('.corp-tab-card.active');
    if (activeTab) {
      const activeCategory = activeTab.getAttribute('data-category');
      renderSubServices(activeCategory);
    }
  }
});
// Solutions Tabs Dropdown Logic
document.addEventListener('DOMContentLoaded', () => {
  const solutionsTabButtons = document.querySelectorAll('.solutions-tabs-list .tab-btn');
  const dropdownItems = document.querySelectorAll('.solutions-tabs-list .dropdown-item');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  const subContent = {
    'tab-roadmaps': [
      { id: 'overview', title: 'Roadmaps Overview', img: 'images/service-advisory.png', content: 'We help you map out IT and digital transformation journeys aligned with business goals.' },
      { id: 'benefits', title: 'Roadmaps Benefits', img: 'images/service-advisory.png', content: 'Clear milestones, ROI estimation, risk mitigation, and stakeholder alignment.' },
      { id: 'process', title: 'Roadmaps Process', img: 'images/service-advisory.png', content: 'Assessment → Vision → Gap analysis → Phased implementation plan.' }
    ],
    'tab-governance': [
      { id: 'overview', title: 'Governance Overview', img: 'images/insight_compliance.png', content: 'Establish robust data governance models to ensure quality, security, and compliance.' },
      { id: 'frameworks', title: 'Governance Frameworks', img: 'images/insight_compliance.png', content: 'We implement DAMA, COBIT, and industry‑specific policies.' },
      { id: 'implementation', title: 'Governance Implementation', img: 'images/insight_compliance.png', content: 'Roles, responsibilities, data stewardship, and automated controls.' }
    ],
    'tab-architecture': [
      { id: 'overview', title: 'Architecture Overview', img: 'images/insight_compliance.png', content: 'Design enterprise‑wide architectures that are scalable, secure, and future‑ready.' },
      { id: 'principles', title: 'Architecture Principles', img: 'images/insight_compliance.png', content: 'Modularity, interoperability, cloud‑first, and data‑centric design.' },
      { id: 'delivery', title: 'Architecture Delivery', img: 'images/insight_compliance.png', content: 'Blueprints, technology selection, migration pathways, and governance.' }
    ],
    'tab-spend': [
      { id: 'overview', title: 'Cost Audit Overview', img: 'images/insight_compliance.png', content: 'Comprehensive analysis of licensing, SaaS spend, and infrastructure costs.' },
      { id: 'savings', title: 'Savings Opportunities', img: 'images/insight_compliance.png', content: 'Identify under‑utilised licences, right‑size resources, and renegotiate contracts.' },
      { id: 'reporting', title: 'Reporting', img: 'images/insight_compliance.png', content: 'Actionable dashboards and recommendations for CFOs and procurement.' }
    ]
  };

  function renderSubContent(tabId, subId) {
    const panel = document.getElementById(tabId);
    if (!panel) return;
    const item = (subContent[tabId] || []).find(i => i.id === subId);
    if (item) {
      panel.innerHTML = `
        <div class="tab-display-card">
          <div class="tab-visual-box">
            <img src="${item.img}" alt="${item.title}" class="tab-visual-img">
          </div>
          <div class="tab-text-box">
            <h4 class="tab-content-title">${item.title}</h4>
            <p class="tab-content-text">${item.content}</p>
          </div>
        </div>`;
    }
  }

  // Main tab click handling
  solutionsTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      solutionsTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabPanels.forEach(panel => panel.classList.toggle('active', panel.id === btn.dataset.tab));
      const first = (subContent[btn.dataset.tab] || [])[0];
      if (first) {
        renderSubContent(btn.dataset.tab, first.id);
        // set active dropdown item
        document.querySelectorAll(`.dropdown-item[data-tab="${btn.dataset.tab}"]`).forEach(i => i.classList.remove('active'));
        const firstItemElem = document.querySelector(`.dropdown-item[data-tab="${btn.dataset.tab}"][data-sub="${first.id}"]`);
        if (firstItemElem) firstItemElem.classList.add('active');
      }
    });
  });

  // Dropdown item click handling
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent triggering parent button click
      const tabId = item.dataset.tab;
      const subId = item.dataset.sub;
      // set active state
      document.querySelectorAll(`.dropdown-item[data-tab="${tabId}"]`).forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      renderSubContent(tabId, subId);
    });
  });

  // Initialise with active main tab
  const initActiveBtn = document.querySelector('.solutions-tabs-list .tab-btn.active');
  if (initActiveBtn) {
    const first = (subContent[initActiveBtn.dataset.tab] || [])[0];
    if (first) {
      renderSubContent(initActiveBtn.dataset.tab, first.id);
      const firstItemElem = document.querySelector(`.dropdown-item[data-tab="${initActiveBtn.dataset.tab}"][data-sub="${first.id}"]`);
      if (firstItemElem) firstItemElem.classList.add('active');
    }
  }
});

// 10. Dynamic Case Studies Renderer
async function renderDynamicCaseStudies(containerId, serviceFilter, limit = 4) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch("/api/case-studies");
    if (!response.ok) throw new Error("Failed to fetch case studies");
    
    let caseStudies = await response.json();
    if (!Array.isArray(caseStudies)) {
        caseStudies = [];
    }
    
    // Filter by service if provided
    if (serviceFilter && serviceFilter.toLowerCase() !== "all") {
      caseStudies = caseStudies.filter(cs => String(cs.service || "").toLowerCase() === serviceFilter.toLowerCase());
    }
    
    // Sort by date descending (newest first)
    caseStudies.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB - dateA;
    });

    const toRender = caseStudies.slice(0, limit);
    
    if (toRender.length === 0) {
      container.innerHTML = "<div style='grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 2rem;'>No insights found at the moment.</div>";
      return;
    }

    container.innerHTML = toRender.map((cs, idx) => {
      const serviceName = (cs.service || "Case Study");
      const industryDisplay = Array.isArray(cs.industry) && cs.industry.length > 0 ? cs.industry[0] : (typeof cs.industry === 'string' ? cs.industry : '');
      const desc = cs.description || "";
      const truncatedDesc = desc.length > 150 ? desc.substring(0, 150) + "..." : desc;
      const pubDate = cs.date ? new Date(cs.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent';
      
      return `
        <div class="case-card">
          <div class="case-image-wrapper">
            <img src="${cs.image || 'images/OurServices.jpg'}" alt="${cs.title}" class="case-image" onerror="this.src='images/OurServices.jpg'">
          </div>
          <div class="case-content">
            <div>
              <div class="case-header">
                ${industryDisplay ? `<span class="case-tag case-tag-industry">${industryDisplay}</span>` : ''}
                <span class="case-tag case-tag-service">${serviceName}</span>
              </div>
              <h2>${cs.title}</h2>
              <p class="summary">${truncatedDesc}</p>
            </div>
            <div class="footer">
              <span class="author">${pubDate}</span>
              <a href="case-studies.html?openId=${cs.id}#filters" class="read-more">
                Go to the Case Study
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

  } catch (error) {
    console.error("Error rendering dynamic case studies:", error);
    container.innerHTML = "<div style='grid-column: 1 / -1; text-align: center; color: #ef4444; padding: 2rem;'>Error loading latest insights.</div>";
  }
}


// Duplicate Solutions Tabs Dropdown Logic block removed to avoid redundancy

// 8. Back to Top Button Interaction
document.addEventListener('DOMContentLoaded', () => {
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // 9. Services side navigation toggle with pulse dot
    const servicesSideNav = document.getElementById('services-side-nav');
    if (servicesSideNav) {
      servicesSideNav.addEventListener('click', (e) => {
        // Toggle open class on the nav
        servicesSideNav.classList.toggle('open');

        // If a side-nav-item was clicked, close after navigation
        if (e.target.classList.contains('side-nav-item') || e.target.closest('.side-nav-item')) {
          servicesSideNav.classList.remove('open');
        }
      });
    }
  }
});

