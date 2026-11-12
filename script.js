/**
 * Ameshika Mohankumar - UI/UX & Front-End Portfolio
 * Professional motion, accessibility, theme switching, and interactive case studies
 */

document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // =========================================================================
    // 1. THEME SWITCHING (DARK / LIGHT MODE) WITH PERSISTENCE
    // =========================================================================
    const themeToggleBtn = document.getElementById("themeToggle");
    
    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("portfolio-theme", theme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            setTheme(newTheme);
        });
    }

    // =========================================================================
    // 2. ACCESSIBLE MOBILE NAVIGATION TOGGLE
    // =========================================================================
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener("click", () => {
            const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
            mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
            navLinks.classList.toggle("open");
        });

        // Close mobile nav when clicking a link
        navLinks.querySelectorAll(".nav-item").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            });
        });

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // =========================================================================
    // 3. HARDWARE-ACCELERATED DUAL-RING CUSTOM CURSOR
    // =========================================================================
    const cursorOutline = document.querySelector(".custom-cursor");
    const cursorDot = document.querySelector(".custom-cursor-dot");

    if (cursorOutline && cursorDot && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
        let mouseX = -100;
        let mouseY = -100;
        let outlineX = -100;
        let outlineY = -100;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Immediate dot follow
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

            if (!cursorOutline.classList.contains("visible")) {
                cursorOutline.classList.add("visible");
                cursorDot.classList.add("visible");
            }
        });

        // Smooth lerp (linear interpolation) loop for trailing outer ring
        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.18;
            outlineY += (mouseY - outlineY) * 0.18;

            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        requestAnimationFrame(animateCursor);

        // Hover expansions
        const interactiveElements = document.querySelectorAll(
            "a, button, input, textarea, .project-card, .magnet-target, .skill-tag, .ai-tool, .testimonial-card"
        );
        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", () => cursorOutline.classList.add("hovered"));
            el.addEventListener("mouseleave", () => cursorOutline.classList.remove("hovered"));
        });
    }

    // =========================================================================
    // 4. TRUE MAGNETIC ATTRACTION FOR BUTTONS & ICONS (.magnet-target)
    // =========================================================================
    const magnetTargets = document.querySelectorAll(".magnet-target");

    if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
        magnetTargets.forEach(target => {
            target.addEventListener("mousemove", (e) => {
                const rect = target.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = (e.clientX - centerX) * 0.28;
                const deltaY = (e.clientY - centerY) * 0.28;

                target.style.transform = `translate3d(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px, 0)`;
            });

            target.addEventListener("mouseleave", () => {
                target.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
                target.style.transform = "translate3d(0, 0, 0)";
                setTimeout(() => {
                    target.style.transition = "";
                }, 400);
            });
        });
    }

    // =========================================================================
    // 5. SUBTLE 3D CARD TILT (60fps requestAnimationFrame)
    // =========================================================================
    const tiltCards = document.querySelectorAll(".project-card");
    const MAX_TILT = 3; // Kept gentle and professional

    if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
        tiltCards.forEach(card => {
            let tiltFrame = null;

            card.addEventListener("mousemove", (e) => {
                if (tiltFrame) cancelAnimationFrame(tiltFrame);
                tiltFrame = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const px = (e.clientX - rect.left) / rect.width - 0.5;
                    const py = (e.clientY - rect.top) / rect.height - 0.5;

                    const rotX = -py * 2 * MAX_TILT;
                    const rotY = px * 2 * MAX_TILT;

                    card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px)`;
                });
            });

            card.addEventListener("mouseleave", () => {
                if (tiltFrame) cancelAnimationFrame(tiltFrame);
                card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)";
            });
        });
    }

    // =========================================================================
    // 6. SCROLL REVEAL (IntersectionObserver)
    // =========================================================================
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".scroll-reveal").forEach(el => revealObserver.observe(el));

    // =========================================================================
    // 7. ACTIVE NAVIGATION SCROLL SPY
    // =========================================================================
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-item");

    function updateActiveNav() {
        let currentSectionId = "home";
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navItems.forEach(item => {
            const href = item.getAttribute("href");
            item.classList.toggle("active", href === `#${currentSectionId}`);
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });

    // =========================================================================
    // 8. PROJECT SHOWCASE FILTERING
    // =========================================================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("active");
            btn.setAttribute("aria-selected", "true");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "block";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(16px)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 250);
                }
            });
        });
    });

    // =========================================================================
    // 9. CASE STUDY MODAL DEEP DIVE
    // =========================================================================
    const caseStudyData = {
        "modal-fitness": {
            title: "Fitness Ecosystem Widget",
            tag: "UI/UX Case Study \u2022 Widget Design",
            role: "UI/UX Designer",
            duration: "",
            metrics: [],
            overview: "A compact, dynamic widget design for local fitness tracking, designed as a synchronization matrix across the fitness ecosystem.",
            challenge: "Fitness tracking data has to stay compact and in sync on a small widget surface.",
            process: [
                "Compact widget layout designed in Figma for local tracking.",
                "Dynamic synchronization between the tracked fitness data."
            ],
            impact: "A compact fitness widget design, with the full Figma file linked for review."
        },
        "modal-ecommerce": {
            title: "E-Commerce Web Application UX",
            tag: "UI/UX Case Study \u2022 E-Commerce",
            role: "UI/UX Designer",
            duration: "",
            metrics: [],
            overview: "Digital retail storefront optimization focused on micro-interactions and conversion flows.",
            challenge: "Online storefronts depend on small interactions and clear conversion flows to turn browsing into buying.",
            process: [
                "Storefront experience optimized for conversion-focused flows.",
                "Micro-interactions designed to guide shoppers through the buying journey."
            ],
            impact: "A storefront UX design centered on micro-interactions and conversion-focused flows."
        },
        "modal-travel": {
            title: "AI Travel Companion",
            tag: "AI-Powered Product \u2022 Travel",
            role: "UI/UX Designer",
            duration: "",
            metrics: [],
            overview: "An AI-powered trip assistant that suggests destinations, builds day-by-day itineraries and adapts plans on the go.",
            challenge: "Planning a trip means juggling destinations, day-by-day plans and changes along the way.",
            process: [
                "Destination suggestions powered by AI.",
                "Day-by-day itinerary building, with plans that adapt on the go."
            ],
            impact: "An AI-powered travel assistant covering destination ideas, itineraries and adaptive planning."
        },
        "modal-grocery": {
            title: "Local E-Grocery App",
            tag: "UI/UX Case Study \u2022 E-Commerce",
            role: "UI/UX Designer",
            duration: "",
            metrics: [],
            overview: "A mobile UI/UX design for a local e-grocery app.",
            challenge: "Design brief: a mobile grocery app for local shoppers, covering item browsing, delivery-slot selection, cart and checkout.",
            process: [
                "Item browsing and categories designed for mobile in Figma.",
                "Quantity controls and delivery-slot selection.",
                "A single-page checkout flow."
            ],
            impact: "A mobile UI/UX design for a local e-grocery app, with the full Figma file linked for review."
        },
        "modal-dashboard": {
            title: "AI Adaptive Dashboards",
            tag: "AI Interaction Design \u2022 Dashboard UI",
            role: "UI/UX Designer",
            duration: "",
            metrics: [],
            overview: "An adaptive dashboard design concept in which the layout changes with priority.",
            challenge: "Dashboards that show many metrics at once make it hard to see what needs attention first.",
            process: [
                "Metrics grouped by priority in the dashboard layout.",
                "Card states designed for Nominal, Warning and Critical.",
                "Widget size and emphasis that change with priority."
            ],
            impact: "An adaptive dashboard design concept, with the full Figma file linked for review."
        },
        "modal-sweetstudio": {
            title: "SweetStudio: 3D Cake Customizer",
            tag: "Front-End Engineering \u2022 WebGL / Three.js",
            role: "Front-End Developer",
            duration: "",
            metrics: [],
            overview: "A browser-based 3D cake customizer built with JavaScript and Three.js.",
            challenge: "Custom cake customers find it hard to picture a multi-tier cake from flat photos.",
            process: [
                "3D cake view built with Three.js.",
                "Rotate the cake and pick flavours.",
                "A running price shown as options change."
            ],
            impact: "A 3D cake customizer project. The source repository is not publicly available right now."
        },
        "modal-paypal": {
            title: "PayPal Mobile App UI/UX Redesign",
            tag: "Fintech \u2022 Mobile UX",
            role: "UI/UX Designer",
            duration: "",
            metrics: [],
            overview: "A redesign of a mobile money-transfer flow, focused on fee transparency.",
            challenge: "Sending money internationally can feel uncertain when fees, currency conversion and receipts are not shown clearly.",
            process: [
                "Competitor fintech flows reviewed.",
                "Transfer journey wireframed.",
                "An upfront fee-breakdown card and a send-confirmation screen designed in Figma."
            ],
            impact: "A redesign of a mobile money-transfer flow, with the full Figma file linked for review."
        },
        "modal-recipe": {
            title: "Recipe Hub: Workflow Library",
            tag: "SaaS UI Design \u2022 Component Library",
            role: "UI/UX Designer",
            duration: "",
            metrics: [],
            overview: "A desktop recipe-library screen for a workflow product called Whisk, where a recipe is a ready-made workflow that connects a team\u2019s tools.",
            challenge: "Teams need an easy way to discover ready-made workflows (recipes) that connect their tools, instead of building every automation from scratch.",
            process: [
                "1440px desktop screen designed in Figma.",
                "Built from reusable components: sidebar, search input, category chips and recipe cards.",
                "Categories for Sales, Marketing, People, Product and Operations; each card shows the connected apps, time and step count."
            ],
            impact: "A desktop recipe-library screen for a workflow product called Whisk, built from reusable Figma components."
        },
        "modal-agrosmart": {
            title: "Agrosmart AI Agricultural Platform",
            tag: "IoT UX \u2022 High-Contrast Design",
            role: "UI/UX Designer",
            duration: "",
            metrics: [],
            overview: "An interface concept for soil-moisture sensors and weather information.",
            challenge: "Farmers need soil-moisture and weather information that is easy to read outdoors.",
            process: [
                "Colour-coded regional maps for soil-sensor data.",
                "High-contrast styling for outdoor use.",
                "Clear indicators for cached versus live data."
            ],
            impact: "A smart-agriculture interface concept. No public project link is available yet."
        },
                "modal-frontend": {
            title: "Contempo Archive — Contemporary Art Museum & Archival Catalog",
            tag: "Front-End Engineering \u2022 Museum Catalog Specification",
            role: "Front-End Developer & UI Designer",
            duration: "November 2026",
            metrics: [
                "100% Structural Zero-Radius Discipline",
                "Mineral Pigment Design Parity",
                "Verified node:test & Playwright Quality Gate"
            ],
            overview: "A contemporary art archival catalog built strictly according to the Contempo Palette design system and custom exhibition specifications to present monograph-grade artwork historical records.",
            challenge: "Museum applications often compromise editorial aesthetics in favor of traditional database layouts, failing to bridge the gap between story-rich curatorial narratives and systematic catalog indexing.",
            process: [
                "Curatorial Aesthetics & Palette Execution: Enforced a strict Mineral Pigment Palette using Warm Linen Stone (#F7F5F0) base canvases, Alabaster Linen plaques (#EFECE4), elevated sheets (#E5E0D5), Mineral Terracotta (#C05634), Antique Ochre (#D4A359), Deep Obsidian (#121212), and Weathered Stone (#57534E) separated by razor-thin hairline borders (rgba(18,18,18,0.08)).",
                "Architectural Zero-Radius Discipline: Applied a rigid 0px border-radius standard across all structural layers, artwork mats, vitrine cards, buttons, filter chips, and plaques, reserving circular geometry strictly for functional audio triggers and close icons.",
                "Editorial Typography Architecture: Paired authoritative Playfair Display headlines and italicized exposition titles with high-legibility Plus Jakarta Sans body copy, taxonomy tags, and tracking-expanded (0.12em) uppercase labels.",
                "Editorial Curation Interface: Engineered a balanced 12-column monograph grid dividing space into an asymmetric 7-column pure white framed artwork viewport, a 1-column spatial air gap, and a 4-column standardized wall plaque tracking plate steppers and provenance timelines.",
                "Core Screens & Capabilities: Structured a seamless Dual-Perspective Switcher to toggle instantly between the Editorial Curation layout and the systematic Archival Catalog Index.",
                "Archival Catalog Index Layout: Implemented a flat baseline search system with sharp rectangular movement filter chips (Earth Pigment, Spatial Constructivism, Post-Minimalism, Brutalist Ceramic, Color Field) and multi-field sorting by accession number, artist, or title.",
                "Curatorial Lightbox & Sheet Modal: Programmed an elevated inspection pane using modern CSS backdrop-filter (blur(12px)) blur treatments, a diffuse warm shadow matrix, multi-level layout zoom (100% to 250%), and an integrated multi-tab dossier engine.",
                "Curatorial Assemblage & Loan Dossier: Developed a private collection tracking engine equipped with a print-ready wall label generator and formal institutional loan request documents configured with flat baseline typography inputs and sharp square checkboxes.",
                "Gallery Wings & Floor Guide: Modeled interactive spatial blueprint trackers across Rooms I, II, and III tracking strict environmental lighting thresholds (50 Lux) and relative humidity controls alongside an Acoustic Guide powered by custom-bound audio scrubbers."
            ],
            impact: "Verification & Quality Gate: Passed 5/5 automated unit tests (node:test) covering sorting, search matching, and taxonomy counts. Fully validated cross-viewport layout fluidity via programmatic Playwright browser workflows for zero compilation or typescript errors (tsc --noEmit)."
        },

       
		        "modal-obsidian": {
            title: "Obsidian Kinetic Engine",
            tag: "AI Interaction Design • Task Orchestration",
            role: "Front-End Developer & UI/UX Designer",
            duration: "November 2026",
            metrics: ["Sub-150ms Interface Parity", "TypeScript Engine Architecture", "Tailwind CSS v4 Token Integration"],
            overview: "A high-performance dark mode task orchestration and deep work environment specifically engineered for software architects and knowledge workers.",
            challenge: "Engineers encounter significant cognitive fatigue and context-switching overhead when trying to balance complex development cycles with focused, deep work blocks.",
            process: [
                "Architected a command-driven UI wrapper optimized with standard hotkeys like Cmd+K (Command Palette) and 'N' for dynamic task modal spawning.",
                "Engineered a dedicated Deep Work Runner incorporating 25-minute Pomodoro and 50-minute task-binding dials with programmatic chimes using the Web Audio API.",
                "Implemented strict background metrics aggregation processing in-flight queue density statistics and continuous developer velocity telemetry.",
                "Styled a custom dark-technical workspace with Tailwind CSS utilizing specific canvas tokens (#0C0D0E) to support low-light focus states."
            ],
            impact: "A lightning-fast, production-ready React and TypeScript task engine wrapper with interactive agile Kanban state-handling and precise column-velocity time logging."
        },

    };

    const modalBackdrop = document.getElementById("caseStudyModal");
    const modalCloseBtn = document.getElementById("modalCloseBtn");
    const modalContent = document.getElementById("modalContent");

    let lastFocus = null;

    function openModal(caseKey, trigger) {
        const data = caseStudyData[caseKey];
        if (!data || !modalBackdrop || !modalContent) return;

        lastFocus = trigger || document.activeElement;
        const card = trigger ? trigger.closest("article") : null;
        const link = card ? card.querySelector(".card-links a") : null;
        const linkName = link && link.querySelector("span") ? link.querySelector("span").textContent : "";

        modalContent.innerHTML = `
            <span class="project-tag">${data.tag}</span>
            <h2 id="modalTitle" class="cs-title">${data.title}</h2>
            <dl class="cs-meta">
                ${data.role ? `<div><dt>Role</dt><dd>${data.role}</dd></div>` : ""}
                ${data.duration ? `<div><dt>Duration</dt><dd>${data.duration}</dd></div>` : ""}
            </dl>
            ${data.metrics && data.metrics.length ? `<ul class="cs-metrics" aria-label="Key results">${data.metrics.map(m => `<li>${m}</li>`).join("")}</ul>` : ""}
            <div class="cs-block"><h3>Overview</h3><p>${data.overview}</p></div>
            <div class="cs-block cs-problem"><h3>Challenge</h3><p>${data.challenge}</p></div>
            <div class="cs-block cs-process"><h3>Approach</h3><ol>${data.process.map(step => `<li>${step}</li>`).join("")}</ol></div>
            <div class="cs-block cs-result"><h3>Outcome</h3><p>${data.impact}</p></div>
            ${link ? `<a class="cs-link" href="${link.href}" target="_blank" rel="noopener noreferrer">View project on ${linkName} <span class="sr-only">(opens in a new tab)</span></a>` : ""}
        `;

        modalBackdrop.classList.add("open");
        modalBackdrop.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        modalCloseBtn.focus();
    }

    function closeModal() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.remove("open");
        modalBackdrop.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.querySelectorAll(".view-details-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.getAttribute("data-modal");
            openModal(modalId, btn);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", (e) => {
            if (e.target === modalBackdrop) closeModal();
        });
    }

    window.addEventListener("keydown", (e) => {
        if (!modalBackdrop || !modalBackdrop.classList.contains("open")) return;
        if (e.key === "Escape") {
            closeModal();
        } else if (e.key === "Tab") {
            const items = modalBackdrop.querySelectorAll("a[href], button");
            const first = items[0], last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    // =========================================================================
    // 10. CONTACT FORM VALIDATION & WEB3FORMS SUBMISSION
    // =========================================================================
    const contactForm = document.getElementById("contactForm");
    const statusBox = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");

    if (contactForm && statusBox && submitBtn) {
        const nameInput = document.getElementById("userName");
        const emailInput = document.getElementById("userEmail");
        const messageInput = document.getElementById("userMessage");

        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const messageError = document.getElementById("messageError");

        function validateForm() {
            let isValid = true;

            // Reset errors
            nameError.textContent = "";
            emailError.textContent = "";
            messageError.textContent = "";

            if (!nameInput.value.trim()) {
                nameError.textContent = "Please enter your name.";
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailError.textContent = "Please enter a valid email address.";
                isValid = false;
            }

            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                messageError.textContent = "Please share a brief message (minimum 10 characters).";
                isValid = false;
            }

            return isValid;
        }

        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (!validateForm()) return;

            const formData = new FormData(contactForm);
            // Replace with your Web3Forms access key
            formData.append("access_key", "621b470f-34ee-4e84-bdb5-12db3591aa2e");

            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Sending...</span>`;
            submitBtn.disabled = true;
            statusBox.textContent = "";
            statusBox.className = "form-status";

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });
                const data = await response.json();

                if (response.ok && data.success) {
                    statusBox.textContent = "✓ Thank you! Your message has been sent successfully. I'll get back to you shortly.";
                    statusBox.className = "form-status success";
                    contactForm.reset();
                } else {
                    statusBox.textContent = "Error: " + (data.message || "Could not send message. Please email directly.");
                    statusBox.className = "form-status error";
                }
            } catch (err) {
                statusBox.textContent = "Network error. Please email me directly at ameshikamohankumar073@gmail.com";
                statusBox.className = "form-status error";
            } finally {
                submitBtn.innerHTML = originalBtnHTML;
                submitBtn.disabled = false;
            }
        });
    }

    // Dynamic current year in footer
    const currentYearEl = document.getElementById("currentYear");
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

});


// =========================================================================
// 11. DYNAMIC STARFIELD CANVAS BACKGROUND (Theme Aware & 60fps)
// =========================================================================
(function () {
    const canvas = document.getElementById("starfield");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w, h, dpr;
    let stars = [];
    let shooters = [];
    const mouse = { x: -9999, y: -9999 };
    let nextShooter = 2000;
    let isPageVisible = true;

    document.addEventListener("visibilitychange", () => {
        isPageVisible = !document.hidden;
    });

    function getStarPalette() {
        const isDark = document.documentElement.getAttribute("data-theme") !== "light";
        return isDark
            ? ["255,255,255", "255,255,255", "196,165,255", "168,85,247", "147,197,253"]
            : ["100,116,139", "148,163,184", "147,51,234", "99,102,241"];
    }

    function makeStar() {
        const depth = Math.random();
        const palette = getStarPalette();
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            r: 0.4 + depth * 1.4,
            depth,
            vx: 0.04 + depth * 0.18,
            vy: -(0.01 + depth * 0.07),
            phase: Math.random() * Math.PI * 2,
            speed: 0.8 + Math.random() * 2.0,
            color: palette[(Math.random() * palette.length) | 0]
        };
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.min(180, Math.floor((w * h) / 10000));
        stars = Array.from({ length: count }, makeStar);
    }

    function spawnShooter() {
        const startX = Math.random() * w * 0.8;
        shooters.push({
            x: startX,
            y: Math.random() * h * 0.35,
            vx: 6 + Math.random() * 4,
            vy: 2.5 + Math.random() * 2.5,
            life: 1
        });
    }

    function draw(timestamp) {
        if (!isPageVisible) {
            requestAnimationFrame(draw);
            return;
        }

        ctx.clearRect(0, 0, w, h);
        const time = timestamp / 1000;
        const isDark = document.documentElement.getAttribute("data-theme") !== "light";

        // Render Stars
        for (const s of stars) {
            if (!reduceMotion) {
                s.x += s.vx;
                s.y += s.vy;
                if (s.x > w + 5) s.x = -5;
                if (s.y < -5) s.y = h + 5;
            }

            const tw = 0.5 + 0.5 * Math.sin(time * s.speed + s.phase);
            const alpha = isDark ? (0.2 + 0.8 * tw) : (0.15 + 0.55 * tw);

            ctx.fillStyle = `rgba(${s.color},${alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();

            // Glitter cross on nearer prominent stars
            if (s.depth > 0.8 && tw > 0.75 && isDark) {
                const len = s.r * 4.5 * tw;
                ctx.strokeStyle = `rgba(${s.color},${alpha * 0.7})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(s.x - len, s.y);
                ctx.lineTo(s.x + len, s.y);
                ctx.moveTo(s.x, s.y - len);
                ctx.lineTo(s.x, s.y + len);
                ctx.stroke();
            }
        }

        // Constellation lines connecting nearby stars & mouse
        if (isDark) {
            const nodes = stars.filter(s => s.depth > 0.65);
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.strokeStyle = `rgba(168,85,247,${(1 - dist / 100) * 0.18})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }

                // Interactive mouse web
                const mx = nodes[i].x - mouse.x;
                const my = nodes[i].y - mouse.y;
                const mDist = Math.sqrt(mx * mx + my * my);
                if (mDist < 140) {
                    ctx.strokeStyle = `rgba(196,165,255,${(1 - mDist / 140) * 0.45})`;
                    ctx.lineWidth = 0.7;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }

        // Shooting Stars
        if (!reduceMotion && isDark) {
            if (timestamp > nextShooter) {
                spawnShooter();
                nextShooter = timestamp + 4000 + Math.random() * 5000;
            }

            shooters = shooters.filter(s => s.life > 0 && s.x < w + 50 && s.y < h + 50);
            for (const s of shooters) {
                const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 8, s.y - s.vy * 8);
                grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
                grad.addColorStop(1, "rgba(168,85,247,0)");
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
                ctx.stroke();

                s.x += s.vx;
                s.y += s.vy;
                s.life -= 0.015;
            }
        }

        if (!reduceMotion) {
            requestAnimationFrame(draw);
        }
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });
    window.addEventListener("mouseout", () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    resize();
    requestAnimationFrame(draw);
})();