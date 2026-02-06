// ======================
// Personaliza aquí
// ======================
const CONFIG = {
    // Si quieres cuenta atrás: pon una fecha futura (hora local). Si no, déjalo en null.
    // Ejemplo: "2026-02-14T00:00:00"
    countdownTo: null,

    // Palabra clave del secreto (minúsculas). Cámbiala por vuestro inside joke.
    secretKey: "amor",

    // Mensaje que aparece al desbloquear (puedes escribir algo largo y bonito)
    secretText:
        "Me haces feliz, mi Chiquitilla. Gracias por ser tú. Y si alguna vez lo dudas: siempre estoy contigo, Reina.",

    // Fotos (cambia nombres y textos; mete tus fotos en assets/img/)
    photos: [
        { src: "assets/img/01.jpg", caption: "Nuestro primer recuerdo ❤️" },
        { src: "assets/img/02.jpg", caption: "Ese día que no se olvida ✨" },
        { src: "assets/img/03.jpg", caption: "Contigo todo es mejor, Karla" }
    ],

    // Tarjetas de razones (puedes poner 6-12 y queda genial)
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
// Elementos
// ======================
const msgEl = document.getElementById("msg");
const btnMsg = document.getElementById("btnMsg");
const btnConfetti = document.getElementById("btnConfetti");

const photoEl = document.getElementById("photo");
const captionEl = document.getElementById("caption");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const dotsEl = document.getElementById("dots");
const galleryEl = document.getElementById("gallery");

const reasonsGrid = document.getElementById("reasonsGrid");
const chipsEl = document.getElementById("chips");

const keyInput = document.getElementById("keyInput");
const unlockBtn = document.getElementById("unlockBtn");
const secretBox = document.getElementById("secretBox");
const secretTextEl = document.getElementById("secretText");

const toggleThemeBtn = document.getElementById("toggleTheme");

const cdWrap = document.getElementById("countdown");
const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMins = document.getElementById("cdMins");
const cdSecs = document.getElementById("cdSecs");

const audio = document.getElementById("audio");
const musicBtn = document.getElementById("musicBtn");
const musicState = document.getElementById("musicState");

// ======================
// Mensajes aleatorios
// ======================
btnMsg.addEventListener("click", () => {
    const txt = CONFIG.messages[Math.floor(Math.random() * CONFIG.messages.length)];
    msgEl.textContent = txt;
    pulse(msgEl);
});

// ======================
// Confetti simple (sin librerías)
// ======================
btnConfetti.addEventListener("click", () => burstConfetti());

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
    photoEl.src = p.src;
    captionEl.textContent = p.caption;

    [...dotsEl.children].forEach((d, i) => {
        d.classList.toggle("active", i === idx);
    });

    if (animate) {
        photoEl.style.transform = "scale(1.06)";
        setTimeout(() => (photoEl.style.transform = ""), 120);
    }
}

prevBtn.addEventListener("click", () => {
    idx = (idx - 1 + CONFIG.photos.length) % CONFIG.photos.length;
    renderPhoto(true);
});

nextBtn.addEventListener("click", () => {
    idx = (idx + 1) % CONFIG.photos.length;
    renderPhoto(true);
});

// Swipe en móvil
let startX = null;
galleryEl.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
}, { passive: true });

galleryEl.addEventListener("touchend", (e) => {
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
// Razones con filtros (chips)
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
// Secreto
// ======================
secretTextEl.textContent = CONFIG.secretText;

unlockBtn.addEventListener("click", () => {
    const k = (keyInput.value || "").trim().toLowerCase();
    if (!k) return wiggle(keyInput);

    if (k === CONFIG.secretKey.toLowerCase()) {
        secretBox.hidden = false;
        pulse(secretBox);
        burstConfetti();
    } else {
        wiggle(keyInput);
        msgEl.textContent = "Esa no es… prueba otra 😏";
        pulse(msgEl);
    }
});

// Enter para desbloquear
keyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") unlockBtn.click();
});

// ======================
// Tema (claro/oscuro) con persistencia
// ======================
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

// ======================
// Música (opcional)
// ======================
let audioEnabled = false;

musicBtn.addEventListener("click", async () => {
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
// Cuenta atrás (opcional)
// ======================
if (CONFIG.countdownTo) {
    cdWrap.hidden = false;
    const target = new Date(CONFIG.countdownTo).getTime();

    const tick = () => {
        const now = Date.now();
        let diff = Math.max(0, target - now);

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
    };

    tick();
    setInterval(tick, 1000);
}

// ======================
// Reveal on scroll
// ======================
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

// ======================
// Canvas corazones flotando (ROJOS)
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

    // Rojo (degradado rojo-rojo)
    const g = ctx.createLinearGradient(-s, -s, s, s);
    g.addColorStop(0, "rgba(220, 38, 38, 1)");
    g.addColorStop(1, "rgba(248, 113, 113, 1)");
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
// Confetti minimalista
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

// Confetti CSS inyectado
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

// ======================
// Helpers
// ======================
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

// ======================
// Init
// ======================
buildDots();
renderPhoto(false);
buildReasons();
buildChips();
filterReasons("Todo");
