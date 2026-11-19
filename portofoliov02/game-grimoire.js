/* =========================================================
   CARTRIDGE 02: GRIMOIRE: ABYSS (V0.3 INFINITE ROGUELIKE)
   50 Spells • 7 School Synergies • 10 Optional Duo Fusions
   12 Cursed Pacts • Status Ailments • Every-10-Level Bosses
   ========================================================= */

window.CRT_GAMES = window.CRT_GAMES || {};

window.CRT_GAMES.grimoire = {
  mount(container, api) {
    const DATA = window.GRIMOIRE_DATA;
    const BEST_KEY = "kai_v03_grimoire_best_lvl";
    let bestLevel = Number(localStorage.getItem(BEST_KEY) || 1);

    container.innerHTML = `
      <div class="arcade-root">
        <div class="arcade-hud">
          <div class="arcade-hud-group">
            <span class="arcade-stat">
              <span class="arcade-stat-label">HP</span>
              <span class="arcade-stat-val" id="grimHp" style="color:#fb7185">120 / 120</span>
            </span>
            <span class="arcade-stat">
              <span class="arcade-stat-label">LVL</span>
              <span class="arcade-stat-val" id="grimLvl" style="color:#c084fc">1</span>
            </span>
            <span class="arcade-stat">
              <span class="arcade-stat-label">KILLS</span>
              <span class="arcade-stat-val" id="grimKills">0</span>
            </span>
            <span class="arcade-stat">
              <span class="arcade-stat-label">TIME</span>
              <span class="arcade-stat-val" id="grimTime">00:00</span>
            </span>
          </div>
          <div class="arcade-hud-group">
            <span class="arcade-pill" id="grimBuildBadge">SPELLS: 1 • PACTS: 0</span>
            <button type="button" class="touch-btn" id="grimTomeBtn">TOME [TAB]</button>
          </div>
        </div>

        <div class="arcade-stage" id="grimStage">
          <canvas id="grimCanvas"></canvas>

          <!-- Start / Draft / Tome / Game Over Overlay -->
          <div class="arcade-overlay" id="grimOverlay">
            <span class="arcade-pill" style="border-color:#c084fc;color:#d8b4fe;background:rgba(168,85,247,0.16)">
              CARTRIDGE 02 // 50-SPELL INFINITE ROGUELIKE
            </span>
            <h3 class="arcade-ov-title" id="grimOvTitle">GRIMOIRE: ABYSS</h3>
            <p class="arcade-ov-sub" id="grimOvSub">
              Command 50 original spells across 7 arcane schools, awaken familiar squads, forge optional Duo Fusions, accept Cursed Pacts, and topple Abyssal Doodle Bosses every 10 levels. (Best Level: ${bestLevel})
            </p>
            <div id="grimDraftMount"></div>
            <div class="arcade-btn-row" id="grimBtnRow">
              <button type="button" class="arcade-btn" id="grimStartBtn" style="background:#c084fc;border-color:#c084fc;color:#12071f">
                OPEN GRIMOIRE [ENTER]
              </button>
            </div>
          </div>
        </div>

        <div class="arcade-controls-bar">
          <span><strong>WASD / ARROWS:</strong> Move &nbsp;|&nbsp; <strong>SPACE / SHIFT:</strong> Blink Dash &nbsp;|&nbsp; <strong>TAB:</strong> Spell Tome &nbsp;|&nbsp; Auto-Cast Active</span>
          <div class="arcade-touch-btns">
            <button type="button" class="touch-btn" id="grimTouchDash">BLINK DASH</button>
          </div>
        </div>
      </div>
    `;

    const stage = container.querySelector("#grimStage");
    const canvas = container.querySelector("#grimCanvas");
    const ctx = canvas.getContext("2d");

    const hpEl = container.querySelector("#grimHp");
    const lvlEl = container.querySelector("#grimLvl");
    const killsEl = container.querySelector("#grimKills");
    const timeEl = container.querySelector("#grimTime");
    const buildBadge = container.querySelector("#grimBuildBadge");
    const tomeBtn = container.querySelector("#grimTomeBtn");

    const overlay = container.querySelector("#grimOverlay");
    const ovTitle = container.querySelector("#grimOvTitle");
    const ovSub = container.querySelector("#grimOvSub");
    const draftMount = container.querySelector("#grimDraftMount");
    const btnRow = container.querySelector("#grimBtnRow");
    const startBtn = container.querySelector("#grimStartBtn");
    const touchDash = container.querySelector("#grimTouchDash");

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
      const rect = stage.getBoundingClientRect();
      W = Math.max(360, Math.floor(rect.width));
      H = Math.max(260, Math.floor(rect.height));
      canvas.width = W;
      canvas.height = H;
    }
    resize();

    const keys = {};
    const pointer = { active: false, sx: 0, sy: 0 };

    const state = {
      mode: "menu", // menu | playing | draft | tome | gameover
      time: 0,
      kills: 0,
      level: 1,
      xp: 0,
      xpNext: 28,
      shake: 0,
      spawnTimer: 0.4,
      frenzyTimer: 0,
      regenTimer: 0,
      bossActive: null,
      nextBossLevel: 10,
      lastCastColor: "#60a5fa",
      stats: {},
      player: {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        facingX: 1,
        facingY: 0,
        r: 15,
        invuln: 0,
        dashCd: 0,
        dashTimer: 0,
        cloakTrail: []
      },
      ownedSpells: [], // { def, level, cdTimer, isFusion }
      fusedIds: new Set(),
      ownedPacts: [],
      schoolCounts: {},
      familiars: [],
      enemies: [],
      enemyBullets: [],
      projectiles: [],
      beams: [],
      novas: [],
      zones: [],
      chains: [],
      meteors: [],
      slashes: [],
      gems: [],
      particles: [],
      popups: []
    };

    function createBaseStats() {
      return {
        maxHp: 120,
        hp: 120,
        dmgMult: 1,
        speedMult: 1,
        aoeMult: 1,
        cdMult: 1,
        dmgTakenMult: 1,
        killHealChance: 0,
        noRegen: false,
        frenzyBurn: false,
        critChance: 0.12,
        critMult: 1.65,
        projSpeedMult: 1,
        bonusProj: 0,
        enemySpeedMult: 1,
        xpMult: 1,
        doubleCastChance: 0,
        pickupRadius: 86,
        spawnRateMult: 1,
        statusMult: 1,
        familiarMult: 1,
        dashCdMult: 1
      };
    }

    function recalcSchools() {
      const counts = {};
      Object.keys(DATA.schools).forEach((k) => {
        counts[k] = 0;
      });
      state.ownedSpells.forEach((s) => {
        if (counts[s.def.school] !== undefined) {
          counts[s.def.school] += s.isFusion ? 2 : 1;
        }
      });
      state.schoolCounts = counts;
    }

    function hasSynergy(school, tier) {
      return (state.schoolCounts[school] || 0) >= tier;
    }

    function syncFamiliars() {
      const famSpells = state.ownedSpells.filter((s) => s.def.kind === "familiar");
      // Keep existing familiars or spawn missing ones
      famSpells.forEach((fs, idx) => {
        const existing = state.familiars.find((f) => f.spellId === fs.def.id);
        if (!existing) {
          const ang = (idx / Math.max(1, famSpells.length)) * Math.PI * 2;
          state.familiars.push({
            spellId: fs.def.id,
            spellRef: fs,
            x: state.player.x + Math.cos(ang) * 48,
            y: state.player.y + Math.sin(ang) * 48,
            cd: 0.3,
            angle: ang
          });
        } else {
          existing.spellRef = fs;
        }
      });
      state.familiars = state.familiars.filter((f) =>
        famSpells.some((fs) => fs.def.id === f.spellId)
      );
    }

    function addSpell(def, isFusion = false) {
      const found = state.ownedSpells.find((s) => s.def.id === def.id);
      if (found) {
        found.level += 1;
      } else {
        state.ownedSpells.push({
          def,
          level: 1,
          cdTimer: 0.25,
          isFusion
        });
      }
      recalcSchools();
      syncFamiliars();
      updateHud();
    }

    function resetRun() {
      state.mode = "playing";
      state.time = 0;
      state.kills = 0;
      state.level = 1;
      state.xp = 0;
      state.xpNext = 26;
      state.shake = 0;
      state.spawnTimer = 0.25;
      state.frenzyTimer = 0;
      state.regenTimer = 0;
      state.bossActive = null;
      state.nextBossLevel = 10;
      state.lastCastColor = "#60a5fa";

      state.stats = createBaseStats();
      state.player = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        facingX: 1,
        facingY: 0,
        r: 15,
        invuln: 0,
        dashCd: 0,
        dashTimer: 0,
        cloakTrail: []
      };

      state.ownedSpells = [];
      state.fusedIds = new Set();
      state.ownedPacts = [];
      state.familiars = [];
      state.enemies = [];
      state.enemyBullets = [];
      state.projectiles = [];
      state.beams = [];
      state.novas = [];
      state.zones = [];
      state.chains = [];
      state.meteors = [];
      state.slashes = [];
      state.gems = [];
      state.particles = [];
      state.popups = [];

      // Start with Starfall Barrage + a random companion starter spell for immediate fun
      const starter = DATA.spells.find((s) => s.id === "starfall_barrage") || DATA.spells[0];
      addSpell(starter, false);

      draftMount.innerHTML = "";
      overlay.classList.add("hidden");
      sfx.tone(280, 0.1, "triangle", 0.08, 560);
    }

    function addParticles(x, y, color, count, speed = 130) {
      if (state.particles.length > 260) return;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = speed * (0.3 + Math.random() * 0.8);
        state.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0.25 + Math.random() * 0.3,
          maxLife: 0.55,
          size: 2.2 + Math.random() * 3.2,
          color
        });
      }
    }

    function addPopup(x, y, text, color = "#ffffff", size = 11) {
      if (state.popups.length > 70) state.popups.shift();
      state.popups.push({ x, y, text, color, size, life: 0.72, vy: -38 });
    }

    function nearestEnemy(fromX, fromY, maxRange = 9999) {
      let best = null;
      let bestD2 = maxRange * maxRange;
      for (let i = 0; i < state.enemies.length; i++) {
        const e = state.enemies[i];
        const dx = e.x - fromX;
        const dy = e.y - fromY;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD2) {
          bestD2 = d2;
          best = e;
        }
      }
      return best;
    }

    function applyDamage(enemy, rawDmg, status, school, lifesteal = 0) {
      if (!enemy || enemy.hp <= 0) return;

      const st = state.stats;
      let dmg = rawDmg * st.dmgMult;

      if (school === "astral" && hasSynergy("astral", 4)) dmg *= 1.35;
      if (school === "familiar") dmg *= st.familiarMult * (hasSynergy("familiar", 4) ? 1.35 : 1);
      if (enemy.vulnTimer > 0) dmg *= 1.25;
      if (enemy.frostTimer > 0 && hasSynergy("glacial", 4)) dmg *= 1.35;
      if (enemy.pulledTimer > 0 && hasSynergy("gravity", 4)) dmg *= 1.3;

      const critRate = st.critChance + (school === "astral" && hasSynergy("astral", 4) ? 0.18 : 0);
      const isCrit = Math.random() < critRate;
      if (isCrit) dmg *= st.critMult;

      const finalDmg = Math.max(1, Math.round(dmg));
      enemy.hp -= finalDmg;
      enemy.hitFlash = 0.1;

      if (lifesteal > 0 && !st.noRegen) {
        st.hp = Math.min(st.maxHp, st.hp + Math.max(1, Math.round(finalDmg * lifesteal)));
      }

      addPopup(
        enemy.x + (Math.random() - 0.5) * 14,
        enemy.y - enemy.r - 4,
        isCrit ? `${finalDmg}!` : String(finalDmg),
        isCrit ? "#fbbf24" : "#f8fafc",
        isCrit ? 13 : 10
      );

      // Apply Status Ailments
      if (status === "burn") {
        enemy.burnTimer = 3.2;
      } else if (status === "frost") {
        enemy.frostTimer = 3.0;
        enemy.frostStacks = (enemy.frostStacks || 0) + 1;
        if (enemy.frostStacks >= 4) {
          enemy.frostStacks = 0;
          const burst = Math.round((enemy.isBoss ? 85 : enemy.maxHp * 0.22 + 24) * st.statusMult);
          enemy.hp -= burst;
          addPopup(enemy.x, enemy.y - enemy.r - 18, `FROSTBITE -${burst}`, "#38bdf8", 12);
          addParticles(enemy.x, enemy.y, "#38bdf8", 12, 160);
        }
      } else if (status === "bleed") {
        enemy.bleedStacks = (enemy.bleedStacks || 0) + 1;
        const threshold = hasSynergy("crimson", 2) ? 3 : 4;
        if (enemy.bleedStacks >= threshold) {
          enemy.bleedStacks = 0;
          const burst = Math.round((enemy.isBoss ? 110 : enemy.maxHp * 0.28 + 26) * st.statusMult);
          enemy.hp -= burst;
          addPopup(enemy.x, enemy.y - enemy.r - 18, `HEMORRHAGE -${burst}`, "#f43f5e", 12);
          addParticles(enemy.x, enemy.y, "#f43f5e", 14, 175);
          if (hasSynergy("crimson", 4)) {
            st.hp = Math.min(st.maxHp, st.hp + 4);
          }
        }
      } else if (status === "shock") {
        enemy.shockTimer = 0.25;
        if (school === "tempest" && hasSynergy("tempest", 4) && Math.random() < 0.4) {
          // Bonus superconductor arc
          let arcs = 0;
          for (let i = 0; i < state.enemies.length && arcs < 2; i++) {
            const other = state.enemies[i];
            if (other !== enemy && other.hp > 0 && Math.hypot(other.x - enemy.x, other.y - enemy.y) < 135) {
              other.hp -= Math.round(finalDmg * 0.45);
              state.chains.push({
                pts: [{ x: enemy.x, y: enemy.y }, { x: other.x, y: other.y }],
                color: "#fde047",
                life: 0.16
              });
              arcs++;
            }
          }
        }
      } else if (status === "vuln") {
        enemy.vulnTimer = 3.8;
      } else if (status === "pull") {
        enemy.pulledTimer = 1.6;
      }

      if (enemy.hp <= 0) {
        onEnemyKilled(enemy);
      }
    }

    function onEnemyKilled(enemy) {
      if (enemy.dead) return;
      enemy.dead = true;
      state.kills += 1;

      const st = state.stats;
      addParticles(enemy.x, enemy.y, enemy.color, enemy.isBoss ? 44 : 10, enemy.isBoss ? 270 : 145);

      // Ashen 4-piece: burning foes explode on death
      if (enemy.burnTimer > 0 && hasSynergy("ashen", 4)) {
        state.novas.push({
          x: enemy.x,
          y: enemy.y,
          r: 10,
          maxR: 84 * st.aoeMult,
          color: "#f97316",
          life: 0.24,
          maxLife: 0.24
        });
        state.enemies.forEach((other) => {
          if (!other.dead && Math.hypot(other.x - enemy.x, other.y - enemy.y) < 84 * st.aoeMult) {
            applyDamage(other, 26 * st.statusMult, "burn", "ashen");
          }
        });
      }

      if (st.killHealChance > 0 && Math.random() < st.killHealChance) {
        st.hp = Math.min(st.maxHp, st.hp + 6);
        addPopup(state.player.x, state.player.y - 24, "+6 HP", "#34d399", 11);
      }

      // Drop XP orbs (Bosses drop a massive chest burst)
      const orbCount = enemy.isBoss ? 14 : 1;
      for (let i = 0; i < orbCount; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = enemy.isBoss ? 18 + Math.random() * 54 : 0;
        state.gems.push({
          x: enemy.x + Math.cos(ang) * dist,
          y: enemy.y + Math.sin(ang) * dist,
          val: enemy.isBoss ? 18 : enemy.xpVal,
          color: enemy.isBoss ? "#fbbf24" : enemy.xpVal > 12 ? "#c084fc" : "#38bdf8"
        });
      }

      if (enemy.isBoss) {
        state.bossActive = null;
        state.shake = 16;
        addPopup(enemy.x, enemy.y - 26, "ABYSSAL BOSS VANQUISHED!", "#fbbf24", 15);
        sfx.tone(440, 0.14, "triangle", 0.1, 880);
        // Heal 30% on boss kill
        st.hp = Math.min(st.maxHp, st.hp + Math.round(st.maxHp * 0.3));
      }
    }

    function castSpell(slot, isDouble = false) {
      const def = slot.def;
      const lvl = slot.level;
      const st = state.stats;
      const p = state.player;
      const dmg = def.dmg * (1 + (lvl - 1) * 0.28);
      const aoe = st.aoeMult * (hasSynergy("gravity", 2) ? 1.25 : 1);
      state.lastCastColor = def.color;

      const target = nearestEnemy(p.x, p.y, 620);
      const aimAngle = target
        ? Math.atan2(target.y - p.y, target.x - p.x)
        : Math.atan2(p.facingY, p.facingX);

      if (def.kind === "bolt") {
        const count = (def.count || 1) + st.bonusProj + Math.floor((lvl - 1) / 2);
        const speed = (def.speed || 460) * st.projSpeedMult * (hasSynergy("astral", 2) ? 1.18 : 1);
        const pierce = (def.pierce || 1) + (hasSynergy("astral", 2) ? 1 : 0);
        const spread = count > 1 ? 0.16 : 0;

        for (let i = 0; i < count; i++) {
          const offset = (i - (count - 1) / 2) * spread;
          const a = aimAngle + offset;
          state.projectiles.push({
            x: p.x,
            y: p.y,
            vx: Math.cos(a) * speed,
            vy: Math.sin(a) * speed,
            r: 7,
            dmg,
            pierce,
            explode: (def.explode || 0) * aoe,
            color: def.color,
            status: def.status,
            school: def.school,
            life: 1.5,
            hitSet: new Set()
          });
        }
        sfx.tone(520, 0.05, "triangle", 0.035, 320);
      } else if (def.kind === "homing") {
        const count = (def.count || 3) + st.bonusProj + Math.floor((lvl - 1) / 2);
        const speed = (def.speed || 310) * st.projSpeedMult;
        for (let i = 0; i < count; i++) {
          const a = aimAngle + (Math.random() - 0.5) * 1.4;
          state.projectiles.push({
            homing: true,
            x: p.x,
            y: p.y,
            vx: Math.cos(a) * speed,
            vy: Math.sin(a) * speed,
            speed,
            r: 6,
            dmg,
            pierce: 1,
            color: def.color,
            status: def.status,
            school: def.school,
            life: 2.5,
            hitSet: new Set()
          });
        }
        sfx.tone(660, 0.045, "sine", 0.03, 820);
      } else if (def.kind === "orb") {
        const speed = (def.speed || 130) * st.projSpeedMult;
        state.projectiles.push({
          isOrb: true,
          x: p.x,
          y: p.y,
          vx: Math.cos(aimAngle) * speed,
          vy: Math.sin(aimAngle) * speed,
          r: (def.radius || 24) * aoe,
          dmg,
          tickCd: 0,
          pull: (def.pull || 0) * (hasSynergy("gravity", 2) ? 1.3 : 1),
          color: def.color,
          status: def.status,
          school: def.school,
          life: 3.1
        });
        sfx.tone(220, 0.11, "sine", 0.05, 160);
      } else if (def.kind === "beam") {
        const range = (def.range || 380) * aoe;
        const width = (def.width || 18) * aoe;
        const x2 = p.x + Math.cos(aimAngle) * range;
        const y2 = p.y + Math.sin(aimAngle) * range;
        state.beams.push({
          x1: p.x,
          y1: p.y,
          x2,
          y2,
          width,
          color: def.color,
          life: 0.28,
          maxLife: 0.28
        });

        // Line-segment collision against enemies
        const dx = x2 - p.x;
        const dy = y2 - p.y;
        const len2 = dx * dx + dy * dy || 1;
        state.enemies.forEach((e) => {
          if (e.dead) return;
          const t = Math.max(0, Math.min(1, ((e.x - p.x) * dx + (e.y - p.y) * dy) / len2));
          const px = p.x + t * dx;
          const py = p.y + t * dy;
          if (Math.hypot(e.x - px, e.y - py) <= e.r + width * 0.55) {
            applyDamage(e, dmg, def.status, def.school, def.lifesteal || 0);
            if (def.explode) {
              addParticles(e.x, e.y, def.color, 6, 130);
            }
          }
        });
        state.shake = Math.max(state.shake, def.width > 24 ? 7 : 3);
        sfx.tone(740, 0.12, "sawtooth", 0.05, 220);
      } else if (def.kind === "nova") {
        const radius = (def.radius || 140) * aoe;
        state.novas.push({
          x: p.x,
          y: p.y,
          r: 12,
          maxR: radius,
          color: def.color,
          life: 0.32,
          maxLife: 0.32
        });
        state.enemies.forEach((e) => {
          if (e.dead) return;
          const dist = Math.hypot(e.x - p.x, e.y - p.y);
          if (dist <= radius + e.r) {
            applyDamage(e, dmg, def.status, def.school);
            if (def.knockback) {
              const a = Math.atan2(e.y - p.y, e.x - p.x);
              e.x += Math.cos(a) * def.knockback * (e.isBoss ? 0.15 : 0.45);
              e.y += Math.sin(a) * def.knockback * (e.isBoss ? 0.15 : 0.45);
            }
          }
        });
        sfx.tone(190, 0.13, "triangle", 0.06, 95);
      } else if (def.kind === "zone") {
        const tx = target ? target.x : p.x + Math.cos(aimAngle) * 120;
        const ty = target ? target.y : p.y + Math.sin(aimAngle) * 120;
        state.zones.push({
          x: tx,
          y: ty,
          r: (def.radius || 84) * aoe,
          dmg,
          tick: 0,
          pull: (def.pull || 0) * (hasSynergy("gravity", 2) ? 1.35 : 1),
          color: def.color,
          status: def.status,
          school: def.school,
          life: def.duration || 3.0,
          maxLife: def.duration || 3.0
        });
        sfx.tone(160, 0.12, "sine", 0.05, 240);
      } else if (def.kind === "chain") {
        if (!target) return;
        const bounces = (def.bounces || 5) + Math.floor((lvl - 1) / 2);
        const range = (def.range || 240) * aoe;
        const visited = new Set();
        const pts = [{ x: p.x, y: p.y }];
        let cur = target;

        for (let b = 0; b < bounces && cur; b++) {
          visited.add(cur);
          pts.push({ x: cur.x, y: cur.y });
          applyDamage(cur, dmg, def.status, def.school);

          let next = null;
          let bestD = range;
          for (let i = 0; i < state.enemies.length; i++) {
            const cand = state.enemies[i];
            if (cand.dead || visited.has(cand)) continue;
            const d = Math.hypot(cand.x - cur.x, cand.y - cur.y);
            if (d < bestD) {
              bestD = d;
              next = cand;
            }
          }
          cur = next;
        }
        state.chains.push({ pts, color: def.color, life: 0.24 });
        sfx.tone(860, 0.07, "square", 0.04, 420);
      } else if (def.kind === "meteor") {
        const count = (def.count || 1) + Math.floor((lvl - 1) / 2);
        for (let i = 0; i < count; i++) {
          const randE = state.enemies.length
            ? state.enemies[Math.floor(Math.random() * state.enemies.length)]
            : null;
          const mx = randE ? randE.x + (Math.random() - 0.5) * 40 : p.x + (Math.random() - 0.5) * 240;
          const my = randE ? randE.y + (Math.random() - 0.5) * 40 : p.y + (Math.random() - 0.5) * 180;
          state.meteors.push({
            x: mx,
            y: my,
            r: (def.radius || 70) * aoe,
            dmg,
            delay: 0.36 + i * 0.14,
            maxDelay: 0.36 + i * 0.14,
            color: def.color,
            status: def.status,
            school: def.school
          });
        }
      } else if (def.kind === "lash") {
        const range = (def.range || 135) * aoe;
        const arc = def.arc || 1.9;
        state.slashes.push({
          x: p.x,
          y: p.y,
          angle: aimAngle,
          arc,
          range,
          color: def.color,
          life: 0.2,
          maxLife: 0.2
        });
        state.enemies.forEach((e) => {
          if (e.dead) return;
          const d = Math.hypot(e.x - p.x, e.y - p.y);
          if (d <= range + e.r) {
            if (arc >= 6) {
              applyDamage(e, dmg, def.status, def.school, def.lifesteal || 0);
            } else {
              const ea = Math.atan2(e.y - p.y, e.x - p.x);
              let diff = Math.abs(ea - aimAngle);
              if (diff > Math.PI) diff = Math.PI * 2 - diff;
              if (diff <= arc * 0.55) {
                applyDamage(e, dmg, def.status, def.school, def.lifesteal || 0);
              }
            }
          }
        });
        sfx.tone(320, 0.08, "sawtooth", 0.04, 150);
      }

      // Cracked Echo Bell double-cast
      if (!isDouble && st.doubleCastChance > 0 && Math.random() < st.doubleCastChance) {
        castSpell(slot, true);
      }
    }

    function spawnEnemy(isBoss = false) {
      const p = state.player;
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.max(W, H) * 0.58 + 60;
      const x = p.x + Math.cos(ang) * dist;
      const y = p.y + Math.sin(ang) * dist;

      const scale = 1 + (state.level - 1) * 0.18 + state.time / 95;

      if (isBoss) {
        const bossNames = [
          "INK LEVIATHAN",
          "THE SCRIBBLED KING",
          "ABYSSAL DOODLE HYDRA",
          "GRAND ERASER FIEND"
        ];
        const name = bossNames[Math.floor((state.level / 10 - 1) % bossNames.length)];
        const boss = {
          isBoss: true,
          name,
          shape: "boss",
          x,
          y,
          r: 40,
          hp: Math.round(920 * scale),
          maxHp: Math.round(920 * scale),
          speed: 78 * state.stats.enemySpeedMult,
          dmg: Math.round(20 + state.level * 0.9),
          xpVal: 80,
          color: "#f43f5e",
          wobble: Math.random() * 10,
          shootCd: 1.8,
          hitFlash: 0,
          burnTimer: 0,
          frostTimer: 0,
          vulnTimer: 0,
          pulledTimer: 0,
          shockTimer: 0
        };
        state.enemies.push(boss);
        state.bossActive = boss;
        addPopup(p.x, p.y - 46, `BOSS APPROACHES: ${name}!`, "#f43f5e", 15);
        sfx.tone(110, 0.32, "sawtooth", 0.1, 70);
        return;
      }

      const archetypes = [
        { shape: "blob", r: 14, hp: 32, speed: 78, dmg: 10, xp: 8, color: "#a78bfa" },
        { shape: "imp", r: 12, hp: 22, speed: 118, dmg: 9, xp: 9, color: "#fb7185" },
        { shape: "spiky", r: 17, hp: 62, speed: 62, dmg: 14, xp: 14, color: "#38bdf8" },
        { shape: "knight", r: 19, hp: 84, speed: 74, dmg: 16, xp: 16, color: "#fbbf24" }
      ];
      const maxIdx = Math.min(archetypes.length, 2 + Math.floor(state.level / 4));
      const base = archetypes[Math.floor(Math.random() * maxIdx)];

      state.enemies.push({
        isBoss: false,
        shape: base.shape,
        x,
        y,
        r: base.r,
        hp: Math.round(base.hp * scale),
        maxHp: Math.round(base.hp * scale),
        speed: base.speed * state.stats.enemySpeedMult,
        dmg: Math.round(base.dmg * (1 + state.level * 0.05)),
        xpVal: base.xp,
        color: base.color,
        wobble: Math.random() * 10,
        hitFlash: 0,
        burnTimer: 0,
        frostTimer: 0,
        vulnTimer: 0,
        pulledTimer: 0,
        shockTimer: 0
      });
    }

    function openLevelDraft() {
      state.mode = "draft";
      const ownedIds = new Set(state.ownedSpells.map((s) => s.def.id));
      const choices = [];

      // 1. Check Optional Duo Fusions (never forced!)
      const readyFusions = DATA.fusions.filter(
        (f) =>
          !state.fusedIds.has(f.id) &&
          f.requires.every((reqId) => ownedIds.has(reqId))
      );
      if (readyFusions.length) {
        const fuse = readyFusions[Math.floor(Math.random() * readyFusions.length)];
        choices.push({ type: "fusion", item: fuse });
      }

      // 2. Offer a Cursed Pact every 3rd level (or 32% chance)
      const availPacts = DATA.pacts.filter(
        (pk) => !state.ownedPacts.some((op) => op.id === pk.id)
      );
      if (availPacts.length && (state.level % 3 === 0 || Math.random() < 0.28) && choices.length < 3) {
        const pact = availPacts[Math.floor(Math.random() * availPacts.length)];
        choices.push({ type: "pact", item: pact });
      }

      // 3. Fill remaining slots with New Spells (from 50-spell pool) or Upgrades
      const usedIds = new Set(choices.map((c) => c.item.id));
      let guard = 0;
      while (choices.length < 3 && guard < 40) {
        guard++;
        const offerUpgrade =
          state.ownedSpells.length >= 2 &&
          (state.ownedSpells.length >= 9 || Math.random() < 0.36);

        if (offerUpgrade) {
          const slot = state.ownedSpells[Math.floor(Math.random() * state.ownedSpells.length)];
          if (!usedIds.has(slot.def.id)) {
            usedIds.add(slot.def.id);
            choices.push({ type: "upgrade", item: slot.def, nextLvl: slot.level + 1 });
          }
        } else {
          const unowned = DATA.spells.filter(
            (sp) => !ownedIds.has(sp.id) && !usedIds.has(sp.id)
          );
          if (unowned.length) {
            const pick = unowned[Math.floor(Math.random() * unowned.length)];
            usedIds.add(pick.id);
            choices.push({ type: "spell", item: pick });
          }
        }
      }

      ovTitle.textContent = `LEVEL ${state.level} — GRIMOIRE DRAFT`;
      ovSub.textContent =
        "Choose a new spell, level an existing incantation, fuse a Duo Rune (optional), or accept a Cursed Trade-Off Pact.";
      btnRow.innerHTML = "";

      const grid = document.createElement("div");
      grid.className = "draft-grid";

      choices.forEach((ch) => {
        const card = document.createElement("button");
        card.type = "button";

        if (ch.type === "fusion") {
          card.className = "draft-card draft-card--fusion";
          card.innerHTML = `
            <span class="draft-badge">✦ OPTIONAL DUO FUSION</span>
            <h4 class="draft-name">${ch.item.name}</h4>
            <p class="draft-desc">${ch.item.desc}</p>
            <span class="draft-badge" style="color:#fde68a">IGNORING KEEPS BOTH SPELLS SEPARATE</span>
          `;
          card.addEventListener("click", () => {
            state.fusedIds.add(ch.item.id);
            // Replace ingredients with the fused super-spell
            state.ownedSpells = state.ownedSpells.filter(
              (s) => !ch.item.requires.includes(s.def.id)
            );
            addSpell(ch.item, true);
            addPopup(state.player.x, state.player.y - 34, `FUSED: ${ch.item.name.toUpperCase()}!`, "#fbbf24", 14);
            sfx.tone(523, 0.14, "triangle", 0.1, 1046);
            closeOverlayToPlay();
          });
        } else if (ch.type === "pact") {
          card.className = "draft-card draft-card--pact";
          card.innerHTML = `
            <span class="draft-badge">☠ CURSED TRADE-OFF PACT</span>
            <h4 class="draft-name">${ch.item.name}</h4>
            <p class="draft-desc"><strong style="color:#34d399">▲ ${ch.item.upside}</strong><br/><strong style="color:#fb7185">▼ ${ch.item.downside}</strong></p>
          `;
          card.addEventListener("click", () => {
            state.ownedPacts.push(ch.item);
            ch.item.apply(state.stats);
            addPopup(state.player.x, state.player.y - 32, `PACT SEALED: ${ch.item.name.toUpperCase()}`, "#fb7185", 13);
            sfx.tone(180, 0.18, "sawtooth", 0.08, 90);
            updateHud();
            closeOverlayToPlay();
          });
        } else if (ch.type === "upgrade") {
          const sc = DATA.schools[ch.item.school];
          card.className = "draft-card";
          card.innerHTML = `
            <span class="draft-badge" style="color:${sc.color}">▲ UPGRADE • ${sc.name.toUpperCase()}</span>
            <h4 class="draft-name">${ch.item.name} (LVL ${ch.nextLvl})</h4>
            <p class="draft-desc">+28% Spell Power, reduced cooldown &amp; amplified multi-cast scaling.</p>
          `;
          card.addEventListener("click", () => {
            addSpell(ch.item, false);
            sfx.tone(440, 0.09, "triangle", 0.07, 660);
            closeOverlayToPlay();
          });
        } else {
          const sc = DATA.schools[ch.item.school];
          const curCount = state.schoolCounts[ch.item.school] || 0;
          card.className = "draft-card";
          card.innerHTML = `
            <span class="draft-badge" style="color:${sc.color}">NEW SPELL • ${sc.name.toUpperCase()} (${curCount + 1}/4)</span>
            <h4 class="draft-name">${ch.item.name}</h4>
            <p class="draft-desc">${ch.item.desc}</p>
            <span class="draft-badge" style="color:#94a3b8">${curCount + 1 === 2 ? "UNLOCKS 2-PC SYNERGY!" : curCount + 1 === 4 ? "UNLOCKS 4-PC SYNERGY!" : sc.synergy2}</span>
          `;
          card.addEventListener("click", () => {
            addSpell(ch.item, false);
            sfx.tone(392, 0.09, "triangle", 0.07, 587);
            closeOverlayToPlay();
          });
        }

        grid.appendChild(card);
      });

      draftMount.innerHTML = "";
      draftMount.appendChild(grid);
      overlay.classList.remove("hidden");
    }

    function openTomeModal() {
      if (state.mode === "tome") {
        closeOverlayToPlay();
        return;
      }
      if (state.mode !== "playing") return;
      state.mode = "tome";
      ovTitle.textContent = "ARCANE TOME & SYNERGIES";

      const activeSynergies = Object.values(DATA.schools)
        .filter((sc) => (state.schoolCounts[sc.id] || 0) >= 2)
        .map((sc) => {
          const c = state.schoolCounts[sc.id];
          return `<span style="color:${sc.color}"><strong>${sc.name} (${c})</strong>: ${c >= 4 ? sc.synergy4 : sc.synergy2}</span>`;
        });

      ovSub.innerHTML = activeSynergies.length
        ? activeSynergies.join(" &nbsp;•&nbsp; ")
        : "Collect 2 or 4 spells from the same arcane school to unlock School Synergies.";

      const listHtml = state.ownedSpells
        .map((s) => {
          const sc = DATA.schools[s.def.school];
          return `<div class="draft-card" style="padding:10px;border-color:${s.isFusion ? "#f59e0b" : "rgba(255,255,255,0.16)"}">
            <span class="draft-badge" style="color:${sc.color}">${s.isFusion ? "✦ FUSION" : sc.name.toUpperCase()} • LVL ${s.level}</span>
            <strong class="draft-name" style="font-size:0.74rem">${s.def.name}</strong>
          </div>`;
        })
        .join("");

      const pactsHtml = state.ownedPacts.length
        ? `<div style="margin-top:10px;font-size:0.74rem;color:#fb7185"><strong>ACTIVE PACTS:</strong> ${state.ownedPacts.map((p) => p.name).join(", ")}</div>`
        : "";

      draftMount.innerHTML = `<div class="draft-grid">${listHtml}</div>${pactsHtml}`;
      btnRow.innerHTML = `<button type="button" class="arcade-btn" id="grimResumeBtn">RESUME ABYSS</button>`;
      container.querySelector("#grimResumeBtn").addEventListener("click", closeOverlayToPlay);
      overlay.classList.remove("hidden");
    }

    function closeOverlayToPlay() {
      state.mode = "playing";
      draftMount.innerHTML = "";
      overlay.classList.add("hidden");
    }

    function triggerDash() {
      if (state.mode !== "playing") return;
      const p = state.player;
      if (p.dashCd > 0) return;
      p.dashTimer = 0.16;
      p.invuln = Math.max(p.invuln, 0.28);
      p.dashCd = 1.45 * state.stats.dashCdMult;
      addParticles(p.x, p.y, "#c084fc", 14, 190);
      sfx.tone(480, 0.08, "sine", 0.06, 920);
    }

    function triggerGameOver() {
      state.mode = "gameover";
      if (state.level > bestLevel) {
        bestLevel = state.level;
        localStorage.setItem(BEST_KEY, String(bestLevel));
      }
      sfx.noise(0.25, 0.12);
      sfx.tone(180, 0.35, "sawtooth", 0.09, 60);

      ovTitle.textContent = "THE GRIMOIRE CLOSES";
      ovSub.innerHTML = `REACHED <strong style="color:#c084fc">LEVEL ${state.level}</strong> &nbsp;•&nbsp; KILLS: <strong style="color:#38bdf8">${state.kills}</strong> &nbsp;•&nbsp; SPELLS: ${state.ownedSpells.length} &nbsp;•&nbsp; BEST LVL: ${bestLevel}`;
      draftMount.innerHTML = "";
      btnRow.innerHTML = `<button type="button" class="arcade-btn" id="grimRetryBtn" style="background:#c084fc;border-color:#c084fc;color:#12071f">ENTER ABYSS AGAIN</button>`;
      container.querySelector("#grimRetryBtn").addEventListener("click", resetRun);
      overlay.classList.remove("hidden");
    }

    function updateHud() {
      const st = state.stats;
      hpEl.textContent = `${Math.max(0, Math.ceil(st.hp))} / ${st.maxHp}`;
      lvlEl.textContent = String(state.level);
      killsEl.textContent = String(state.kills);
      const mins = String(Math.floor(state.time / 60)).padStart(2, "0");
      const secs = String(Math.floor(state.time % 60)).padStart(2, "0");
      timeEl.textContent = `${mins}:${secs}`;
      buildBadge.textContent = `SPELLS: ${state.ownedSpells.length} • PACTS: ${state.ownedPacts.length}`;
    }

    function update(dt) {
      if (state.mode !== "playing") return;

      const p = state.player;
      const st = state.stats;
      state.time += dt;
      if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 28);
      if (p.invuln > 0) p.invuln = Math.max(0, p.invuln - dt);
      if (p.dashCd > 0) p.dashCd = Math.max(0, p.dashCd - dt);

      // Passive regen vs Frenzy Crown self-burn
      if (!st.noRegen && st.hp < st.maxHp) {
        state.regenTimer += dt;
        if (state.regenTimer >= 2.2) {
          state.regenTimer = 0;
          st.hp = Math.min(st.maxHp, st.hp + 1.5);
        }
      }
      if (st.frenzyBurn) {
        state.frenzyTimer += dt;
        if (state.frenzyTimer >= 2.5) {
          state.frenzyTimer = 0;
          st.hp = Math.max(1, st.hp - 2);
          state.novas.push({ x: p.x, y: p.y, r: 8, maxR: 115, color: "#fb7185", life: 0.24, maxLife: 0.24 });
          state.enemies.forEach((e) => {
            if (!e.dead && Math.hypot(e.x - p.x, e.y - p.y) < 115) {
              applyDamage(e, 26, "burn", "ashen");
            }
          });
        }
      }

      // Movement vector
      let mx = 0;
      let my = 0;
      if (keys.KeyW || keys.ArrowUp) my -= 1;
      if (keys.KeyS || keys.ArrowDown) my += 1;
      if (keys.KeyA || keys.ArrowLeft) mx -= 1;
      if (keys.KeyD || keys.ArrowRight) mx += 1;

      if (mx === 0 && my === 0 && pointer.active) {
        const dx = pointer.sx - W * 0.5;
        const dy = pointer.sy - H * 0.5;
        const d = Math.hypot(dx, dy);
        if (d > 18) {
          mx = dx / d;
          my = dy / d;
        }
      }

      if (mx !== 0 || my !== 0) {
        const mag = Math.hypot(mx, my);
        mx /= mag;
        my /= mag;
        p.facingX = mx;
        p.facingY = my;
      }

      let moveSpeed =
        215 *
        st.speedMult *
        (hasSynergy("tempest", 2) ? 1.12 : 1) *
        (hasSynergy("familiar", 4) ? 1.12 : 1);

      if (p.dashTimer > 0) {
        p.dashTimer -= dt;
        moveSpeed *= 3.0;
        if (mx === 0 && my === 0) {
          mx = p.facingX;
          my = p.facingY;
        }
      }

      p.x += mx * moveSpeed * dt;
      p.y += my * moveSpeed * dt;

      // Flowing wizard cloak trail
      if (mx !== 0 || my !== 0 || p.dashTimer > 0) {
        p.cloakTrail.push({ x: p.x, y: p.y, life: 0.24 });
      }
      for (let i = p.cloakTrail.length - 1; i >= 0; i--) {
        p.cloakTrail[i].life -= dt;
        if (p.cloakTrail[i].life <= 0) p.cloakTrail.splice(i, 1);
      }

      // Auto-cast owned spells
      const globalCd = st.cdMult * (hasSynergy("tempest", 2) ? 0.88 : 1);
      state.ownedSpells.forEach((slot) => {
        if (slot.def.kind === "familiar") return;
        if (slot.def.kind === "orbit") {
          // Orbiting blades tick damage directly
          slot.cdTimer -= dt;
          if (slot.cdTimer <= 0) {
            slot.cdTimer = Math.max(0.14, slot.def.cd * globalCd);
            const cnt = (slot.def.count || 2) + Math.floor((slot.level - 1) / 2);
            const rad = (slot.def.radius || 72) * st.aoeMult;
            const dmg = slot.def.dmg * (1 + (slot.level - 1) * 0.28);
            for (let k = 0; k < cnt; k++) {
              const ang = state.time * 3.1 + (k / cnt) * Math.PI * 2;
              const ox = p.x + Math.cos(ang) * rad;
              const oy = p.y + Math.sin(ang) * rad;
              state.enemies.forEach((e) => {
                if (!e.dead && Math.hypot(e.x - ox, e.y - oy) <= e.r + 22) {
                  applyDamage(e, dmg, slot.def.status, slot.def.school);
                  if (slot.def.pull) {
                    const pa = Math.atan2(p.y - e.y, p.x - e.x);
                    e.x += Math.cos(pa) * 18;
                    e.y += Math.sin(pa) * 18;
                  }
                }
              });
            }
          }
          return;
        }

        slot.cdTimer -= dt;
        if (slot.cdTimer <= 0 && state.enemies.length > 0) {
          const lvlCd = Math.max(0.55, 1 - (slot.level - 1) * 0.06);
          slot.cdTimer = Math.max(0.24, slot.def.cd * globalCd * lvlCd);
          castSpell(slot, false);
        }
      });

      // Update Arcane Familiars
      const famSpeedBonus = hasSynergy("familiar", 2) ? 1.25 : 1;
      state.familiars.forEach((f, idx) => {
        const def = f.spellRef.def;
        const dmg = def.dmg * (1 + (f.spellRef.level - 1) * 0.3);
        const tgt = nearestEnemy(f.x, f.y, 440);
        f.cd -= dt * famSpeedBonus;

        if (def.role === "chaser" && tgt) {
          const a = Math.atan2(tgt.y - f.y, tgt.x - f.x);
          f.x += Math.cos(a) * def.speed * dt;
          f.y += Math.sin(a) * def.speed * dt;
          if (Math.hypot(tgt.x - f.x, tgt.y - f.y) <= tgt.r + 16 && f.cd <= 0) {
            f.cd = def.cd;
            applyDamage(tgt, dmg, def.status, "familiar");
            addParticles(tgt.x, tgt.y, def.color, 6, 110);
          }
        } else {
          // Orbit gently around wizard and fire / bomb
          f.angle += dt * 1.9;
          const desiredX = p.x + Math.cos(f.angle + idx * 1.3) * 56;
          const desiredY = p.y + Math.sin(f.angle + idx * 1.3) * 56;
          f.x += (desiredX - f.x) * Math.min(1, dt * 6);
          f.y += (desiredY - f.y) * Math.min(1, dt * 6);

          if (tgt && f.cd <= 0) {
            f.cd = def.cd;
            const a = Math.atan2(tgt.y - f.y, tgt.x - f.x);
            state.projectiles.push({
              x: f.x,
              y: f.y,
              vx: Math.cos(a) * 420,
              vy: Math.sin(a) * 420,
              r: def.role === "bomber" ? 8 : 5,
              dmg,
              pierce: 1,
              explode: def.role === "bomber" ? 56 * st.aoeMult : 0,
              color: def.color,
              status: def.status,
              school: "familiar",
              life: 1.5,
              hitSet: new Set()
            });
          }
        }
      });

      // Spawn hordes (scales cleanly with time & level)
      state.spawnTimer -= dt;
      if (state.spawnTimer <= 0 && state.enemies.length < 95) {
        const batch = 1 + Math.floor(state.level / 5);
        for (let i = 0; i < batch; i++) spawnEnemy(false);
        state.spawnTimer = Math.max(0.24, (1.05 - state.level * 0.025) / st.spawnRateMult);
      }

      // Every-10-level Boss Trigger
      if (state.level >= state.nextBossLevel && !state.bossActive) {
        state.nextBossLevel += 10;
        spawnEnemy(true);
      }

      // Update Projectiles & Orbs
      for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const pr = state.projectiles[i];
        pr.life -= dt;
        if (pr.homing) {
          const t = nearestEnemy(pr.x, pr.y, 460);
          if (t) {
            const desired = Math.atan2(t.y - pr.y, t.x - pr.x);
            const cur = Math.atan2(pr.vy, pr.vx);
            let diff = desired - cur;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            const nextA = cur + Math.max(-5 * dt, Math.min(5 * dt, diff));
            pr.vx = Math.cos(nextA) * pr.speed;
            pr.vy = Math.sin(nextA) * pr.speed;
          }
        }
        pr.x += pr.vx * dt;
        pr.y += pr.vy * dt;

        if (pr.isOrb) {
          pr.tickCd -= dt;
          if (pr.tickCd <= 0) {
            pr.tickCd = 0.24;
            state.enemies.forEach((e) => {
              if (e.dead) return;
              const d = Math.hypot(e.x - pr.x, e.y - pr.y);
              if (d <= pr.r + e.r + 12) {
                applyDamage(e, pr.dmg * 0.42, pr.status, pr.school);
              }
              if (pr.pull && d < pr.r * 3.5 && d > 8) {
                const a = Math.atan2(pr.y - e.y, pr.x - e.x);
                e.x += Math.cos(a) * pr.pull * dt * 2.4;
                e.y += Math.sin(a) * pr.pull * dt * 2.4;
              }
            });
          }
          if (pr.life <= 0) {
            state.novas.push({ x: pr.x, y: pr.y, r: pr.r, maxR: pr.r * 2.3, color: pr.color, life: 0.24, maxLife: 0.24 });
            state.enemies.forEach((e) => {
              if (!e.dead && Math.hypot(e.x - pr.x, e.y - pr.y) <= pr.r * 2.3 + e.r) {
                applyDamage(e, pr.dmg, pr.status, pr.school);
              }
            });
            state.projectiles.splice(i, 1);
          }
          continue;
        }

        let remove = pr.life <= 0;
        for (let j = 0; j < state.enemies.length && !remove; j++) {
          const e = state.enemies[j];
          if (e.dead || pr.hitSet.has(e)) continue;
          if (Math.hypot(e.x - pr.x, e.y - pr.y) <= e.r + pr.r) {
            pr.hitSet.add(e);
            applyDamage(e, pr.dmg, pr.status, pr.school);
            if (pr.explode > 0) {
              state.novas.push({ x: pr.x, y: pr.y, r: 8, maxR: pr.explode, color: pr.color, life: 0.2, maxLife: 0.2 });
              state.enemies.forEach((o) => {
                if (!o.dead && o !== e && Math.hypot(o.x - pr.x, o.y - pr.y) <= pr.explode + o.r) {
                  applyDamage(o, pr.dmg * 0.65, pr.status, pr.school);
                }
              });
            }
            pr.pierce -= 1;
            if (pr.pierce <= 0) remove = true;
          }
        }
        if (remove) state.projectiles.splice(i, 1);
      }

      // Update Ground Zones
      for (let i = state.zones.length - 1; i >= 0; i--) {
        const z = state.zones[i];
        z.life -= dt;
        z.tick -= dt;
        if (z.pull) {
          state.enemies.forEach((e) => {
            if (e.dead) return;
            const d = Math.hypot(e.x - z.x, e.y - z.y);
            if (d < z.r * 1.45 && d > 6) {
              const a = Math.atan2(z.y - e.y, z.x - e.x);
              const mult = e.isBoss ? 0.2 : 1;
              e.x += Math.cos(a) * z.pull * mult * dt;
              e.y += Math.sin(a) * z.pull * mult * dt;
              e.pulledTimer = 0.6;
            }
          });
        }
        if (z.tick <= 0) {
          z.tick = 0.42;
          state.enemies.forEach((e) => {
            if (!e.dead && Math.hypot(e.x - z.x, e.y - z.y) <= z.r + e.r) {
              applyDamage(e, z.dmg, z.status, z.school);
            }
          });
        }
        if (z.life <= 0) state.zones.splice(i, 1);
      }

      // Update Falling Meteors / Pillars
      for (let i = state.meteors.length - 1; i >= 0; i--) {
        const m = state.meteors[i];
        m.delay -= dt;
        if (m.delay <= 0) {
          state.novas.push({ x: m.x, y: m.y, r: 10, maxR: m.r, color: m.color, life: 0.26, maxLife: 0.26 });
          addParticles(m.x, m.y, m.color, 16, 210);
          state.shake = Math.max(state.shake, 6);
          sfx.noise(0.08, 0.06);
          state.enemies.forEach((e) => {
            if (!e.dead && Math.hypot(e.x - m.x, e.y - m.y) <= m.r + e.r) {
              applyDamage(e, m.dmg, m.status, m.school);
            }
          });
          state.meteors.splice(i, 1);
        }
      }

      // Visual effect decays
      for (let i = state.beams.length - 1; i >= 0; i--) {
        state.beams[i].life -= dt;
        if (state.beams[i].life <= 0) state.beams.splice(i, 1);
      }
      for (let i = state.novas.length - 1; i >= 0; i--) {
        const n = state.novas[i];
        n.life -= dt;
        n.r = n.maxR * (1 - n.life / n.maxLife);
        if (n.life <= 0) state.novas.splice(i, 1);
      }
      for (let i = state.chains.length - 1; i >= 0; i--) {
        state.chains[i].life -= dt;
        if (state.chains[i].life <= 0) state.chains.splice(i, 1);
      }
      for (let i = state.slashes.length - 1; i >= 0; i--) {
        state.slashes[i].life -= dt;
        if (state.slashes[i].life <= 0) state.slashes.splice(i, 1);
      }

      // Update Enemies & Boss AI
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const e = state.enemies[i];
        if (e.dead) {
          state.enemies.splice(i, 1);
          continue;
        }
        e.wobble += dt * 7;
        if (e.hitFlash > 0) e.hitFlash -= dt;
        if (e.vulnTimer > 0) e.vulnTimer -= dt;
        if (e.pulledTimer > 0) e.pulledTimer -= dt;
        if (e.shockTimer > 0) e.shockTimer -= dt;

        // Burn DoT
        if (e.burnTimer > 0) {
          e.burnTimer -= dt;
          const burnMult = hasSynergy("ashen", 2) ? 1.4 : 1;
          e.hp -= (e.isBoss ? 22 : e.maxHp * 0.08 + 7) * burnMult * st.statusMult * dt;
          if (e.hp <= 0) {
            onEnemyKilled(e);
            state.enemies.splice(i, 1);
            continue;
          }
        }

        let slow = 1;
        if (e.frostTimer > 0) {
          e.frostTimer -= dt;
          slow = hasSynergy("glacial", 2) ? 0.52 : 0.72;
        }
        if (e.shockTimer > 0) slow *= 0.25;

        const a = Math.atan2(p.y - e.y, p.x - e.x);
        e.x += Math.cos(a) * e.speed * slow * dt;
        e.y += Math.sin(a) * e.speed * slow * dt;

        // Boss radial volley
        if (e.isBoss) {
          e.shootCd -= dt;
          if (e.shootCd <= 0) {
            e.shootCd = 2.1;
            const spokes = 10;
            for (let s = 0; s < spokes; s++) {
              const ba = a + (s / spokes) * Math.PI * 2;
              state.enemyBullets.push({
                x: e.x,
                y: e.y,
                vx: Math.cos(ba) * 195,
                vy: Math.sin(ba) * 195,
                r: 6,
                dmg: Math.round(e.dmg * 0.7),
                life: 3.5
              });
            }
            sfx.tone(150, 0.14, "sawtooth", 0.06, 90);
          }
        }

        // Contact damage against wizard
        if (Math.hypot(e.x - p.x, e.y - p.y) <= e.r + p.r - 2 && p.invuln <= 0) {
          const taken = Math.max(1, Math.round(e.dmg * st.dmgTakenMult));
          st.hp -= taken;
          p.invuln = 0.52;
          state.shake = Math.max(state.shake, 9);
          addPopup(p.x, p.y - 24, `-${taken}`, "#fb7185", 13);
          sfx.noise(0.09, 0.08);
          if (st.hp <= 0) {
            triggerGameOver();
            return;
          }
        }
      }

      // Boss projectiles
      for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
        const b = state.enemyBullets[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.life -= dt;
        if (Math.hypot(b.x - p.x, b.y - p.y) <= b.r + p.r && p.invuln <= 0) {
          const taken = Math.max(1, Math.round(b.dmg * st.dmgTakenMult));
          st.hp -= taken;
          p.invuln = 0.5;
          state.shake = Math.max(state.shake, 8);
          state.enemyBullets.splice(i, 1);
          if (st.hp <= 0) {
            triggerGameOver();
            return;
          }
          continue;
        }
        if (b.life <= 0) state.enemyBullets.splice(i, 1);
      }

      // XP Gems & Magnet Pull
      for (let i = state.gems.length - 1; i >= 0; i--) {
        const g = state.gems[i];
        const d = Math.hypot(p.x - g.x, p.y - g.y);
        if (d < st.pickupRadius) {
          const a = Math.atan2(p.y - g.y, p.x - g.x);
          g.x += Math.cos(a) * 380 * dt;
          g.y += Math.sin(a) * 380 * dt;
        }
        if (d < p.r + 12) {
          state.xp += g.val * st.xpMult;
          state.gems.splice(i, 1);
          sfx.tone(720, 0.04, "sine", 0.025, 960);
          if (state.xp >= state.xpNext) {
            state.xp -= state.xpNext;
            state.level += 1;
            state.xpNext = Math.round(state.xpNext * 1.24 + 14);
            st.hp = Math.min(st.maxHp, st.hp + 12);
            updateHud();
            openLevelDraft();
            return;
          }
        }
      }

      // Particles & Popups
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

      updateHud();
    }

    function drawWizard(p) {
      // Flowing cloak trail
      p.cloakTrail.forEach((t) => {
        ctx.globalAlpha = t.life * 1.6;
        ctx.fillStyle = "#581c87";
        ctx.beginPath();
        ctx.arc(t.x, t.y + 4, 11, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      const blink = p.invuln > 0 && Math.floor(p.invuln * 18) % 2 === 0;
      if (blink) return;

      ctx.save();
      ctx.translate(p.x, p.y);

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.beginPath();
      ctx.ellipse(0, 15, 13, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wizard robe body
      ctx.fillStyle = "#4c1d95";
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(13, 14);
      ctx.lineTo(-13, 14);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Glowing eyes beneath hat
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(-4, -3, 3, 3);
      ctx.fillRect(2, -3, 3, 3);

      // Crooked Pointed Wizard Hat
      const lean = p.facingX >= 0 ? -5 : 5;
      ctx.fillStyle = "#1e1b4b";
      // Brim
      ctx.beginPath();
      ctx.ellipse(0, -8, 17, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Cone
      ctx.beginPath();
      ctx.moveTo(-11, -8);
      ctx.quadraticCurveTo(lean * 0.4, -22, lean * 2.1, -31);
      ctx.lineTo(11, -8);
      ctx.closePath();
      ctx.fill();
      // Glowing arcane hatband
      ctx.strokeStyle = state.lastCastColor;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.lineTo(10, -10);
      ctx.stroke();

      // Orbiting floating spellbook / wand
      const bookX = Math.cos(state.time * 3) * 22;
      const bookY = Math.sin(state.time * 3) * 14 - 4;
      ctx.shadowBlur = 10;
      ctx.shadowColor = state.lastCastColor;
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(bookX - 5, bookY - 4, 10, 8);
      ctx.fillStyle = state.lastCastColor;
      ctx.fillRect(bookX - 3, bookY - 2, 6, 4);
      ctx.shadowBlur = 0;

      ctx.restore();
    }

    function drawDoodleEnemy(e) {
      ctx.save();
      ctx.translate(e.x, e.y);
      const wob = Math.sin(e.wobble) * 1.8;

      ctx.fillStyle = e.hitFlash > 0 ? "#ffffff" : e.frostTimer > 0 ? "#38bdf8" : e.color;
      ctx.strokeStyle = "#090b12";
      ctx.lineWidth = e.isBoss ? 3.5 : 2.2;

      if (e.isBoss) {
        // Massive sketchy Abyssal Doodle Boss
        ctx.beginPath();
        for (let a = 0; a < 12; a++) {
          const ang = (a / 12) * Math.PI * 2;
          const rr = e.r + (a % 2 === 0 ? 8 : -4) + Math.sin(e.wobble + a) * 3;
          const px = Math.cos(ang) * rr;
          const py = Math.sin(ang) * rr;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Crown horns & glowing angry eyes
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.moveTo(-18, -e.r + 4);
        ctx.lineTo(-10, -e.r - 16);
        ctx.lineTo(0, -e.r + 2);
        ctx.lineTo(10, -e.r - 16);
        ctx.lineTo(18, -e.r + 4);
        ctx.fill();

        ctx.fillStyle = "#fef08a";
        ctx.fillRect(-14, -8, 9, 8);
        ctx.fillRect(5, -8, 9, 8);
        ctx.fillStyle = "#090b12";
        ctx.fillRect(-10, 9, 20, 6);
      } else if (e.shape === "blob") {
        ctx.beginPath();
        ctx.arc(0, wob * 0.5, e.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#090b12";
        ctx.fillRect(-5, -3, 3, 4);
        ctx.fillRect(2, -3, 3, 4);
      } else if (e.shape === "imp") {
        ctx.beginPath();
        ctx.moveTo(0, -e.r - 3);
        ctx.lineTo(e.r, e.r);
        ctx.lineTo(-e.r, e.r);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(-4, -1, 3, 3);
        ctx.fillRect(2, -1, 3, 3);
      } else {
        // Spiky / Knight doodle
        ctx.beginPath();
        for (let k = 0; k < 8; k++) {
          const ang = (k / 8) * Math.PI * 2 + e.wobble * 0.12;
          const rad = k % 2 === 0 ? e.r + 3 : e.r - 4;
          const px = Math.cos(ang) * rad;
          const py = Math.sin(ang) * rad;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-5, -3, 4, 4);
        ctx.fillRect(2, -3, 4, 4);
      }

      // Status aura pips
      if (e.burnTimer > 0) {
        ctx.strokeStyle = "#f97316";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, e.r + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function draw() {
      ctx.save();
      if (state.shake > 0.2) {
        ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
      }

      // Deep arcane abyss background
      ctx.fillStyle = "#0b0916";
      ctx.fillRect(0, 0, W, H);

      const camX = state.player.x - W * 0.5;
      const camY = state.player.y - H * 0.5;

      // Infinite scrolling arcane rune grid
      const grid = 64;
      const offX = ((-camX % grid) + grid) % grid;
      const offY = ((-camY % grid) + grid) % grid;
      ctx.strokeStyle = "rgba(168, 85, 247, 0.11)";
      ctx.lineWidth = 1;
      for (let gx = offX; gx < W; gx += grid) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = offY; gy < H; gy += grid) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(-camX, -camY);

      // Ground Zones
      state.zones.forEach((z) => {
        ctx.save();
        ctx.globalAlpha = 0.28 + Math.sin(state.time * 8) * 0.08;
        ctx.fillStyle = z.color;
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.85;
        ctx.strokeStyle = z.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.restore();
      });

      // Meteor impact telegraphs
      state.meteors.forEach((m) => {
        const prog = 1 - m.delay / m.maxDelay;
        ctx.save();
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * prog, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // XP Gems
      state.gems.forEach((g) => {
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.moveTo(g.x, g.y - 5);
        ctx.lineTo(g.x + 4, g.y);
        ctx.lineTo(g.x, g.y + 5);
        ctx.lineTo(g.x - 4, g.y);
        ctx.closePath();
        ctx.fill();
      });

      // Orbiting spell blades / scythes
      state.ownedSpells
        .filter((s) => s.def.kind === "orbit")
        .forEach((slot) => {
          const cnt = (slot.def.count || 2) + Math.floor((slot.level - 1) / 2);
          const rad = (slot.def.radius || 72) * state.stats.aoeMult;
          for (let k = 0; k < cnt; k++) {
            const ang = state.time * 3.1 + (k / cnt) * Math.PI * 2;
            const ox = state.player.x + Math.cos(ang) * rad;
            const oy = state.player.y + Math.sin(ang) * rad;
            ctx.save();
            ctx.translate(ox, oy);
            ctx.rotate(ang + Math.PI * 0.5);
            ctx.shadowBlur = 12;
            ctx.shadowColor = slot.def.color;
            ctx.fillStyle = slot.def.color;
            ctx.beginPath();
            ctx.moveTo(0, -12);
            ctx.lineTo(8, 6);
            ctx.lineTo(-8, 6);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
        });

      // Enemies
      state.enemies.forEach(drawDoodleEnemy);

      // Arcane Familiars
      state.familiars.forEach((f) => {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = f.spellRef.def.color;
        ctx.fillStyle = f.spellRef.def.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(f.x - 3, f.y - 2, 2, 2);
        ctx.fillRect(f.x + 1, f.y - 2, 2, 2);
        ctx.restore();
      });

      // Wizard Hero
      drawWizard(state.player);

      // Projectiles & Orbs
      state.projectiles.forEach((pr) => {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = pr.color;
        ctx.fillStyle = pr.color;
        ctx.beginPath();
        ctx.arc(pr.x, pr.y, pr.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Enemy boss bullets
      ctx.fillStyle = "#fb7185";
      state.enemyBullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Beams
      state.beams.forEach((bm) => {
        ctx.save();
        ctx.globalAlpha = bm.life / bm.maxLife;
        ctx.strokeStyle = bm.color;
        ctx.lineWidth = bm.width;
        ctx.lineCap = "round";
        ctx.shadowBlur = 18;
        ctx.shadowColor = bm.color;
        ctx.beginPath();
        ctx.moveTo(bm.x1, bm.y1);
        ctx.lineTo(bm.x2, bm.y2);
        ctx.stroke();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = bm.width * 0.35;
        ctx.stroke();
        ctx.restore();
      });

      // Expanding Novas
      state.novas.forEach((n) => {
        ctx.save();
        ctx.globalAlpha = n.life / n.maxLife;
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Lightning Chains
      state.chains.forEach((c) => {
        ctx.save();
        ctx.globalAlpha = c.life / 0.24;
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 12;
        ctx.shadowColor = c.color;
        ctx.beginPath();
        c.pts.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
        ctx.restore();
      });

      // Lash Slash Arcs
      state.slashes.forEach((sl) => {
        ctx.save();
        ctx.globalAlpha = sl.life / sl.maxLife;
        ctx.strokeStyle = sl.color;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(sl.x, sl.y, sl.range, sl.angle - sl.arc * 0.5, sl.angle + sl.arc * 0.5);
        ctx.stroke();
        ctx.restore();
      });

      // Particles & Floating Numbers
      state.particles.forEach((pt) => {
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
      });
      ctx.globalAlpha = 1;

      ctx.textAlign = "center";
      state.popups.forEach((pp) => {
        ctx.globalAlpha = Math.max(0, pp.life / 0.72);
        ctx.font = `900 ${pp.size}px Unbounded, sans-serif`;
        ctx.fillStyle = pp.color;
        ctx.fillText(pp.text, pp.x, pp.y);
      });
      ctx.globalAlpha = 1;

      ctx.restore(); // End world camera

      // Screen-Space XP Bar at Top
      const xpRatio = Math.min(1, state.xp / Math.max(1, state.xpNext));
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(0, 0, W, 5);
      ctx.fillStyle = "#c084fc";
      ctx.fillRect(0, 0, W * xpRatio, 5);

      // Screen-Space Boss HP Bar
      if (state.bossActive && !state.bossActive.dead) {
        const b = state.bossActive;
        const bw = Math.min(460, W - 60);
        const bx = (W - bw) * 0.5;
        const by = 18;
        ctx.fillStyle = "rgba(10,12,20,0.85)";
        ctx.fillRect(bx - 4, by - 4, bw + 8, 28);
        ctx.fillStyle = "#4c0519";
        ctx.fillRect(bx, by + 12, bw, 10);
        ctx.fillStyle = "#f43f5e";
        ctx.fillRect(bx, by + 12, bw * Math.max(0, b.hp / b.maxHp), 10);
        ctx.fillStyle = "#fef2f2";
        ctx.font = "900 10px Unbounded, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`BOSS // ${b.name}`, W * 0.5, by + 8);
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

    function onKeyDown(e) {
      keys[e.code] = true;
      if (e.code === "Space" || e.code === "ShiftLeft" || e.code === "ShiftRight") {
        if (state.mode === "playing") {
          e.preventDefault();
          triggerDash();
        }
      } else if (e.code === "Enter" && (state.mode === "menu" || state.mode === "gameover")) {
        resetRun();
      } else if (e.code === "Tab") {
        e.preventDefault();
        openTomeModal();
      }
    }

    function onKeyUp(e) {
      keys[e.code] = false;
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      pointer.sx = e.clientX - rect.left;
      pointer.sy = e.clientY - rect.top;
    }

    function onPointerDown(e) {
      pointer.active = true;
      onPointerMove(e);
    }

    function onPointerUp() {
      pointer.active = false;
    }

    startBtn.addEventListener("click", resetRun);
    tomeBtn.addEventListener("click", openTomeModal);
    touchDash.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      triggerDash();
    });

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", resize);

    lastTime = performance.now();
    rafId = requestAnimationFrame(loop);

    return {
      destroy() {
        destroyed = true;
        if (rafId) cancelAnimationFrame(rafId);
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("resize", resize);
      }
    };
  }
};