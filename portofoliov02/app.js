/* =========================================================
   PORTFOLIO V0.3 — MASTER APPLICATION CONTROLLER
   Dynamic KAI. Favicon • Dual-Polarity Theme • Bilingual EN/ID
   Three.js 3D Hero Monolith • Interactive About Bento
   Education Slider + 3-Tile Google Maps • Case Study Modal
   3D Credentials Deck • Magnetic & Tilt Micro-Interactions
   ========================================================= */

(function () {
  const DATA = window.PORTFOLIO_DATA;
  if (!DATA) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  let currentLang = localStorage.getItem("kai_v03_lang") || "en";
  let currentTheme = localStorage.getItem("kai_v03_theme") || "light";
  let currentFocus = "hci";
  let eduIndex = 0;
  let credIndex = 0;
  let hero3dThemeUpdater = null;

  /* ---------------------------------------------------------
     1. DYNAMIC KAI. SVG FAVICON (OXBLOOD LIGHT <-> GLACIAL CYAN DARK)
     --------------------------------------------------------- */
  function updateFavicon(theme) {
    const link = document.getElementById("dynamicFavicon");
    if (!link) return;
    const dotColor = theme === "dark" ? "%2364e3db" : "%239b1c24";
    const bgColor = theme === "dark" ? "%230f1012" : "%23121212";
    link.href = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='${bgColor}'/%3E%3Ctext x='11' y='46' font-family='Arial Black, sans-serif' font-weight='900' font-size='36' fill='%23f4f4f2'%3EK%3C/text%3E%3Ccircle cx='48' cy='42' r='7' fill='${dotColor}'/%3E%3C/svg%3E`;
  }

  /* ---------------------------------------------------------
     2. DUAL-POLARITY THEME SWITCHER
     --------------------------------------------------------- */
  function applyTheme(theme) {
    currentTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("kai_v03_theme", currentTheme);
    updateFavicon(currentTheme);
    if (typeof hero3dThemeUpdater === "function") {
      hero3dThemeUpdater(currentTheme);
    }
  }

  /* ---------------------------------------------------------
     3. BILINGUAL LANGUAGE ENGINE (EN | ID)
     --------------------------------------------------------- */
  function applyLanguage(lang) {
    currentLang = lang === "id" ? "id" : "en";
    localStorage.setItem("kai_v03_lang", currentLang);
    document.documentElement.lang = currentLang;

    document.querySelectorAll(".lang-btn[data-lang]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });

    const dict = DATA.i18n[currentLang] || DATA.i18n.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key]) el.textContent = dict[key];
    });

    renderAboutFocus(currentFocus, false);
    renderEducationCards();
    updateEducationMap(eduIndex);
    updateCredentialPanel(credIndex, false);
    updateHeroPillarCaption();
  }

  /* ---------------------------------------------------------
     4. CUSTOM CONCRETE ENTRY CURTAIN (GSAP REVEAL)
     --------------------------------------------------------- */
  function runIntroCurtain() {
    const curtain = document.getElementById("introCurtain");
    const counter = document.getElementById("introCounter");
    const fill = document.getElementById("introBarFill");
    const status = document.getElementById("introStatus");

    if (!curtain) return;
    if (prefersReducedMotion || !window.gsap) {
      curtain.classList.add("is-done");
      return;
    }

    const stages = [
      "INITIALIZING ARCHITECTURE",
      "LOADING 3D MONOLITH",
      "MOUNTING 4 CRT CARTRIDGES",
      "READY // V0.3"
    ];
    const obj = { val: 0 };

    const tl = window.gsap.timeline({
      onComplete: () => {
        curtain.classList.add("is-done");
      }
    });

    tl.to(obj, {
      val: 100,
      duration: 1.05,
      ease: "power2.inOut",
      onUpdate: () => {
        const n = Math.round(obj.val);
        if (counter) counter.textContent = String(n).padStart(2, "0");
        if (fill) fill.style.width = `${n}%`;
        if (status) {
          const idx = Math.min(stages.length - 1, Math.floor((n / 100) * stages.length));
          status.textContent = stages[idx];
        }
      }
    })
      .to(curtain, {
        yPercent: -102,
        duration: 0.72,
        ease: "expo.inOut"
      })
      .from(
        ".hero-reveal",
        {
          y: 28,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out"
        },
        "-=0.35"
      );
  }

  /* ---------------------------------------------------------
     5. INTERACTIVE 3D HERO CONCRETE MONOLITH (THREE.JS)
     --------------------------------------------------------- */
  let pillarIdx = 0;

  function updateHeroPillarCaption() {
    const badge = document.getElementById("monolithPillarBadge");
    const caption = document.getElementById("monolithPillarCaption");
    const dots = document.querySelectorAll("#monolithDots .m-dot");
    const pillar = DATA.heroPillars[pillarIdx];
    if (!pillar) return;

    if (badge) badge.textContent = pillar.badge;
    if (caption) caption.textContent = pillar.caption[currentLang] || pillar.caption.en;
    dots.forEach((d, i) => d.classList.toggle("active", i === pillarIdx));
  }

  function initHero3DMonolith() {
    const canvas = document.getElementById("hero3dCanvas");
    const card = document.getElementById("heroMonolithCard");
    if (!canvas || !card || !window.THREE) return;

    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 4 / 3.4, 0.1, 100);
    camera.position.set(0, 0.3, 6.2);

    const amb = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(amb);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const accentLight = new THREE.PointLight(0x9b1c24, 2.2, 16);
    accentLight.position.set(-3.2, -1.8, 3.6);
    scene.add(accentLight);

    const root = new THREE.Group();
    scene.add(root);

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xd6d5ce,
      roughness: 0.75,
      metalness: 0.12,
      flatShading: true
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x9b1c24,
      emissive: 0x9b1c24,
      emissiveIntensity: 0.45,
      roughness: 0.35,
      metalness: 0.25,
      flatShading: true
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x121212,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });

    // 3 Swap-in Architectural Sculptures for the 3 Pillars
    const shapes = [];

    // Shape 0: Brutalist Monolith Slab
    const g0 = new THREE.Group();
    g0.add(new THREE.Mesh(new THREE.BoxGeometry(1.55, 2.55, 1.0), concreteMat));
    g0.add(new THREE.Mesh(new THREE.BoxGeometry(1.62, 2.62, 1.06), wireMat));
    const core0 = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), accentMat);
    core0.position.set(0.88, 0.72, 0.56);
    g0.add(core0);
    shapes.push(g0);

    // Shape 1: Kinetic Octahedron Crystal
    const g1 = new THREE.Group();
    g1.add(new THREE.Mesh(new THREE.OctahedronGeometry(1.45, 0), concreteMat));
    g1.add(new THREE.Mesh(new THREE.OctahedronGeometry(1.55, 0), wireMat));
    g1.add(new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.08, 6, 24), accentMat));
    g1.visible = false;
    shapes.push(g1);

    // Shape 2: Game Dev Torus Knot Engine
    const g2 = new THREE.Group();
    g2.add(new THREE.Mesh(new THREE.TorusKnotGeometry(0.95, 0.3, 48, 8), concreteMat));
    g2.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), accentMat));
    g2.visible = false;
    shapes.push(g2);

    shapes.forEach((s) => root.add(s));

    // Orbiting Concrete Ring
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.06, 6, 36), concreteMat);
    outerRing.rotation.x = 1.15;
    root.add(outerRing);

    const accentOrb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), accentMat);
    root.add(accentOrb);

    function sync3DColors(theme) {
      const isDark = theme === "dark";
      const accentHex = isDark ? 0x64e3db : 0x9b1c24;
      concreteMat.color.setHex(isDark ? 0x2c313c : 0xdad9d2);
      wireMat.color.setHex(isDark ? 0x64e3db : 0x121212);
      wireMat.opacity = isDark ? 0.22 : 0.14;
      accentMat.color.setHex(accentHex);
      accentMat.emissive.setHex(accentHex);
      accentLight.color.setHex(accentHex);
    }

    hero3dThemeUpdater = sync3DColors;
    sync3DColors(currentTheme);

    function resize3D() {
      const box = canvas.parentElement;
      if (!box) return;
      const w = Math.max(200, box.clientWidth);
      const h = Math.max(180, box.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize3D();
    window.addEventListener("resize", resize3D);

    let targetRotX = 0.18;
    let targetRotY = 0;
    let spinBoost = 0;

    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      targetRotY = nx * 0.9;
      targetRotX = ny * 0.65;
    });

    card.addEventListener("pointerleave", () => {
      targetRotX = 0.18;
      targetRotY = 0;
    });

    card.addEventListener("click", () => {
      pillarIdx = (pillarIdx + 1) % DATA.heroPillars.length;
      spinBoost = 0.28;
      shapes.forEach((s, i) => {
        s.visible = i === pillarIdx;
      });
      updateHeroPillarCaption();
      if (window.CRTConsole && window.CRTConsole.tone) {
        window.CRTConsole.tone(320 + pillarIdx * 110, 0.08, "triangle", 0.035, 520 + pillarIdx * 90);
      }
    });

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      // Pause rendering when hidden inside CRT theater to save GPU for 3D games
      if (document.body.classList.contains("theater-open")) return;

      t += 0.014;
      spinBoost *= 0.92;
      root.rotation.y += 0.008 + spinBoost;
      root.rotation.x += (targetRotX - root.rotation.x) * 0.07;
      root.position.y = Math.sin(t * 1.4) * 0.14;
      outerRing.rotation.z = t * 0.6;
      accentOrb.position.set(Math.cos(t * 1.6) * 2.15, Math.sin(t * 1.6) * 0.95, Math.sin(t * 1.6) * 1.8);

      renderer.render(scene, camera);
    }

    updateHeroPillarCaption();
    animate();
  }

  /* ---------------------------------------------------------
     6. ABOUT SECTION: INTERACTIVE FOCUS TABS + PORTRAIT + TOEIC COUNTER
     --------------------------------------------------------- */
  function renderAboutFocus(focusKey, animate = true) {
    currentFocus = focusKey;
    const entry = DATA.aboutFocus[focusKey];
    if (!entry) return;

    const copy = entry[currentLang] || entry.en;
    const leadEl = document.getElementById("aboutFocusLead");
    const bodyEl = document.getElementById("aboutFocusBody");

    document.querySelectorAll("#aboutFocusTabs .focus-tab").forEach((btn) => {
      const active = btn.dataset.focus === focusKey;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    const swapText = () => {
      if (leadEl) leadEl.textContent = copy.lead;
      if (bodyEl) bodyEl.textContent = copy.body;
    };

    if (animate && window.gsap && leadEl && bodyEl) {
      window.gsap.to([leadEl, bodyEl], {
        opacity: 0,
        y: 6,
        duration: 0.15,
        onComplete: () => {
          swapText();
          window.gsap.to([leadEl, bodyEl], { opacity: 1, y: 0, duration: 0.25 });
        }
      });
    } else {
      swapText();
    }

    document.querySelectorAll("#skillPillsWrap .skill-pill").forEach((pill) => {
      const match = pill.dataset.group === focusKey;
      pill.classList.toggle("is-highlighted", match);
      pill.classList.toggle("is-dimmed", !match);
    });
  }

  function hydratePortrait() {
    const box = document.getElementById("portraitBox");
    if (!box || !DATA.portraitImage) return;
    const img = document.createElement("img");
    img.src = DATA.portraitImage;
    img.alt = "Portrait of Fauza Kaizaku Setiawan";
    img.onload = () => {
      box.innerHTML = "";
      box.appendChild(img);
    };
  }

  function initAboutSection() {
    document.querySelectorAll("#aboutFocusTabs .focus-tab").forEach((btn) => {
      btn.addEventListener("click", () => renderAboutFocus(btn.dataset.focus, true));
    });
    renderAboutFocus("hci", false);
    hydratePortrait();

    // Animated TOEIC 905 Counter on Scroll
    const counterEl = document.getElementById("toeicCounter");
    if (counterEl) {
      const target = Number(counterEl.dataset.target || 905);
      if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
        const obj = { val: 0 };
        window.gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: counterEl,
            start: "top 88%",
            once: true
          },
          onUpdate: () => {
            counterEl.textContent = String(Math.round(obj.val)).padStart(3, "0");
          }
        });
      } else {
        counterEl.textContent = String(target);
      }
    }
  }

  /* ---------------------------------------------------------
     7. EDUCATION SLIDER + 3-TILE LIVE GOOGLE MAPS BENTO
     --------------------------------------------------------- */
  function positionCircularCards(cards, activeIdx) {
    const total = cards.length;
    cards.forEach((card, i) => {
      card.classList.remove("pos-center", "pos-prev", "pos-next", "pos-hidden-left", "pos-hidden-right");
      const diff = (i - activeIdx + total) % total;
      if (diff === 0) card.classList.add("pos-center");
      else if (diff === 1) card.classList.add("pos-next");
      else if (diff === total - 1) card.classList.add("pos-prev");
      else if (diff <= total / 2) card.classList.add("pos-hidden-right");
      else card.classList.add("pos-hidden-left");
    });
  }

  function updateEducationMap(index) {
    const item = DATA.educationTrack[index];
    if (!item) return;

    const cityEl = document.getElementById("mapCity");
    const typeEl = document.getElementById("mapTypeBadge");
    const titleEl = document.getElementById("mapTitle");
    const extLink = document.getElementById("mapExternalLink");
    const photosLink = document.getElementById("eduPhotosLink");
    const streetFrame = document.getElementById("eduStreetIframe");
    const mapFrame = document.getElementById("eduMapIframe");
    const satFrame = document.getElementById("eduSatIframe");

    if (cityEl) cityEl.textContent = item.city;
    if (titleEl) titleEl.textContent = item.name;
    if (typeEl) {
      typeEl.textContent = item.badge[currentLang] || item.badge.en;
      typeEl.classList.toggle("map-type-badge--accent", item.type === "industry");
    }

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${item.mapQuery}`;
    if (extLink) extLink.href = mapsUrl;
    if (photosLink) photosLink.href = mapsUrl;

    const z = item.zoom || 16;
    if (streetFrame) {
      streetFrame.src = `https://maps.google.com/maps?q=&layer=c&cbll=${item.lat},${item.lng}&cbp=11,0,0,0,0&output=svembed`;
    }
    if (mapFrame) {
      mapFrame.src = `https://maps.google.com/maps?q=${item.mapQuery}&t=&z=${z}&ie=UTF8&iwloc=&output=embed`;
    }
    if (satFrame) {
      satFrame.src = `https://maps.google.com/maps?q=${item.mapQuery}&t=k&z=${z}&ie=UTF8&iwloc=&output=embed`;
    }
  }

  function renderEducationCards() {
    const stage = document.getElementById("eduStage");
    const counter = document.getElementById("eduCounter");
    if (!stage) return;

    stage.innerHTML = "";
    DATA.educationTrack.forEach((item, idx) => {
      const card = document.createElement("article");
      card.className = `edu-card ${item.type === "industry" ? "edu-card--industry" : ""}`;
      card.innerHTML = `
        ${
          item.image
            ? `<div class="edu-card-media">
                 <img src="${item.image}" alt="${item.name}" loading="lazy" />
                 ${item.imageTag ? `<span class="edu-card-media-tag">${item.imageTag}</span>` : ""}
               </div>`
            : ""
        }
        <div class="edu-card-top">
          <span class="edu-year">${item.year}</span>
          <span class="edu-pill">${item.badge[currentLang] || item.badge.en}</span>
        </div>
        <h3 class="edu-name">${item.name}</h3>
        <p class="edu-role">${item.role[currentLang] || item.role.en}</p>
        <span class="edu-city">${item.city}</span>
      `;
      card.addEventListener("click", () => {
        if (eduIndex !== idx) {
          eduIndex = idx;
          syncEducationSlider();
        }
      });
      stage.appendChild(card);
    });

    const cards = Array.from(stage.querySelectorAll(".edu-card"));
    positionCircularCards(cards, eduIndex);
    if (counter) {
      counter.textContent = `${String(eduIndex + 1).padStart(2, "0")} OF ${String(DATA.educationTrack.length).padStart(2, "0")}`;
    }
  }

  function syncEducationSlider() {
    const stage = document.getElementById("eduStage");
    const counter = document.getElementById("eduCounter");
    if (!stage) return;
    const cards = Array.from(stage.querySelectorAll(".edu-card"));
    positionCircularCards(cards, eduIndex);
    if (counter) {
      counter.textContent = `${String(eduIndex + 1).padStart(2, "0")} OF ${String(DATA.educationTrack.length).padStart(2, "0")}`;
    }
    updateEducationMap(eduIndex);
  }

  function initEducationSlider() {
    renderEducationCards();
    updateEducationMap(eduIndex);

    const prevBtn = document.getElementById("eduPrevBtn");
    const nextBtn = document.getElementById("eduNextBtn");
    const total = DATA.educationTrack.length;

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        eduIndex = (eduIndex - 1 + total) % total;
        syncEducationSlider();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        eduIndex = (eduIndex + 1) % total;
        syncEducationSlider();
      });
    }
  }

  /* ---------------------------------------------------------
     8. PROJECTS CASE STUDY MODAL (MEDIA TABS + 2x2 SPEC GRID)
     --------------------------------------------------------- */
  function initProjectModal() {
    const modal = document.getElementById("projectModal");
    const drawer = document.getElementById("modalDrawer");
    const closeBtn = document.getElementById("modalCloseBtn");
    const tagEl = document.getElementById("modalTag");
    const stampEl = document.getElementById("modalStamp");
    const titleEl = document.getElementById("modalTitle");
    const bodyEl = document.getElementById("modalBody");
    const mediaSection = document.getElementById("modalMediaSection");
    const mediaTabs = document.getElementById("modalMediaTabs");
    const mediaStage = document.getElementById("modalMediaStage");
    const archStrip = document.getElementById("modalArchStrip");
    const specGrid = document.getElementById("modalSpecGrid");

    if (!modal) return;

    function renderMediaTab(item) {
      const cap = item.caption ? item.caption[currentLang] || item.caption.en : "";
      if (item.type === "youtube" && item.videoId) {
        mediaStage.innerHTML = `
          <button type="button" class="yt-preview-card" id="ytLaunchBtn">
            <div class="yt-thumb-wrap">
              <img src="https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg" alt="${cap}" />
              <span class="yt-play-btn" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
            </div>
            <div class="yt-caption-bar">
              <span class="yt-caption-title">PLAY WALKTHROUGH VIDEO</span>
              <span>${cap}</span>
            </div>
          </button>
        `;
        const playBtn = mediaStage.querySelector("#ytLaunchBtn");
        if (playBtn) {
          playBtn.addEventListener("click", () => {
            mediaStage.innerHTML = `
              <iframe
                class="yt-embed-frame"
                src="https://www.youtube.com/embed/${item.videoId}?autoplay=1"
                title="Project Walkthrough Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            `;
          });
        }
      } else {
        mediaStage.innerHTML = `
          <div class="media-photo-frame">
            <img src="${item.src}" alt="${cap}" style="${item.id === "team" ? "object-position:center 22%" : ""}" />
            <div class="media-photo-caption">${cap}</div>
          </div>
        `;
      }
    }

    function openProject(key) {
      const proj = DATA.projects[key];
      if (!proj) return;

      tagEl.textContent = proj.tag[currentLang] || proj.tag.en;
      if (proj.stamp) {
        stampEl.textContent = proj.stamp;
        stampEl.hidden = false;
      } else {
        stampEl.hidden = true;
      }

      titleEl.textContent = proj.title;
      bodyEl.textContent = proj.body[currentLang] || proj.body.en;

      if (proj.media && proj.media.length) {
        mediaSection.hidden = false;
        mediaTabs.innerHTML = "";
        proj.media.forEach((m, idx) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = `media-tab-btn ${idx === 0 ? "active" : ""}`;
          b.textContent = m.label[currentLang] || m.label.en;
          b.addEventListener("click", () => {
            mediaTabs.querySelectorAll(".media-tab-btn").forEach((x) => x.classList.remove("active"));
            b.classList.add("active");
            renderMediaTab(m);
          });
          mediaTabs.appendChild(b);
        });
        renderMediaTab(proj.media[0]);
      } else {
        mediaSection.hidden = true;
      }

      if (proj.archSteps && proj.archSteps.length) {
        archStrip.hidden = false;
        archStrip.innerHTML = proj.archSteps
          .map(
            (a) => `
          <div class="arch-node">
            <span class="arch-step">${a.step}</span>
            <span class="arch-label">${a.label}</span>
          </div>`
          )
          .join("");
      } else {
        archStrip.hidden = true;
      }

      specGrid.innerHTML = proj.specs
        .map(
          (s) => `
        <div class="modal-spec-card">
          <span class="modal-spec-label">${s.label}</span>
          <p class="modal-spec-text">${s.text}</p>
        </div>`
        )
        .join("");

      document.body.classList.add("modal-open");
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");

      if (window.gsap && drawer) {
        window.gsap.fromTo(
          drawer,
          { y: 26, scale: 0.96, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.3, ease: "power3.out" }
        );
      }
    }

    function closeModal() {
      if (!modal.classList.contains("open")) return;
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      mediaStage.innerHTML = "";
    }

    document.querySelectorAll("[data-open-project]").forEach((btn) => {
      btn.addEventListener("click", () => openProject(btn.dataset.openProject));
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    window.addEventListener("keydown", (e) => {
      if (e.code === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  /* ---------------------------------------------------------
     9. CREDENTIALS 3D PEEKING DECK + WIDE DETAIL PANEL
     --------------------------------------------------------- */
  function updateCredentialPanel(index, animate = true) {
    const item = DATA.credentials[index];
    if (!item) return;

    const panel = document.getElementById("credDetailPanel");
    const issuer = document.getElementById("detailIssuer");
    const title = document.getElementById("detailTitle");
    const meta = document.getElementById("detailMeta");
    const desc = document.getElementById("detailDesc");
    const counter = document.getElementById("credCounter");

    if (counter) {
      counter.textContent = `${String(index + 1).padStart(2, "0")} OF ${String(DATA.credentials.length).padStart(2, "0")}`;
    }

    const write = () => {
      if (issuer) issuer.textContent = item.issuer;
      if (title) title.textContent = item.title;
      if (meta) meta.textContent = item.meta;
      if (desc) desc.textContent = item.desc[currentLang] || item.desc.en;
    };

    if (animate && panel) {
      panel.classList.add("switching");
      setTimeout(() => {
        write();
        panel.classList.remove("switching");
      }, 140);
    } else {
      write();
    }
  }

  function initCredentialsDeck() {
    const stage = document.getElementById("credDeckStage");
    if (!stage) return;

    stage.innerHTML = "";
    DATA.credentials.forEach((item, idx) => {
      const card = document.createElement("article");
      card.className = `cred-card ${item.accent ? "cred-card--accent" : ""}`;
      card.innerHTML = `
        <div class="cred-slab-body">
          <div class="slab-top-bar">
            <span>CERT // ${item.num}</span>
            <span>${item.accent ? "HIGHEST RATING" : "VERIFIED"}</span>
          </div>
          <div class="missing-file-box card-placeholder">
            <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.remove()" />
            <span class="missing-label">${item.fallbackLabel}</span>
          </div>
          <div>
            <p class="slab-issuer">${item.issuer}</p>
            <h3 class="slab-title">${item.title}</h3>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        if (credIndex !== idx) {
          credIndex = idx;
          syncCredDeck();
        }
      });

      // Subtle 3D tilt on center card
      if (!isTouchDevice) {
        card.addEventListener("pointermove", (e) => {
          if (!card.classList.contains("pos-center")) return;
          const r = card.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty("--tilt-x", `${(-ny * 8).toFixed(2)}deg`);
          card.style.setProperty("--tilt-y", `${(nx * 10).toFixed(2)}deg`);
        });
        card.addEventListener("pointerleave", () => {
          card.style.setProperty("--tilt-x", "0deg");
          card.style.setProperty("--tilt-y", "0deg");
        });
      }

      stage.appendChild(card);
    });

    function syncCredDeck() {
      const cards = Array.from(stage.querySelectorAll(".cred-card"));
      positionCircularCards(cards, credIndex);
      updateCredentialPanel(credIndex, true);
    }

    syncCredDeck();

    const prevBtn = document.getElementById("prevCredBtn");
    const nextBtn = document.getElementById("nextCredBtn");
    const total = DATA.credentials.length;

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        credIndex = (credIndex - 1 + total) % total;
        syncCredDeck();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        credIndex = (credIndex + 1) % total;
        syncCredDeck();
      });
    }
  }

  /* ---------------------------------------------------------
     10. FOOTER CONTACT HYDRATION + CLICK-TO-COPY
     --------------------------------------------------------- */
  function initFooterContacts() {
    const c = DATA.contact;
    const outlookBtn = document.getElementById("copyOutlookBtn");
    const gmailBtn = document.getElementById("copyGmailBtn");
    const outlookText = document.getElementById("emailPrimaryText");
    const gmailText = document.getElementById("emailSecondaryText");
    const waLink = document.getElementById("whatsappLink");
    const ghLink = document.getElementById("githubLink");
    const liLink = document.getElementById("linkedinLink");
    const igLink = document.getElementById("instagramLink");

    if (outlookText) outlookText.textContent = c.outlook;
    if (gmailText) gmailText.textContent = c.gmail;
    if (outlookBtn) outlookBtn.dataset.copy = c.outlook;
    if (gmailBtn) gmailBtn.dataset.copy = c.gmail;
    if (waLink) waLink.href = c.whatsappUrl;
    if (ghLink) ghLink.href = c.github;
    if (liLink) liLink.href = c.linkedin;
    if (igLink) igLink.href = c.instagram;

    [outlookBtn, gmailBtn].forEach((btn) => {
      if (!btn) return;
      btn.addEventListener("click", () => {
        const val = btn.dataset.copy;
        if (!val) return;
        navigator.clipboard?.writeText(val).catch(() => {});
        btn.classList.add("is-copied");
        setTimeout(() => btn.classList.remove("is-copied"), 1800);
      });
    });
  }

  /* ---------------------------------------------------------
     11. NAVBAR, SMOOTH SCROLL, MAGNETIC & 3D SLAB TILT + GSAP
     --------------------------------------------------------- */
  function initNavigationAndMotion() {
    const navbar = document.getElementById("navbar");
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const mobileDrawer = document.getElementById("mobileDrawer");

    window.addEventListener(
      "scroll",
      () => {
        if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 18);
      },
      { passive: true }
    );

    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener("click", () => {
        const open = !mobileDrawer.classList.contains("is-open");
        mobileDrawer.classList.toggle("is-open", open);
        mobileBtn.classList.toggle("is-open", open);
        mobileBtn.setAttribute("aria-expanded", String(open));
        mobileDrawer.setAttribute("aria-hidden", String(!open));
      });
    }

    // Smooth Scroll Links
    document.querySelectorAll(".js-scroll").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();

        if (mobileDrawer && mobileDrawer.classList.contains("is-open")) {
          mobileDrawer.classList.remove("is-open");
          mobileBtn?.classList.remove("is-open");
        }

        if (window.gsap && window.ScrollToPlugin && !prefersReducedMotion) {
          window.gsap.to(window, {
            duration: 0.78,
            scrollTo: { y: target, offsetY: 74 },
            ease: "power3.inOut"
          });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Theme & Language Button Bindings
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        applyTheme(currentTheme === "dark" ? "light" : "dark");
      });
    }

    document.querySelectorAll(".lang-btn[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
    });

    // Global Keyboard Shortcuts (Disabled when playing inside CRT Theater or reading Modal!)
    window.addEventListener("keydown", (e) => {
      if (
        document.body.classList.contains("theater-open") ||
        document.body.classList.contains("modal-open") ||
        ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) {
        return;
      }
      if (e.code === "KeyT") {
        applyTheme(currentTheme === "dark" ? "light" : "dark");
      } else if (e.code === "KeyL") {
        applyLanguage(currentLang === "en" ? "id" : "en");
      }
    });

    // Magnetic Tactile Hover & Subtle 3D Slab Tilt (Desktop only)
    if (!isTouchDevice && !prefersReducedMotion) {
      document.querySelectorAll("[data-magnetic]").forEach((el) => {
        el.addEventListener("pointermove", (e) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * 0.16;
          const dy = (e.clientY - (r.top + r.height / 2)) * 0.16;
          el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        });
        el.addEventListener("pointerleave", () => {
          el.style.transform = "";
        });
      });

      document.querySelectorAll("[data-tilt-slab]").forEach((slab) => {
        slab.addEventListener("pointermove", (e) => {
          const r = slab.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          slab.style.transform = `perspective(1000px) rotateX(${(-ny * 4.5).toFixed(2)}deg) rotateY(${(nx * 5.5).toFixed(2)}deg) translateY(-2px)`;
        });
        slab.addEventListener("pointerleave", () => {
          slab.style.transform = "";
        });
      });
    }

    // GSAP Scroll Reveals + Scroll-Scrubbed Ticker Strip
    if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      if (window.ScrollToPlugin) window.gsap.registerPlugin(window.ScrollToPlugin);

      const ticker = document.getElementById("heroTickerTrack");
      if (ticker) {
        window.gsap.to(ticker, {
          xPercent: -24,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.7
          }
        });
      }

      document.querySelectorAll(".reveal-up").forEach((el) => {
        window.gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: 0.72,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true
          }
        });
      });
    }
  }

  /* ---------------------------------------------------------
     BOOT SEQUENCE
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(currentTheme);
    initNavigationAndMotion();
    initHero3DMonolith();
    initAboutSection();
    initEducationSlider();
    initProjectModal();
    initCredentialsDeck();
    initFooterContacts();
    applyLanguage(currentLang);

    if (window.CRTConsole && typeof window.CRTConsole.init === "function") {
      window.CRTConsole.init();
    }

    runIntroCurtain();
  });
})();