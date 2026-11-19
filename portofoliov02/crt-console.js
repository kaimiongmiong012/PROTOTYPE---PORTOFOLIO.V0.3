/* =========================================================
   KAI-VISION CRT CONSOLE ENGINE (V0.3)
   Web Audio Procedural Synth • Cartridge Hover Previews
   "Jumanji" Pull-In Theater • Safe Cartridge Mount / Eject
   ========================================================= */

window.CRTConsole = (function () {
  let audioCtx = null;
  let isMuted = false;
  let activeGame = null;
  let activeCartId = null;

  function ensureAudio() {
    if (isMuted) return null;
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  /* ---------------------------------------------------------
     PROCEDURAL WEB AUDIO SYNTH API (SHARED WITH ALL 4 GAMES)
     --------------------------------------------------------- */
  function tone(freq = 440, dur = 0.1, type = "triangle", gainVal = 0.06, endFreq = null) {
    const ctx = ensureAudio();
    if (!ctx || isMuted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(30, freq), now);
    if (endFreq && endFreq > 20) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + dur);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  function noise(dur = 0.12, gainVal = 0.08) {
    const ctx = ensureAudio();
    if (!ctx || isMuted) return;
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1800;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  }

  function playMotif(notes) {
    if (isMuted || !Array.isArray(notes)) return;
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        tone(freq, 0.11, "triangle", 0.042);
      }, idx * 55);
    });
  }

  function playInsertSweep() {
    if (isMuted) return;
    // Physical cartridge clunk + CRT warm-up power sweep
    noise(0.07, 0.09);
    tone(120, 0.12, "square", 0.06, 75);
    setTimeout(() => tone(240, 0.28, "sawtooth", 0.055, 960), 90);
    setTimeout(() => tone(523.25, 0.16, "triangle", 0.06, 1046.5), 240);
  }

  function playEjectSweep() {
    if (isMuted) return;
    tone(660, 0.18, "triangle", 0.06, 140);
    setTimeout(() => noise(0.08, 0.07), 80);
  }

  const audioApi = { tone, noise };

  function init() {
    const DATA = window.PORTFOLIO_DATA;
    if (!DATA || !DATA.cartridges) return;

    const previewFrame = document.getElementById("crtPreviewFrame");
    const crtFlash = document.getElementById("crtFlash");
    const crtPowerLed = document.getElementById("crtPowerLed");
    const crtStatusText = document.getElementById("crtStatusText");
    const crtChannelReadout = document.getElementById("crtChannelReadout");

    const attractSlotTag = document.getElementById("attractSlotTag");
    const attractTitle = document.getElementById("attractTitle");
    const attractDesc = document.getElementById("attractDesc");
    const attractMeta = document.getElementById("attractMeta");

    const cartButtons = document.querySelectorAll(".cartridge-card[data-cart]");
    const muteBtn = document.getElementById("crtMuteBtn");

    const theater = document.getElementById("crtTheater");
    const theaterShell = document.getElementById("crtTheaterShell");
    const theaterCartTag = document.getElementById("theaterCartTag");
    const theaterTitle = document.getElementById("theaterTitle");
    const theaterMuteBtn = document.getElementById("theaterMuteBtn");
    const theaterEjectBtn = document.getElementById("theaterEjectBtn");
    const gameMount = document.getElementById("crtGameMount");

    if (!previewFrame || !theater || !gameMount) return;

    const defaultAttract = {
      slot: "NO CARTRIDGE LOADED",
      title: "SELECT A CARTRIDGE BELOW",
      desc: "HOVER A CASSETTE TO PREVIEW AUDIO • CLICK TO INSERT & ZOOM INTO CRT",
      channel: "CH-00 // AV-IN",
      status: "STANDBY • INSERT CARTRIDGE",
      tags: ["01 PARKOUR", "02 50-SPELL ROGUELIKE", "03 CAMPUS FIGHTER", "04 PS1 3D BOSS CLIMBER"],
      bg: "radial-gradient(circle at 50% 42%, #192434 0%, var(--crt-glass) 76%)",
      accent: "#64e3db"
    };

    function syncMuteButtons() {
      const label = isMuted ? "SFX: OFF" : "SFX: ON";
      if (muteBtn) {
        muteBtn.textContent = label;
        muteBtn.setAttribute("aria-pressed", String(isMuted));
      }
      if (theaterMuteBtn) {
        theaterMuteBtn.textContent = label;
        theaterMuteBtn.setAttribute("aria-pressed", String(isMuted));
      }
    }

    function toggleMute() {
      isMuted = !isMuted;
      syncMuteButtons();
      if (!isMuted) tone(520, 0.08, "triangle", 0.05, 780);
    }

    if (muteBtn) muteBtn.addEventListener("click", toggleMute);
    if (theaterMuteBtn) theaterMuteBtn.addEventListener("click", toggleMute);

    function setPreview(cart) {
      if (!cart) {
        previewFrame.style.background = defaultAttract.bg;
        attractSlotTag.textContent = defaultAttract.slot;
        attractSlotTag.style.color = defaultAttract.accent;
        attractSlotTag.style.borderColor = "rgba(100, 227, 219, 0.4)";
        attractTitle.textContent = defaultAttract.title;
        attractDesc.textContent = defaultAttract.desc;
        crtChannelReadout.textContent = defaultAttract.channel;
        crtStatusText.textContent = defaultAttract.status;
        attractMeta.innerHTML = defaultAttract.tags.map((t) => `<span>${t}</span>`).join("");
        return;
      }

      previewFrame.style.background = cart.bgGradient;
      attractSlotTag.textContent = `${cart.slot} // ${cart.genre}`;
      attractSlotTag.style.color = cart.accent;
      attractSlotTag.style.borderColor = cart.accent;
      attractTitle.textContent = cart.title;
      attractDesc.textContent = cart.desc;
      crtChannelReadout.textContent = cart.channel;
      crtStatusText.textContent = `PREVIEWING ${cart.slot}`;
      attractMeta.innerHTML = cart.tags.map((t) => `<span>${t}</span>`).join("");
    }

    function launchCartridge(cartId) {
      const cart = DATA.cartridges[cartId];
      const engine = window.CRT_GAMES && window.CRT_GAMES[cartId];
      if (!cart || !engine) return;

      // Clean up any prior running cartridge first
      if (activeGame && typeof activeGame.destroy === "function") {
        activeGame.destroy();
        activeGame = null;
      }

      activeCartId = cartId;
      playInsertSweep();

      // CRT Phosphor Flash + LED flip
      if (crtPowerLed) crtPowerLed.classList.add("crt-led--active");
      if (crtStatusText) crtStatusText.textContent = `ACTIVE // ${cart.title}`;

      if (window.gsap && crtFlash) {
        window.gsap.fromTo(
          crtFlash,
          { opacity: 0.9 },
          { opacity: 0, duration: 0.36, ease: "power2.out" }
        );
      }

      theaterCartTag.textContent = cart.slot;
      theaterCartTag.style.color = cart.accent;
      theaterTitle.textContent = cart.title;

      // Open Jumanji Full-Focus Theater
      document.body.classList.add("theater-open");
      theater.classList.add("is-open");
      theater.setAttribute("aria-hidden", "false");

      if (window.gsap && theaterShell) {
        window.gsap.fromTo(
          theater,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power2.out" }
        );
        window.gsap.fromTo(
          theaterShell,
          { scale: 0.72, y: 42, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.44, ease: "back.out(1.25)" }
        );
      }

      // Mount game cleanly after shell layout settles
      gameMount.innerHTML = "";
      requestAnimationFrame(() => {
        activeGame = engine.mount(gameMount, audioApi);
      });
    }

    function ejectCartridge() {
      if (!theater.classList.contains("is-open")) return;
      playEjectSweep();

      if (activeGame && typeof activeGame.destroy === "function") {
        activeGame.destroy();
        activeGame = null;
      }
      activeCartId = null;

      const finishClose = () => {
        gameMount.innerHTML = "";
        theater.classList.remove("is-open");
        theater.setAttribute("aria-hidden", "true");
        document.body.classList.remove("theater-open");
        if (crtPowerLed) crtPowerLed.classList.remove("crt-led--active");
        setPreview(null);
      };

      if (window.gsap && theaterShell) {
        window.gsap.to(theaterShell, {
          scale: 0.84,
          opacity: 0,
          duration: 0.22,
          ease: "power2.in"
        });
        window.gsap.to(theater, {
          opacity: 0,
          duration: 0.22,
          ease: "power2.in",
          onComplete: finishClose
        });
      } else {
        finishClose();
      }
    }

    // Hover Preview & Click Insert listeners on all 4 cartridges
    let lastHoverTime = 0;
    cartButtons.forEach((btn) => {
      const cartId = btn.dataset.cart;
      const cart = DATA.cartridges[cartId];
      if (!cart) return;

      const onPreview = () => {
        setPreview(cart);
        const now = performance.now();
        if (now - lastHoverTime > 160) {
          lastHoverTime = now;
          playMotif(cart.motif);
        }
      };

      btn.addEventListener("mouseenter", onPreview);
      btn.addEventListener("focus", onPreview);
      btn.addEventListener("click", () => launchCartridge(cartId));
    });

    const bay = document.getElementById("cartridgeBay");
    if (bay) {
      bay.addEventListener("mouseleave", () => {
        if (!activeCartId) setPreview(null);
      });
    }

    if (theaterEjectBtn) {
      theaterEjectBtn.addEventListener("click", ejectCartridge);
    }

    // Backdrop click outside the CRT shell ejects cleanly
    theater.addEventListener("click", (e) => {
      if (e.target === theater) ejectCartridge();
    });

    // Shift + Escape always ejects (keeps plain Escape free for Veil of the Monolith's Sanctum Hub)
    window.addEventListener("keydown", (e) => {
      if (!theater.classList.contains("is-open")) return;
      if (e.code === "Escape" && (e.shiftKey || activeCartId !== "monolith")) {
        ejectCartridge();
      }
    });

    syncMuteButtons();
    setPreview(null);
  }

  return { init, tone, noise };
})();