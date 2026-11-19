/* =========================================================
   CARTRIDGE 03: CAMPUS COMBAT (V0.3 ARCADE FIGHTER ENGINE)
   6 Campus Archetypes • Directional Specials • 3-Bar Supers
   High/Low Guard • Throws • Hit-Stop • Normal & Nightmare AI
   ========================================================= */

window.CRT_GAMES = window.CRT_GAMES || {};

window.CRT_GAMES.campus = {
  mount(container, api) {
    const ROSTER = [
      {
        id: "coder",
        name: "CAFFEINE CODER",
        archetype: "ALL-ROUNDER / SHOTO",
        color: "#38bdf8",
        accent: "#facc15",
        outfit: "#1e293b",
        prop: "coffee",
        hp: 1000,
        speed: 255,
        spec1Name: "SYNTAX WAVE",
        spec1Type: "projectile",
        spec2Name: "STACK OVERFLOW",
        spec2Type: "uppercut",
        superName: "OVERCLOCKED COMPILE BEAM",
        superType: "beam",
        aiStyle: "balanced"
      },
      {
        id: "lab",
        name: "LAB ASSISTANT",
        archetype: "ZONER / TRAP MASTER",
        color: "#a855f7",
        accent: "#34d399",
        outfit: "#e2e8f0",
        prop: "clipboard",
        hp: 940,
        speed: 235,
        spec1Name: "OSCILLOSCOPE ARC",
        spec1Type: "fast_proj",
        spec2Name: "POP-QUIZ MINE",
        spec2Type: "trap",
        superName: "ZERO-TOLERANCE REVISION",
        superType: "beam",
        aiStyle: "zoner"
      },
      {
        id: "crammer",
        name: "DEADLINE CRAMMER",
        archetype: "RUSHDOWN / SPEEDSTER",
        color: "#f97316",
        accent: "#fbbf24",
        outfit: "#7c2d12",
        prop: "bag",
        hp: 900,
        speed: 320,
        spec1Name: "CTRL+C / CTRL+V RUSH",
        spec1Type: "rush",
        spec2Name: "23:59 RISING KICK",
        spec2Type: "uppercut",
        superName: "ALL-NIGHTER ADRENALINE",
        superType: "barrage",
        aiStyle: "rushdown"
      },
      {
        id: "designer",
        name: "DESIGN ARCHITECT",
        archetype: "MIX-UP / TELEPORT",
        color: "#ec4899",
        accent: "#67e8f9",
        outfit: "#312e81",
        prop: "stylus",
        hp: 880,
        speed: 300,
        spec1Name: "VECTOR SLICE",
        spec1Type: "projectile",
        spec2Name: "BEZIER BLINK",
        spec2Type: "teleport",
        superName: "PIXEL-PERFECT MIRAGE",
        superType: "barrage",
        aiStyle: "mixup"
      },
      {
        id: "security",
        name: "CAMPUS SECURITY",
        archetype: "GRAPPLER / HEAVY TANK",
        color: "#eab308",
        accent: "#ef4444",
        outfit: "#1e3a5f",
        prop: "vest",
        hp: 1220,
        speed: 195,
        spec1Name: "PERMIT CHECK QUAKE",
        spec1Type: "quake",
        spec2Name: "ARMORED LARIAT",
        spec2Type: "rush_armor",
        superName: "TOWED & IMPOUNDED",
        superType: "slam",
        aiStyle: "grappler"
      },
      {
        id: "senior",
        name: "THESIS SENIOR",
        archetype: "COUNTER / PARRY",
        color: "#34d399",
        accent: "#f8fafc",
        outfit: "#334155",
        prop: "binder",
        hp: 1040,
        speed: 245,
        spec1Name: "CITATION SLIDE",
        spec1Type: "slide",
        spec2Name: "REVISION DENIED PARRY",
        spec2Type: "parry",
        superName: "FINAL DEFENSE VERDICT",
        superType: "beam",
        aiStyle: "counter"
      }
    ];

    const STAGES = [
      { id: "cafe", name: "24-HOUR COFFEE SHOP", sky1: "#181326", sky2: "#3b1d2a", floor: "#2c221e", accent: "#fb923c" },
      { id: "gate", name: "MAIN CAMPUS GATE AT DUSK", sky1: "#1e1b4b", sky2: "#9a3412", floor: "#27272a", accent: "#fbbf24" },
      { id: "server", name: "UNIVERSITY SERVER ROOM", sky1: "#07131d", sky2: "#0f293a", floor: "#141d26", accent: "#38bdf8" }
    ];

    container.innerHTML = `
      <div class="arcade-root">
        <div class="arcade-hud">
          <div class="arcade-hud-group">
            <span class="arcade-stat">
              <span class="arcade-stat-label">P1</span>
              <span class="arcade-stat-val" id="ccP1Name" style="color:#38bdf8">CAFFEINE CODER</span>
            </span>
            <span class="arcade-pill" id="ccRounds">R1 • 0 - 0</span>
            <span class="arcade-stat">
              <span class="arcade-stat-label">CPU</span>
              <span class="arcade-stat-val" id="ccP2Name" style="color:#fb7185">DEADLINE CRAMMER</span>
            </span>
          </div>
          <div class="arcade-hud-group">
            <span class="arcade-stat">
              <span class="arcade-stat-label">STAGE</span>
              <span class="arcade-stat-val" id="ccStageName">24-HOUR COFFEE SHOP</span>
            </span>
            <button type="button" class="touch-btn" id="ccMovesBtn">MOVES [M]</button>
          </div>
        </div>

        <div class="arcade-stage" id="ccStage">
          <canvas id="ccCanvas"></canvas>

          <div class="arcade-overlay" id="ccOverlay">
            <span class="arcade-pill" style="border-color:#fb923c;color:#fed7aa;background:rgba(249,115,22,0.16)">
              CARTRIDGE 03 // 6-FIGHTER CAMPUS ARCADE BRAWLER
            </span>
            <h3 class="arcade-ov-title" id="ccOvTitle">CAMPUS COMBAT</h3>
            <p class="arcade-ov-sub" id="ccOvSub">
              Select your campus fighter and CPU difficulty. Hold BACK to guard highs, DOWN-BACK to block lows, and chain J / K / L specials into 3-bar Super Arts!
            </p>
            <div id="ccMenuBody" style="width:100%;display:flex;flex-direction:column;align-items:center;gap:12px;"></div>
          </div>
        </div>

        <div class="arcade-controls-bar">
          <span><strong>A/D:</strong> Move &amp; Guard &nbsp;|&nbsp; <strong>W/S:</strong> Jump/Crouch &nbsp;|&nbsp; <strong>J:</strong> Light (Fwd+J Throw) &nbsp;|&nbsp; <strong>K:</strong> Heavy/Low &nbsp;|&nbsp; <strong>L:</strong> Special (Back/Down+L = Spec 2) &nbsp;|&nbsp; <strong>U / J+K:</strong> Super</span>
          <div class="arcade-touch-btns">
            <button type="button" class="touch-btn" data-act="left">◀</button>
            <button type="button" class="touch-btn" data-act="right">▶</button>
            <button type="button" class="touch-btn" data-act="jump">▲</button>
            <button type="button" class="touch-btn" data-act="light">J</button>
            <button type="button" class="touch-btn" data-act="heavy">K</button>
            <button type="button" class="touch-btn" data-act="special">L</button>
            <button type="button" class="touch-btn" data-act="super" style="border-color:#fbbf24;color:#fbbf24">SUPER</button>
          </div>
        </div>
      </div>
    `;

    const stageEl = container.querySelector("#ccStage");
    const canvas = container.querySelector("#ccCanvas");
    const ctx = canvas.getContext("2d");

    const p1NameEl = container.querySelector("#ccP1Name");
    const p2NameEl = container.querySelector("#ccP2Name");
    const roundsEl = container.querySelector("#ccRounds");
    const stageNameEl = container.querySelector("#ccStageName");
    const movesBtn = container.querySelector("#ccMovesBtn");

    const overlay = container.querySelector("#ccOverlay");
    const ovTitle = container.querySelector("#ccOvTitle");
    const ovSub = container.querySelector("#ccOvSub");
    const menuBody = container.querySelector("#ccMenuBody");

    const sfx = {
      tone: (f, d, t, g, ef) => api && api.tone && api.tone(f, d, t, g, ef),
      noise: (d, g) => api && api.noise && api.noise(d, g)
    };

    let W = 960;
    let H = 500;
    let rafId = null;
    let destroyed = false;
    let lastTime = 0;

    function resize() {
      const rect = stageEl.getBoundingClientRect();
      W = Math.max(360, Math.floor(rect.width));
      H = Math.max(260, Math.floor(rect.height));
      canvas.width = W;
      canvas.height = H;
    }
    resize();

    const GRAVITY = 2100;
    const keys = {};
    const touchState = { left: false, right: false };

    let selectedId = "coder";
    let difficulty = "normal"; // normal | nightmare
    let currentStage = STAGES[0];

    const state = {
      mode: "select", // select | intro | fighting | roundOver | matchOver | moves
      round: 1,
      p1Wins: 0,
      p2Wins: 0,
      timer: 99,
      bannerText: "",
      bannerTimer: 0,
      hitStop: 0,
      superFlash: 0,
      superName: "",
      shake: 0,
      p1: null,
      p2: null,
      projectiles: [],
      traps: [],
      beams: [],
      particles: [],
      popups: [],
      ai: {
        decisionTimer: 0.15,
        action: "idle",
        holdBack: false,
        crouch: false,
        moveDir: 0
      },
      p1InputHistory: [],
      lastTapDir: 0,
      lastTapTime: 0
    };

    function floorY() {
      return H - 58;
    }

    function makeFighter(def, x, facing) {
      return {
        def,
        x,
        y: floorY(),
        vx: 0,
        vy: 0,
        w: 44,
        h: 96,
        facing, // 1 right, -1 left
        hp: def.hp,
        maxHp: def.hp,
        meter: 0, // 0..300 (3 bars)
        grounded: true,
        crouching: false,
        blocking: false,
        state: "idle", // idle | walk | jump | dash | attack | hitstun | blockstun | parry | ko | victory
        stateTimer: 0,
        attack: null,
        hasHit: false,
        comboCount: 0,
        comboResetTimer: 0,
        armor: false,
        invuln: 0,
        flash: 0,
        animPhase: 0,
        afterimages: []
      };
    }

    function addParticles(x, y, color, count, speed = 220) {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = speed * (0.3 + Math.random() * 0.85);
        state.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0.22 + Math.random() * 0.25,
          maxLife: 0.47,
          size: 3 + Math.random() * 4,
          color
        });
      }
    }

    function addPopup(x, y, text, color = "#fbbf24", size = 14) {
      state.popups.push({ x, y, text, color, size, life: 0.85, vy: -48 });
    }

    function renderSelectMenu() {
      state.mode = "select";
      ovTitle.textContent = "CAMPUS COMBAT // SELECT FIGHTER";
      ovSub.textContent =
        "Choose your archetype and AI difficulty. Every fighter has Light/Heavy chains, Low Sweeps, Throws, 2 Specials, and a 3-Bar Super Art.";

      const cards = ROSTER.map((f) => {
        const isSel = f.id === selectedId;
        return `
          <button type="button" class="roster-card ${isSel ? "selected" : ""}" data-pick="${f.id}">
            <span class="draft-badge" style="color:${f.color}">${f.archetype}</span>
            <strong class="draft-name" style="font-size:0.8rem">${f.name}</strong>
            <span style="font-size:0.7rem;color:#cbd5e1">HP ${f.hp} • SPD ${f.speed}</span>
            <span style="font-size:0.66rem;color:#94a3b8">L: ${f.spec1Name} • ◀/▼+L: ${f.spec2Name}</span>
            <span style="font-size:0.64rem;color:#fbbf24">★ SUPER: ${f.superName}</span>
          </button>
        `;
      }).join("");

      menuBody.innerHTML = `
        <div class="roster-grid">${cards}</div>
        <div class="arcade-btn-row" style="margin-top:4px">
          <button type="button" class="arcade-btn ${difficulty === "normal" ? "" : "arcade-btn--ghost"}" id="ccDiffNormal">
            AI: ARCADE (NORMAL)
          </button>
          <button type="button" class="arcade-btn ${difficulty === "nightmare" ? "" : "arcade-btn--ghost"}" id="ccDiffHard" style="${difficulty === "nightmare" ? "background:#f43f5e;border-color:#f43f5e;color:#fff" : ""}">
            AI: NIGHTMARE (HARD)
          </button>
          <button type="button" class="arcade-btn" id="ccFightBtn" style="background:#fb923c;border-color:#fb923c;color:#140904">
            FIGHT! [ENTER]
          </button>
        </div>
      `;

      menuBody.querySelectorAll("[data-pick]").forEach((btn) => {
        btn.addEventListener("click", () => {
          selectedId = btn.dataset.pick;
          sfx.tone(420, 0.06, "triangle", 0.06, 620);
          renderSelectMenu();
        });
      });

      menuBody.querySelector("#ccDiffNormal").addEventListener("click", () => {
        difficulty = "normal";
        sfx.tone(360, 0.05, "sine", 0.05);
        renderSelectMenu();
      });

      menuBody.querySelector("#ccDiffHard").addEventListener("click", () => {
        difficulty = "nightmare";
        sfx.tone(240, 0.08, "sawtooth", 0.06, 160);
        renderSelectMenu();
      });

      menuBody.querySelector("#ccFightBtn").addEventListener("click", startMatch);
      overlay.classList.remove("hidden");
    }

    function startMatch() {
      const p1Def = ROSTER.find((r) => r.id === selectedId) || ROSTER[0];
      const others = ROSTER.filter((r) => r.id !== p1Def.id);
      const p2Def = others[Math.floor(Math.random() * others.length)];
      currentStage = STAGES[Math.floor(Math.random() * STAGES.length)];

      state.round = 1;
      state.p1Wins = 0;
      state.p2Wins = 0;

      p1NameEl.textContent = p1Def.name;
      p1NameEl.style.color = p1Def.color;
      p2NameEl.textContent = `${p2Def.name} (${difficulty === "nightmare" ? "NIGHTMARE" : "CPU"})`;
      p2NameEl.style.color = p2Def.color;
      stageNameEl.textContent = currentStage.name;

      startRound(p1Def, p2Def);
    }

    function startRound(p1Def, p2Def) {
      const carryP1Meter = state.p1 ? state.p1.meter : 0;
      const carryP2Meter = state.p2 ? state.p2.meter : 0;

      state.p1 = makeFighter(p1Def, W * 0.28, 1);
      state.p2 = makeFighter(p2Def, W * 0.72, -1);
      if (state.round > 1) {
        state.p1.meter = Math.min(300, carryP1Meter + 40);
        state.p2.meter = Math.min(300, carryP2Meter + 40);
      }

      state.projectiles = [];
      state.traps = [];
      state.beams = [];
      state.particles = [];
      state.popups = [];
      state.timer = 99;
      state.hitStop = 0;
      state.superFlash = 0;
      state.mode = "intro";
      state.bannerText = `ROUND ${state.round} — READY`;
      state.bannerTimer = 1.45;

      roundsEl.textContent = `R${state.round} • ${state.p1Wins} - ${state.p2Wins}`;
      overlay.classList.add("hidden");
      sfx.tone(300, 0.12, "square", 0.06, 450);
    }

    function openMoveList() {
      if (state.mode === "moves") {
        state.mode = "fighting";
        overlay.classList.add("hidden");
        return;
      }
      if (state.mode !== "fighting" && state.mode !== "intro") return;
      state.mode = "moves";
      const f = state.p1.def;
      ovTitle.textContent = `${f.name} — COMMAND LIST`;
      ovSub.textContent = `Archetype: ${f.archetype} • Hold Back to High Guard • Down+Back to Crouch Guard • Double-Tap Forward/Back to Dash.`;

      menuBody.innerHTML = `
        <div class="draft-grid">
          <div class="draft-card">
            <span class="draft-badge">NORMALS &amp; THROW</span>
            <strong class="draft-name">J / K / Forward+J</strong>
            <p class="draft-desc"><strong>J:</strong> Fast Jab (chains into K)<br/><strong>K:</strong> Heavy Strike (▼+K = Low Sweep; Air K = Overhead)<br/><strong>Fwd + J (close):</strong> Guard-Break Throw</p>
          </div>
          <div class="draft-card">
            <span class="draft-badge" style="color:${f.color}">SPECIAL MOVES</span>
            <strong class="draft-name">${f.spec1Name} &amp; ${f.spec2Name}</strong>
            <p class="draft-desc"><strong>L (or ↓ → + L):</strong> ${f.spec1Name}<br/><strong>Back/Down + L (or ↓ ← + L):</strong> ${f.spec2Name}<br/><em>Uses 1 Bar for powered EX if meter &gt;= 100 &amp; holding Shift</em></p>
          </div>
          <div class="draft-card draft-card--fusion">
            <span class="draft-badge">3-BAR SUPER ART</span>
            <strong class="draft-name">${f.superName}</strong>
            <p class="draft-desc">Press <strong>U</strong> or <strong>J + K</strong> when your Super Gauge reaches <strong>MAX (3 BARS)</strong> for a screen-shaking cinematic finisher.</p>
          </div>
        </div>
        <div class="arcade-btn-row">
          <button type="button" class="arcade-btn" id="ccResumeBtn">BACK TO FIGHT</button>
          <button type="button" class="arcade-btn arcade-btn--ghost" id="ccCharSelBtn">CHANGE FIGHTER</button>
        </div>
      `;
      menuBody.querySelector("#ccResumeBtn").addEventListener("click", () => {
        state.mode = "fighting";
        overlay.classList.add("hidden");
      });
      menuBody.querySelector("#ccCharSelBtn").addEventListener("click", renderSelectMenu);
      overlay.classList.remove("hidden");
    }

    function startAttack(fighter, opponent, kind) {
      if (
        fighter.state === "hitstun" ||
        fighter.state === "blockstun" ||
        fighter.state === "ko" ||
        fighter.state === "parry"
      ) {
        return;
      }

      // Allow light -> heavy or normal -> special/super cancel
      const isCancel =
        fighter.state === "attack" &&
        fighter.hasHit &&
        ((fighter.attack.kind === "light" && (kind === "heavy" || kind === "spec1" || kind === "spec2" || kind === "super")) ||
          (fighter.attack.kind === "heavy" && (kind === "spec1" || kind === "spec2" || kind === "super")));

      if (fighter.state === "attack" && !isCancel) return;

      const def = fighter.def;

      // Close-range Throw check
      if (kind === "throw") {
        const dist = Math.abs(opponent.x - fighter.x);
        if (dist < 78 && fighter.grounded && opponent.grounded && opponent.invuln <= 0) {
          fighter.state = "attack";
          fighter.stateTimer = 0.34;
          fighter.attack = { kind: "throw", startup: 0.08, active: 0.06, dmg: 95, range: 78, height: "throw", hitstun: 0.44, push: 320, launch: -340 };
          fighter.hasHit = false;
          sfx.tone(240, 0.08, "sawtooth", 0.06, 130);
          return;
        }
        kind = "light";
      }

      if (kind === "light") {
        fighter.state = "attack";
        fighter.stateTimer = 0.24;
        fighter.attack = {
          kind: "light",
          startup: 0.06,
          active: 0.08,
          dmg: 46,
          range: 74,
          height: fighter.crouching ? "low" : !fighter.grounded ? "overhead" : "mid",
          hitstun: 0.26,
          blockstun: 0.14,
          push: 110,
          launch: 0
        };
        fighter.hasHit = false;
        sfx.tone(520, 0.04, "triangle", 0.04, 340);
      } else if (kind === "heavy") {
        const isAir = !fighter.grounded;
        const isLow = fighter.crouching && fighter.grounded;
        fighter.state = "attack";
        fighter.stateTimer = 0.42;
        fighter.armor = def.id === "security" && !isAir;
        fighter.attack = {
          kind: "heavy",
          startup: 0.12,
          active: 0.11,
          dmg: isLow ? 84 : 96,
          range: isLow ? 92 : 86,
          height: isAir ? "overhead" : isLow ? "low" : "mid",
          hitstun: 0.38,
          blockstun: 0.22,
          push: isLow ? 220 : 195,
          launch: isLow ? -240 : -110
        };
        fighter.hasHit = false;
        // Dive kick boost for Crammer
        if (isAir && def.id === "crammer") {
          fighter.vx = fighter.facing * 420;
          fighter.vy = 460;
        }
        sfx.tone(280, 0.08, "sawtooth", 0.06, 160);
      } else if (kind === "spec1") {
        const t = def.spec1Type;
        fighter.state = "attack";
        fighter.hasHit = false;
        fighter.meter = Math.min(300, fighter.meter + 12);

        if (t === "projectile" || t === "fast_proj") {
          fighter.stateTimer = 0.4;
          fighter.attack = { kind: "spec1", startup: 0.13, active: 0.05, fired: false, projSpeed: t === "fast_proj" ? 640 : 470, dmg: 86, name: def.spec1Name };
          addPopup(fighter.x, fighter.y - 110, def.spec1Name + "!", def.color, 11);
          sfx.tone(420, 0.12, "sawtooth", 0.07, 740);
        } else if (t === "rush") {
          fighter.stateTimer = 0.44;
          fighter.vx = fighter.facing * 520;
          fighter.attack = { kind: "spec1", startup: 0.08, active: 0.22, dmg: 92, range: 86, height: "mid", hitstun: 0.36, blockstun: 0.2, push: 220, launch: -160, chip: 16 };
          addPopup(fighter.x, fighter.y - 110, def.spec1Name + "!", def.color, 11);
          sfx.tone(540, 0.1, "square", 0.06, 260);
        } else if (t === "quake") {
          fighter.stateTimer = 0.52;
          fighter.armor = true;
          fighter.attack = { kind: "spec1", startup: 0.18, active: 0.16, dmg: 112, range: 175, height: "low", hitstun: 0.44, blockstun: 0.24, push: 250, launch: -310, chip: 20, quake: true };
          addPopup(fighter.x, fighter.y - 110, def.spec1Name + "!", def.color, 11);
          sfx.noise(0.14, 0.1);
          sfx.tone(110, 0.18, "sawtooth", 0.09, 60);
        } else if (t === "slide") {
          fighter.stateTimer = 0.44;
          fighter.crouching = true;
          fighter.vx = fighter.facing * 540;
          fighter.attack = { kind: "spec1", startup: 0.09, active: 0.22, dmg: 88, range: 92, height: "low", hitstun: 0.38, blockstun: 0.2, push: 190, launch: -230, chip: 14 };
          addPopup(fighter.x, fighter.y - 110, def.spec1Name + "!", def.color, 11);
          sfx.tone(360, 0.1, "triangle", 0.06, 180);
        }
      } else if (kind === "spec2") {
        const t = def.spec2Type;
        fighter.meter = Math.min(300, fighter.meter + 12);

        if (t === "uppercut") {
          fighter.state = "attack";
          fighter.stateTimer = 0.52;
          fighter.invuln = 0.16;
          fighter.grounded = false;
          fighter.vy = -690;
          fighter.vx = fighter.facing * 150;
          fighter.hasHit = false;
          fighter.attack = { kind: "spec2", startup: 0.06, active: 0.22, dmg: 118, range: 82, height: "mid", hitstun: 0.48, blockstun: 0.22, push: 190, launch: -440, chip: 18 };
          addPopup(fighter.x, fighter.y - 114, def.spec2Name + "!", def.accent, 12);
          sfx.tone(260, 0.16, "sawtooth", 0.08, 780);
        } else if (t === "trap") {
          fighter.state = "attack";
          fighter.stateTimer = 0.36;
          fighter.hasHit = true;
          fighter.attack = { kind: "spec2", startup: 0.12, active: 0.05 };
          state.traps.push({
            owner: fighter,
            x: Math.max(55, Math.min(W - 55, fighter.x + fighter.facing * 120)),
            y: floorY() - 8,
            r: 22,
            life: 6.0,
            color: def.accent
          });
          addPopup(fighter.x, fighter.y - 110, "POP-QUIZ SET!", def.accent, 11);
          sfx.tone(620, 0.08, "square", 0.05, 840);
        } else if (t === "teleport") {
          addParticles(fighter.x, fighter.y - 50, def.color, 16, 200);
          fighter.x = Math.max(50, Math.min(W - 50, opponent.x + opponent.facing * -72));
          fighter.facing = opponent.x >= fighter.x ? 1 : -1;
          fighter.state = "attack";
          fighter.stateTimer = 0.32;
          fighter.hasHit = false;
          fighter.attack = { kind: "spec2", startup: 0.09, active: 0.12, dmg: 84, range: 84, height: "overhead", hitstun: 0.36, blockstun: 0.18, push: 160, launch: -140, chip: 14 };
          addParticles(fighter.x, fighter.y - 50, def.accent, 16, 200);
          addPopup(fighter.x, fighter.y - 114, "BEZIER BLINK!", def.accent, 12);
          sfx.tone(760, 0.09, "sine", 0.07, 320);
        } else if (t === "rush_armor") {
          fighter.state = "attack";
          fighter.stateTimer = 0.5;
          fighter.armor = true;
          fighter.vx = fighter.facing * 430;
          fighter.hasHit = false;
          fighter.attack = { kind: "spec2", startup: 0.1, active: 0.24, dmg: 120, range: 88, height: "mid", hitstun: 0.45, blockstun: 0.24, push: 290, launch: -280, chip: 20 };
          addPopup(fighter.x, fighter.y - 112, def.spec2Name + "!", def.accent, 12);
          sfx.tone(190, 0.14, "sawtooth", 0.08, 120);
        } else if (t === "parry") {
          fighter.state = "parry";
          fighter.stateTimer = 0.44;
          fighter.vx = 0;
          addPopup(fighter.x, fighter.y - 112, "PARRY STANCE!", def.color, 11);
          sfx.tone(500, 0.08, "triangle", 0.06, 700);
        }
      } else if (kind === "super") {
        if (fighter.meter < 300) return;
        fighter.meter = 0;
        fighter.state = "attack";
        fighter.stateTimer = 0.72;
        fighter.invuln = 0.35;
        fighter.hasHit = false;
        state.superFlash = 0.48;
        state.superName = `${def.name}: ${def.superName}`;
        state.hitStop = 0.18;
        state.shake = 12;

        sfx.tone(220, 0.14, "sawtooth", 0.1, 880);
        sfx.tone(440, 0.25, "triangle", 0.09, 660);

        if (def.superType === "beam") {
          fighter.attack = { kind: "super", startup: 0.14, active: 0.32, superBeam: true, dmg: 265, chip: 48 };
        } else if (def.superType === "barrage") {
          fighter.vx = fighter.facing * 640;
          fighter.attack = { kind: "super", startup: 0.08, active: 0.36, dmg: 255, range: 112, height: "mid", hitstun: 0.62, blockstun: 0.3, push: 320, launch: -420, chip: 45 };
        } else {
          // Slam shockwave
          fighter.attack = { kind: "super", startup: 0.12, active: 0.25, dmg: 290, range: 215, height: "throw", hitstun: 0.65, blockstun: 0.3, push: 380, launch: -490, quake: true };
        }
      }
    }

    function resolveHit(attacker, defender, atk) {
      if (defender.invuln > 0) return;

      // Thesis Senior Counter Parry!
      if (defender.state === "parry" && atk.height !== "throw") {
        defender.state = "attack";
        defender.stateTimer = 0.34;
        defender.hasHit = true;
        defender.meter = Math.min(300, defender.meter + 55);
        state.hitStop = 0.14;
        state.shake = 10;
        attacker.hp = Math.max(0, attacker.hp - 125);
        attacker.state = "hitstun";
        attacker.stateTimer = 0.52;
        attacker.vx = -attacker.facing * 320;
        attacker.vy = -260;
        attacker.grounded = false;
        addParticles(defender.x + defender.facing * 24, defender.y - 54, "#34d399", 24, 280);
        addPopup(defender.x, defender.y - 122, "REVISION DENIED! COUNTER!", "#34d399", 14);
        sfx.tone(820, 0.12, "triangle", 0.1, 420);
        checkKO();
        return;
      }

      // Guard check (Throws beat block!)
      let blocked = false;
      if (defender.blocking && atk.height !== "throw") {
        if (atk.height === "mid") blocked = true;
        else if (atk.height === "low" && defender.crouching) blocked = true;
        else if (atk.height === "overhead" && !defender.crouching) blocked = true;
      }

      if (blocked) {
        const chip = atk.chip || 0;
        defender.hp = Math.max(1, defender.hp - chip);
        defender.state = "blockstun";
        defender.stateTimer = atk.blockstun || 0.16;
        defender.vx = attacker.facing * ((atk.push || 140) * 0.72);
        attacker.meter = Math.min(300, attacker.meter + 12);
        defender.meter = Math.min(300, defender.meter + 18);
        state.hitStop = 0.045;
        addParticles(defender.x - defender.facing * 18, defender.y - 56, "#93c5fd", 10, 170);
        addPopup(defender.x, defender.y - 104, "GUARD", "#93c5fd", 11);
        sfx.tone(240, 0.06, "square", 0.05, 190);
        return;
      }

      // Armored attack absorbs hitstun but takes 60% damage
      if (defender.armor && atk.height !== "throw" && atk.kind !== "super") {
        defender.hp = Math.max(0, defender.hp - Math.round(atk.dmg * 0.6));
        defender.flash = 0.12;
        addPopup(defender.x, defender.y - 106, "ARMOR!", "#fbbf24", 12);
        addParticles(defender.x, defender.y - 54, "#fbbf24", 10, 180);
        sfx.tone(180, 0.07, "square", 0.06, 120);
        checkKO();
        return;
      }

      // Clean Hit!
      const comboScale = Math.max(0.55, 1 - defender.comboCount * 0.08);
      const dmg = Math.round(atk.dmg * comboScale);
      defender.hp = Math.max(0, defender.hp - dmg);
      defender.comboCount += 1;
      defender.comboResetTimer = 1.25;
      defender.state = "hitstun";
      defender.stateTimer = atk.hitstun || 0.3;
      defender.armor = false;
      defender.flash = 0.14;
      defender.vx = attacker.facing * (atk.push || 160);
      if (atk.launch) {
        defender.vy = atk.launch;
        defender.grounded = false;
      }

      attacker.meter = Math.min(300, attacker.meter + (atk.kind === "super" ? 0 : 28));
      defender.meter = Math.min(300, defender.meter + 20);

      state.hitStop = atk.kind === "super" ? 0.14 : atk.kind === "heavy" || atk.kind === "spec1" || atk.kind === "spec2" ? 0.075 : 0.04;
      state.shake = Math.max(state.shake, atk.kind === "super" ? 16 : atk.kind === "light" ? 4 : 9);

      addParticles(defender.x, defender.y - 54, attacker.def.color, atk.kind === "super" ? 30 : 14, 260);
      if (atk.height === "throw") {
        addPopup(defender.x, defender.y - 115, "THROW!", "#fb923c", 14);
      } else if (defender.comboCount >= 2) {
        addPopup(defender.x, defender.y - 115, `${defender.comboCount} HIT COMBO!`, "#fbbf24", 14);
      } else {
        addPopup(defender.x, defender.y - 102, `-${dmg}`, "#fef08a", 12);
      }

      sfx.noise(atk.kind === "light" ? 0.05 : 0.1, 0.09);
      sfx.tone(atk.kind === "light" ? 320 : 180, 0.08, "sawtooth", 0.08, 90);
      checkKO();
    }

    function checkKO() {
      if (state.mode !== "fighting") return;
      if (state.p1.hp <= 0 || state.p2.hp <= 0) {
        const p1Won = state.p2.hp <= 0 && state.p1.hp > 0;
        const p2Won = state.p1.hp <= 0 && state.p2.hp > 0;
        endRound(p1Won ? "p1" : p2Won ? "p2" : "draw");
      }
    }

    function endRound(winner) {
      state.mode = "roundOver";
      state.hitStop = 0.22;
      state.shake = 14;

      if (winner === "p1") {
        state.p1Wins += 1;
        state.p1.state = "victory";
        state.p2.state = "ko";
        state.bannerText = `${state.p1.def.name} WINS ROUND ${state.round}!`;
        sfx.tone(440, 0.15, "triangle", 0.09, 880);
      } else if (winner === "p2") {
        state.p2Wins += 1;
        state.p2.state = "victory";
        state.p1.state = "ko";
        state.bannerText = `${state.p2.def.name} WINS ROUND ${state.round}!`;
        sfx.tone(240, 0.2, "sawtooth", 0.09, 110);
      } else {
        state.bannerText = "DOUBLE K.O.!";
      }

      roundsEl.textContent = `R${state.round} • ${state.p1Wins} - ${state.p2Wins}`;
      state.bannerTimer = 2.2;
    }

    function updateAI(dt) {
      const cpu = state.p2;
      const p1 = state.p1;
      const ai = state.ai;
      const hard = difficulty === "nightmare";

      ai.decisionTimer -= dt;
      const dist = Math.abs(p1.x - cpu.x);

      // Reactive blocking & anti-air on Nightmare
      const p1Attacking = p1.state === "attack" && dist < 135;
      const incomingProj = state.projectiles.some(
        (pr) => pr.owner === p1 && Math.abs(pr.x - cpu.x) < 130
      );

      if (p1Attacking || incomingProj) {
        if (Math.random() < (hard ? 0.82 : 0.38)) {
          ai.holdBack = true;
          ai.crouch = p1.crouching && p1.grounded;
        }
      }

      // Anti-air jump punish on Hard!
      if (hard && !p1.grounded && dist < 110 && cpu.grounded && cpu.state !== "attack" && Math.random() < 0.28) {
        if (cpu.def.spec2Type === "uppercut" || cpu.def.spec2Type === "parry") {
          startAttack(cpu, p1, "spec2");
        } else {
          startAttack(cpu, p1, "heavy");
        }
        ai.decisionTimer = 0.22;
        return;
      }

      if (ai.decisionTimer > 0) return;
      ai.decisionTimer = hard ? 0.11 + Math.random() * 0.1 : 0.26 + Math.random() * 0.22;
      ai.holdBack = false;
      ai.crouch = false;
      ai.moveDir = 0;

      if (cpu.state === "hitstun" || cpu.state === "blockstun") return;

      // Use Super when ready & in range!
      if (cpu.meter >= 300 && dist < (cpu.def.superType === "beam" ? 560 : 185) && Math.random() < (hard ? 0.65 : 0.35)) {
        startAttack(cpu, p1, "super");
        return;
      }

      // Punish passive blockers with Throw
      if (dist < 76 && p1.blocking && Math.random() < (hard ? 0.65 : 0.25)) {
        startAttack(cpu, p1, "throw");
        return;
      }

      // Close-range combat
      if (dist < 92) {
        const r = Math.random();
        if (r < 0.35) startAttack(cpu, p1, "light");
        else if (r < 0.62) {
          ai.crouch = Math.random() < 0.45;
          startAttack(cpu, p1, "heavy");
        } else if (r < 0.8) startAttack(cpu, p1, "spec1");
        else if (r < 0.92) startAttack(cpu, p1, "spec2");
        else ai.holdBack = true;
        return;
      }

      // Mid / Long range footsies by archetype
      const dirToP1 = p1.x >= cpu.x ? 1 : -1;
      const r = Math.random();
      if (cpu.def.aiStyle === "zoner" && dist < 340) {
        if (r < 0.48) startAttack(cpu, p1, "spec1");
        else if (r < 0.72) startAttack(cpu, p1, "spec2");
        else ai.moveDir = -dirToP1;
      } else if (dist > 170 && r < (hard ? 0.34 : 0.18)) {
        startAttack(cpu, p1, Math.random() < 0.65 ? "spec1" : "spec2");
      } else if (r < 0.72) {
        ai.moveDir = dirToP1;
        if (dist > 140 && dist < 240 && Math.random() < 0.14 && cpu.grounded) {
          cpu.vy = -720;
          cpu.grounded = false;
        }
      } else {
        ai.moveDir = -dirToP1;
      }
    }

    function updateFighter(f, opp, dt, isPlayer) {
      f.animPhase += dt * 9;
      if (f.invuln > 0) f.invuln = Math.max(0, f.invuln - dt);
      if (f.flash > 0) f.flash = Math.max(0, f.flash - dt);

      if (f.comboResetTimer > 0) {
        f.comboResetTimer -= dt;
        if (f.comboResetTimer <= 0 && f.state !== "hitstun") f.comboCount = 0;
      }

      // Auto face opponent when neutral & grounded
      if (f.grounded && (f.state === "idle" || f.state === "walk")) {
        f.facing = opp.x >= f.x ? 1 : -1;
      }

      // Afterimages during dash or super
      if (f.state === "dash" || (f.state === "attack" && f.attack && f.attack.kind === "super")) {
        f.afterimages.push({ x: f.x, y: f.y, life: 0.18, color: f.def.color });
      }
      for (let i = f.afterimages.length - 1; i >= 0; i--) {
        f.afterimages[i].life -= dt;
        if (f.afterimages[i].life <= 0) f.afterimages.splice(i, 1);
      }

      // Handle timed states
      if (f.state === "hitstun" || f.state === "blockstun" || f.state === "dash" || f.state === "parry") {
        f.stateTimer -= dt;
        if (f.grounded) f.vx *= Math.pow(0.015, dt);
        if (f.stateTimer <= 0) {
          f.state = "idle";
          f.armor = false;
        }
      } else if (f.state === "attack") {
        f.stateTimer -= dt;
        const atk = f.attack;
        const elapsed = (atk.totalDur || 0.4) - f.stateTimer;
        if (atk.totalDur === undefined) atk.totalDur = f.stateTimer + dt;

        // Fire projectile on startup finish
        if (atk.projSpeed && !atk.fired && elapsed >= atk.startup) {
          atk.fired = true;
          state.projectiles.push({
            owner: f,
            x: f.x + f.facing * 36,
            y: f.y - 54,
            vx: f.facing * atk.projSpeed,
            r: 15,
            dmg: atk.dmg,
            color: f.def.color,
            accent: f.def.accent,
            life: 2.2
          });
        }

        // Fire Super Beam
        if (atk.superBeam && !atk.fired && elapsed >= atk.startup) {
          atk.fired = true;
          state.beams.push({
            owner: f,
            x: f.x + f.facing * 26,
            y: f.y - 54,
            dir: f.facing,
            len: W,
            color: f.def.color,
            accent: f.def.accent,
            life: 0.38,
            maxLife: 0.38
          });
          // Hit check along beam
          const inFront = (opp.x - f.x) * f.facing > -10;
          if (inFront && Math.abs((opp.y - 48) - (f.y - 54)) < 90) {
            resolveHit(f, opp, atk);
          }
        }

        // Melee active frames
        if (
          !f.hasHit &&
          !atk.projSpeed &&
          !atk.superBeam &&
          elapsed >= atk.startup &&
          elapsed <= atk.startup + atk.active
        ) {
          const dx = (opp.x - f.x) * f.facing;
          const dy = Math.abs(opp.y - f.y);
          if (dx >= -20 && dx <= atk.range && dy < (atk.quake ? 42 : 95)) {
            f.hasHit = true;
            resolveHit(f, opp, atk);
          }
        }

        if (f.grounded) f.vx *= Math.pow(0.03, dt);
        if (f.stateTimer <= 0) {
          f.state = "idle";
          f.attack = null;
          f.armor = false;
        }
      } else if (state.mode === "fighting") {
        // Movement & Guard Input
        let moveDir = 0;
        let wantCrouch = false;
        let wantJump = false;

        if (isPlayer) {
          if (keys.KeyA || keys.ArrowLeft || touchState.left) moveDir -= 1;
          if (keys.KeyD || keys.ArrowRight || touchState.right) moveDir += 1;
          wantCrouch = Boolean(keys.KeyS || keys.ArrowDown);
          wantJump = Boolean(keys.KeyW || keys.ArrowUp);
        } else {
          moveDir = state.ai.moveDir;
          if (state.ai.holdBack) moveDir = -f.facing;
          wantCrouch = state.ai.crouch;
        }

        const holdingBack = moveDir !== 0 && moveDir === -f.facing;
        f.blocking = holdingBack && f.grounded;
        f.crouching = wantCrouch && f.grounded;

        if (f.crouching) {
          f.vx = 0;
          f.state = "idle";
        } else if (moveDir !== 0) {
          const speedMod = holdingBack ? 0.78 : 1;
          f.vx = moveDir * f.def.speed * speedMod;
          if (f.grounded) f.state = "walk";
        } else {
          if (f.grounded) {
            f.vx = 0;
            f.state = "idle";
          }
        }

        if (wantJump && f.grounded) {
          f.vy = -760;
          f.grounded = false;
          f.state = "jump";
          sfx.tone(240, 0.06, "sine", 0.04, 380);
        }
      }

      // Physics integration
      f.vy += GRAVITY * dt;
      f.x += f.vx * dt;
      f.y += f.vy * dt;

      if (f.y >= floorY()) {
        f.y = floorY();
        f.vy = 0;
        if (!f.grounded) {
          f.grounded = true;
          if (f.state === "jump") f.state = "idle";
        }
      }

      // Arena wall clamp
      f.x = Math.max(42, Math.min(W - 42, f.x));
    }

    function update(dt) {
      if (state.mode === "select" || state.mode === "moves" || state.mode === "matchOver") return;

      if (state.superFlash > 0) state.superFlash = Math.max(0, state.superFlash - dt);
      if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 36);

      if (state.hitStop > 0) {
        state.hitStop -= dt;
        return;
      }

      if (state.bannerTimer > 0) {
        state.bannerTimer -= dt;
        if (state.bannerTimer <= 0) {
          if (state.mode === "intro") {
            state.mode = "fighting";
            state.bannerText = "FIGHT!";
            state.bannerTimer = 0.65;
            sfx.tone(620, 0.14, "square", 0.08, 880);
          } else if (state.mode === "roundOver") {
            if (state.p1Wins >= 2 || state.p2Wins >= 2) {
              state.mode = "matchOver";
              const won = state.p1Wins >= 2;
              ovTitle.textContent = won ? "VICTORY! CAMPUS CHAMPION" : "DEFEATED BY DEADLINE";
              ovSub.innerHTML = `${state.p1.def.name} (${state.p1Wins}) vs ${state.p2.def.name} (${state.p2Wins}) • Stage: ${currentStage.name}`;
              menuBody.innerHTML = `
                <div class="arcade-btn-row">
                  <button type="button" class="arcade-btn" id="ccRematchBtn" style="background:#fb923c;border-color:#fb923c;color:#140904">REMATCH</button>
                  <button type="button" class="arcade-btn arcade-btn--ghost" id="ccSelectAgainBtn">CHARACTER SELECT</button>
                </div>
              `;
              menuBody.querySelector("#ccRematchBtn").addEventListener("click", startMatch);
              menuBody.querySelector("#ccSelectAgainBtn").addEventListener("click", renderSelectMenu);
              overlay.classList.remove("hidden");
              return;
            } else {
              state.round += 1;
              startRound(state.p1.def, state.p2.def);
              return;
            }
          }
        }
      }

      if (state.mode === "fighting") {
        state.timer = Math.max(0, state.timer - dt);
        if (state.timer <= 0) {
          const p1Pct = state.p1.hp / state.p1.maxHp;
          const p2Pct = state.p2.hp / state.p2.maxHp;
          endRound(p1Pct > p2Pct ? "p1" : p2Pct > p1Pct ? "p2" : "draw");
          return;
        }
        updateAI(dt);
      }

      updateFighter(state.p1, state.p2, dt, true);
      updateFighter(state.p2, state.p1, dt, false);

      // Pushbox separation so fighters don't overlap on the ground
      if (state.p1.grounded && state.p2.grounded) {
        const dx = state.p2.x - state.p1.x;
        const minDist = 48;
        if (Math.abs(dx) < minDist) {
          const push = (minDist - Math.abs(dx)) * 0.5;
          const sign = dx >= 0 ? 1 : -1;
          state.p1.x = Math.max(42, state.p1.x - sign * push);
          state.p2.x = Math.min(W - 42, state.p2.x + sign * push);
        }
      }

      // Projectiles
      for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const pr = state.projectiles[i];
        pr.x += pr.vx * dt;
        pr.life -= dt;
        const target = pr.owner === state.p1 ? state.p2 : state.p1;
        if (
          Math.abs(pr.x - target.x) < 34 &&
          pr.y > target.y - (target.crouching ? 58 : 96) &&
          pr.y < target.y
        ) {
          resolveHit(pr.owner, target, {
            kind: "spec1",
            dmg: pr.dmg,
            height: "mid",
            hitstun: 0.34,
            blockstun: 0.18,
            push: 165,
            chip: 14
          });
          state.projectiles.splice(i, 1);
          continue;
        }
        if (pr.life <= 0 || pr.x < -30 || pr.x > W + 30) {
          state.projectiles.splice(i, 1);
        }
      }

      // Pop-Quiz Traps
      for (let i = state.traps.length - 1; i >= 0; i--) {
        const tr = state.traps[i];
        tr.life -= dt;
        const target = tr.owner === state.p1 ? state.p2 : state.p1;
        if (Math.abs(tr.x - target.x) < 34 && Math.abs(tr.y - target.y) < 30) {
          resolveHit(tr.owner, target, {
            kind: "spec2",
            dmg: 96,
            height: "low",
            hitstun: 0.42,
            blockstun: 0.2,
            push: 150,
            launch: -340,
            chip: 16
          });
          addParticles(tr.x, tr.y - 10, tr.color, 20, 240);
          state.traps.splice(i, 1);
          continue;
        }
        if (tr.life <= 0) state.traps.splice(i, 1);
      }

      // Beams, Particles & Popups
      for (let i = state.beams.length - 1; i >= 0; i--) {
        state.beams[i].life -= dt;
        if (state.beams[i].life <= 0) state.beams.splice(i, 1);
      }
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const pt = state.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        if (pt.life <= 0) state.particles.splice(i, 1);
      }
      for (let i = state.popups.length - 1; i >= 0; i--) {
        const pp = state.popups[i];
        pp.y += pp.vy * dt;
        pp.life -= dt;
        if (pp.life <= 0) state.popups.splice(i, 1);
      }
    }

    function drawStageBackdrop() {
      const st = currentStage;
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, st.sky1);
      grad.addColorStop(0.75, st.sky2);
      grad.addColorStop(1, "#090b10");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const fy = floorY();

      if (st.id === "cafe") {
        // Warm 24-Hour Coffee Shop windows & neon sign
        ctx.fillStyle = "rgba(251, 146, 60, 0.14)";
        for (let wx = 60; wx < W - 60; wx += 170) {
          ctx.fillRect(wx, 85, 120, fy - 120);
        }
        ctx.strokeStyle = "#fb923c";
        ctx.lineWidth = 2;
        ctx.strokeRect(W * 0.5 - 95, 58, 190, 32);
        ctx.fillStyle = "#fed7aa";
        ctx.font = "900 11px Unbounded, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("OPEN 24H • KOPI & WIFI", W * 0.5, 78);
      } else if (st.id === "gate") {
        // Dusk Campus Gate arch silhouette
        ctx.fillStyle = "rgba(251, 191, 36, 0.22)";
        ctx.beginPath();
        ctx.arc(W * 0.5, fy - 40, 110, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = "#18181b";
        ctx.fillRect(W * 0.2, 110, 36, fy - 110);
        ctx.fillRect(W * 0.8 - 36, 110, 36, fy - 110);
        ctx.fillRect(W * 0.18, 96, W * 0.64, 24);
      } else {
        // Server Room blinking racks
        for (let sx = 44; sx < W - 44; sx += 92) {
          ctx.fillStyle = "#0b1724";
          ctx.fillRect(sx, 78, 64, fy - 78);
          for (let ly = 96; ly < fy - 24; ly += 22) {
            ctx.fillStyle = (Math.floor(performance.now() / 300) + sx + ly) % 3 === 0 ? "#38bdf8" : "#22c55e";
            ctx.fillRect(sx + 10, ly, 16, 4);
          }
        }
      }

      // Arena floor
      ctx.fillStyle = st.floor;
      ctx.fillRect(0, fy, W, H - fy);
      ctx.fillStyle = st.accent;
      ctx.fillRect(0, fy, W, 3);
    }

    function drawFighter(f) {
      // Afterimages
      f.afterimages.forEach((a) => {
        ctx.globalAlpha = a.life * 2.2;
        ctx.fillStyle = a.color;
        ctx.fillRect(a.x - 18, a.y - 88, 36, 86);
      });
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.translate(f.x, f.y);

      // Ground shadow
      const shadowScale = Math.max(0.45, 1 - (floorY() - f.y) / 360);
      ctx.fillStyle = "rgba(0,0,0,0.42)";
      ctx.beginPath();
      ctx.ellipse(0, 2, 26 * shadowScale, 7 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.scale(f.facing, 1);

      const crouchOffset = f.crouching ? 26 : 0;
      const bodyH = f.crouching ? 62 : 90;
      const bob = f.state === "walk" ? Math.sin(f.animPhase * 2) * 4 : Math.sin(f.animPhase * 0.7) * 2;
      const hitTilt = f.state === "hitstun" ? -0.22 : f.state === "ko" ? -1.45 : 0;

      ctx.rotate(hitTilt);

      // Legs
      const stride = f.state === "walk" ? Math.sin(f.animPhase * 2.2) * 10 : 0;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-13 + stride, -32 + crouchOffset * 0.5, 11, 32 - crouchOffset * 0.5);
      ctx.fillRect(3 - stride, -32 + crouchOffset * 0.5, 11, 32 - crouchOffset * 0.5);

      // Torso (Outfit)
      ctx.fillStyle = f.flash > 0 ? "#ffffff" : f.def.outfit;
      ctx.fillRect(-17, -bodyH + 18 + bob, 34, 46 - crouchOffset * 0.35);

      // Signature Campus Accent Vest / Tie / Hoodie Stripe
      ctx.fillStyle = f.def.color;
      ctx.fillRect(-15, -bodyH + 22 + bob, 30, 10);
      if (f.def.prop === "vest") {
        ctx.fillStyle = "#facc15";
        ctx.fillRect(-17, -bodyH + 20 + bob, 34, 30);
      }

      // Head
      ctx.fillStyle = f.flash > 0 ? "#ffffff" : "#fde68a";
      ctx.fillRect(-11, -bodyH - 4 + bob, 22, 22);

      // Hair / Headgear
      ctx.fillStyle = f.def.id === "security" ? "#1e293b" : f.def.color;
      ctx.fillRect(-13, -bodyH - 9 + bob, 26, 9);
      // Eyes
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(3, -bodyH + 3 + bob, 5, 4);

      // Guard / Parry Shield Visual
      if (f.blocking || f.state === "blockstun" || f.state === "parry") {
        ctx.strokeStyle = f.state === "parry" ? "#34d399" : "#93c5fd";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(20, -bodyH * 0.5, 28, -1.1, 1.1);
        ctx.stroke();
      }

      // Active Attack Arm / Energy Trail
      if (f.state === "attack" && f.attack) {
        ctx.save();
        ctx.shadowBlur = 16;
        ctx.shadowColor = f.def.color;
        ctx.fillStyle = f.def.accent;
        const reach = Math.min(82, (f.attack.range || 68) * 0.8);
        const yOff = f.attack.height === "low" ? -18 : -bodyH + 34;
        ctx.fillRect(10, yOff, reach, f.attack.kind === "light" ? 12 : 18);
        ctx.restore();
      }

      ctx.restore();
    }

    function drawHudBars() {
      if (!state.p1 || !state.p2) return;
      const barW = Math.min(340, W * 0.36);
      const y = 18;

      // P1 HP Bar (drains right-to-left toward center)
      const p1Pct = Math.max(0, state.p1.hp / state.p1.maxHp);
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(20, y, barW, 20);
      ctx.fillStyle = p1Pct < 0.25 ? "#ef4444" : state.p1.def.color;
      ctx.fillRect(20 + barW * (1 - p1Pct), y + 2, barW * p1Pct, 16);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, y, barW, 20);

      // P2 HP Bar (drains left-to-right toward center)
      const p2Pct = Math.max(0, state.p2.hp / state.p2.maxHp);
      const p2X = W - 20 - barW;
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(p2X, y, barW, 20);
      ctx.fillStyle = p2Pct < 0.25 ? "#ef4444" : state.p2.def.color;
      ctx.fillRect(p2X, y + 2, barW * p2Pct, 16);
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(p2X, y, barW, 20);

      // Round Timer Center Box
      ctx.fillStyle = "#090b12";
      ctx.fillRect(W * 0.5 - 28, y - 4, 56, 32);
      ctx.strokeStyle = "#fb923c";
      ctx.strokeRect(W * 0.5 - 28, y - 4, 56, 32);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 18px Unbounded, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(Math.ceil(state.timer)).padStart(2, "0"), W * 0.5, y + 19);

      // 3-Bar Super Meters at Bottom Corners
      const mW = Math.min(220, W * 0.26);
      const mY = H - 24;

      [
        { f: state.p1, x: 20 },
        { f: state.p2, x: W - 20 - mW }
      ].forEach(({ f, x }) => {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(x, mY, mW, 12);
        const pct = f.meter / 300;
        ctx.fillStyle = f.meter >= 300 ? "#fbbf24" : "#38bdf8";
        ctx.fillRect(x, mY, mW * pct, 12);
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.strokeRect(x, mY, mW, 12);
        // 3-bar ticks
        ctx.fillStyle = "#000";
        ctx.fillRect(x + mW / 3, mY, 2, 12);
        ctx.fillRect(x + (mW * 2) / 3, mY, 2, 12);
        if (f.meter >= 300) {
          ctx.fillStyle = "#fbbf24";
          ctx.font = "900 9px Unbounded, sans-serif";
          ctx.textAlign = "left";
          ctx.fillText("MAX SUPER READY [U]", x, mY - 5);
        }
      });
    }

    function draw() {
      ctx.save();
      if (state.shake > 0.2) {
        ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
      }

      drawStageBackdrop();

      if (state.superFlash > 0) {
        ctx.fillStyle = `rgba(5, 8, 18, ${Math.min(0.75, state.superFlash * 1.5)})`;
        ctx.fillRect(0, 0, W, H);
      }

      // Traps
      state.traps.forEach((tr) => {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = tr.color;
        ctx.fillStyle = tr.color;
        ctx.fillRect(tr.x - 14, tr.y - 6, 28, 10);
        ctx.restore();
      });

      if (state.p1 && state.p2) {
        drawFighter(state.p1);
        drawFighter(state.p2);
      }

      // Projectiles
      state.projectiles.forEach((pr) => {
        ctx.save();
        ctx.shadowBlur = 16;
        ctx.shadowColor = pr.color;
        ctx.fillStyle = pr.color;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, pr.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, pr.r * 0.48, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Super Beams
      state.beams.forEach((bm) => {
        ctx.save();
        ctx.globalAlpha = bm.life / bm.maxLife;
        ctx.shadowBlur = 24;
        ctx.shadowColor = bm.color;
        ctx.fillStyle = bm.color;
        const bx = bm.dir === 1 ? bm.x : bm.x - bm.len;
        ctx.fillRect(bx, bm.y - 28, bm.len, 56);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(bx, bm.y - 11, bm.len, 22);
        ctx.restore();
      });

      // Particles & Popups
      state.particles.forEach((pt) => {
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
      });
      ctx.globalAlpha = 1;

      ctx.textAlign = "center";
      state.popups.forEach((pp) => {
        ctx.globalAlpha = Math.max(0, pp.life);
        ctx.font = `900 ${pp.size}px Unbounded, sans-serif`;
        ctx.fillStyle = pp.color;
        ctx.fillText(pp.text, pp.x, pp.y);
      });
      ctx.globalAlpha = 1;

      drawHudBars();

      // Super Art Cut-in Banner
      if (state.superFlash > 0) {
        ctx.fillStyle = "rgba(251, 191, 36, 0.92)";
        ctx.fillRect(0, H * 0.38, W, 44);
        ctx.fillStyle = "#090b12";
        ctx.font = "900 18px Unbounded, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`★ ${state.superName} ★`, W * 0.5, H * 0.38 + 29);
      }

      // Round / Fight Banner
      if (state.bannerTimer > 0 && state.bannerText) {
        ctx.fillStyle = "rgba(0,0,0,0.68)";
        ctx.fillRect(0, H * 0.44 - 26, W, 52);
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 22px Unbounded, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(state.bannerText, W * 0.5, H * 0.44 + 8);
      }

      ctx.restore();
    }

    function loop(ts) {
      if (destroyed) return;
      const dt = Math.min(0.035, (ts - lastTime) / 1000 || 0.016);
      lastTime = ts;
      update(dt);
      draw();
      rafId = requestAnimationFrame(loop);
    }

    function triggerDash(dir) {
      const f = state.p1;
      if (!f || state.mode !== "fighting" || !f.grounded) return;
      if (f.state !== "idle" && f.state !== "walk") return;
      f.state = "dash";
      f.stateTimer = 0.16;
      f.vx = dir * 560;
      if (dir === -f.facing) f.invuln = 0.14;
      sfx.tone(360, 0.06, "sine", 0.05, 520);
    }

    function onKeyDown(e) {
      if (e.repeat) return;
      keys[e.code] = true;

      if (e.code === "KeyM") {
        openMoveList();
        return;
      }

      if (state.mode === "select" && e.code === "Enter") {
        startMatch();
        return;
      }

      if (state.mode !== "fighting") return;

      const p1 = state.p1;
      const p2 = state.p2;

      // Double-tap Dash / Backstep
      if (e.code === "KeyA" || e.code === "ArrowLeft" || e.code === "KeyD" || e.code === "ArrowRight") {
        const dir = e.code === "KeyD" || e.code === "ArrowRight" ? 1 : -1;
        const now = performance.now();
        if (dir === state.lastTapDir && now - state.lastTapTime < 230) {
          triggerDash(dir);
          state.lastTapDir = 0;
        } else {
          state.lastTapDir = dir;
          state.lastTapTime = now;
        }
      }

      // Simultaneous J + K or U for 3-Bar Super Art
      if (e.code === "KeyU" || ((e.code === "KeyJ" && keys.KeyK) || (e.code === "KeyK" && keys.KeyJ))) {
        if (p1.meter >= 300) {
          startAttack(p1, p2, "super");
          return;
        }
      }

      if (e.code === "KeyJ" || e.code === "KeyZ") {
        const holdingFwd =
          (p1.facing === 1 && (keys.KeyD || keys.ArrowRight)) ||
          (p1.facing === -1 && (keys.KeyA || keys.ArrowLeft));
        startAttack(p1, p2, holdingFwd ? "throw" : "light");
      } else if (e.code === "KeyK" || e.code === "KeyX") {
        startAttack(p1, p2, "heavy");
      } else if (e.code === "KeyL" || e.code === "KeyC") {
        const holdingBackOrDown =
          keys.KeyS ||
          keys.ArrowDown ||
          (p1.facing === 1 && (keys.KeyA || keys.ArrowLeft)) ||
          (p1.facing === -1 && (keys.KeyD || keys.ArrowRight));
        startAttack(p1, p2, holdingBackOrDown ? "spec2" : "spec1");
      }
    }

    function onKeyUp(e) {
      keys[e.code] = false;
    }

    // Touch / Click Controls
    container.querySelectorAll("[data-act]").forEach((btn) => {
      const act = btn.dataset.act;
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (act === "left") touchState.left = true;
        else if (act === "right") touchState.right = true;
        else if (act === "jump" && state.p1 && state.p1.grounded && state.mode === "fighting") {
          state.p1.vy = -760;
          state.p1.grounded = false;
        } else if (state.mode === "fighting") {
          if (act === "light") startAttack(state.p1, state.p2, "light");
          if (act === "heavy") startAttack(state.p1, state.p2, "heavy");
          if (act === "special") startAttack(state.p1, state.p2, touchState.left ? "spec2" : "spec1");
          if (act === "super") startAttack(state.p1, state.p2, "super");
        }
      });
      const release = () => {
        if (act === "left") touchState.left = false;
        if (act === "right") touchState.right = false;
      };
      btn.addEventListener("pointerup", release);
      btn.addEventListener("pointerleave", release);
    });

    movesBtn.addEventListener("click", openMoveList);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", resize);

    renderSelectMenu();
    lastTime = performance.now();
    rafId = requestAnimationFrame(loop);

    return {
      destroy() {
        destroyed = true;
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("resize", resize);
      }
    };
  }
};