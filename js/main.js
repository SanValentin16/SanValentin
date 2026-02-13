// ======================
// Personaliza aquí
// ======================
const CONFIG = {
    // Palabra clave para desbloquear TODA la página (minúsculas)
    secretKey: "a",

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
        "Chiquitilla, eres mi persona favorita.",
        "Contigo todo se vuelve fácil.",
        "Reina, gracias por quererme siempre.",
        "Te voy a amar por siempre.",
        "Siento que contigo todo es posible.",
        "Contigo, todo se siente como si estuviera viviendo un sueño.",
        "Gracias por ser la niña de mis ojos.",
        "Eres mi TODO.",
        "Cuando nuestras miradas se cruzan, siento que no necesito nada más."
    ],

    photos2: [
        "assets/img/04.jpg",
        "assets/img/05.jpg",
        "assets/img/06.jpg",
        "assets/img/07.jpg",
        "assets/img/08.jpg",
        "assets/img/09.jpg",
    ],

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
    window.scrollTo(0, 0);

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
// Música
// ======================
musicBtn?.addEventListener("click", async () => {
    try {
        // Si está sonando → pausar
        if (!audio.paused && !audio.ended) {
            audio.pause();
            musicState.textContent = "Pausado";
            musicBtn.textContent = "Reproducir";
            return;
        }

        // Si terminó → volver al inicio
        if (audio.ended) {
            audio.currentTime = 0;
        }

        // Reproducir / continuar
        await audio.play();
        musicState.textContent = "Reproduciendo";
        musicBtn.textContent = "Pausar";

    } catch (e) {
        musicState.textContent = "No se pudo reproducir";
    }
});

audio?.addEventListener("ended", () => {
    musicState.textContent = "Finalizada";
    musicBtn.textContent = "Reproducir";
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

// ======= Forzar scroll arriba al recargar =======
window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});


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
// Sorpresa: lluvia de corazones (azul clarito + rojo)
// ======================
function burstConfetti() {
    // Mantengo el nombre para que no tengas que cambiar llamadas en el resto del código
    const colors = ["#7dd3fc", "#fb7185"]; // azul clarito / rojo
    const n = 70;

    for (let i = 0; i < n; i++) {
        const el = document.createElement("div");
        el.className = "fall-heart";

        // Color aleatorio (azul o rojo)
        const c = colors[Math.floor(Math.random() * colors.length)];
        el.style.setProperty("--c", c);

        // Posición/tamaño
        el.style.left = (Math.random() * 100) + "vw";
        const size = 10 + Math.random() * 14;
        el.style.width = size + "px";
        el.style.height = size + "px";

        // Opacidad y giro inicial
        el.style.opacity = (0.65 + Math.random() * 0.35).toFixed(2);
        const rot = (Math.random() * 80 - 40); // -40..40
        el.style.transform = `rotate(${45 + rot}deg)`;

        document.body.appendChild(el);

        // Movimiento
        const dx = (Math.random() - 0.5) * 120; // deriva horizontal
        const dy = 110 + Math.random() * 120;   // cae
        const dur = 1400 + Math.random() * 1400;

        el.animate(
            [
                { transform: el.style.transform + " translate(0, 0)", opacity: el.style.opacity },
                { transform: `rotate(${45 + rot + (Math.random() * 120 - 60)}deg) translate(${dx}px, ${dy}vh)`, opacity: 0 }
            ],
            { duration: dur, easing: "cubic-bezier(.2,.8,.2,1)" }
        );

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

// ======================
// Galería 2: grid 2xN
// ======================
const gallery2Grid = document.getElementById("gallery2Grid");

function renderGallery2Grid() {
    if (!gallery2Grid) return;

    gallery2Grid.innerHTML = "";

    CONFIG.photos2.forEach((src) => {
        const item = document.createElement("div");
        item.className = "gallery2-item";

        const img = document.createElement("img");
        img.src = src;
        img.loading = "lazy";
        img.alt = "Foto";

        item.appendChild(img);
        gallery2Grid.appendChild(item);
    });
}

renderGallery2Grid();

