// ======================
// Personaliza aquí
// ======================
const CONFIG = {
    // Palabra clave para desbloquear TODA la página (minúsculas)
    secretKey: "loshdosh14112025kisskiss",

    // Aniversario: 14/11/2025 23:14 (España peninsular)
    // Usamos formato ISO con offset +01:00 (CET) para que sea exacto.
    anniversaryISO: "2025-11-14T23:14:00+01:00",

    photos: [
        {
            src: "assets/img/01.mp4",
            type: "video",
            caption: "Nuestra primera caricia — 29/09/2025 ❤️"
        },
        {
            src: "assets/img/02.jpg",
            type: "image",
            caption: "Nuestra primera noche juntos — 01/10/2025 💞"
        },
        {
            src: "assets/img/03.jpg",
            type: "image",
            caption: "Nuestra primera cita oficial — 04/12/2025 ✨"
        }
    ],

    reasons: [
        { tag: "Tú", title: "Eres mi calma", text: "Karla, contigo todo se siente más fácil." },
        { tag: "Risas", title: "Me haces reír", text: "Mi Chiquitilla, incluso cuando el día no acompaña." },
        { tag: "Casa", title: "Eres hogar", text: "Donde estás tú, Reina, estoy bien." },
        { tag: "Detalles", title: "Tienes magia", text: "En lo pequeño, en lo grande, en todo." },
        { tag: "Nosotros", title: "Me encanta ser nosotros", text: "Compartir la vida contigo es mi plan favorito." },
        { tag: "Siempre", title: "Te elijo", text: "Hoy, mañana y cada día." }
    ],

    messages: [
        "Mi Chiquitilla, eres mi lugar favorito.",
        "Reina, contigo todo es mejor.",
        "Karla, gracias por existir 💘",
        "Te elegiría en todas las vidas.",
        "Eres mi plan favorito.",
        "Contigo, todo encaja.",
        "Me gustas en calma y en caos.",
        "Eres mi suerte."
    ]
};

// ======================
// Elementos (bloqueo)
/// ======================
const lockWrap = document.getElementById("lockWrap");
const lockMsg = document.getElementById("lockMsg");
const keyInput = document.getElementById("keyInput");
const unlockBtn = document.getElementById("unlockBtn");
const content = document.getElementById("content");

// ======================
// Elementos (contenido)
/// ======================
const msgEl = document.getElementById("msg");
const btnMsg = document.getElementById("btnMsg");
const btnConfetti = document.getElementById("btnConfetti");

const photoImg = document.getElementById("photoImg");
const photoVideo = document.getElementById("photoVideo");

const captionEl = document.getElementById("caption");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const dotsEl = document.getElementById("dots");
const galleryEl = document.getElementById("gallery");

const reasonsGrid = document.getElementById("reasonsGrid");
const chipsEl = document.getElementById("chips");

const toggleThemeBtn = document.getElementById("toggleTheme");

const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMins = document.getElementById("cdMins");
const cdSecs = document.getElementById("cdSecs");

const audio = document.getElementById("audio");
const musicBtn = document.getElementById("musicBtn");
const musicState = document.getElementById("musicState");

// ======================
// Desbloqueo de la página
// ======================
function unlockPage() {
    document.body.classList.add("unlocked");
    lockWrap.style.display = "none";
    content.hidden = false;

    burstConfetti();
    // Activar reveal
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
}

function tryUnlock() {
    const k = (keyInput.value || "").trim().toLowerCase();
    if (!k) return wiggle(keyInput);

    if (k === CONFIG.secretKey.toLowerCase()) {
        if (lockMsg) lockMsg.textContent = "Correcto 💘";
        unlockPage();
    } else {
        if (lockMsg) lockMsg.textContent = "Esa no es… prueba otra 😏";
        wiggle(keyInput);
    }
}

unlockBtn.addEventListener("click", tryUnlock);
keyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryUnlock();
});

// Si ya se desbloqueó antes en el mismo móvil/navegador
if (localStorage.getItem("sv_unlocked") === "1") {
    unlockPage();
}

// ======================
// Mensajes aleatorios (ya dentro)
// ======================
btnMsg?.addEventListener("click", () => {
    const txt = CONFIG.messages[Math.floor(Math.random() * CONFIG.messages.length)];
    msgEl.textContent = txt;
    pulse(msgEl);
});

