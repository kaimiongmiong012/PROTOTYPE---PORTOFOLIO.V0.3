/* =========================================================
   PORTFOLIO V0.3 — CENTRAL DATA & BILINGUAL CONTENT (EN / ID)
   Edit your links, portrait path, certificate filenames,
   and project media right here without touching app logic.
   ========================================================= */

window.PORTFOLIO_DATA = {
  // Drop your portrait inside assets/ (e.g. "assets/portrait.jpg") when ready
  portraitImage: "",

  contact: {
    outlook: "fauzakaizakusetiawan@student.telkomuniversity.ac.id",
    gmail: "kaizaku.telkomuniv@gmail.com",
    whatsappUrl: "https://wa.me/6280000000000", // Replace with your active WA number
    github: "https://github.com/kaimiongmiong012",
    linkedin: "https://www.linkedin.com/in/fauza-kaizaku-439338327",
    instagram: "https://www.instagram.com/kaieaych"
  },

  /* ---------------------------------------------------------
     HERO 3D MONOLITH PILLARS (Click canvas to cycle)
     --------------------------------------------------------- */
  heroPillars: [
    {
      badge: "01 // UI/UX ARCHITECTURE",
      caption: {
        en: "HCI-DRIVEN SYSTEMS & CLEAN PRODUCT ARCHITECTURE",
        id: "SISTEM BERBASIS HCI & ARSITEKTUR PRODUK BERSIH"
      },
      shape: "monolith"
    },
    {
      badge: "02 // FULL-STACK & WEBGL",
      caption: {
        en: "LARAVEL, MARIADB, CANVAS 2D & THREE.JS 3D ENGINES",
        id: "LARAVEL, MARIADB, CANVAS 2D & ENGINE 3D THREE.JS"
      },
      shape: "octa"
    },
    {
      badge: "03 // GAME DEV & HCI QOL",
      caption: {
        en: "UNITY, UNREAL ENGINE & PLAYABLE BROWSER CARTRIDGES",
        id: "UNITY, UNREAL ENGINE & CARTRIDGE GAME BROWSER"
      },
      shape: "torus"
    }
  ],

  /* ---------------------------------------------------------
     ABOUT INTERACTIVE FOCUS MODES (Highlights matching pills)
     --------------------------------------------------------- */
  aboutFocus: {
    hci: {
      en: {
        lead: "I ORGANIZE CONCEPTS, DEFINE USER FLOWS, AND SHAPE CLEAN INTERFACES BEFORE HEAVY CODE BEGINS.",
        body: "Focused on Human-Computer Interaction and practical Quality of Life software design. I prefer calm, non-complicated visual hierarchies where every click, contrast ratio, and layout decision has a clear purpose."
      },
      id: {
        lead: "SAYA MENYUSUN KONSEP, ALUR PENGGUNA, DAN ANTARMUKA BERSIH SEBELUM KODE BERAT DIMULAI.",
        body: "Berfokus pada Human-Computer Interaction dan desain perangkat lunak Quality of Life. Saya mengutamakan hierarki visual yang minimalis, efisien, dan berpusat pada kenyamanan pengguna."
      }
    },
    web: {
      en: {
        lead: "BRIDGING FIGMA PROTOTYPES WITH REAL PRODUCTION CODE, DATABASES, AND INTERACTIVE GRAPHICS.",
        body: "Experienced in enterprise Laravel & MariaDB web apps from my PT. Telkom Indonesia Regional IV internship, custom WordPress storefronts, and procedural HTML5 Canvas / Three.js WebGL game engines running at 60 FPS."
      },
      id: {
        lead: "MENGHUBUNGKAN PROTOTIPE FIGMA DENGAN KODE PRODUKSI, DATABASE, DAN GRAFIS INTERAKTIF.",
        body: "Berpengalaman membangun aplikasi web Laravel & MariaDB saat magang di PT. Telkom Indonesia Regional IV, storefront WordPress kustom, serta engine game prosedural HTML5 Canvas dan Three.js."
      }
    },
    english: {
      en: {
        lead: "OFFICIAL ETS TOEIC 905 — AVAILABLE FOR PRIVATE ENGLISH TUTORING & INTERVIEW COACHING.",
        body: "Combining professional-level English proficiency (Listening 490 / Reading 415) with real tech-industry presentation habits. I help students and peers sharpen spoken fluency, TOEIC strategy, and technical interviews."
      },
      id: {
        lead: "SKOR RESMI ETS TOEIC 905 — TERSEDIA UNTUK LES PRIVAT BAHASA INGGRIS & COACHING WAWANCARA.",
        body: "Memadukan kemahiran bahasa Inggris tingkat profesional (Listening 490 / Reading 415) dengan komunikasi presentasi teknologi untuk membantu persiapan TOEIC, percakapan, dan wawancara kerja."
      }
    }
  },

  /* ---------------------------------------------------------
     EDUCATION & TRACK (5 STOPS + LIVE GOOGLE MAPS COORDS)
     --------------------------------------------------------- */
  educationTrack: [
    {
      id: "tup",
      type: "academic",
      year: "2024 — PRESENT",
      badge: { en: "5TH SEMESTER", id: "SEMESTER 5" },
      name: "TELKOM UNIVERSITY PURWOKERTO",
      role: {
        en: "B.Sc. Informatics Engineering — HCI & Quality of Life Focus",
        id: "S1 Teknik Informatika — Fokus HCI & Quality of Life"
      },
      city: "PURWOKERTO, CENTRAL JAVA",
      lat: -7.4352631,
      lng: 109.2490926,
      zoom: 17,
      mapQuery: "Telkom+University+Purwokerto",
      image: ""
    },
    {
      id: "telkom-reg4",
      type: "industry",
      year: "2023 • INTERNSHIP",
      badge: { en: "SANGAT KOMPETEN", id: "SANGAT KOMPETEN" },
      name: "PT. TELKOM INDONESIA REGIONAL IV",
      role: {
        en: "Web Developer & UI/UX Intern — Networking Division (Built ISIM)",
        id: "Magang Web Developer & UI/UX — Divisi Networking (Membangun ISIM)"
      },
      city: "SEMARANG, CENTRAL JAVA",
      lat: -6.99262,
      lng: 110.42275,
      zoom: 17,
      mapQuery: "Telkom+Regional+IV+Semarang",
      image: "assets/telkom-team.jpg",
      imageTag: "TELKOM REG IV • AKHLAK TEAM"
    },
    {
      id: "smk-telkom",
      type: "academic",
      year: "2021 — 2024",
      badge: { en: "FOUNDATION", id: "FONDASI" },
      name: "VOCATIONAL SOFTWARE & UI TRACK",
      role: {
        en: "Full-Stack Web Fundamentals, Database Design & Visual Prototyping",
        id: "Dasar Web Full-Stack, Desain Database & Prototipe Visual"
      },
      city: "PURWOKERTO, CENTRAL JAVA",
      lat: -7.4352631,
      lng: 109.2490926,
      zoom: 16,
      mapQuery: "SMK+Telkom+Purwokerto",
      image: ""
    },
    {
      id: "intervol",
      type: "academic",
      year: "2024 — PRESENT",
      badge: { en: "ORGANIZATION", id: "ORGANISASI" },
      name: "INTERVOL — INTERNATIONAL VOLUNTEER",
      role: {
        en: "Event Organizer & Logistics Division — The Index & Global Welcoming",
        id: "Divisi Event Organizer & Logistik — The Index & Penyambutan Internasional"
      },
      city: "TELKOM UNIVERSITY PURWOKERTO",
      lat: -7.4352631,
      lng: 109.2490926,
      zoom: 17,
      mapQuery: "Telkom+University+Purwokerto",
      image: ""
    },
    {
      id: "creative-lab",
      type: "industry",
      year: "2024 — PRESENT",
      badge: { en: "INDEPENDENT", id: "INDEPENDEN" },
      name: "UI/UX, WEB & INTERACTIVE LAB",
      role: {
        en: "Freelance Interface Systems, Front-End Builds & English Coaching",
        id: "Sistem Antarmuka Freelance, Pengembangan Front-End & Coaching Inggris"
      },
      city: "PURWOKERTO, INDONESIA",
      lat: -7.4244,
      lng: 109.2302,
      zoom: 15,
      mapQuery: "Alun+Alun+Purwokerto",
      image: ""
    }
  ],

  /* ---------------------------------------------------------
     PROJECTS CASE STUDIES (MODAL DATA + MEDIA TABS)
     --------------------------------------------------------- */
  projects: {
    isim: {
      tag: { en: "FLAGSHIP ENTERPRISE CASE STUDY", id: "STUDI KASUS ENTERPRISE UTAMA" },
      stamp: "SANGAT KOMPETEN",
      title: "ISIM — INVENTORY MANAGEMENT SYSTEM",
      body: {
        en: "Designed and engineered during my internship at PT. Telkom Indonesia Regional IV Semarang for the Networking Division. ISIM replaced scattered spreadsheet tracking with a role-secured Laravel & MariaDB dashboard featuring real-time stock analytics, incoming/outgoing transaction logs, CAPTCHA + email verification security, and exportable operational reports.",
        id: "Dirancang dan dibangun selama magang di PT. Telkom Indonesia Regional IV Semarang untuk Divisi Networking. ISIM menggantikan pencatatan spreadsheet manual dengan dashboard Laravel & MariaDB berkeamanan peran, analitik stok real-time, log barang masuk/keluar, CAPTCHA + verifikasi email, dan laporan operasional."
      },
      media: [
        {
          id: "ui",
          label: { en: "DASHBOARD UI", id: "UI DASHBOARD" },
          type: "image",
          src: "assets/isim-ui.jpg",
          caption: {
            en: "Clean inventory dashboard interface built for daily Networking Division operations.",
            id: "Antarmuka dashboard inventaris bersih untuk operasional harian Divisi Networking."
          }
        },
        {
          id: "desk",
          label: { en: "OFFICE DEPLOYMENT", id: "LINGKUNGAN KANTOR" },
          type: "image",
          src: "assets/isim-desk.jpg",
          caption: {
            en: "On-site development and testing environment at PT. Telkom Indonesia Regional IV Semarang.",
            id: "Lingkungan pengembangan dan pengujian langsung di PT. Telkom Indonesia Regional IV Semarang."
          }
        },
        {
          id: "team",
          label: { en: "REG IV TEAM", id: "TIM REG IV" },
          type: "image",
          src: "assets/telkom-team.jpg",
          caption: {
            en: "With the PT. Telkom Indonesia Regional IV Networking Division team (AKHLAK core values).",
            id: "Bersama tim Divisi Networking PT. Telkom Indonesia Regional IV (nilai inti AKHLAK)."
          }
        }
      ],
      archSteps: [
        { step: "01", label: "USER FLOW & WIREFRAME" },
        { step: "02", label: "MARIADB SCHEMA & AUTH" },
        { step: "03", label: "LARAVEL CRUD & CHARTS" },
        { step: "04", label: "STAFF UAT & HANDOVER" }
      ],
      specs: [
        {
          label: "CORE STACK",
          text: "Laravel (PHP), Python utilities, MariaDB relational database, responsive HTML/CSS/JS."
        },
        {
          label: "SECURITY & ACCESS",
          text: "Role-based staff permissions, login CAPTCHA protection, and email verification workflow."
        },
        {
          label: "KEY MODULES",
          text: "Master item registry, category controls, incoming/outgoing logs, and live inventory charts."
        },
        {
          label: "EVALUATION",
          text: "Rated SANGAT KOMPETEN (Very Competent) by PT. Telkom Indonesia Regional IV supervisors."
        }
      ]
    },
    ecommerce: {
      tag: { en: "RETAIL WEB ARCHITECTURE", id: "ARSITEKTUR WEB RITEL" },
      stamp: "",
      title: "APPAREL E-COMMERCE PLATFORM",
      body: {
        en: "A minimalist fashion storefront inspired by high-clarity modern retail grids. Focused on frictionless mobile browsing, clean product detail hierarchy, automated Indonesian payment gateways, and transparent live shipment tracking.",
        id: "Toko ritel pakaian minimalis yang terinspirasi grid ritel modern. Berfokus pada navigasi mobile tanpa hambatan, hierarki detail produk yang jelas, integrasi pembayaran Indonesia, dan pelacakan pengiriman langsung."
      },
      media: [],
      archSteps: [
        { step: "01", label: "CATALOG IA & GRID" },
        { step: "02", label: "CUSTOM FRONT-END" },
        { step: "03", label: "MIDTRANS / XENDIT" },
        { step: "04", label: "LIVE SHIPMENT SYNC" }
      ],
      specs: [
        {
          label: "PLATFORM",
          text: "WordPress core paired with custom HTML, CSS, and JavaScript storefront components."
        },
        {
          label: "CHECKOUT FLOW",
          text: "Integrated Midtrans, Xendit, virtual accounts, e-wallets, and manual bank transfer verification."
        },
        {
          label: "UX PRIORITY",
          text: "High-contrast size selectors, distraction-free cart drawer, and fast mobile image loading."
        },
        {
          label: "FULFILLMENT",
          text: "Automated courier rate estimation and real-time order tracking status for buyers."
        }
      ]
    }
  },

  /* ---------------------------------------------------------
     CREDENTIALS DECK (5 CARDS — UPDATE FILENAMES IF NEEDED)
     --------------------------------------------------------- */
  credentials: [
    {
      num: "01",
      accent: true,
      issuer: "PT. TELKOM INDONESIA REGIONAL IV",
      title: "INDUSTRIAL INTERNSHIP — SANGAT KOMPETEN",
      meta: "SEMARANG, INDONESIA • 2023",
      image: "assets/cert-telkom.jpg",
      fallbackLabel: "CERT_TELKOM_REG4.JPG",
      desc: {
        en: "Completed an enterprise Web Development and UI/UX internship in the Networking Division at PT. Telkom Indonesia Regional IV Semarang. Awarded the highest competency rating (Sangat Kompeten) for building and delivering the internal ISIM inventory management platform.",
        id: "Menyelesaikan magang Web Development dan UI/UX di Divisi Networking PT. Telkom Indonesia Regional IV Semarang. Meraih predikat tertinggi (Sangat Kompeten) atas pembangunan sistem manajemen inventaris internal ISIM."
      }
    },
    {
      num: "02",
      accent: false,
      issuer: "EDUCATIONAL TESTING SERVICE (ETS)",
      title: "OFFICIAL TOEIC SCORE — 905 / 990",
      meta: "LISTENING 490 • READING 415",
      image: "assets/cert-toeic.jpg",
      fallbackLabel: "CERT_TOEIC_905.JPG",
      desc: {
        en: "Achieved an official ETS TOEIC score of 905, reflecting International Professional Proficiency in English communication, technical documentation, cross-cultural collaboration, and executive presentation.",
        id: "Meraih skor resmi ETS TOEIC 905 yang mencerminkan kemahiran bahasa Inggris tingkat profesional internasional untuk komunikasi kerja, dokumentasi teknis, dan presentasi."
      }
    },
    {
      num: "03",
      accent: false,
      issuer: "OPENGAUSS / ENTERPRISE DATABASE TRACK",
      title: "DATABASE ARCHITECTURE & SQL CERTIFICATION",
      meta: "RELATIONAL SYSTEMS • DATA MODELING",
      image: "assets/cert-opengauss.jpg",
      fallbackLabel: "CERT_DATABASE.JPG",
      desc: {
        en: "Validated competency in relational database design, SQL query optimization, schema normalization, and enterprise data integrity across MariaDB and openGauss environments.",
        id: "Validasi kompetensi dalam perancangan database relasional, optimasi kueri SQL, normalisasi skema, dan integritas data pada lingkungan MariaDB serta openGauss."
      }
    },
    {
      num: "04",
      accent: false,
      issuer: "UI/UX & DIGITAL PRODUCT DESIGN",
      title: "HUMAN-COMPUTER INTERACTION & PROTOTYPING",
      meta: "FIGMA • DESIGN SYSTEMS • QOL UX",
      image: "assets/cert-uiux.jpg",
      fallbackLabel: "CERT_UIUX.JPG",
      desc: {
        en: "Specialized in user-centric interface flows, minimalist component libraries, interactive wireframing in Figma, and visual clarity focused on practical Quality of Life improvements.",
        id: "Spesialisasi dalam alur antarmuka berpusat pada pengguna, pustaka komponen minimalis, wireframing interaktif di Figma, serta kejelasan visual berbasis Quality of Life."
      }
    },
    {
      num: "05",
      accent: false,
      issuer: "INTERVOL — TELKOM UNIVERSITY PURWOKERTO",
      title: "INTERNATIONAL VOLUNTEER & EVENT LOGISTICS",
      meta: "THE INDEX • EVENT ORGANIZER DIVISION",
      image: "assets/cert-intervol.jpg",
      fallbackLabel: "CERT_INTERVOL.JPG",
      desc: {
        en: "Active Event Organizer & Logistics member for INTERVOL at Telkom University Purwokerto, coordinating international guest welcoming for The Index, equipment tracking, administration, and budget planning (RAB).",
        id: "Anggota aktif Divisi Event Organizer & Logistik INTERVOL Telkom University Purwokerto, menangani penyambutan tamu internasional The Index, pendataan barang, administrasi, dan penyusunan RAB."
      }
    }
  ],

  /* ---------------------------------------------------------
     CRT CONSOLE — 4 PLAYABLE CARTRIDGES METADATA
     --------------------------------------------------------- */
  cartridges: {
    runner: {
      id: "runner",
      slot: "CART 01",
      channel: "CH-01 // 60FPS CANVAS",
      title: "GRAVITY FLIP RUNNER",
      genre: "HIGH-FREQUENCY SYNTH PARKOUR & BLASTER",
      desc: "Flip between neon floor and ceiling rails at breakneck speed, chain mid-air flips, blast drone squadrons, and stack overdrive multipliers.",
      tags: ["SPACE / W: FLIP", "F / CLICK: BLAST", "COMBO CHAINS", "DRONE SQUADRONS"],
      bgGradient: "radial-gradient(circle at 50% 42%, #0c3554 0%, #050a14 78%)",
      accent: "#38bdf8",
      motif: [261.63, 329.63, 392.0, 523.25] // Crisp synth arpeggio
    },
    grimoire: {
      id: "grimoire",
      slot: "CART 02",
      channel: "CH-02 // 50-SPELL ENGINE",
      title: "GRIMOIRE: ABYSS",
      genre: "50-SPELL WIZARD ROGUELIKE • DUO FUSIONS • CURSED PACTS",
      desc: "Wield 50 original spells across 7 arcane schools, summon familiar squads, forge optional Duo Fusions, accept Cursed Pacts, and survive every-10-level bosses.",
      tags: ["WASD / ARROWS: MOVE", "SPACE: BLINK DASH", "50 SPELLS + FUSIONS", "BOSS EVERY 10 LVLS"],
      bgGradient: "radial-gradient(circle at 50% 42%, #3b1361 0%, #0a0612 78%)",
      accent: "#c084fc",
      motif: [220.0, 261.63, 311.13, 440.0] // Arcane minor chord
    },
    campus: {
      id: "campus",
      slot: "CART 03",
      channel: "CH-03 // FGC FRAME ENGINE",
      title: "CAMPUS COMBAT",
      genre: "6-FIGHTER CAMPUS ARCADE BRAWLER",
      desc: "Pick from 6 campus archetypes with directional specials, crouch/high guard, throws, hit-stop combos, 3-bar Super Arts, and Normal or Nightmare AI.",
      tags: ["A/D: MOVE & BLOCK", "W/S: JUMP & CROUCH", "J/K/L: LIGHT / HEAVY / SPECIAL", "6 ARCHETYPES"],
      bgGradient: "radial-gradient(circle at 50% 42%, #5c1f0e 0%, #100706 78%)",
      accent: "#fb923c",
      motif: [196.0, 246.94, 293.66, 392.0] // Punchy arcade brass
    },
    monolith: {
      id: "monolith",
      slot: "CART 04",
      channel: "CH-04 // THREE.JS WEBGL 3D",
      title: "VEIL OF THE MONOLITH",
      genre: "PS1/PS2 LOW-POLY 3D COLOSSUS CLIMBER",
      desc: "Enter The Sunken Sanctum and fell three ancient 3D Monoliths across unique arenas using Twin Chain-Blades, Crest Shield parries, and grapple climbing.",
      tags: ["WASD: MOVE • MOUSE: ORBIT", "LMB/J: CHAIN-BLADE", "RMB/SHIFT: SHIELD PARRY", "E: GRAPPLE CLIMB"],
      bgGradient: "radial-gradient(circle at 50% 42%, #0a3c30 0%, #060a0d 78%)",
      accent: "#34d399",
      motif: [146.83, 220.0, 261.63, 329.63] // Mythic orchestral fifths
    }
  },

  /* ---------------------------------------------------------
     BILINGUAL UI STRINGS (EN / ID)
     --------------------------------------------------------- */
  i18n: {
    en: {
      nav_about: "ABOUT",
      nav_education: "EDUCATION",
      nav_projects: "PROJECTS",
      nav_credentials: "CREDENTIALS",
      nav_contact: "CONTACT",
      hero_role: "UI/UX DESIGNER & PRODUCT IDEATOR",
      hero_sub:
        "INFORMATICS ENGINEERING STUDENT AT TELKOM UNIVERSITY PURWOKERTO. STRUCTURING IDEAS INTO CLEAR INTERFACES AND USABLE DIGITAL PRODUCTS.",
      hero_cta_projects: "VIEW PROJECTS",
      hero_cta_arcade: "PLAY CRT ARCADE",
      hero_cta_contact: "GET IN TOUCH",
      about_title: "ABOUT",
      portrait_hint: "SET IMAGE PATH IN DATA.JS",
      edu_title: "EDUCATION & TRACK",
      legend_industry: "INDUSTRIAL INTERNSHIP",
      open_maps: "OPEN GOOGLE MAPS",
      tile_street: "SEE OUTSIDE • STREET VIEW",
      tile_map: "PINNED MAP",
      see_photos: "SEE PHOTOS ON GOOGLE",
      projects_title: "PROJECTS",
      tag_flagship: "FLAGSHIP ENTERPRISE",
      proj_isim_desc:
        "Internal inventory management web application built during my internship for the Networking Division staff at PT. Telkom Indonesia Regional IV Semarang. Handles incoming/outgoing stock tracking, master item records, category controls, and real-time summary charts.",
      isim_proof_val: "Office Docs + Interface Gallery",
      open_case_study: "OPEN CASE STUDY & GALLERY",
      proj_ecom_desc:
        "Minimalist retail storefront inspired by clean modern apparel grids. Built with WordPress and custom front-end code, integrating real Indonesian payment gateways and live order shipment tracking.",
      read_brief: "PROJECT BRIEF",
      crt_desc:
        "Hover any cartridge below to preview its procedural synth motif, then click INSERT & PLAY to pull straight into the CRT monitor. Four completely different genres built in vanilla JavaScript, HTML5 Canvas, and Three.js WebGL.",
      cred_title: "CREDENTIALS",
      footer_semester: "5TH SEMESTER INFORMATICS ENGINEERING — TELKOM UNIVERSITY PURWOKERTO",
      footer_nav: "NAVIGATION",
      footer_contact: "DIRECT CONTACT",
      wa_cta: "DIRECT MESSAGE • PROJECTS & ENGLISH COACHING"
    },
    id: {
      nav_about: "TENTANG",
      nav_education: "PENDIDIKAN",
      nav_projects: "PROYEK",
      nav_credentials: "SERTIFIKASI",
      nav_contact: "KONTAK",
      hero_role: "DESAINER UI/UX & IDEATOR PRODUK",
      hero_sub:
        "MAHASISWA TEKNIK INFORMATIKA TELKOM UNIVERSITY PURWOKERTO. MENYUSUN IDE MENJADI ANTARMUKA JELAS DAN PRODUK DIGITAL YANG NYAMAN DIGUNAKAN.",
      hero_cta_projects: "LIHAT PROYEK",
      hero_cta_arcade: "MAIN ARCADE CRT",
      hero_cta_contact: "HUBUNGI SAYA",
      about_title: "TENTANG",
      portrait_hint: "ATUR PATH FOTO DI DATA.JS",
      edu_title: "PENDIDIKAN & REKAM JEJAK",
      legend_industry: "MAGANG INDUSTRI",
      open_maps: "BUKA GOOGLE MAPS",
      tile_street: "LIHAT LUAR • STREET VIEW",
      tile_map: "PETA LOKASI",
      see_photos: "LIHAT FOTO DI GOOGLE",
      projects_title: "PROYEK",
      tag_flagship: "PROYEK ENTERPRISE UTAMA",
      proj_isim_desc:
        "Aplikasi web manajemen inventaris internal yang dibangun saat magang untuk staf Divisi Networking PT. Telkom Indonesia Regional IV Semarang. Menangani pencatatan stok masuk/keluar, data master barang, kontrol kategori, dan grafik ringkasan real-time.",
      isim_proof_val: "Dokumentasi Kantor + Galeri UI",
      open_case_study: "BUKA STUDI KASUS & GALERI",
      proj_ecom_desc:
        "Toko ritel pakaian minimalis yang terinspirasi grid ritel modern. Dibangun dengan WordPress dan kode front-end kustom, terintegrasi dengan payment gateway Indonesia dan pelacakan pengiriman langsung.",
      read_brief: "RINGKASAN PROYEK",
      crt_desc:
        "Arahkan kursor ke cartridge di bawah untuk mendengar motif synth prosedural, lalu klik INSERT & PLAY untuk masuk ke monitor CRT. Empat genre berbeda dibangun penuh dengan JavaScript, HTML5 Canvas, dan Three.js WebGL.",
      cred_title: "SERTIFIKASI & REKOGNISI",
      footer_semester: "SEMESTER 5 TEKNIK INFORMATIKA — TELKOM UNIVERSITY PURWOKERTO",
      footer_nav: "NAVIGASI",
      footer_contact: "KONTAK LANGSUNG",
      wa_cta: "PESAN LANGSUNG • PROYEK & COACHING INGGRIS"
    }
  }
};