const CONFIG = {
    eventDate: "July 17, 2026 15:30:00",
    whatsappNumber: "5210000000000",
    openingDelay: 1850
};

const welcomeScreen = document.getElementById("welcomeScreen");
const envelopeWrapper = document.getElementById("envelopeWrapper");
const openInvitationButton = document.getElementById("openInvitation");
const invitationContent = document.getElementById("invitationContent");

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicText = document.getElementById("musicText");
const musicIcon = document.getElementById("musicIcon");

let invitationOpened = false;

function openInvitation() {
    if (invitationOpened) return;

    invitationOpened = true;
    envelopeWrapper.classList.add("open");

    setTimeout(() => {
        welcomeScreen.classList.add("hidden");
        invitationContent.classList.add("visible");
        document.body.style.overflow = "auto";
        tryPlayMusic();
    }, CONFIG.openingDelay);
}

openInvitationButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openInvitation();
});

envelopeWrapper.addEventListener("click", openInvitation);

function tryPlayMusic() {
    if (!music) return;

    music.volume = 0.55;

    music.play()
        .then(() => updateMusicButton(true))
        .catch(() => updateMusicButton(false));
}

function updateMusicButton(isPlaying) {
    musicText.textContent = isPlaying ? "Pausar música" : "Reproducir música";
    musicIcon.textContent = isPlaying ? "❚❚" : "♫";
}

musicButton.addEventListener("click", () => {
    if (music.paused) {
        music.play()
            .then(() => updateMusicButton(true))
            .catch(() => updateMusicButton(false));
    } else {
        music.pause();
        updateMusicButton(false);
    }
});

/* CONTADOR */
const eventTime = new Date(CONFIG.eventDate).getTime();

function updateCountdown() {
    const now = Date.now();
    const distance = eventTime - now;

    if (distance <= 0) {
        document.getElementById("countdown").style.display = "none";
        document.getElementById("countdownMessage").textContent =
            "¡Llegó el gran día! Gracias por celebrar conmigo.";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ANIMACIONES AL DESPLAZARSE */
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

/* CONFIRMACIÓN POR WHATSAPP */
const rsvpForm = document.getElementById("rsvpForm");

rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const attendance = document.getElementById("attendance").value;
    const guests = document.getElementById("guests").value;
    const message = document.getElementById("messageText").value.trim();

    const text = [
        "Hola, quiero confirmar mi asistencia a la graduación.",
        "",
        `Nombre: ${name}`,
        `Respuesta: ${attendance}`,
        `Número de personas: ${guests}`,
        message ? `Mensaje: ${message}` : ""
    ]
        .filter(Boolean)
        .join("\n");

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
});

/* PÉTALOS DECORATIVOS */
function createPetal() {
    if (document.hidden) return;

    const petal = document.createElement("span");
    petal.className = "petal";

    const left = Math.random() * 100;
    const duration = 7 + Math.random() * 7;
    const drift = `${-90 + Math.random() * 180}px`;
    const scale = 0.6 + Math.random() * 0.9;

    petal.style.left = `${left}vw`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.setProperty("--drift", drift);
    petal.style.transform = `scale(${scale})`;
    petal.style.opacity = `${0.25 + Math.random() * 0.45}`;

    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000);
}

setInterval(createPetal, 900);
/* nombre de enlaces */
const params = new URLSearchParams(window.location.search);

const invitedGuest = params.get("invitado");
const invitedPasses = params.get("pases");
const invitedTable = params.get("mesa");

const guestNameElement = document.getElementById("guestName");
const guestPassesElement = document.getElementById("guestPasses");
const peopleWordElement = document.getElementById("peopleWord");
const guestTableElement = document.getElementById("guestTable");
const tableTextElement = document.getElementById("tableText");

if (invitedGuest && guestNameElement) {
    guestNameElement.textContent = invitedGuest;
}

if (invitedPasses && guestPassesElement) {
    const passes = Math.max(1, Number(invitedPasses) || 1);
    guestPassesElement.textContent = passes;

    if (peopleWordElement) {
        peopleWordElement.textContent = passes === 1 ? "persona" : "personas";
    }
}

if (invitedTable && guestTableElement && tableTextElement) {
    guestTableElement.textContent = invitedTable;
    tableTextElement.hidden = false;
}