btnConfetti?.addEventListener("click", () => burstConfetti());

// ======================
// Contador: tiempo desde aniversario hasta ahora
// ======================
const anniversary = new Date(CONFIG.anniversaryISO).getTime();

function tickAnniversary() {
    const now = Date.now();
    let diff = Math.max(0, now - anniversary); // tiempo transcurrido

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    const secs = Math.floor(diff / 1000);

    cdDays.textContent = String(days);
    cdHours.textContent = String(hours).padStart(2, "0");
    cdMins.textContent = String(mins).padStart(2, "0");
    cdSecs.textContent = String(secs).padStart(2, "0");
}
setInterval(tickAnniversary, 1000);
tickAnniversary();

// ======================
// Galería
// ======================
let idx = 0;

function buildDots() {
    dotsEl.innerHTML = "";
    CONFIG.photos.forEach((_, i) => {
        const d = document.createElement("div");
        d.className = "dot" + (i === idx ? " active" : "");
        d.addEventListener("click", () => {
            idx = i;
            renderPhoto(true);
        });
        dotsEl.appendChild(d);
    });
}

function renderPhoto(animate = false) {
    const p = CONFIG.photos[idx];

    // Caption
    captionEl.textContent = p.caption;

    // Mostrar vídeo o imagen
    if (p.type === "video") {
        photoImg.style.display = "none";

        photoVideo.style.display = "block";
        if (photoVideo.src !== location.origin + "/" + p.src) {
            photoVideo.src = p.src;
        }
        // Para iPhone: intenta reproducir si ya está permitido
        photoVideo.currentTime = 0;
        photoVideo.play().catch(() => { });
    } else {
        // Si veníamos de vídeo, lo paramos
        if (!photoVideo.paused) photoVideo.pause();
        photoVideo.removeAttribute("src");
        photoVideo.load();
        photoVideo.style.display = "none";

        photoImg.style.display = "block";
        photoImg.src = p.src;

        if (animate) {
            photoImg.style.transform = "scale(1.06)";
            setTimeout(() => (photoImg.style.transform = ""), 120);
        }
    }

    // Dots
    [...dotsEl.children].forEach((d, i) => {
        d.classList.toggle("active", i === idx);
    });
}


prevBtn?.addEventListener("click", () => {
    idx = (idx - 1 + CONFIG.photos.length) % CONFIG.photos.length;
    renderPhoto(true);
});

nextBtn?.addEventListener("click", () => {
    idx = (idx + 1) % CONFIG.photos.length;
    renderPhoto(true);
});

// Swipe en móvil
let startX = null;
galleryEl?.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
}, { passive: true });

galleryEl?.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    startX = null;

    if (Math.abs(dx) > 40) {
        if (dx > 0) prevBtn.click();
        else nextBtn.click();
    }
}, { passive: true });

// ======================
// Razones + chips
// ======================
function buildReasons() {
    reasonsGrid.innerHTML = "";
    CONFIG.reasons.forEach(r => {
        const card = document.createElement("div");
        card.className = "reason";
        card.dataset.tag = r.tag;

        const h = document.createElement("h3");
        h.textContent = r.title;

        const p = document.createElement("p");
        p.textContent = r.text;

        card.appendChild(h);
        card.appendChild(p);
        reasonsGrid.appendChild(card);
    });
}

function buildChips() {
    const tags = Array.from(new Set(CONFIG.reasons.map(r => r.tag)));
    const all = ["Todo", ...tags];

    chipsEl.innerHTML = "";
    all.forEach((t, i) => {
        const chip = document.createElement("button");
        chip.className = "chip" + (i === 0 ? " active" : "");
        chip.textContent = t;

        chip.addEventListener("click", () => {
            [...chipsEl.children].forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            filterReasons(t);
        });

        chipsEl.appendChild(chip);
    });
}

function filterReasons(tag) {
    const cards = [...reasonsGrid.children];
    cards.forEach(c => {
        const ok = tag === "Todo" || c.dataset.tag === tag;
        c.style.display = ok ? "" : "none";
    });
}


// ======================
// Tema (claro/oscuro)
// ======================
if (toggleThemeBtn) {
    function setTheme(theme) {
        if (theme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            toggleThemeBtn.textContent = "☀️";
        } else {
            document.documentElement.removeAttribute("data-theme");
            toggleThemeBtn.textContent = "🌙";
        }
        localStorage.setItem("sv_theme", theme);
    }

    toggleThemeBtn.addEventListener("click", () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        setTheme(isDark ? "light" : "dark");
    });

    setTheme(localStorage.getItem("sv_theme") || "light");
}


