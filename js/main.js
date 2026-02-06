const messages = [
    "Te elegiría en todas las vidas.",
    "Eres mi plan favorito.",
    "Gracias por existir 💘",
    "Hoy y siempre: tú."
];

const photos = [
    { src: "assets/img/01.jpg", caption: "Nuestro primer recuerdo ❤️" },
    { src: "assets/img/02.jpg", caption: "Ese día que no se olvida ✨" },
    { src: "assets/img/03.jpg", caption: "Contigo todo es mejor" }
];

let idx = 0;

const msgEl = document.getElementById("msg");
const btnMsg = document.getElementById("btnMsg");
const photoEl = document.getElementById("photo");
const captionEl = document.getElementById("caption");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

btnMsg.addEventListener("click", () => {
    msgEl.textContent = messages[Math.floor(Math.random() * messages.length)];
});

function renderPhoto() {
    photoEl.src = photos[idx].src;
    captionEl.textContent = photos[idx].caption;
}

prev.addEventListener("click", () => {
    idx = (idx - 1 + photos.length) % photos.length;
    renderPhoto();
});

next.addEventListener("click", () => {
    idx = (idx + 1) % photos.length;
    renderPhoto();
});

renderPhoto();
