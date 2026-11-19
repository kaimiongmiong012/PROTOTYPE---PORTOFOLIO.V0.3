/* =========================================================
   CARTRIDGE 04: VEIL OF THE MONOLITH (V0.3 THREE.JS 3D)
   PS1/PS2 Low-Poly 3D Colossus Climber • The Sunken Sanctum
   3 Monoliths • 3 Arenas • Twin Chain-Blades • Crest Shield
   ========================================================= */

window.CRT_GAMES = window.CRT_GAMES || {};

window.CRT_GAMES.monolith = {
  mount(container, api) {
    const SAVE_KEY = "kai_v03_monolith_oath";

    function loadSave() {
      try {
        const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
        return Array.isArray(parsed.defeated) ? parsed.defeated : [];
      } catch {
        return [];
      }
    }

    function writeSave(defeated) {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ defeated }));
    }

    let defeatedList = loadSave();

    const MONOLITHS = [
      {
        id: "verdant",
        num: "I",
        name: "VERDANT, THE STEPPE SOVEREIGN",
        arena: "WINDSWEPT EMERALD STEPPE",
        archetype: "HUMANOID STONE SOVEREIGN",
        lore: "An ancient moss-draped guardian whose footsteps ripple the golden meadow. Dodge or parry its seismic stomps, grapple its knee and back sigils, and sever the first seal.",
        sky: 0x3b6e6c,
        fog: 0x4b7d75,
        ground: 0x2f6b3e,
        accent: "#34d399",
        sigilColor: 0x38bdf8,
        sigilHp: [170, 190, 210]
      },
      {
        id: "aurelia",
        num: "II",
        name: "AURELIA, THE CLOUD LEVIATHAN",
        arena: "SHATTERED CLOUD SPIRE",
        archetype: "WINGED SKY SERPENT",
        lore: "A segmented stone-and-gold wyvern circling floating temple pillars. Step onto glowing cyan updraft wind-vents to launch skyward and grapple onto its spine locks.",
        sky: 0x2b4570,
        fog: 0x5c7ea3,
        ground: 0x64748b,
        accent: "#38bdf8",
        sigilColor: 0xfbbf24,
        sigilHp: [190, 210, 230]
      },
      {
        id: "ignis",
        num: "III",
        name: "IGNIS, THE CALDERA BEHEMOTH",
        arena: "OBSIDIAN CALDERA",
        archetype: "VOLCANIC SIEGE-BEAST",
        lore: "A four-legged basalt juggernaut bound in molten chains. Time your Crest Shield Parry (RMB / Shift) to reflect its magma boulders back and expose its crown furnace.",
        sky: 0x2b1212,
        fog: 0x451a14,
        ground: 0x1f191a,
        accent: "#f97316",
        sigilColor: 0xf43f5e,
        sigilHp: [220, 240, 270]
      }
    ];

    const OILS = [
      { id: "ember", name: "CRIMSON EMBER", color: 0xf97316, hex: "#f97316", dmgMult: 1.24, speedMult: 1.0, slowBoss: 1.0 },
      { id: "gale", name: "GALE EDGE", color: 0x34d399, hex: "#34d399", dmgMult: 1.05, speedMult: 1.24, slowBoss: 1.0 },
      { id: "frost", name: "FROSTFANG", color: 0x38bdf8, hex: "#38bdf8", dmgMult: 1.08, speedMult: 1.05, slowBoss: 0.74 }
    ];

    container.innerHTML = `
      <div class="arcade-root">
        <div class="arcade-hud">
          <div class="arcade-hud-group">
            <span class="arcade-stat">
              <span class="arcade-stat-label">HP</span>
              <span class="arcade-stat-val" id="vmHp" style="color:#34d399">100 / 100</span>
            </span>
            <span class="arcade-stat">
              <span class="arcade-stat-label">GRIP</span>
              <span class="arcade-stat-val" id="vmStam" style="color:#fbbf24">100%</span>
            </span>
            <span class="arcade-stat">
              <span class="arcade-stat-label">OIL</span>
              <span class="arcade-stat-val" id="vmOil" style="color:#f97316">CRIMSON EMBER</span>
            </span>
          </div>
          <div class="arcade-hud-group">
            <span class="arcade-pill" id="vmBossStatus">SUNKEN SANCTUM • ${defeatedList.length}/3 SEALS BROKEN</span>
            <button type="button" class="touch-btn" id="vmHubBtn">SANCTUM [ESC]</button>
          </div>
        </div>

        <div class="arcade-stage" id="vmStage">
          <canvas id="vmCanvas"></canvas>

          <!-- Live In-Fight Boss Bar + Prompt Banner -->
          <div id="vmFightHud" style="position:absolute;inset:0;pointer-events:none;display:none;flex-direction:column;justify-content:space-between;padding:14px 20px;z-index:4;">
            <div style="width:min(540px,100%);margin:0 auto;text-align:center;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;font-family:Unbounded,sans-serif;font-size:0.62rem;font-weight:900;text-shadow:0 2px 6px #000;">
                <span id="vmBossName">VERDANT, THE STEPPE SOVEREIGN</span>
                <span id="vmSigilCount" style="color:#38bdf8">SIGILS: 3 LEFT</span>
              </div>
              <div style="height:10px;background:rgba(0,0,0,0.65);border:1.5px solid rgba(255,255,255,0.3);border-radius:999px;overflow:hidden;">
                <div id="vmBossHpFill" style="height:100%;width:100%;background:linear-gradient(90deg,#f43f5e,#fb923c);transition:width 0.12s linear;"></div>
              </div>
            </div>

            <div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px;">
              <div id="vmBanner" style="font-family:Unbounded,sans-serif;font-size:0.74rem;font-weight:900;color:#fef08a;text-shadow:0 2px 8px #000;min-height:20px;"></div>
              <div id="vmClimbHint" style="font-family:Unbounded,sans-serif;font-size:0.6rem;padding:5px 12px;border-radius:999px;background:rgba(6,10,16,0.78);border:1px solid rgba(100,227,219,0.5);color:#64e3db;display:none;">
                CLIMBING SIGIL — PRESS J / LMB TO CLEAVE • SPACE TO SLINGSHOT OFF
              </div>
            </div>
          </div>

          <!-- Sanctum Hub / Victory / Defeat Overlay -->
          <div class="arcade-overlay" id="vmOverlay">
            <span class="arcade-pill" style="border-color:#34d399;color:#a7f3d0;background:rgba(16,185,129,0.16)">
              CARTRIDGE 04 // THREE.JS PS1/PS2 3D ACTION-ADVENTURE
            </span>
            <h3 class="arcade-ov-title" id="vmOvTitle">VEIL OF THE MONOLITH</h3>
            <p class="arcade-ov-sub" id="vmOvSub"></p>
            <div id="vmMenuMount" style="width:100%;display:flex;flex-direction:column;align-items:center;gap:12px;"></div>
          </div>
        </div>

        <div class="arcade-controls-bar">
          <span><strong>WASD:</strong> Move &nbsp;|&nbsp; <strong>SPACE:</strong> Jump/Slingshot &nbsp;|&nbsp; <strong>LMB / J:</strong> Chain-Blades &nbsp;|&nbsp; <strong>RMB / SHIFT:</strong> Crest Shield Parry &nbsp;|&nbsp; <strong>E:</strong> Grapple Climb &nbsp;|&nbsp; <strong>Q:</strong> Lock-On &nbsp;|&nbsp; <strong>R:</strong> Oil</span>
          <div class="arcade-touch-btns">
            <button type="button" class="touch-btn" id="vmActSlash">SLASH [J]</button>
            <button type="button" class="touch-btn" id="vmActParry">PARRY [SHIFT]</button>
            <button type="button" class="touch-btn" id="vmActGrapple" style="border-color:#34d399;color:#34d399">GRAPPLE [E]</button>
            <button type="button" class="touch-btn" id="vmActOil">OIL [R]</button>
          </div>
        </div>
      </div>
    `;

    const stageEl = container.querySelector("#vmStage");
    const canvas = container.querySelector("#vmCanvas");
    const hpEl = container.querySelector("#vmHp");
    const stamEl = container.querySelector("#vmStam");
    const oilEl = container.querySelector("#vmOil");
    const bossStatusEl = container.querySelector("#vmBossStatus");
    const hubBtn = container.querySelector("#vmHubBtn");

    const fightHud = container.querySelector("#vmFightHud");
    const bossNameEl = container.querySelector("#vmBossName");
    const sigilCountEl = container.querySelector("#vmSigilCount");
    const bossHpFill = container.querySelector("#vmBossHpFill");
    const bannerEl = container.querySelector("#vmBanner");
    const climbHintEl = container.querySelector("#vmClimbHint");

    const overlay = container.querySelector("#vmOverlay");
    const ovTitle = container.querySelector("#vmOvTitle");
    const ovSub = container.querySelector("#vmOvSub");
    const menuMount = container.querySelector("#vmMenuMount");

    const sfx = {
      tone: (f, d, t, g, ef) => api && api.tone && api.tone(f, d, t, g, ef),
      noise: (d, g) => api && api.noise && api.noise(d, g)
    };

    if (!window.THREE) {
      ovTitle.textContent = "THREE.JS WEBGL REQUIRED";
      ovSub.textContent = "Could not load Three.js CDN. Check your internet connection and reload the page.";
      return { destroy() {} };
    }

    const THREE = window.THREE;
    let destroyed = false;
    let rafId = null;
    let lastTime = 0;

    // WebGL Renderer with crisp PS1/PS2 retro scaling
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(1, window.devicePixelRatio * 0.78));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.2, 240);

    function resize() {
      const rect = stageEl.getBoundingClientRect();
      const w = Math.max(320, Math.floor(rect.width));
      const h = Math.max(220, Math.floor(rect.height));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();

    // Shared World Containers
    const arenaGroup = new THREE.Group();
    const fxGroup = new THREE.Group();
    scene.add(arenaGroup);
    scene.add(fxGroup);

    const hemiLight = new THREE.HemisphereLight(0xdff5ff, 0x263226, 0.9);
    scene.add(hemiLight);
    const sunLight = new THREE.DirectionalLight(0xfff1d6, 1.15);
    sunLight.position.set(24, 42, 18);
    scene.add(sunLight);

    const keys = {};
    const mouse = { dragging: false, lastX: 0, lastY: 0 };

    const state = {
      mode: "hub", // hub | fight | victory | defeat
      activeDef: null,
      time: 0,
      hitStop: 0,
      shake: 0,
      bannerTimer: 0,
      oilIdx: 0,
      lockOn: true,
      camYaw: 0,
      camPitch: 0.26,
      hero: {
        pos: new THREE.Vector3(0, 0, 22),
        vel: new THREE.Vector3(),
        yaw: Math.PI,
        hp: 100,
        maxHp: 100,
        stam: 100,
        grounded: true,
        guarding: false,
        parryWindow: 0,
        slashTimer: 0,
        slashCd: 0,
        comboStep: 0,
        invuln: 0,
        climbingSigil: null,
        grappleTimer: 0,
        group: null,
        ponchoMat: null,
        bladeMats: [],
        shieldMesh: null,
        grappleLine: null
      },
      monolith: null, // { group, parts, sigils, pos, yaw, attackTimer, staggerTimer, shakeTimer, enraged, totalMaxHp }
      windVents: [],
      shockwaves: [],
      boulders: [],
      debris: []
    };

    function disposeGroup(grp) {
      while (grp.children.length > 0) {
        const child = grp.children[0];
        grp.remove(child);
        child.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        });
      }
    }

    function showBanner(msg, dur = 1.6) {
      bannerEl.textContent = msg;
      state.bannerTimer = dur;
    }

    /* ---------------------------------------------------------
       BUILD THE WANDERER HERO (SOTC Poncho + Link Tunic + Shield + Twin Chain-Blades)
       --------------------------------------------------------- */
    function buildHero() {
      const h = state.hero;
      if (h.group) {
        scene.remove(h.group);
      }
      const g = new THREE.Group();

      // Darkness of cloak deepens with each slain Monolith (Curse Lore!)
      const curse = defeatedList.length;
      const ponchoColors = [0xe8e3d5, 0x8b8a84, 0x3b3342, 0x150f1c];
      const ponchoColor = ponchoColors[Math.min(3, curse)];

      // Emerald Tunic Torso
      const tunicMat = new THREE.MeshStandardMaterial({ color: 0x15803d, flatShading: true, roughness: 0.8 });
      const tunic = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.56, 1.35, 6), tunicMat);
      tunic.position.y = 1.05;
      g.add(tunic);

      // Nomadic Flowing Poncho
      const ponchoMat = new THREE.MeshStandardMaterial({ color: ponchoColor, flatShading: true, roughness: 0.9 });
      h.ponchoMat = ponchoMat;
      const poncho = new THREE.Mesh(new THREE.ConeGeometry(0.68, 0.88, 6), ponchoMat);
      poncho.position.set(0, 1.38, 0.05);
      g.add(poncho);

      // Head & Hooded Tunic Cap
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xf3d2a8, flatShading: true });
      const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 0), skinMat);
      head.position.y = 1.98;
      g.add(head);

      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.65, 5), tunicMat);
      cap.position.set(0, 2.25, 0.12);
      cap.rotation.x = -0.38;
      g.add(cap);

      // Boots
      const bootMat = new THREE.MeshStandardMaterial({ color: 0x3b2618, flatShading: true });
      const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.62, 0.28), bootMat);
      legL.position.set(-0.2, 0.31, 0);
      const legR = legL.clone();
      legR.position.x = 0.2;
      g.add(legL, legR);

      // Strapped Crest Shield (Left Arm)
      const shieldMat = new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        emissive: 0x0b1f54,
        flatShading: true,
        metalness: 0.35,
        roughness: 0.5
      });
      const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.34, 0.14, 6), shieldMat);
      shield.rotation.x = Math.PI * 0.5;
      shield.position.set(-0.62, 1.25, -0.35);
      g.add(shield);
      h.shieldMesh = shield;

      // Twin Chain-Blades
      const oil = OILS[state.oilIdx];
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        emissive: curse >= 3 ? 0xa855f7 : oil.color,
        emissiveIntensity: 0.75,
        flatShading: true
      });
      h.bladeMats = [bladeMat];

      const bladeR = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 1.45), bladeMat);
      bladeR.position.set(0.62, 1.15, -0.78);
      const bladeL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.15), bladeMat);
      bladeL.position.set(-0.52, 1.05, -0.62);
      g.add(bladeR, bladeL);
      h.bladeR = bladeR;
      h.bladeL = bladeL;

      // Grapple Chain Line
      if (!h.grappleLine) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(),
          new THREE.Vector3()
        ]);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x64e3db });
        h.grappleLine = new THREE.Line(lineGeo, lineMat);
        h.grappleLine.visible = false;
        scene.add(h.grappleLine);
      }

      scene.add(g);
      h.group = g;
    }

    /* ---------------------------------------------------------
       BUILD 3D ARENA ENVIRONMENTS
       --------------------------------------------------------- */
    function buildSanctumBackdrop() {
      disposeGroup(arenaGroup);
      disposeGroup(fxGroup);
      state.monolith = null;
      state.windVents = [];

      scene.background = new THREE.Color(0x111722);
      scene.fog = new THREE.FogExp2(0x111722, 0.022);

      // Ancient Sunken Sanctum Floor & Sealed Central Monolith
      const floor = new THREE.Mesh(
        new THREE.CylinderGeometry(28, 30, 1.2, 12),
        new THREE.MeshStandardMaterial({ color: 0x262a33, flatShading: true, roughness: 0.92 })
      );
      floor.position.y = -0.6;
      arenaGroup.add(floor);

      const coreMat = new THREE.MeshStandardMaterial({
        color: defeatedList.length >= 3 ? 0x140d1e : 0x3b4252,
        emissive: defeatedList.length >= 3 ? 0xa855f7 : 0x34d399,
        emissiveIntensity: 0.45 + defeatedList.length * 0.25,
        flatShading: true
      });
      const obelisk = new THREE.Mesh(new THREE.OctahedronGeometry(3.2, 0), coreMat);
      obelisk.scale.set(0.8, 2.5, 0.8);
      obelisk.position.set(0, 6.2, 0);
      arenaGroup.add(obelisk);

      // 8 Temple Pillars
      const pilMat = new THREE.MeshStandardMaterial({ color: 0x363b45, flatShading: true });
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.15, 11, 6), pilMat);
        p.position.set(Math.cos(a) * 16, 5.5, Math.sin(a) * 16);
        arenaGroup.add(p);
      }
    }

    function buildArena(def) {
      disposeGroup(arenaGroup);
      disposeGroup(fxGroup);
      state.windVents = [];
      state.shockwaves = [];
      state.boulders = [];
      state.debris = [];

      scene.background = new THREE.Color(def.sky);
      scene.fog = new THREE.FogExp2(def.fog, 0.012);

      // Arena Ground Slab
      const groundMat = new THREE.MeshStandardMaterial({
        color: def.ground,
        flatShading: true,
        roughness: 0.94
      });
      const ground = new THREE.Mesh(new THREE.CylinderGeometry(52, 56, 2, 20), groundMat);
      ground.position.y = -1;
      arenaGroup.add(ground);

      if (def.id === "verdant") {
        // Windswept Emerald Steppe: Grass tufts, ancient arches & distant jagged peaks
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x3d8b4c, flatShading: true });
        for (let i = 0; i < 55; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = 8 + Math.random() * 38;
          const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.4, 4), grassMat);
          tuft.position.set(Math.cos(a) * r, 0.65, Math.sin(a) * r);
          tuft.rotation.z = (Math.random() - 0.5) * 0.25;
          arenaGroup.add(tuft);
        }
        const mtnMat = new THREE.MeshStandardMaterial({ color: 0x2a4544, flatShading: true });
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const peak = new THREE.Mesh(new THREE.ConeGeometry(14, 28 + Math.random() * 18, 5), mtnMat);
          peak.position.set(Math.cos(a) * 62, 12, Math.sin(a) * 62);
          arenaGroup.add(peak);
        }
      } else if (def.id === "aurelia") {
        // Shattered Cloud Spire: Floating pillars + 4 Updraft Wind-Vents!
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, flatShading: true });
        const cloudMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, flatShading: true });
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          const p = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 1.6, 12 + (i % 3) * 5, 6), stoneMat);
          p.position.set(Math.cos(a) * 34, 4, Math.sin(a) * 34);
          arenaGroup.add(p);
          const cl = new THREE.Mesh(new THREE.DodecahedronGeometry(6.5, 0), cloudMat);
          cl.position.set(Math.cos(a + 0.3) * 48, -5, Math.sin(a + 0.3) * 48);
          arenaGroup.add(cl);
        }

        // Glowing Cyan Updraft Wind-Vents (Step on to launch skyward!)
        const ventMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.75,
          transparent: true,
          opacity: 0.65,
          flatShading: true
        });
        for (let v = 0; v < 4; v++) {
          const a = (v / 4) * Math.PI * 2 + 0.4;
          const vx = Math.cos(a) * 18;
          const vz = Math.sin(a) * 18;
          const ring = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.2, 4.5, 8, 1, true), ventMat);
          ring.position.set(vx, 2.2, vz);
          arenaGroup.add(ring);
          state.windVents.push({ x: vx, z: vz, r: 3.1, mesh: ring });
        }
      } else {
        // Obsidian Caldera: Glowing magma rim & basalt spikes
        const lavaRing = new THREE.Mesh(
          new THREE.TorusGeometry(46, 4.5, 6, 24),
          new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 1.2, flatShading: true })
        );
        lavaRing.rotation.x = Math.PI * 0.5;
        lavaRing.position.y = -0.3;
        arenaGroup.add(lavaRing);

        const spikeMat = new THREE.MeshStandardMaterial({ color: 0x292524, flatShading: true });
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const sp = new THREE.Mesh(new THREE.ConeGeometry(3.4, 15 + (i % 3) * 5, 5), spikeMat);
          sp.position.set(Math.cos(a) * 42, 6.5, Math.sin(a) * 42);
          arenaGroup.add(sp);
        }
      }
    }

    /* ---------------------------------------------------------
       BUILD ARTICULATED 3D MONOLITHS + 3 GLOWING SIGIL LOCKS
       --------------------------------------------------------- */
    function makeSigilNode(parent, x, y, z, colorHex, hp, label) {
      const grp = new THREE.Group();
      grp.position.set(x, y, z);

      // Glowing Weak-Point Sigil Core
      const coreMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 1.35,
        flatShading: true
      });
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(1.15, 0), coreMat);
      grp.add(core);

      // Cursed Iron Anchor-Chain Ring locking the sigil
      const chainMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.7, roughness: 0.4, flatShading: true });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.18, 5, 8), chainMat);
      grp.add(ring);

      parent.add(grp);
      return {
        label,
        mesh: grp,
        core,
        ring,
        hp,
        maxHp: hp,
        broken: false
      };
    }

    function buildMonolith(def) {
      const root = new THREE.Group();
      const stoneMat = new THREE.MeshStandardMaterial({
        color: def.id === "ignis" ? 0x2b2424 : def.id === "aurelia" ? 0x9ca3af : 0x576158,
        flatShading: true,
        roughness: 0.88
      });
      const mossOrTrimMat = new THREE.MeshStandardMaterial({
        color: def.id === "ignis" ? 0xea580c : def.id === "aurelia" ? 0xd97706 : 0x2f7a44,
        emissive: def.id === "ignis" ? 0x9a3412 : 0x000000,
        flatShading: true
      });
      const eyeMat = new THREE.MeshStandardMaterial({
        color: def.sigilColor,
        emissive: def.sigilColor,
        emissiveIntensity: 1.8,
        flatShading: true
      });

      const sigils = [];
      const parts = {};

      if (def.id === "verdant") {
        // Towering Humanoid Stone Sovereign
        const legL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 6.2, 2.4), stoneMat);
        legL.position.set(-2.3, 3.1, 0);
        const legR = legL.clone();
        legR.position.x = 2.3;
        root.add(legL, legR);

        const torso = new THREE.Mesh(new THREE.BoxGeometry(6.8, 7.2, 4.2), stoneMat);
        torso.position.y = 9.4;
        const mossShoulder = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.8, 4.8), mossOrTrimMat);
        mossShoulder.position.y = 12.6;
        root.add(torso, mossShoulder);

        const armL = new THREE.Mesh(new THREE.BoxGeometry(2.1, 7.4, 2.2), stoneMat);
        armL.position.set(-4.8, 8.6, 0.5);
        const armR = armL.clone();
        armR.position.x = 4.8;
        root.add(armL, armR);

        const head = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.1, 3.2), stoneMat);
        head.position.y = 14.8;
        const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.4), eyeMat);
        eyeL.position.set(-0.7, 15.0, 1.55);
        const eyeR = eyeL.clone();
        eyeR.position.x = 0.7;
        root.add(head, eyeL, eyeR);

        parts.armL = armL;
        parts.armR = armR;
        parts.legL = legL;
        parts.legR = legR;
        parts.torso = torso;

        sigils.push(makeSigilNode(legR, 0, 0.6, 1.35, def.sigilColor, def.sigilHp[0], "KNEE LOCK"));
        sigils.push(makeSigilNode(torso, 0, 0.8, -2.35, def.sigilColor, def.sigilHp[1], "SPINE SEAL"));
        sigils.push(makeSigilNode(head, 0, 1.85, 0, def.sigilColor, def.sigilHp[2], "CROWN SIGIL"));
        root.position.set(0, 0, -14);
      } else if (def.id === "aurelia") {
        // Segmented Sky Serpent Leviathan
        const segs = [];
        for (let i = 0; i < 6; i++) {
          const size = 3.2 - i * 0.32;
          const seg = new THREE.Mesh(
            new THREE.OctahedronGeometry(size, 0),
            i % 2 === 0 ? stoneMat : mossOrTrimMat
          );
          seg.position.set(0, 0, -i * 4.2);
          root.add(seg);
          segs.push(seg);
        }
        // Broad Stone Wings on Segment 1
        const wingL = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.55, 4.2), mossOrTrimMat);
        wingL.position.set(-6.2, 0.4, -3.5);
        const wingR = wingL.clone();
        wingR.position.x = 6.2;
        root.add(wingL, wingR);

        const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.6), eyeMat);
        eyeL.position.set(-1.1, 0.6, 2.4);
        const eyeR = eyeL.clone();
        eyeR.position.x = 1.1;
        root.add(eyeL, eyeR);

        parts.segs = segs;
        parts.wingL = wingL;
        parts.wingR = wingR;

        sigils.push(makeSigilNode(segs[4], 0, 1.9, 0, def.sigilColor, def.sigilHp[0], "TAIL RING"));
        sigils.push(makeSigilNode(segs[2], 0, 2.6, 0, def.sigilColor, def.sigilHp[1], "SPINE LOCK"));
        sigils.push(makeSigilNode(segs[0], 0, 3.0, 0, def.sigilColor, def.sigilHp[2], "SKY CREST"));
        root.position.set(0, 11.5, -18);
      } else {
        // Ignis: Four-Legged Volcanic Siege-Behemoth
        const body = new THREE.Mesh(new THREE.BoxGeometry(8.5, 5.2, 11.5), stoneMat);
        body.position.y = 6.8;
        const furnace = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 2.4, 7), mossOrTrimMat);
        furnace.position.set(0, 10.2, -1);
        root.add(body, furnace);

        const legCoords = [
          [-3.8, 2.8, 4.2],
          [3.8, 2.8, 4.2],
          [-3.8, 2.8, -4.2],
          [3.8, 2.8, -4.2]
        ];
        parts.legs = legCoords.map(([lx, ly, lz]) => {
          const lg = new THREE.Mesh(new THREE.BoxGeometry(2.2, 5.6, 2.4), stoneMat);
          lg.position.set(lx, ly, lz);
          root.add(lg);
          return lg;
        });

        const head = new THREE.Mesh(new THREE.BoxGeometry(4.4, 3.4, 4.2), stoneMat);
        head.position.set(0, 7.2, 7.2);
        const eye = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.55, 0.5), eyeMat);
        eye.position.set(0, 7.6, 9.3);
        root.add(head, eye);
        parts.head = head;

        sigils.push(makeSigilNode(parts.legs[0], -1.2, 0.2, 0.8, def.sigilColor, def.sigilHp[0], "FRONT ANCHOR"));
        sigils.push(makeSigilNode(furnace, 0, 1.5, 0, def.sigilColor, def.sigilHp[1], "FURNACE CORE"));
        sigils.push(makeSigilNode(head, 0, 2.1, 0.4, def.sigilColor, def.sigilHp[2], "CALDERA CROWN"));
        root.position.set(0, 0, -16);
      }

      arenaGroup.add(root);
      const totalMaxHp = def.sigilHp.reduce((a, b) => a + b, 0);

      state.monolith = {
        def,
        group: root,
        parts,
        sigils,
        pos: root.position,
        yaw: 0,
        orbitAngle: 0,
        attackTimer: 2.2,
        staggerTimer: 0,
        shakeTimer: 0,
        enraged: false,
        totalMaxHp
      };
    }

    function spawnDebris(worldPos, colorHex, count = 12) {
      const mat = new THREE.MeshStandardMaterial({ color: colorHex, flatShading: true });
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), mat);
        mesh.position.copy(worldPos);
        fxGroup.add(mesh);
        state.debris.push({
          mesh,
          vel: new THREE.Vector3(
            (Math.random() - 0.5) * 16,
            6 + Math.random() * 12,
            (Math.random() - 0.5) * 16
          ),
          life: 0.9 + Math.random() * 0.5
        });
      }
    }

    function spawnShockwave(x, z, colorHex, maxR = 26) {
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.8, 1.8, 24), mat);
      ring.rotation.x = -Math.PI * 0.5;
      ring.position.set(x, 0.35, z);
      fxGroup.add(ring);
      state.shockwaves.push({ mesh: ring, r: 1.5, maxR, hit: false });
      sfx.noise(0.18, 0.11);
      sfx.tone(85, 0.25, "sawtooth", 0.09, 45);
    }

    function spawnBoulder(origin, targetPos, colorHex) {
      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.9,
        flatShading: true
      });
      const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 0), mat);
      mesh.position.copy(origin);
      fxGroup.add(mesh);

      const dir = new THREE.Vector3().subVectors(targetPos, origin).normalize();
      state.boulders.push({
        mesh,
        vel: dir.multiplyScalar(22),
        reflected: false,
        life: 4.5
      });
      sfx.tone(180, 0.14, "sawtooth", 0.08, 95);
    }

    /* ---------------------------------------------------------
       THE SUNKEN SANCTUM HUB OVERLAY & LORE
       --------------------------------------------------------- */
    function openSanctumHub(customTitle = "", customSub = "") {
      state.mode = "hub";
      fightHud.style.display = "none";
      if (state.hero.grappleLine) state.hero.grappleLine.visible = false;
      buildSanctumBackdrop();
      buildHero();

      const count = defeatedList.length;
      bossStatusEl.textContent = `SUNKEN SANCTUM • ${count}/3 SEALS BROKEN`;

      if (customTitle) {
        ovTitle.textContent = customTitle;
        ovSub.textContent = customSub;
      } else if (count >= 3) {
        ovTitle.textContent = "THE VEIL IS TORN — SANCTUM AWAKENED";
        ovSub.textContent =
          "All three Monoliths have fallen. Shadow coils around your Wanderer's cloak—the Core was never imprisoned to suffer; it was sealed away from the world. Replay any Monolith below with full Void-infused Chain-Blades.";
      } else {
        const curseLore = [
          "You awaken inside The Sunken Sanctum. Three ancient Monoliths hold the iron seals binding the Sanctum Core. Sever all three to lift the Veil.",
          "One seal shattered. A dark tendril now clings to your cloak, empowering your Twin Chain-Blades (+18% Void Power). Two Monoliths remain.",
          "Two seals broken. Your cloak turns to ash and shadow (+35% Void Power). Only one Monolith still stands between you and the Core's truth."
        ];
        ovTitle.textContent = "VEIL OF THE MONOLITH // THE SUNKEN SANCTUM";
        ovSub.textContent = curseLore[count];
      }

      const cards = MONOLITHS.map((m) => {
        const done = defeatedList.includes(m.id);
        return `
          <button type="button" class="draft-card" data-enter-arena="${m.id}" style="border-color:${done ? "#34d399" : m.accent}">
            <span class="draft-badge" style="color:${m.accent}">MONOLITH ${m.num} • ${m.arena}</span>
            <h4 class="draft-name">${m.name}</h4>
            <p class="draft-desc">${m.lore}</p>
            <span class="draft-badge" style="color:${done ? "#34d399" : "#fbbf24"}">
              ${done ? "✓ SEAL SEVERED — REPLAY HUNT" : "▶ ENTER ARENA"}
            </span>
          </button>
        `;
      }).join("");

      menuMount.innerHTML = `
        <div class="monolith-arena-grid">${cards}</div>
        ${
          count > 0
            ? `<div class="arcade-btn-row"><button type="button" class="arcade-btn arcade-btn--ghost" id="vmResetOathBtn">RESET SANCTUM OATH</button></div>`
            : ""
        }
      `;

      menuMount.querySelectorAll("[data-enter-arena]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const def = MONOLITHS.find((x) => x.id === btn.dataset.enterArena);
          if (def) startArenaFight(def);
        });
      });

      const resetBtn = menuMount.querySelector("#vmResetOathBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          defeatedList = [];
          writeSave(defeatedList);
          openSanctumHub();
        });
      }

      overlay.classList.remove("hidden");
    }

    function startArenaFight(def) {
      state.activeDef = def;
      state.mode = "fight";
      state.hitStop = 0;
      state.shake = 0;

      buildArena(def);
      buildMonolith(def);
      buildHero();

      const h = state.hero;
      h.pos.set(0, 0, 24);
      h.vel.set(0, 0, 0);
      h.yaw = Math.PI;
      h.hp = 100;
      h.maxHp = 100;
      h.stam = 100;
      h.grounded = true;
      h.guarding = false;
      h.climbingSigil = null;
      h.invuln = 0;
      state.lockOn = true;

      bossNameEl.textContent = def.name;
      bossStatusEl.textContent = `${def.arena}`;
      fightHud.style.display = "flex";
      climbHintEl.style.display = "none";
      overlay.classList.add("hidden");

      showBanner(`${def.name} AWAKENS!`, 2.4);
      sfx.tone(130, 0.25, "sawtooth", 0.09, 90);
      updateHud();
    }

    function cycleOil() {
      state.oilIdx = (state.oilIdx + 1) % OILS.length;
      const oil = OILS[state.oilIdx];
      oilEl.textContent = oil.name;
      oilEl.style.color = oil.hex;
      state.hero.bladeMats.forEach((m) => m.emissive.setHex(oil.color));
      showBanner(`WHETSTONE: ${oil.name}`, 1.2);
      sfx.tone(540, 0.08, "triangle", 0.06, 780);
    }

    function triggerGrapple() {
      if (state.mode !== "fight" || !state.monolith) return;
      const h = state.hero;

      if (h.climbingSigil) {
        // Release & Slingshot Jump!
        h.climbingSigil = null;
        h.vel.y = 14.5;
        h.grounded = false;
        climbHintEl.style.display = "none";
        showBanner("CHAIN SLINGSHOT!", 0.9);
        sfx.tone(420, 0.08, "triangle", 0.06, 760);
        return;
      }

      if (h.stam < 18) {
        showBanner("LOW GRIP STAMINA!", 0.8);
        return;
      }

      // Find nearest unbroken sigil within generous grapple range
      let best = null;
      let bestDist = 24;
      const tmp = new THREE.Vector3();
      state.monolith.sigils.forEach((sig) => {
        if (sig.broken) return;
        sig.mesh.getWorldPosition(tmp);
        const d = tmp.distanceTo(h.pos);
        if (d < bestDist) {
          bestDist = d;
          best = sig;
        }
      });

      if (best) {
        h.climbingSigil = best;
        h.grappleTimer = 0.24;
        h.vel.set(0, 0, 0);
        h.grounded = false;
        climbHintEl.style.display = "inline-block";
        showBanner(`LATCHED ONTO ${best.label}!`, 1.2);
        sfx.tone(320, 0.1, "square", 0.07, 680);
      } else {
        showBanner("MOVE CLOSER (OR USE WIND-VENT) TO GRAPPLE!", 1.1);
      }
    }

    function triggerSlash() {
      if (state.mode !== "fight" || !state.monolith) return;
      const h = state.hero;
      if (h.slashCd > 0) return;

      const oil = OILS[state.oilIdx];
      const curseBonus = 1 + defeatedList.length * 0.18;
      h.comboStep = (h.comboStep + 1) % 4;
      h.slashTimer = 0.18;
      h.slashCd = (h.comboStep === 3 ? 0.34 : 0.2) / oil.speedMult;

      const baseDmg = (h.comboStep === 3 ? 46 : 26) * oil.dmgMult * curseBonus;
      sfx.tone(h.comboStep === 3 ? 260 : 440, 0.07, "sawtooth", 0.06, 160);

      // If climbing, cleave the latched sigil directly!
      if (h.climbingSigil && !h.climbingSigil.broken) {
        damageSigil(h.climbingSigil, baseDmg * 1.28);
        return;
      }

      // Ground / Aerial slash check against any close unbroken sigil
      const tmp = new THREE.Vector3();
      for (const sig of state.monolith.sigils) {
        if (sig.broken) continue;
        sig.mesh.getWorldPosition(tmp);
        if (tmp.distanceTo(h.pos) < 6.4) {
          damageSigil(sig, baseDmg);
          break;
        }
      }
    }

    function damageSigil(sig, amount) {
      sig.hp = Math.max(0, sig.hp - amount);
      state.hitStop = 0.05;
      state.shake = Math.max(state.shake, 0.32);

      const wp = new THREE.Vector3();
      sig.mesh.getWorldPosition(wp);
      spawnDebris(wp, state.activeDef.sigilColor, 4);

      if (sig.hp <= 0 && !sig.broken) {
        sig.broken = true;
        sig.mesh.visible = false;
        state.hitStop = 0.16;
        state.shake = 0.85;
        spawnDebris(wp, state.activeDef.sigilColor, 20);
        spawnDebris(wp, 0x576158, 12);
        sfx.noise(0.24, 0.14);
        sfx.tone(520, 0.22, "triangle", 0.1, 220);

        // Eject hero gracefully if climbing broken sigil
        if (state.hero.climbingSigil === sig) {
          state.hero.climbingSigil = null;
          state.hero.vel.y = 12;
          climbHintEl.style.display = "none";
        }

        const remaining = state.monolith.sigils.filter((s) => !s.broken).length;
        if (remaining === 0) {
          onMonolithSlain();
        } else {
          state.monolith.enraged = true;
          showBanner(`${sig.label} SHATTERED! (${remaining} SEALS LEFT)`, 2.0);
        }
      }
      updateHud();
    }

    function onMonolithSlain() {
      const def = state.activeDef;
      if (!defeatedList.includes(def.id)) {
        defeatedList.push(def.id);
        writeSave(defeatedList);
      }
      state.mode = "victory";
      sfx.tone(220, 0.18, "triangle", 0.1, 440);
      sfx.tone(330, 0.35, "triangle", 0.1, 660);

      setTimeout(() => {
        if (destroyed) return;
        openSanctumHub(
          `${def.name} VANQUISHED`,
          `The iron anchor-chains dissolve into ash. Dark energy winds across your cloak (${defeatedList.length}/3 Seals Severed).`
        );
      }, 1200);
    }

    function damageHero(amount, knockFrom) {
      const h = state.hero;
      if (h.invuln > 0) return;

      // Timed Crest Shield Parry!
      if (h.parryWindow > 0) {
        state.hitStop = 0.12;
        state.shake = 0.45;
        h.stam = Math.min(100, h.stam + 35);
        if (state.monolith) state.monolith.staggerTimer = 2.6;
        showBanner("PERFECT CREST PARRY! MONOLITH STAGGERED!", 1.8);
        sfx.tone(860, 0.14, "triangle", 0.11, 520);
        return;
      }

      if (h.guarding && h.stam > 12) {
        h.stam = Math.max(0, h.stam - 22);
        h.hp = Math.max(1, h.hp - Math.round(amount * 0.25));
        showBanner("SHIELD BLOCKED!", 0.9);
        sfx.tone(280, 0.08, "square", 0.07, 190);
        updateHud();
        return;
      }

      h.hp = Math.max(0, h.hp - amount);
      h.invuln = 0.85;
      state.shake = 0.6;
      if (h.climbingSigil) {
        h.climbingSigil = null;
        climbHintEl.style.display = "none";
      }
      if (knockFrom) {
        const push = new THREE.Vector3().subVectors(h.pos, knockFrom).setY(0).normalize();
        h.vel.x = push.x * 16;
        h.vel.z = push.z * 16;
        h.vel.y = 7;
        h.grounded = false;
      }
      sfx.noise(0.14, 0.1);
      updateHud();

      if (h.hp <= 0) {
        state.mode = "defeat";
        openSanctumHub(
          "FALLEN BEFORE THE MONOLITH",
          `${state.activeDef.name} overwhelmed your Wanderer. Return to the arena and use Crest Shield Parries [RMB / SHIFT] and Grapple Climbing [E].`
        );
      }
    }

    function updateHud() {
      const h = state.hero;
      hpEl.textContent = `${Math.ceil(h.hp)} / ${h.maxHp}`;
      stamEl.textContent = `${Math.round(h.stam)}%`;

      if (state.monolith) {
        const curHp = state.monolith.sigils.reduce((sum, s) => sum + Math.max(0, s.hp), 0);
        const rem = state.monolith.sigils.filter((s) => !s.broken).length;
        bossHpFill.style.width = `${Math.max(0, (curHp / state.monolith.totalMaxHp) * 100)}%`;
        sigilCountEl.textContent = `SIGILS: ${rem} LEFT`;
      }
    }

    function update(dt) {
      state.time += dt;

      // Hub camera gentle orbit
      if (state.mode !== "fight") {
        camera.position.set(
          Math.cos(state.time * 0.25) * 24,
          10 + Math.sin(state.time * 0.5) * 1.4,
          Math.sin(state.time * 0.25) * 24
        );
        camera.lookAt(0, 5, 0);
        return;
      }

      if (state.bannerTimer > 0) {
        state.bannerTimer -= dt;
        if (state.bannerTimer <= 0) bannerEl.textContent = "";
      }

      if (state.hitStop > 0) {
        state.hitStop -= dt;
        return;
      }

      if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 2.4);

      const h = state.hero;
      const m = state.monolith;
      const oil = OILS[state.oilIdx];

      if (h.invuln > 0) h.invuln = Math.max(0, h.invuln - dt);
      if (h.parryWindow > 0) h.parryWindow = Math.max(0, h.parryWindow - dt);
      if (h.slashCd > 0) h.slashCd = Math.max(0, h.slashCd - dt);
      if (h.slashTimer > 0) h.slashTimer = Math.max(0, h.slashTimer - dt);
      if (h.grappleTimer > 0) h.grappleTimer = Math.max(0, h.grappleTimer - dt);

      // Camera-relative movement input
      let inX = 0;
      let inZ = 0;
      if (keys.KeyW || keys.ArrowUp) inZ -= 1;
      if (keys.KeyS || keys.ArrowDown) inZ += 1;
      if (keys.KeyA || keys.ArrowLeft) inX -= 1;
      if (keys.KeyD || keys.ArrowRight) inX += 1;

      if (h.climbingSigil) {
        // Attached to Monolith Weak Point!
        const sigPos = new THREE.Vector3();
        h.climbingSigil.mesh.getWorldPosition(sigPos);
        const offset = new THREE.Vector3(0, 0.3, 1.8).applyAxisAngle(new THREE.Vector3(0, 1, 0), m.yaw);
        h.pos.lerp(sigPos.clone().add(offset), Math.min(1, dt * 14));
        h.stam = Math.max(0, h.stam - (m.shakeTimer > 0 ? 26 : 11) * dt);

        if (h.grappleLine) {
          h.grappleLine.visible = true;
          h.grappleLine.geometry.setFromPoints([
            h.pos.clone().add(new THREE.Vector3(0, 1.3, 0)),
            sigPos
          ]);
        }

        if (h.stam <= 0) {
          h.climbingSigil = null;
          h.vel.y = 8;
          climbHintEl.style.display = "none";
          showBanner("GRIP BROKEN! RECOVER STAMINA!", 1.2);
        }
      } else {
        if (h.grappleLine) h.grappleLine.visible = false;
        h.stam = Math.min(100, h.stam + (h.guarding ? 8 : 26) * dt);

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        const moveVec = new THREE.Vector3();
        moveVec.addScaledVector(forward, -inZ);
        moveVec.addScaledVector(right, inX);
        if (moveVec.lengthSq() > 0.01) {
          moveVec.normalize();
          const speed = (h.guarding ? 6.5 : 13.5) * oil.speedMult;
          h.vel.x = THREE.MathUtils.lerp(h.vel.x, moveVec.x * speed, Math.min(1, dt * 10));
          h.vel.z = THREE.MathUtils.lerp(h.vel.z, moveVec.z * speed, Math.min(1, dt * 10));
          h.yaw = Math.atan2(-moveVec.x, -moveVec.z);
        } else if (h.grounded) {
          h.vel.x *= Math.pow(0.002, dt);
          h.vel.z *= Math.pow(0.002, dt);
        }

        h.vel.y -= 32 * dt;
        h.pos.addScaledVector(h.vel, dt);

        if (h.pos.y <= 0) {
          h.pos.y = 0;
          h.vel.y = 0;
          h.grounded = true;
        }

        // Arena boundary clamp
        const rad = Math.hypot(h.pos.x, h.pos.z);
        if (rad > 44) {
          h.pos.x = (h.pos.x / rad) * 44;
          h.pos.z = (h.pos.z / rad) * 44;
        }

        // Updraft Wind-Vents in Aurelia's Cloud Spire!
        state.windVents.forEach((v) => {
          v.mesh.rotation.y += dt * 3;
          if (Math.hypot(h.pos.x - v.x, h.pos.z - v.z) < v.r && h.pos.y < 14) {
            h.vel.y = 22;
            h.grounded = false;
            showBanner("UPDRAFT LAUNCH! PRESS [E] TO GRAPPLE AURELIA!", 1.1);
            sfx.tone(320, 0.14, "sine", 0.06, 860);
          }
        });
      }

      // Hero Mesh Animation
      h.group.position.copy(h.pos);
      h.group.rotation.y = h.yaw;
      if (h.shieldMesh) {
        h.shieldMesh.position.z = h.guarding ? -0.72 : -0.35;
        h.shieldMesh.material.emissiveIntensity = h.parryWindow > 0 ? 1.8 : h.guarding ? 0.9 : 0.25;
      }
      if (h.bladeR && h.bladeL) {
        const swing = h.slashTimer > 0 ? Math.sin((h.slashTimer / 0.18) * Math.PI) * 1.6 : 0;
        h.bladeR.rotation.y = -swing;
        h.bladeL.rotation.y = swing;
      }

      // Monolith AI & Procedural Limb Animation
      const bossSpeed = (m.enraged ? 1.25 : 1.0) * oil.slowBoss;
      if (m.staggerTimer > 0) {
        m.staggerTimer -= dt;
        m.group.rotation.z = Math.sin(state.time * 18) * 0.06;
      } else {
        m.group.rotation.z = 0;
        const dx = h.pos.x - m.pos.x;
        const dz = h.pos.z - m.pos.z;
        const dist = Math.hypot(dx, dz);

        if (m.def.id === "verdant") {
          m.yaw = Math.atan2(dx, dz);
          m.group.rotation.y = m.yaw;
          if (dist > 11 && !h.climbingSigil) {
            m.pos.x += (dx / dist) * 4.4 * bossSpeed * dt;
            m.pos.z += (dz / dist) * 4.4 * bossSpeed * dt;
          }
          // Procedural heavy stride & arm sway
          const stride = Math.sin(state.time * 3.1 * bossSpeed);
          m.parts.legL.rotation.x = stride * 0.28;
          m.parts.legR.rotation.x = -stride * 0.28;
          m.parts.armL.rotation.x = -stride * 0.35;
          m.parts.armR.rotation.x = stride * 0.35;
        } else if (m.def.id === "aurelia") {
          // Graceful soaring circle around the Cloud Spire
          m.orbitAngle += dt * 0.58 * bossSpeed;
          const ox = Math.cos(m.orbitAngle) * 18;
          const oz = Math.sin(m.orbitAngle) * 18;
          const oy = 9.5 + Math.sin(state.time * 1.6) * 3.5;
          m.yaw = Math.atan2(ox - m.pos.x, oz - m.pos.z);
          m.pos.set(ox, oy, oz);
          m.group.rotation.y = m.yaw;
          m.parts.wingL.rotation.z = Math.sin(state.time * 4.5) * 0.38;
          m.parts.wingR.rotation.z = -Math.sin(state.time * 4.5) * 0.38;
        } else {
          // Ignis: Slow, ominous volcanic behemoth
          m.yaw = Math.atan2(dx, dz);
          m.group.rotation.y = m.yaw;
          if (dist > 15 && !h.climbingSigil) {
            m.pos.x += (dx / dist) * 3.6 * bossSpeed * dt;
            m.pos.z += (dz / dist) * 3.6 * bossSpeed * dt;
          }
          m.parts.legs.forEach((lg, idx) => {
            lg.rotation.x = Math.sin(state.time * 2.6 + idx * Math.PI * 0.5) * 0.24;
          });
        }

        // Boss Attack Cadence
        m.attackTimer -= dt * bossSpeed;
        if (m.attackTimer <= 0) {
          m.attackTimer = m.enraged ? 2.6 : 3.5;

          if (h.climbingSigil) {
            // Shake off the climber!
            m.shakeTimer = 1.25;
            showBanner("MONOLITH SHAKING — WATCH YOUR GRIP!", 1.2);
            sfx.noise(0.16, 0.1);
          } else if (m.def.id === "verdant") {
            spawnShockwave(m.pos.x, m.pos.z, 0x38bdf8, 28);
          } else if (m.def.id === "aurelia") {
            const origin = m.pos.clone();
            spawnBoulder(origin, h.pos.clone().add(new THREE.Vector3(0, 1.2, 0)), 0xfbbf24);
          } else {
            // Ignis launches parryable molten boulder + occasional quake
            if (Math.random() < 0.65) {
              const origin = m.pos.clone().add(new THREE.Vector3(0, 7.5, 0));
              spawnBoulder(origin, h.pos.clone().add(new THREE.Vector3(0, 1.2, 0)), 0xf97316);
              showBanner("MOLTEN BOULDER! TIME PARRY [RMB/SHIFT] TO REFLECT!", 1.4);
            } else {
              spawnShockwave(m.pos.x, m.pos.z, 0xf43f5e, 32);
            }
          }
        }
      }

      if (m.shakeTimer > 0) {
        m.shakeTimer -= dt;
        m.group.rotation.z = Math.sin(state.time * 26) * 0.08;
      }

      // Pulse Sigil Cores
      m.sigils.forEach((s) => {
        if (!s.broken) {
          s.core.rotation.y += dt * 2.4;
          s.ring.rotation.x += dt * 1.4;
        }
      });

      // Update Shockwave Rings
      for (let i = state.shockwaves.length - 1; i >= 0; i--) {
        const sw = state.shockwaves[i];
        sw.r += 22 * dt;
        sw.mesh.scale.setScalar(sw.r);
        sw.mesh.material.opacity = Math.max(0, 1 - sw.r / sw.maxR);

        if (!sw.hit && h.pos.y < 1.8 && !h.climbingSigil) {
          const d = Math.hypot(h.pos.x - sw.mesh.position.x, h.pos.z - sw.mesh.position.z);
          if (Math.abs(d - sw.r * 1.25) < 2.2) {
            sw.hit = true;
            damageHero(18, sw.mesh.position);
          }
        }
        if (sw.r >= sw.maxR) {
          fxGroup.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          sw.mesh.material.dispose();
          state.shockwaves.splice(i, 1);
        }
      }

      // Update Molten / Sky Boulders (Parryable!)
      for (let i = state.boulders.length - 1; i >= 0; i--) {
        const b = state.boulders[i];
        b.life -= dt;
        b.mesh.position.addScaledVector(b.vel, dt);
        b.mesh.rotation.x += dt * 5;

        if (!b.reflected && b.mesh.position.distanceTo(h.pos.clone().add(new THREE.Vector3(0, 1.2, 0))) < 2.5) {
          if (h.parryWindow > 0 || h.guarding) {
            // Reflect straight back at the Monolith!
            b.reflected = true;
            b.vel.copy(m.pos.clone().add(new THREE.Vector3(0, 6, 0)).sub(b.mesh.position).normalize().multiplyScalar(36));
            state.hitStop = 0.09;
            showBanner("BOULDER PARRIED BACK AT MONOLITH!", 1.5);
            sfx.tone(880, 0.14, "triangle", 0.11, 460);
          } else {
            damageHero(22, b.mesh.position);
            b.life = 0;
          }
        } else if (b.reflected && b.mesh.position.distanceTo(m.pos.clone().add(new THREE.Vector3(0, 6, 0))) < 7.5) {
          // Reflected boulder staggers Monolith & damages first unbroken sigil!
          m.staggerTimer = 3.2;
          const activeSig = m.sigils.find((s) => !s.broken);
          if (activeSig) damageSigil(activeSig, 65);
          showBanner("DIRECT REFLECT! MONOLITH STAGGERED — GRAPPLE [E]!", 1.8);
          b.life = 0;
        }

        if (b.life <= 0 || b.mesh.position.y < -1) {
          fxGroup.remove(b.mesh);
          b.mesh.geometry.dispose();
          b.mesh.material.dispose();
          state.boulders.splice(i, 1);
        }
      }

      // Update Shattered Stone Debris
      for (let i = state.debris.length - 1; i >= 0; i--) {
        const db = state.debris[i];
        db.life -= dt;
        db.vel.y -= 28 * dt;
        db.mesh.position.addScaledVector(db.vel, dt);
        db.mesh.rotation.x += dt * 6;
        db.mesh.rotation.y += dt * 5;
        if (db.life <= 0) {
          fxGroup.remove(db.mesh);
          db.mesh.geometry.dispose();
          state.debris.splice(i, 1);
        }
      }

      // Cinematic Third-Person Camera (Lock-On or Free Orbit)
      if (state.lockOn && m) {
        const toBoss = new THREE.Vector3().subVectors(m.pos, h.pos);
        const targetYaw = Math.atan2(-toBoss.x, -toBoss.z);
        state.camYaw = THREE.MathUtils.lerp(state.camYaw, targetYaw, Math.min(1, dt * 4.5));
      }

      const camDist = h.climbingSigil ? 13 : 15;
      const camX = h.pos.x + Math.sin(state.camYaw) * camDist;
      const camZ = h.pos.z + Math.cos(state.camYaw) * camDist;
      const camY = Math.max(2.6, h.pos.y + 4.8 + state.camPitch * 8);

      camera.position.lerp(new THREE.Vector3(camX, camY, camZ), Math.min(1, dt * 8));
      if (state.shake > 0.02) {
        camera.position.x += (Math.random() - 0.5) * state.shake;
        camera.position.y += (Math.random() - 0.5) * state.shake;
      }

      const lookTarget = state.lockOn && m
        ? h.pos.clone().lerp(m.pos.clone().add(new THREE.Vector3(0, 6.5, 0)), 0.45)
        : h.pos.clone().add(new THREE.Vector3(0, 2.2, 0));
      camera.lookAt(lookTarget);

      updateHud();
    }

    function loop(ts) {
      if (destroyed) return;
      const dt = Math.min(0.035, (ts - lastTime) / 1000 || 0.016);
      lastTime = ts;
      update(dt);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(loop);
    }

    function startGuard() {
      if (state.mode !== "fight") return;
      if (!state.hero.guarding) {
        state.hero.guarding = true;
        state.hero.parryWindow = 0.28; // Generous timed Crest Parry window
      }
    }

    function stopGuard() {
      state.hero.guarding = false;
    }

    function onKeyDown(e) {
      if (e.repeat) return;
      keys[e.code] = true;

      if (e.code === "Escape" && state.mode === "fight") {
        openSanctumHub();
        return;
      }
      if (state.mode !== "fight") return;

      if (e.code === "Space") {
        e.preventDefault();
        if (state.hero.climbingSigil) {
          triggerGrapple();
        } else if (state.hero.grounded) {
          state.hero.vel.y = 13.5;
          state.hero.grounded = false;
          sfx.tone(240, 0.07, "sine", 0.04, 380);
        }
      } else if (e.code === "KeyJ") {
        triggerSlash();
      } else if (e.code === "KeyE") {
        triggerGrapple();
      } else if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        startGuard();
      } else if (e.code === "KeyQ" || e.code === "Tab") {
        e.preventDefault();
        state.lockOn = !state.lockOn;
        showBanner(state.lockOn ? "CAMERA LOCK-ON: ENGAGED" : "CAMERA: FREE ORBIT", 1.0);
      } else if (e.code === "KeyR") {
        cycleOil();
      }
    }

    function onKeyUp(e) {
      keys[e.code] = false;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") stopGuard();
    }

    function onPointerDown(e) {
      if (state.mode !== "fight") return;
      if (e.button === 2) {
        startGuard();
      } else if (e.button === 0) {
        mouse.dragging = true;
        mouse.lastX = e.clientX;
        mouse.lastY = e.clientY;
        triggerSlash();
      }
    }

    function onPointerMove(e) {
      if (!mouse.dragging || state.mode !== "fight") return;
      const dx = e.clientX - mouse.lastX;
      const dy = e.clientY - mouse.lastY;
      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;
      if (!state.lockOn) {
        state.camYaw -= dx * 0.008;
        state.camPitch = Math.max(-0.1, Math.min(0.65, state.camPitch + dy * 0.004));
      }
    }

    function onPointerUp(e) {
      if (e.button === 2) stopGuard();
      mouse.dragging = false;
    }

    function onContextMenu(e) {
      e.preventDefault();
    }

    hubBtn.addEventListener("click", () => openSanctumHub());
    container.querySelector("#vmActSlash").addEventListener("pointerdown", (e) => {
      e.preventDefault();
      triggerSlash();
    });
    const parryBtn = container.querySelector("#vmActParry");
    parryBtn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      startGuard();
    });
    parryBtn.addEventListener("pointerup", stopGuard);
    parryBtn.addEventListener("pointerleave", stopGuard);
    container.querySelector("#vmActGrapple").addEventListener("pointerdown", (e) => {
      e.preventDefault();
      triggerGrapple();
    });
    container.querySelector("#vmActOil").addEventListener("pointerdown", (e) => {
      e.preventDefault();
      cycleOil();
    });

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", resize);

    openSanctumHub();
    lastTime = performance.now();
    rafId = requestAnimationFrame(loop);

    return {
      destroy() {
        destroyed = true;
        if (rafId) cancelAnimationFrame(rafId);
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("contextmenu", onContextMenu);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("resize", resize);

        disposeGroup(arenaGroup);
        disposeGroup(fxGroup);
        if (state.hero.group) scene.remove(state.hero.group);
        if (state.hero.grappleLine) {
          scene.remove(state.hero.grappleLine);
          state.hero.grappleLine.geometry.dispose();
          state.hero.grappleLine.material.dispose();
        }
        renderer.dispose();
      }
    };
  }
};