// ======================
// Música (opcional)
// ======================
let audioEnabled = false;
musicBtn?.addEventListener("click", async () => {
    try {
        if (!audioEnabled) {
            await audio.play();
            audioEnabled = true;
            musicState.textContent = "Reproduciendo";
            musicBtn.textContent = "Pausar";
        } else {
            audio.pause();
            musicState.textContent = "Pausado";
            musicBtn.textContent = "Reproducir";
        }
    } catch {
        musicState.textContent = "No se encontró el MP3 (opcional)";
        audioEnabled = false;
    }
});

// ======================
// Reveal on scroll
// ======================
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
    });
}, { threshold: 0.12 });

// Nota: solo observamos reveal cuando está desbloqueado (en unlockPage()).

// ======================
// Canvas corazones rojos
// ======================
const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");

function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

const hearts = [];
function spawnHeart() {
    hearts.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 20,
        s: 8 + Math.random() * 14,
        vy: 0.6 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.7,
        a: 0.20 + Math.random() * 0.22,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.02
    });
}
for (let i = 0; i < 18; i++) spawnHeart();

function drawHeart(x, y, size, rot, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    const s = size;
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(0, -s * 0.2, -s, -s * 0.2, -s, s * 0.35);
    ctx.bezierCurveTo(-s, s * 0.9, 0, s * 1.15, 0, s * 1.45);
    ctx.bezierCurveTo(0, s * 1.15, s, s * 0.9, s, s * 0.35);
    ctx.bezierCurveTo(s, -s * 0.2, 0, -s * 0.2, 0, s * 0.35);
    ctx.closePath();

    // 💎 Corazones turquesa (color favorito de Karla)
    const g = ctx.createLinearGradient(-s, -s, s, s);
    g.addColorStop(0, "rgba(20, 184, 166, 1)");   // turquesa
    g.addColorStop(1, "rgba(45, 212, 191, 1)");  // turquesa claro
    ctx.fillStyle = g;
    ctx.fill();

    ctx.restore();
}


function animateHearts() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.y -= h.vy;
        h.x += h.vx;
        h.rot += h.vr;

        drawHeart(h.x, h.y, h.s, h.rot, h.a);

        if (h.y < -60) {
            hearts.splice(i, 1);
            spawnHeart();
        }
    }
    requestAnimationFrame(animateHearts);
}
animateHearts();

// ======================
// Confetti
// ======================
function burstConfetti() {
    const n = 80;
    for (let i = 0; i < n; i++) {
        const el = document.createElement("div");
        el.className = "confetti";
        el.style.left = (Math.random() * 100) + "vw";
        el.style.top = "-10px";
        el.style.transform = `rotate(${Math.random() * 360}deg)`;
        el.style.opacity = "0.9";
        el.style.width = (6 + Math.random() * 6) + "px";
        el.style.height = (10 + Math.random() * 10) + "px";
        el.style.background = `hsl(${Math.floor(Math.random() * 360)}, 90%, 65%)`;
        document.body.appendChild(el);

        const dx = (Math.random() - 0.5) * 140;
        const dy = 100 + Math.random() * 220;
        const dur = 900 + Math.random() * 900;

        el.animate([
            { transform: el.style.transform, translate: "0 0" },
            { transform: `rotate(${Math.random() * 720}deg)`, translate: `${dx}px ${dy}vh` }
        ], { duration: dur, easing: "cubic-bezier(.2,.8,.2,1)" });

        setTimeout(() => el.remove(), dur + 50);
    }
}

const style = document.createElement("style");
style.textContent = `
.confetti{
  position: fixed;
  z-index: 9999;
  border-radius: 2px;
  pointer-events:none;
  will-change: transform;
}
`;
document.head.appendChild(style);

// Helpers
function pulse(el) {
    el.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }],
        { duration: 240, easing: "ease-out" }
    );
}
function wiggle(el) {
    el.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
        { duration: 220, easing: "ease-in-out" }
    );
}

// Init de contenido (aunque esté oculto, no pasa nada)
buildDots();
renderPhoto(false);
buildReasons();
buildChips();
filterReasons("Todo");
