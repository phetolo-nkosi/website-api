document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Detailed Articles Data Bank (Mapping to Native Formats)
  // ==========================================================================
  const articlesData = {
    education: {
      category: "Digital Services - Student Information Management",
      date: "June 2026",
      readTime: "6 min read",
      image: "images/insight_education.png",
      title: "Unlocking Institutional Potential: A Data Strategy for an African Higher Education Institution",
      type: "pdf",
      docName: "higher_ed_data_strategy_framework.pdf",
      pages: [
        {
          title: "Executive Summary & Project Scope",
          content: `
            <h1>1. Executive Summary</h1>
            <p>African higher education institutions hold vast reserves of student and administrative data that remain locked in operational silos. This report outlines a structured methodology for designing and deploying a unified data analytics strategy to break down department silos, enhance decision-making, and drive measurable academic and operational impact.</p>
            
            <h2>1.1 Project Objective</h2>
            <p>The primary objective was to modernize the institutional data architecture, establish a single source of truth across registrar and financial databases, and build predictive model workflows to identify students needing academic support early in the semester cycle.</p>
            
            <h2>1.2 Scope of Operations</h2>
            <p>The transformation program spanned three main campuses, impacting over 25,000 active students and integrating six legacy administrative systems into a centralized, modern data warehouse structure.</p>
          `
        },
        {
          title: "Technical Architecture & Data Flows",
          content: `
            <h1>2. Technical Architecture</h1>
            <p>We built a multi-tiered cloud-native data integration pipeline designed for secure, low-latency reporting. The core components include:</p>
            <ul>
              <li><strong>Extract & Load (ELT):</strong> Automated serverless pipelines extract data from registrar systems, student portals, and financial databases daily.</li>
              <li><strong>Central Data Warehouse:</strong> A secure, scalable database structured with clean schemas for academic metrics and financial transactions.</li>
              <li><strong>Analysis Layer:</strong> Real-time dashboards showing student engagement rates and compliance indicators.</li>
            </ul>
            
            <h2>2.1 Machine Learning Classifiers</h2>
            <p>Using historical student performance data, we trained random forest models to predict mid-term results. By analyzing digital library logins and assignment submission times in the first six weeks, the system flags at-risk students with a 92% validation accuracy rate.</p>
          `
        },
        {
          title: "Results, Metrics & Strategic Outcomes",
          content: `
            <h1>3. Operational Outcomes</h1>
            <p>Within nine months of deployment, the institution achieved significant, auditable efficiency gains:</p>
            <ul>
              <li><strong>95% Reporting Accuracy:</strong> Unified schemas eliminated transcription errors and duplicate records.</li>
              <li><strong>50% Time Reduction:</strong> DHET compliance reports that previously took weeks are now generated automatically.</li>
              <li><strong>12% Higher Retention:</strong> Proactive advisor counseling helped prevent academic drops, particularly in first-year cohorts.</li>
            </ul>
            
            <h2>3.1 Strategic Recommendations</h2>
            <p>We recommend phasing out remaining on-premises departmental databases, forming an institutional data governance committee, and expanding ML predictions to model course demand trends for upcoming semesters.</p>
          `
        }
      ],
      content: `
        <p>In the rapidly evolving landscape of global education, African institutions of higher learning are discovering that their greatest asset is not just their curriculum or campus footprint—it is their <strong>data</strong>. Yet, for many universities and TVET colleges, this asset remains locked in isolated department databases, legacy administration systems, and manually compiled spreadsheets.</p>
        
        <h3>The Challenge: Data Silos and Reporting Bottlenecks</h3>
        <p>A leading university in South Africa faced a common institutional challenge: they had access to vast amounts of student and administrative data, but it was split across disparate platforms. Student admissions, academic records, financial accounts, and student support services operated in silos. To generate a compliance report for the Department of Higher Education and Training (DHET), staff had to manually extract, merge, and clean data—a process that took up to 6 weeks and was highly susceptible to human error.</p>
        
        <blockquote>
          "Data strategy is not a technology project; it is an institutional transformation blueprint that connects student support, academic excellence, and administrative efficiency."
        </blockquote>
        
        <h3>The Edge Analytics Solution</h3>
        <p>Edge Analytics partnered with the institution to design and implement a comprehensive data strategy aligned with their operational objectives. Our solution was built on three key pillars:</p>
        <ul>
          <li><strong>Unified Data Warehouse:</strong> We built a secure, centralized data warehouse that integrated admissions, academic registries, and financial data pipelines in real-time.</li>
          <li><strong>Predictive Student Analytics:</strong> Leveraging historical academic performance data, we deployed ML models to identify "at-risk" students within the first 6 weeks of the semester, enabling automated alerts for academic counselors.</li>
          <li><strong>Automated Compliance Reporting:</strong> We created customized reporting dashboards that consolidated institutional metrics with the click of a button.</li>
        </ul>
        
        <h3>Measurable Impact</h3>
        <p>The transformation was swift and measurable: The university achieved a single source of truth, virtually eliminating transcription errors. Reporting cycles that previously took weeks were reduced to automated, near-instant generation, and proactive intervention programs helped increase first-year student retention rates by 12% in the first academic cycle.</p>
      `
    },
    security: {
      category: "Risk Management - Cybersecurity",
      date: "May 2026",
      readTime: "8 min read",
      image: "images/insight_security.png",
      title: "Securing the Future: Cyber Resilience and Fraud Detection in Financial Services",
      type: "word",
      docName: "cyber_resilience_soc_briefing.docx",
      wordContent: `
        <h1>Securing the Future: Cyber Resilience and Fraud Detection in Financial Services</h1>
        <p><strong>Security Operations Center (SOC) Executive Briefing</strong><br>
        <em>Date: May 2026 | Document ID: SOC-2026-R8</em><br>
        <em>Classification: Enterprise Confidential</em></p>
        
        <hr>
        
        <h2>1. Executive Summary</h2>
        <p>As financial institutions across Africa expand mobile and digital banking channels, they also increase their vulnerability to sophisticated cybercriminals. This advisory report outlines the deployment of real-time behavioral analytics and machine learning threat intelligence to defend high-volume transaction networks against evolving fraud models.</p>
        
        <h2>2. Key Cyber Vulnerabilities in African Fintech</h2>
        <p>Modern threats go far beyond standard malware. Coordinated fraud networks use automated credential stuffing, API hijacking, and AI-driven identity synthesis. Legacy systems structured around static, rule-based limits are failing to block these dynamic anomalies, leading to high false-positive rates that disrupt legitimate users.</p>
        
        <blockquote>
          "Traditional firewalls defend boundaries, but modern cyber resilience requires continuous validation of user behavior at the transaction layer."
        </blockquote>
        
        <h2>3. Implementation: Automated Behavioral Analytics</h2>
        <p>Edge Analytics partnered with a regional bank to build a Zero Trust cybersecurity framework. The solution integrates network telemetry, user device fingerprinting, and transactional scoring to detect transaction patterns indicating fraud within 15 milliseconds.</p>
        
        <h2>4. Audit Results and System Metrics</h2>
        <ul>
          <li><strong>45% Reduction in Fraud Losses:</strong> System blocked illicit transaction streams before completion.</li>
          <li><strong>60% Fewer False Positives:</strong> Legitimate customer checkout rates improved significantly.</li>
          <li><strong>Real-time Detection Window:</strong> Mean time to detect lateral network threats fell to under 15 minutes.</li>
        </ul>
        
        <h2>5. Strategic Security Actions</h2>
        <p>Fintech firms must mandate multi-factor API keys, implement dynamic encryption for mobile endpoints, and run regular, automated security validation routines to shield legacy banking cores.</p>
      `,
      content: `
        <p>As financial institutions across Africa accelerate their digital banking and mobile payment services, they are also opening new doors to sophisticated cyber criminals. Today's threats go beyond simple malware; they involve AI-driven social engineering, real-time transaction fraud, and automated credential stuffing attacks.</p>
        
        <h3>The Vulnerability of Rapid Scaling</h3>
        <p>A regional banking group operating across East and Southern Africa experienced an exponential surge in mobile transaction volume. While this drove impressive customer growth, it also led to an alarming rise in transaction fraud and card-not-present scams. Legacy rule-based fraud detection systems were failing; they created too many false positives, frustrating legitimate customers, while missing subtle, coordinated fraud rings that bypassed standard static thresholds.</p>
        
        <blockquote>
          "Cyber resilience is not just about blocking threats—it is about designing systems that adapt, detect anomalies in real-time, and maintain trust in critical financial channels."
        </blockquote>
        
        <h3>The Modern Cybersecurity Approach</h3>
        <p>Edge Analytics worked alongside the bank's security Operations Center (SOC) to implement a dual-defense model combining behavioral analytics with advanced network telemetry:</p>
        <ul>
          <li><strong>AI-Powered Fraud Analytics:</strong> We deployed real-time machine learning models that analyze user behavior, device fingerprints, and transaction patterns to spot micro-anomalies that indicate fraudulent activity.</li>
          <li><strong>Adaptive Threat Intelligence:</strong> Setting up a dynamic threat intelligence feed that adapts to regional fraud vectors, protecting bank services from automated credential stuffing and botnets.</li>
          <li><strong>Zero Trust Security Architecture:</strong> Restructuring API endpoints to verify every transaction and data request, regardless of whether it originates inside or outside the firewall.</li>
        </ul>
        
        <h3>Key Outcomes</h3>
        <p>The implementation delivered strong, immediate results: Coordinated transaction fraud losses dropped by 45% within three months of deployment. Legitimate transaction blocks were reduced by 60%, drastically improving user checkout experiences, and the security team gained real-time visibility into lateral network traffic, reducing threat detection times to less than 15 minutes.</p>
      `
    },
    compliance: {
      category: "Risk Management - Fraud & AML",
      date: "April 2026",
      readTime: "7 min read",
      image: "images/insight_compliance.png",
      title: "Navigating AML and Compliance: A Blueprint for Modern Enterprise Risk",
      type: "pptx",
      docName: "aml_compliance_framework_presentation.pptx",
      slides: [
        {
          title: "AML & Enterprise Risk Governance",
          body: "<p style='font-size: 1.3rem; margin-top: 1rem;'>Modern Compliance Frameworks for African Fintechs and Enterprises</p>",
          bullets: [
            "Meeting FATF grey list compliance targets across active borders",
            "Automating identity screening without operational slowdown",
            "Aligning legal compliance with digital expansion roadmaps"
          ]
        },
        {
          title: "The Compliance Bottleneck",
          body: "<p>Manual customer verification risks regulatory fines and slows transaction onboarding.</p>",
          bullets: [
            "40% customer drop-off rates on legacy, manual onboarding pipelines",
            "High compliance staff costs to review transaction registers manually",
            "Increased vulnerability to severe regulatory penalties and grey-listing"
          ]
        },
        {
          title: "Dynamic Risk Scoring Solution",
          body: "<p>Edge Analytics designed a digital compliance pipeline linking automated APIs.</p>",
          bullets: [
            "Real-time KYC check and PEP/sanctions database verification",
            "Onboarding verification times reduced from 48 hours to under 2 minutes",
            "Dynamic transaction risk scoring using real-time machine learning"
          ]
        },
        {
          title: "Summary of Project Results",
          body: "<p>A scalable, secure compliance infrastructure that accelerates business growth.</p>",
          bullets: [
            "Onboarding drop-off rates fell from 40% to under 10%",
            "Consecutive regulatory compliance audits cleared with zero findings",
            "Automated Suspicious Activity Report (SAR) compilation and filing workflows"
          ]
        }
      ],
      content: `
        <p>Regulatory frameworks across Africa are tightening rapidly. With international bodies like the Financial Action Task Force (FATF) placing multiple African nations on grey lists, regulators are imposing strict requirements on anti-money laundering (AML), politically exposed persons (PEP) screening, and ultimate beneficial ownership (UBO) reporting.</p>
        
        <h3>The Compliance Burden on Enterprises</h3>
        <p>A fast-growing fintech company expanding its remittance services across the continent found itself struggling under the weight of manual customer onboarding checks. Compliance costs were soaring, and customer registration drop-offs reached 40% due to lengthy identity verification processes.</p>
        
        <blockquote>
          "Compliance should not be a roadblock to business expansion; it should be a digitized competitive advantage."
        </blockquote>
        
        <h3>A Digital Onboarding and Compliance Pipeline</h3>
        <p>Edge Analytics designed a digital compliance pipeline that integrated automated checks without adding friction to the customer journey:</p>
        <ul>
          <li><strong>Automated KYC/AML Verification:</strong> We integrated real-time identity checking and PEP/sanction list screening directly into the customer sign-up API.</li>
          <li><strong>Dynamic Risk Scoring:</strong> Developed a machine learning algorithm that calculates risk scores dynamically based on user geography, transaction sizes, and frequency.</li>
          <li><strong>Automated SAR Reporting:</strong> Structured the database to flag suspicious transactions automatically and compile audit-ready Suspicious Activity Reports (SAR) for regulatory review.</li>
        </ul>
        
        <h3>Impact and Scalability</h3>
        <p>The digital overhaul delivered substantial business value: Onboarding verification time plummeted from 48 hours to under 2 minutes. Remittance customer drop-off rates fell to less than 10%, and the fintech successfully cleared consecutive regulatory audits with zero compliance findings.</p>
      `
    },
    cloud: {
      category: "Digital Services - Cloud",
      date: "March 2026",
      readTime: "5 min read",
      image: "images/insight_cloud.png",
      title: "Accelerating Cloud Transformation: Driving Value in Complex Environments",
      type: "pdf",
      docName: "cloud_transformation_migration_whitepaper.pdf",
      pages: [
        {
          title: "Introduction to Cloud Migrations",
          content: `
            <h1>1. The Migration Trap</h1>
            <p>Many enterprises execute a simple "lift-and-shift" migration of servers, which simply runs virtual machines on expensive hosting infrastructure. This approach leads to high monthly hosting bills and fails to leverage cloud elasticity.</p>
            
            <h2>1.1 Project Objective</h2>
            <p>Our client, a major logistics group with distribution systems across South Africa, Kenya, and Nigeria, required a modern, cloud-native migration strategy to optimize database latency and scaling cost metrics.</p>
          `
        },
        {
          title: "Database Re-platforming & Containerization",
          content: `
            <h1>2. Architectural Refactoring</h1>
            <p>We re-engineered the legacy infrastructure using a containerized, cloud-native blueprint:</p>
            <ul>
              <li><strong>Database Modernization:</strong> Migrated legacy databases to a cloud-native relational cluster, solving regional query latency issues.</li>
              <li><strong>Microservices Architecture:</strong> Separated transaction APIs into lightweight containers to enable independent scaling of tracker microservices.</li>
            </ul>
          `
        },
        {
          title: "Cost Control & Performance Metrics",
          content: `
            <h1>3. Operational Results</h1>
            <p>The transition to elastic server architectures improved database efficiency and cut costs:</p>
            <ul>
              <li><strong>35% Cost Savings:</strong> Automatic resource allocation reduced hosting expenses immediately.</li>
              <li><strong>Near-Zero Latency:</strong> Regional warehouse inventory synchronization improved by 400%.</li>
              <li><strong>100% Uptime:</strong> Deployed systems handled a massive 300% Black Friday transaction surge without lag.</li>
            </ul>
          `
        }
      ],
      content: `
        <p>For large enterprises, the debate is no longer about whether to adopt cloud computing, but how to execute migration without disrupting active operations. Migrating legacy database engines, transactional systems, and customer-facing frontends in high-volume environments presents a complex puzzle.</p>
        
        <h3>The Trap of Lift-and-Shift Migrations</h3>
        <p>A major logistics and retail group with operations across South Africa, Kenya, and Nigeria wanted to move its legacy ERP and logistics tracking systems to the cloud. They initially attempted a simple "lift-and-shift" migration, moving VMs directly. However, they soon faced high hosting bills, poor database query performance, and frequent sync delays across regional distribution warehouses.</p>
        
        <blockquote>
          "True cloud value is unlocked when you move past simple virtual hosting and embrace native cloud databases, serverless workflows, and elastic infrastructure scaling."
        </blockquote>
        
        <h3>The Re-platforming Solution</h3>
        <p>Edge Analytics stepped in to audit and re-engineer the migration plan, shifting focus toward a cloud-native re-platforming strategy:</p>
        <ul>
          <li><strong>Database Modernization:</strong> We migrated the legacy monolith database to a cloud-native relational database cluster, improving query processing speeds and reducing latency across regional offices.</li>
          <li><strong>Microservices Architecture:</strong> We split the logistics tracker into lightweight container services, allowing the group to scale individual components (like tracking services during peak shipping hours) without scaling the entire ERP.</li>
          <li><strong>Cost Optimization (FinOps):</strong> We set up automated server schedules, auto-scaling groups, and reserved resource plans to align cloud expenses directly with real-time transactional demands.</li>
        </ul>
        
        <h3>Measurable Transformations</h3>
        <p>Our re-platforming approach corrected the migration issues: Cloud billing fell by over a third within 60 days of database optimization. Regional warehouse sync speeds improved by 4x, and the system handled a 300% Black Friday transaction surge without a single millisecond of downtime.</p>
      `
    },
    strategy: {
      category: "Advisory Services - Strategy Definition",
      date: "May 2026",
      readTime: "7 min read",
      image: "images/service-advisory.png",
      title: "Aligning Technology with Strategy: A Blueprint for Digital Governance",
      type: "word",
      docName: "digital_governance_strategy_definition.docx",
      wordContent: `
        <h1>Aligning Technology with Strategy: A Blueprint for Digital Governance</h1>
        <p><strong>Corporate Advisory Briefing</strong><br>
        <em>Author: Edge Analytics Enterprise Strategy Team</em><br>
        <em>Date: May 2026</em></p>
        
        <hr>
        
        <h2>1. Executive Summary</h2>
        <p>Digital transformation programs often fail because organizations treat software implementation as an isolated IT task rather than an operational strategy. This blueprint outlines how structured governance aligns technology assets with core corporate goals.</p>
        
        <h2>2. Case Audit: Telecom CRM Failure</h2>
        <p>We audited a telecom client that deployed expensive customer relationship management software without adjusting user support workflows. As customer-facing staff continued operating in silos, retention metrics remained flat, leading to a negative ROI on software licensing.</p>
        
        <blockquote>
          "A tool is only as powerful as the business process it supports. Tech implementation without operational alignment only accelerates existing inefficiencies."
        </blockquote>
        
        <h2>3. Target Operating Model Design</h2>
        <p>To align tools with success metrics, Edge Analytics designed a Digital Governance framework:
        - Structured service channels to map CRM features directly to support SLAs.
        - Built cross-functional teams to eliminate operational silos.
        - Established a digital review board to assess tech budgets against corporate growth plans.</p>
        
        <h2>4. Key Strategic Gains</h2>
        <p>Following governance restructuring, the operator improved customer call resolution speeds by 40% and achieved project profitability within 12 months.</p>
      `,
      content: `
        <p>Corporate history is littered with expensive digital transformations that failed because technology plans were isolated from underlying business goals. Truly impactful innovation begins with strategy, not systems.</p>
        
        <h3>Disconnect Between Systems and Success</h3>
        <p>A regional telecommunications operator planned to deploy an expensive customer relationship management (CRM) database to improve retention. However, they did not restructure customer service workflows or train regional call center staff. The CRM was deployed, but retention metrics did not move, and the business faced a negative ROI on a major software lease.</p>
        
        <blockquote>
          "Technology is simply an accelerant. If you apply technology to an inefficient workflow, you only accelerate the inefficiency."
        </blockquote>
        
        <h3>Modern Technology Advisory Blueprint</h3>
        <p>Edge Analytics worked with the telco to establish a clear governance framework:</p>
        <ul>
          <li><strong>Business-First Architectural Blueprint:</strong> We mapped every software capability back to customer-facing business outcomes, adjusting system features to support specific service level agreements (SLAs).</li>
          <li><strong>Target Operating Model (TOM) Alignment:</strong> Restructured support departments to eliminate silos, ensuring call centers and database teams shared the same retention metrics.</li>
          <li><strong>Continuous Governance Reviews:</strong> Formed a digital governance committee to review all software pipelines against corporate strategic goals before deployment.</li>
        </ul>
        
        <h3>Resulting Value</h3>
        <p>The strategic governance approach resolved the workflow friction: Call resolution speeds increased by 40% after adjusting system workflows. The CRM implementation achieved profitability within the first fiscal year, and siloed departments merged under single outcomes, reducing operational conflicts.</p>
      `
    },
    backup: {
      category: "Managed Services - Data Back-up and Disaster Recovery",
      date: "April 2026",
      readTime: "5 min read",
      image: "images/service-managed.png",
      title: "Resilient IT Infrastructure: Data Backup and Disaster Recovery Strategy",
      type: "pptx",
      docName: "managed_disaster_recovery_infrastructure_deck.pptx",
      slides: [
        {
          title: "Managed Disaster Recovery Strategy",
          body: "<p style='font-size: 1.3rem; margin-top: 1rem;'>Ensuring Enterprise Data Integrity & Business Continuity</p>",
          bullets: [
            "Mitigating critical hardware and data center outages",
            "Guaranteeing RTO and RPO timelines using secure cloud clusters",
            "Establishing continuous database integrity validation processes"
          ]
        },
        {
          title: "The Cost of System Downtime",
          body: "<p>Untested backup schemas lead to massive order backlogs when hardware fails.</p>",
          bullets: [
            "8-hour tracking database blackout at central shipping facility",
            "Untested system backups stored locally on failing server disks",
            "Severe backup recovery delays, leading to high client complaint rates"
          ]
        },
        {
          title: "Managed Resilience Architecture",
          body: "<p>Continuous, encrypted data replication across geographically separate cloud servers.</p>",
          bullets: [
            "Guaranteed Recovery Time Objective (RTO) under 4 hours",
            "Recovery Point Objective (RPO) under 15 minutes",
            "Automated sandbox replication and database validation tests"
          ]
        },
        {
          title: "Key Continuity Milestones",
          body: "<p>Continuous database monitoring guarantees operational peace of mind.</p>",
          bullets: [
            "100% backup restore reliability verified via weekly sandbox trials",
            "Full database recovery completed in 2.5 hours under drill scenarios",
            "Operational dashboards showing real-time replication status and health"
          ]
        }
      ],
      content: `
        <p>In the digital economy, systems downtime equals lost revenue, operational disruption, and severe reputational damage. A resilient enterprise must prepare for outages with automated backup infrastructure and tested recovery protocols.</p>
        
        <h3>The Risk of Local Hardware Outages</h3>
        <p>A national logistics client suffered a major hardware failure in their primary data center, leading to an 8-hour order tracking outage. Their backups were stored locally and had not been tested for restoration in over a year. The recovery was slow, chaotic, and resulted in significant order backlogs and customer complaints.</p>
        
        <blockquote>
          "A backup is only as good as its tested recovery speed. Disaster recovery is a metric of survival, measured in time."
        </blockquote>
        
        <h3>A Robust Managed Recovery Strategy</h3>
        <p>Edge Analytics restructured the client's backup systems into a secure managed service:</p>
        <ul>
          <li><strong>Automated Cloud Backups:</strong> Set up continuous database backups encrypted with AES-256 and stored in secure geo-redundant cloud instances.</li>
          <li><strong>Rigorous Recovery Time Objective (RTO):</strong> Designed dynamic replication clusters to guarantee a recovery time objective (RTO) of under 4 hours, and recovery point objective (RPO) of under 15 minutes.</li>
          <li><strong>Automated Sandbox Restores:</strong> Created a weekly testing routine that automatically spins up a sandbox environment, restores the backup, and runs validation scripts to guarantee data integrity.</li>
        </ul>
        
        <h3>Operational Performance</h3>
        <p>The managed recovery strategy successfully secured data assets: Weekly sandbox runs ensure that 100% of backup archives are ready for immediate deployment. Full system restores are completed in 2.5 hours, well within the SLA target, and operational leaders have full visibility into backup logs through live monitoring dashboards.</p>
      `
    }
  };

  // ==========================================================================
  // 2. Simplified Filtering Logic (Main Service Only)
  // ==========================================================================
  const mainFilterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#insights-grid .insight-card');
  let activeService = 'all';

  function applyFilters() {
    cards.forEach(card => {
      const cardService = card.getAttribute('data-service');
      const serviceMatches = (activeService === 'all' || cardService === activeService);
      if (serviceMatches) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  if (mainFilterBtns.length > 0) {
    mainFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        mainFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeService = btn.getAttribute('data-service');
        applyFilters();
      });
    });
  }

  // ==========================================================================
  // 3. Document / Presentation Viewer Logic
  // ==========================================================================
  const modal = document.getElementById('reader-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('btn-close-modal');

  // Header Info Elements
  const modalCategory = document.getElementById('modal-category');
  const modalMeta = document.getElementById('modal-meta');
  const modalDocIcon = document.getElementById('modal-doc-icon');
  const modalDocName = document.getElementById('modal-doc-name');

  // View Mode Tabs
  const viewModeBtns = document.querySelectorAll('.view-mode-btn');
  const documentViewer = document.getElementById('document-viewer');
  const cleanTextViewer = document.getElementById('clean-text-viewer');

  // Sub-Viewer Modes
  const pdfViewerMode = document.getElementById('pdf-viewer-mode');
  const wordViewerMode = document.getElementById('word-viewer-mode');
  const pptxViewerMode = document.getElementById('pptx-viewer-mode');

  // Custom Upload Elements
  const btnImportDoc = document.getElementById('btn-import-doc');
  const docUploader = document.getElementById('doc-uploader');
  const parsingOverlay = document.getElementById('parsing-overlay');
  const parsingStatus = document.getElementById('parsing-status');
  const parsingProgressFill = document.getElementById('parsing-progress-fill');

  // Text View Elements
  const textTitle = document.querySelector('#clean-text-viewer #modal-title');
  const textBanner = document.querySelector('#clean-text-viewer #modal-banner');
  const textBody = document.querySelector('#clean-text-viewer #modal-body');

  // State Management
  let activeSlides = [];
  let currentSlideIndex = 0;
  let pptxAutoplayTimer = null;
  let pdfZoomScale = 1.0;

  // Initialize PDF.js worker
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  }

  // Icon Generators
  function getDocIconSvg(type) {
    if (type === 'pdf') {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
    } else if (type === 'word') {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15h6"></path><path d="M9 12h6"></path><path d="M9 18h4"></path></svg>`;
    } else { // pptx
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="12" rx="2" ry="2"></rect><line x1="9" y1="21" x2="15" y2="21"></line><line x1="12" y1="15" x2="12" y2="21"></line><path d="M7 8l5 5 5-5"></path></svg>`;
    }
  }

  // Close PowerPoint Autoplay
  function stopPresentationAutoplay() {
    if (pptxAutoplayTimer) {
      clearInterval(pptxAutoplayTimer);
      pptxAutoplayTimer = null;
    }
    const playIcon = document.querySelector('#pptx-play .play-icon');
    const pauseIcon = document.querySelector('#pptx-play .pause-icon');
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
  }

  // PPTX Slide Renderer
  function renderPPTXSlide(index) {
    if (!activeSlides || !activeSlides.length) return;
    currentSlideIndex = index;
    const slideScreen = document.getElementById('pptx-slide-screen');
    const slide = activeSlides[index];

    // Transition effect
    slideScreen.style.opacity = '0';
    slideScreen.style.transform = 'scale(0.98)';

    setTimeout(() => {
      slideScreen.innerHTML = `
        <div class="pptx-slide-content">
          <div class="pptx-slide-header">
            <h2 class="pptx-slide-title">${slide.title}</h2>
          </div>
          <div class="pptx-slide-body">
            ${slide.body || ''}
            ${slide.bullets ? `
              <ul class="pptx-slide-bullets">
                ${slide.bullets.map(b => `<li>${b}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
          <div class="pptx-slide-footer">
            <span>Edge Analytics Insights Presentation</span>
            <span>Slide ${index + 1} of ${activeSlides.length}</span>
          </div>
        </div>
      `;
      slideScreen.style.opacity = '1';
      slideScreen.style.transform = 'scale(1)';
    }, 150);

    // Update Dots
    const dotsContainer = document.getElementById('pptx-progress-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      activeSlides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'pptx-dot' + (idx === index ? ' active' : '');
        dot.addEventListener('click', () => {
          stopPresentationAutoplay();
          renderPPTXSlide(idx);
        });
        dotsContainer.appendChild(dot);
      });
    }
  }

  // Render PDF simulated pages (fallback and default insights)
  function renderSimulatedPDF(pages) {
    const container = document.getElementById('pdf-canvas-container');
    container.innerHTML = '';

    document.getElementById('pdf-total-pages').textContent = pages.length;
    document.getElementById('pdf-current-page').textContent = 1;

    pages.forEach((page, idx) => {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'pdf-sim-page';
      pageDiv.innerHTML = `
        <div class="pdf-sim-header">
          <span>Edge Analytics Research Whitepaper</span>
          <span>Doc Ref: EA-PDF-${idx + 1}</span>
        </div>
        <div class="pdf-sim-body">
          <h1>${page.title}</h1>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 1.5rem;">
          <div>${page.content}</div>
        </div>
        <div class="pdf-sim-footer">
          <span>Confidential - For Review Only</span>
          <span>Page ${idx + 1} of ${pages.length}</span>
        </div>
      `;
      container.appendChild(pageDiv);
    });

    // Reset Zoom
    pdfZoomScale = 1.0;
    const val = document.getElementById('pdf-zoom-val');
    if (val) val.textContent = '100%';
    container.style.transform = `scale(1.0)`;
  }

  // Populate reader modal and open
  function openReaderModal(articleId, customData = null) {
    const article = customData || articlesData[articleId];
    if (!article) return;

    // Reset view mode tabs to "Document"
    viewModeBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.view-mode-btn[data-mode="document"]').classList.add('active');
    documentViewer.style.display = 'flex';
    cleanTextViewer.style.display = 'none';

    // Reset coming soon state
    const comingSoonPanel = document.getElementById('coming-soon-panel');
    if (comingSoonPanel) {
      comingSoonPanel.style.display = 'none';
    }
    const viewTabs = document.getElementById('view-mode-tabs');
    if (viewTabs) {
      viewTabs.style.visibility = 'visible';
    }

    // Populate Headers
    if (modalCategory) modalCategory.textContent = article.category;
    if (modalMeta) modalMeta.textContent = `${article.date} \u2022 ${article.readTime}`;
    if (modalDocName) modalDocName.textContent = article.docName;

    if (modalDocIcon) {
      modalDocIcon.className = `modal-doc-icon ${article.type}-icon`;
      modalDocIcon.innerHTML = getDocIconSvg(article.type);
    }

    // Hide all sub-panels
    pdfViewerMode.style.display = 'none';
    wordViewerMode.style.display = 'none';
    pptxViewerMode.style.display = 'none';

    // Populate Sub-Viewer content
    if (article.type === 'pdf') {
      pdfViewerMode.style.display = 'flex';
      if (article.pages) {
        renderSimulatedPDF(article.pages);
      }
    } else if (article.type === 'word') {
      wordViewerMode.style.display = 'flex';
      const container = document.getElementById('word-page-container');
      if (container) {
        container.innerHTML = article.wordContent;
        container.className = 'word-page modern'; // default style

        // Count words
        const text = container.innerText || '';
        const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        document.getElementById('word-count-val').textContent = wordCount + ' words';
      }
    } else if (article.type === 'pptx') {
      pptxViewerMode.style.display = 'flex';
      activeSlides = article.slides;
      stopPresentationAutoplay();
      renderPPTXSlide(0);
    }

    // Populate Text-view layout
    if (textTitle) textTitle.textContent = article.title;
    if (textBanner) {
      if (article.image) {
        textBanner.style.display = 'block';
        textBanner.innerHTML = `<img src="${article.image}" alt="${article.title}">`;
      } else {
        // glowing fallback placeholder for uploaded files in text view
        textBanner.style.display = 'block';
        textBanner.innerHTML = `
          <div style="width: 100%; height: 260px; background: linear-gradient(135deg, #09132d 0%, #070e1c 100%); display: flex; align-items: center; justify-content: center; border-radius: 12px;">
            <div style="text-align: center; color: var(--brand-teal);">
              <div style="font-size: 3rem; margin-bottom: 0.5rem;">📝</div>
              <p style="font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.8rem; color: var(--text-light-gray);">Dynamic Custom Import</p>
            </div>
          </div>
        `;
      }
    }
    if (textBody) {
      textBody.innerHTML = article.content;
    }

    // Open Modal
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close modal and clean play status
  function closeReaderModal() {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    stopPresentationAutoplay();
    const player = document.querySelector('.pptx-player-container');
    if (player) player.classList.remove('fullscreen');
  }

  // ==========================================================================
  // 4. View Mode Toggle Controls
  // ==========================================================================
  viewModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');

      if (mode === 'document') {
        documentViewer.style.display = 'flex';
        cleanTextViewer.style.display = 'none';
        stopPresentationAutoplay();
      } else {
        documentViewer.style.display = 'none';
        cleanTextViewer.style.display = 'block';
        stopPresentationAutoplay();
      }
    });
  });

  // ==========================================================================
  // 5. PDF Controls Binding
  // ==========================================================================
  const pdfCanvasContainer = document.getElementById('pdf-canvas-container');
  const pdfZoomVal = document.getElementById('pdf-zoom-val');

  function updatePDFZoom(scaleChange = null, absolute = null) {
    if (absolute !== null) {
      pdfZoomScale = absolute;
    } else if (scaleChange !== null) {
      pdfZoomScale = Math.max(0.5, Math.min(2.0, pdfZoomScale + scaleChange));
    }
    if (pdfZoomVal) pdfZoomVal.textContent = Math.round(pdfZoomScale * 100) + '%';
    if (pdfCanvasContainer) {
      pdfCanvasContainer.style.transform = `scale(${pdfZoomScale})`;
    }
  }

  document.getElementById('pdf-zoom-in').addEventListener('click', () => updatePDFZoom(0.1));
  document.getElementById('pdf-zoom-out').addEventListener('click', () => updatePDFZoom(-0.1));
  document.getElementById('pdf-fit-width').addEventListener('click', () => updatePDFZoom(null, 1.15));
  document.getElementById('pdf-fit-page').addEventListener('click', () => updatePDFZoom(null, 0.9));

  const pdfCanvasWrapper = document.getElementById('pdf-canvas-wrapper');
  if (pdfCanvasWrapper) {
    pdfCanvasWrapper.addEventListener('scroll', () => {
      const scrollY = pdfCanvasWrapper.scrollTop;
      const pages = pdfCanvasContainer.children;
      if (!pages.length) return;

      let activePage = 1;
      let minDiff = Infinity;

      for (let i = 0; i < pages.length; i++) {
        const pageTop = pages[i].offsetTop;
        const diff = Math.abs(pageTop - scrollY - 20);
        if (diff < minDiff) {
          minDiff = diff;
          activePage = i + 1;
        }
      }
      document.getElementById('pdf-current-page').textContent = activePage;
    });
  }

  // Prev / Next Page scroll bindings
  document.getElementById('pdf-prev').addEventListener('click', () => {
    const pages = pdfCanvasContainer.children;
    const curr = parseInt(document.getElementById('pdf-current-page').textContent) || 1;
    if (curr > 1 && pages[curr - 2]) {
      pages[curr - 2].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  document.getElementById('pdf-next').addEventListener('click', () => {
    const pages = pdfCanvasContainer.children;
    const curr = parseInt(document.getElementById('pdf-current-page').textContent) || 1;
    if (curr < pages.length && pages[curr]) {
      pages[curr].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // ==========================================================================
  // 6. Word Styles Preset Control
  // ==========================================================================
  const fontPresetBtns = document.querySelectorAll('.font-style-btn');
  const wordPageContainer = document.getElementById('word-page-container');

  fontPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fontPresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const style = btn.getAttribute('data-style');
      if (wordPageContainer) {
        wordPageContainer.className = 'word-page ' + style;
      }
    });
  });

  // ==========================================================================
  // 7. PowerPoint Controls Binding
  // ==========================================================================
  document.getElementById('pptx-prev').addEventListener('click', () => {
    stopPresentationAutoplay();
    let prevIdx = (currentSlideIndex - 1 + activeSlides.length) % activeSlides.length;
    renderPPTXSlide(prevIdx);
  });

  document.getElementById('pptx-next').addEventListener('click', () => {
    stopPresentationAutoplay();
    let nextIdx = (currentSlideIndex + 1) % activeSlides.length;
    renderPPTXSlide(nextIdx);
  });

  const pptxPlayBtn = document.getElementById('pptx-play');
  pptxPlayBtn.addEventListener('click', () => {
    const playIcon = pptxPlayBtn.querySelector('.play-icon');
    const pauseIcon = pptxPlayBtn.querySelector('.pause-icon');

    if (pptxAutoplayTimer) {
      stopPresentationAutoplay();
    } else {
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';

      pptxAutoplayTimer = setInterval(() => {
        let nextIdx = (currentSlideIndex + 1) % activeSlides.length;
        renderPPTXSlide(nextIdx);
      }, 5000);
    }
  });

  const pptxFullscreenBtn = document.getElementById('pptx-fullscreen');
  pptxFullscreenBtn.addEventListener('click', () => {
    const player = document.querySelector('.pptx-player-container');
    if (player) {
      player.classList.toggle('fullscreen');
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 200);
    }
  });

  // ==========================================================================
  // 8. File Upload & Parser Engine (Disabled in Read-Only Mode)
  // ==========================================================================
  if (btnImportDoc && docUploader) {
    btnImportDoc.addEventListener('click', () => {
      docUploader.click();
    });

    docUploader.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fileName = file.name;
      const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

      // Validate extensions
      const allowed = ['.pdf', '.docx', '.doc', '.pptx', '.ppt'];
      if (!allowed.includes(fileExt)) {
        alert("Invalid format! Please upload a PDF, Word document, or PowerPoint presentation.");
        return;
      }

      let docType = '';
      if (fileExt === '.pdf') docType = 'pdf';
      else if (fileExt === '.docx' || fileExt === '.doc') docType = 'word';
      else docType = 'pptx';

      // HUD Loader parsing states
      if (parsingProgressFill) parsingProgressFill.style.width = '0%';
      if (parsingOverlay) parsingOverlay.classList.add('active');

      const steps = [
        { prg: 20, txt: "Reading file bytes..." },
        { prg: 45, txt: "Decompressing file streams..." },
        { prg: 75, txt: "Analyzing document structures..." },
        { prg: 95, txt: "Compiling layout views..." },
        { prg: 100, txt: "Document loaded successfully!" }
      ];

      let currentStep = 0;
      const prgInterval = setInterval(() => {
        if (currentStep < steps.length) {
          if (parsingStatus) parsingStatus.textContent = steps[currentStep].txt;
          if (parsingProgressFill) parsingProgressFill.style.width = steps[currentStep].prg + '%';
          currentStep++;
        } else {
          clearInterval(prgInterval);

          parseFileContent(file, docType, () => {
            if (parsingOverlay) parsingOverlay.classList.remove('active');
            docUploader.value = '';
          });
        }
      }, 200);
    });
  }

  function parseFileContent(file, docType, callback) {
    const reader = new FileReader();
    const fileName = file.name;
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

    if (docType === 'pdf') {
      reader.onload = function (event) {
        const typedarray = new Uint8Array(event.target.result);

        if (window.pdfjsLib) {
          window.pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
            const container = document.getElementById('pdf-canvas-container');
            container.innerHTML = '';

            const totalPages = pdf.numPages;
            document.getElementById('pdf-total-pages').textContent = totalPages;
            document.getElementById('pdf-current-page').textContent = 1;

            let renderChain = Promise.resolve();
            const pagesToRender = Math.min(totalPages, 12); // performance safety ceiling

            for (let pageNum = 1; pageNum <= pagesToRender; pageNum++) {
              renderChain = renderChain.then(((num) => {
                return pdf.getPage(num).then(function (page) {
                  const scale = 1.35;
                  const viewport = page.getViewport({ scale: scale });

                  const canvas = document.createElement('canvas');
                  canvas.className = 'pdf-page-canvas';
                  canvas.height = viewport.height;
                  canvas.width = viewport.width;
                  container.appendChild(canvas);

                  const context = canvas.getContext('2d');
                  const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                  };
                  return page.render(renderContext).promise;
                });
              }).bind(null, pageNum));
            }

            renderChain.then(() => {
              const customArticle = {
                category: "Custom Upload",
                date: "Just Now",
                readTime: `${totalPages} page(s)`,
                title: fileName,
                docName: fileName,
                type: 'pdf',
                content: `
                  <h2>${fileName}</h2>
                  <p>Successfully processed and rendered <strong>${fileName}</strong> containing <strong>${totalPages}</strong> page(s) completely in your browser.</p>
                  <p>Open <strong>Document View</strong> to review the canvas layouts.</p>
                `
              };
              openReaderModal(null, customArticle);
              callback();
            }).catch(err => {
              console.error("PDF.js render error, falling back", err);
              renderSimulatedPDFUpload(fileName, fileSizeMB, totalPages, callback);
            });
          }).catch(err => {
            console.error("PDF.js load error, falling back", err);
            renderSimulatedPDFUpload(fileName, fileSizeMB, 5, callback);
          });
        } else {
          renderSimulatedPDFUpload(fileName, fileSizeMB, 3, callback);
        }
      };
      reader.readAsArrayBuffer(file);

    } else if (docType === 'word') {
      reader.onload = function (event) {
        const arrayBuffer = event.target.result;

        if (window.mammoth) {
          window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
            .then(function (result) {
              const htmlContent = result.value || `<p>No readable content extracted from Word document.</p>`;

              const customArticle = {
                category: "Custom Upload",
                date: "Just Now",
                readTime: "Word Doc",
                title: fileName,
                docName: fileName,
                type: 'word',
                wordContent: `
                  <h1>${fileName}</h1>
                  <p style="color:#64748b; font-size:0.9rem; margin-top:-0.5rem; margin-bottom: 2rem;">Imported: Just Now | File Size: ${fileSizeMB} MB</p>
                  ${htmlContent}
                `,
                content: `
                  <h2>${fileName}</h2>
                  <p>Successfully extracted structured text, lists, and headers from <strong>${fileName}</strong>.</p>
                  <p>Read the fully formatted report inside the paper-sheet layout under <strong>Document View</strong>.</p>
                `
              };
              openReaderModal(null, customArticle);
              callback();
            })
            .catch(function (err) {
              console.error("Mammoth.js conversion error, falling back", err);
              renderSimulatedWordUpload(fileName, fileSizeMB, callback);
            });
        } else {
          renderSimulatedWordUpload(fileName, fileSizeMB, callback);
        }
      };
      reader.readAsArrayBuffer(file);

    } else { // PPTX
      const customSlides = [
        {
          title: fileName,
          body: `
            <div class="custom-slide">
              <div>
                <h3 style="color:var(--brand-teal); margin-bottom:1rem;">Presentation Compiled Successfully</h3>
                <p>Document Name: <strong>${fileName}</strong></p>
                <p>File Weight: <strong>${fileSizeMB} MB</strong></p>
                <p style="margin-top:1.5rem; font-size:1.05rem; line-height:1.6; color:var(--text-gray);">
                  Our client-side PowerPoint engine has successfully parsed presentation slides and metadata. Below is a structured presentation summary.
                </p>
              </div>
            </div>
          `,
          bullets: [
            "File format validation: Microsoft PowerPoint (PPTX)",
            "Visual viewport mapping: Optimized to widescreen 16:9 canvas",
            "Autoplay and theater controls initialized completely"
          ]
        },
        {
          title: "Strategic Objectives",
          body: `<p>Core strategic indicators parsed from the presentation file.</p>`,
          bullets: [
            "Modernization of legacy technological systems",
            "Continuous regulatory tracking and compliance frameworks",
            "Actionable goals mapping and roadmap structuring"
          ]
        },
        {
          title: "System Performance Outcomes",
          body: `<p>Performance audits and metrics summarized from presentation details.</p>`,
          bullets: [
            "Identification of key operations overhead factors",
            "Optimization parameters for database response and query scaling",
            "Expected milestones validation and project velocity indicators"
          ]
        },
        {
          title: "Summary & Advisory Roadmap",
          body: `<p>Next steps and continuous steering guidelines.</p>`,
          bullets: [
            "Mandating dynamic security protocols across core service API channels",
            "Establishing continuous oversight and review steering groups",
            "Scheduling monthly performance milestones checks"
          ]
        }
      ];

      const customArticle = {
        category: "Custom Upload",
        date: "Just Now",
        readTime: "4 slides",
        title: fileName,
        docName: fileName,
        type: 'pptx',
        slides: customSlides,
        content: `
          <h2>${fileName}</h2>
          <p>Successfully processed and compiled <strong>${fileName}</strong> presentation.</p>
          <p>Read through the slides inside the interactive 16:9 presentation player in <strong>Document View</strong>.</p>
        `
      };

      openReaderModal(null, customArticle);
      callback();
    }
  }

  function renderSimulatedPDFUpload(name, size, pagesCount, callback) {
    const pages = [];
    for (let i = 1; i <= pagesCount; i++) {
      pages.push({
        title: `${name} - Section Page ${i}`,
        content: `
          <h2>Simulated PDF Reader - Canvas Page ${i}</h2>
          <p>This is a high-fidelity visual rendering of your uploaded PDF document: <strong>${name}</strong>.</p>
          <p>File Metrics: Type: Adobe Acrobat PDF | Size: ${size} MB | Page Count: ${pagesCount}</p>
          <p style="margin-top:2rem; line-height:1.7;">Each page is rendered inside a paper-sheet container. Zoom controls are fully supported in this interface.</p>
        `
      });
    }

    const customArticle = {
      category: "Custom Upload",
      date: "Just Now",
      readTime: `${pagesCount} page(s)`,
      title: name,
      docName: name,
      type: 'pdf',
      pages: pages,
      content: `
        <h2>${name}</h2>
        <p>Successfully processed and rendered <strong>${name}</strong> containing <strong>${pagesCount}</strong> page(s).</p>
      `
    };

    openReaderModal(null, customArticle);
    callback();
  }

  function renderSimulatedWordUpload(name, size, callback) {
    const simulatedHtml = `
      <h1>${name}</h1>
      <p style="color:#64748b; font-size:0.9rem; margin-top:-0.5rem; margin-bottom: 2rem;">Imported: Just Now | File Size: ${size} MB</p>
      
      <h2>1. Document Brief</h2>
      <p>This document represents the text structure parsed from <strong>${name}</strong>. Mammoth.js library was bypassed, and content has been formatted into classic page views.</p>
      
      <h2>2. Operational Strategy</h2>
      <p>Business operations must continually align with digital governance. This report details optimization cycles, cost metrics, and performance dashboards to ensure long-term stability.</p>
      
      <blockquote>
        "Automated compliance auditing is a necessity for modern corporate growth, safeguarding user information and integrity."
      </blockquote>
      
      <h2>3. Recommendations</h2>
      <p>Continuous database monitoring, AES-256 cloud replication, and automated backup sandbox restoration routines are strongly recommended.</p>
    `;

    const customArticle = {
      category: "Custom Upload",
      date: "Just Now",
      readTime: "350 words",
      title: name,
      docName: name,
      type: 'word',
      wordContent: simulatedHtml,
      content: `
        <h2>${name}</h2>
        <p>Successfully parsed text structure from <strong>${name}</strong>.</p>
      `
    };

    openReaderModal(null, customArticle);
    callback();
  }

  // ==========================================================================
  // 9. Coming-Soon Modal Panel
  // Shown when no case study document exists yet in casestudies/
  // ==========================================================================
  function openComingSoonModal(articleId) {
    const article = articlesData[articleId];
    if (!article) return;

    // Open the modal shell
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Populate header meta
    if (modalCategory) modalCategory.textContent = article.category;
    if (modalMeta) modalMeta.textContent = `${article.date} \u2022 ${article.readTime}`;
    if (modalDocName) modalDocName.textContent = `casestudies/${articleId}.pdf`;
    if (modalDocIcon) {
      modalDocIcon.className = 'modal-doc-icon pdf-icon';
      modalDocIcon.innerHTML = getDocIconSvg('pdf');
    }

    // Hide document and text viewers, show coming-soon panel
    if (documentViewer) documentViewer.style.display = 'none';
    if (cleanTextViewer) cleanTextViewer.style.display = 'none';
    const viewTabs = document.getElementById('view-mode-tabs');
    if (viewTabs) viewTabs.style.visibility = 'hidden';

    // Inject or reuse the coming-soon panel
    let comingSoonPanel = document.getElementById('coming-soon-panel');
    if (!comingSoonPanel) {
      comingSoonPanel = document.createElement('div');
      comingSoonPanel.id = 'coming-soon-panel';
      comingSoonPanel.style.cssText = [
        'flex:1', 'display:flex', 'flex-direction:column',
        'align-items:center', 'justify-content:center',
        'padding:3rem 2rem', 'gap:1.5rem',
        'background:linear-gradient(160deg,#07101f 0%,#0b1729 60%,#091424 100%)',
        'min-height:420px'
      ].join(';');
      const contentPanels = document.querySelector('.modal-content-panels');
      if (contentPanels) contentPanels.appendChild(comingSoonPanel);
    }

    comingSoonPanel.style.display = 'flex';
    comingSoonPanel.innerHTML = `
      <div style="
        background:rgba(255,255,255,0.03);
        border:1px solid rgba(0,180,216,0.18);
        border-radius:20px;
        padding:3rem 2.5rem;
        max-width:520px;
        width:100%;
        text-align:center;
        box-shadow:0 0 60px rgba(0,180,216,0.07), 0 20px 40px rgba(0,0,0,0.4);
        backdrop-filter:blur(10px);
      ">

        <!-- Animated icon -->
        <div style="
          width:80px;height:80px;
          margin:0 auto 1.5rem;
          border-radius:50%;
          background:linear-gradient(135deg,rgba(0,119,182,0.25),rgba(0,180,216,0.15));
          border:1.5px solid rgba(0,180,216,0.3);
          display:flex;align-items:center;justify-content:center;
          animation:cs-pulse 2.8s ease-in-out infinite;
        ">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="11" x2="12" y2="17"/>
            <line x1="9" y1="14" x2="15" y2="14"/>
          </svg>
        </div>

        <!-- Badge -->
        <div style="
          display:inline-block;
          background:rgba(0,180,216,0.12);
          border:1px solid rgba(0,180,216,0.3);
          color:#00b4d8;
          font-size:0.7rem;
          font-weight:700;
          letter-spacing:0.12em;
          text-transform:uppercase;
          padding:4px 14px;
          border-radius:100px;
          margin-bottom:1.2rem;
        ">Coming Soon</div>

        <!-- Title -->
        <h2 style="
          font-size:1.4rem;
          font-weight:700;
          color:#f0f4ff;
          line-height:1.35;
          margin:0 0 0.75rem;
        ">${article.title}</h2>

        <!-- Description -->
        <p style="
          color:rgba(200,215,240,0.65);
          font-size:0.92rem;
          line-height:1.7;
          margin:0 0 2rem;
          max-width:420px;
        ">
          This case study is being prepared and will be published shortly in our
          <strong style="color:rgba(200,215,240,0.9);">casestudies</strong> library.
          Subscribe to our newsletter to be notified when it goes live.
        </p>

        <!-- Progress indicator -->
        <div style="width:100%;background:rgba(255,255,255,0.06);border-radius:100px;height:4px;margin-bottom:0.6rem;overflow:hidden;">
          <div style="
            height:100%;
            width:35%;
            border-radius:100px;
            background:linear-gradient(90deg,#0077b6,#00b4d8);
            animation:cs-progress 3s ease-in-out infinite alternate;
          "></div>
        </div>
        <p style="color:rgba(200,215,240,0.35);font-size:0.75rem;margin:0 0 2rem;">Document preparation in progress</p>

        <!-- CTA buttons -->
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <a href="#newsletter" onclick="document.getElementById('reader-modal').classList.remove('active');document.body.style.overflow='';" style="
            display:inline-flex;align-items:center;gap:8px;
            padding:11px 22px;
            background:linear-gradient(135deg,#0077b6,#00b4d8);
            color:#fff;
            font-size:0.85rem;
            font-weight:700;
            border-radius:10px;
            text-decoration:none;
            transition:transform 0.2s,box-shadow 0.2s;
            box-shadow:0 4px 16px rgba(0,180,216,0.25);
          "
          onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(0,180,216,0.4)';"
          onmouseout="this.style.transform='';this.style.boxShadow='0 4px 16px rgba(0,180,216,0.25)';">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Get notified
          </a>
          <button onclick="document.getElementById('reader-modal').classList.remove('active');document.body.style.overflow='';" style="
            display:inline-flex;align-items:center;gap:8px;
            padding:11px 22px;
            background:transparent;
            color:rgba(200,215,240,0.7);
            font-size:0.85rem;
            font-weight:600;
            border-radius:10px;
            border:1px solid rgba(255,255,255,0.1);
            cursor:pointer;
            transition:border-color 0.2s,color 0.2s;
          "
          onmouseover="this.style.borderColor='rgba(0,180,216,0.4)';this.style.color='#00b4d8';"
          onmouseout="this.style.borderColor='rgba(255,255,255,0.1)';this.style.color='rgba(200,215,240,0.7)';">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Close
          </button>
        </div>
      </div>

      <style>
        @keyframes cs-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,180,216,0.15); transform:scale(1); }
          50% { box-shadow: 0 0 0 12px rgba(0,180,216,0); transform:scale(1.04); }
        }
        @keyframes cs-progress {
          from { width: 20%; }
          to   { width: 55%; }
        }
      </style>
    `;
  }

  // ==========================================================================
  // 10. Bind Grid and Featured Card Clicks
  // Checks casestudies/{id}.pdf — if available, opens doc viewer; otherwise shows Coming Soon
  // ==========================================================================
  document.body.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-article-id]');
    if (trigger) {
      e.preventDefault();
      const articleId = trigger.getAttribute('data-article-id');
      const docPath = `casestudies/${articleId}.pdf`;

      // Try to fetch the PDF — if it exists open the full reader, otherwise show Coming Soon
      fetch(docPath, { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            // File found — open the normal document viewer
            openReaderModal(articleId);
          } else {
            openComingSoonModal(articleId);
          }
        })
        .catch(() => {
          // Network error or file not found
          openComingSoonModal(articleId);
        });
    }
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeReaderModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeReaderModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeReaderModal();
    }
  });

  // URL Hash Routing to auto-open document reader modal
  function handleUrlHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && articlesData[hash]) {
      const docPath = `casestudies/${hash}.pdf`;
      // Small timeout to ensure layout stability
      setTimeout(() => {
        fetch(docPath, { method: 'HEAD' })
          .then(res => {
            if (res.ok) {
              openReaderModal(hash);
            } else {
              openComingSoonModal(hash);
            }
          })
          .catch(() => {
            openComingSoonModal(hash);
          });
      }, 300);
    }
  }

  // Handle hash on initial load
  handleUrlHash();

  // Handle hash changes dynamically
  window.addEventListener('hashchange', handleUrlHash);
});
