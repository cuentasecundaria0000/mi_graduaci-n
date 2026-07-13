/* =========================================================
   SIEMPRE INICIAR DESDE ARRIBA
========================================================= */

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

function irAlInicio() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
    });
}

/* Ejecutar inmediatamente */
irAlInicio();

/* Cuando el HTML esté cargado */
document.addEventListener("DOMContentLoaded", () => {
    irAlInicio();

    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "hidden";
});

/* Cuando terminen de cargar imágenes y recursos */
window.addEventListener("load", () => {
    irAlInicio();

    requestAnimationFrame(irAlInicio);

    setTimeout(irAlInicio, 50);
    setTimeout(irAlInicio, 200);
    setTimeout(irAlInicio, 500);
});

/* También al regresar con el botón Atrás */
window.addEventListener("pageshow", () => {
    irAlInicio();
    setTimeout(irAlInicio, 100);
});

/* =========================================================
   CONFIGURACIÓN PRINCIPAL
========================================================= */

const CONFIG = {
    eventDate: "July 17, 2026 15:30:00",
    whatsappNumber: "5210000000000",
    openingDelay: 1850
};

/* =========================================================
   ELEMENTOS PRINCIPALES
========================================================= */

const welcomeScreen = document.getElementById("welcomeScreen");
const envelopeWrapper = document.getElementById("envelopeWrapper");
const openInvitationButton = document.getElementById("openInvitation");
const invitationContent = document.getElementById("invitationContent");

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const musicText = document.getElementById("musicText");
const musicIcon = document.getElementById("musicIcon");

let invitationOpened = false;

/* =========================================================
   APERTURA DEL SOBRE
========================================================= */

function openInvitation() {
    if (invitationOpened) return;

    irAlInicio();
    invitationOpened = true;

    if (envelopeWrapper) {
        envelopeWrapper.classList.add("open");
    }

    setTimeout(() => {
        if (welcomeScreen) {
            welcomeScreen.classList.add("hidden");
        }

        if (invitationContent) {
            invitationContent.classList.add("visible");
        }

        document.body.style.overflowX = "hidden";
        document.body.style.overflowY = "auto";

        irAlInicio();
        tryPlayMusic();
    }, CONFIG.openingDelay);
}

if (openInvitationButton) {
    openInvitationButton.addEventListener("click", (event) => {
        event.stopPropagation();
        openInvitation();
    });
}

if (envelopeWrapper) {
    envelopeWrapper.addEventListener("click", openInvitation);
}

/* =========================================================
   FLECHA PARA BAJAR AL MENSAJE
========================================================= */

const scrollIndicator = document.querySelector(".scroll-indicator");

if (scrollIndicator) {
    scrollIndicator.addEventListener("click", (event) => {
        event.preventDefault();

        const messageSection = document.getElementById("message");

        if (messageSection) {
            messageSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}

/* =========================================================
   MÚSICA
========================================================= */

function updateMusicButton(isPlaying) {
    if (musicText) {
        musicText.textContent = isPlaying
            ? "Pausar música"
            : "Reproducir música";
    }

    if (musicIcon) {
        musicIcon.textContent = isPlaying ? "❚❚" : "♫";
    }
}

function tryPlayMusic() {
    if (!music) return;

    music.volume = 0.55;

    music.play()
        .then(() => {
            updateMusicButton(true);
        })
        .catch(() => {
            updateMusicButton(false);
        });
}

if (musicButton && music) {
    musicButton.addEventListener("click", () => {
        if (music.paused) {
            music.play()
                .then(() => {
                    updateMusicButton(true);
                })
                .catch(() => {
                    updateMusicButton(false);
                });
        } else {
            music.pause();
            updateMusicButton(false);
        }
    });
}

/* =========================================================
   CONTADOR
========================================================= */

const eventTime = new Date(CONFIG.eventDate).getTime();

function updateCountdown() {
    const countdown = document.getElementById("countdown");
    const countdownMessage =
        document.getElementById("countdownMessage");

    const now = Date.now();
    const distance = eventTime - now;

    if (distance <= 0) {
        if (countdown) {
            countdown.style.display = "none";
        }

        if (countdownMessage) {
            countdownMessage.textContent =
                "¡Llegó el gran día! Gracias por celebrar conmigo.";
        }

        return;
    }

    const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (distance / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (distance / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (distance / 1000) % 60
    );

    const values = {
        days,
        hours,
        minutes,
        seconds
    };

    Object.entries(values).forEach(([id, value]) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent =
                String(value).padStart(2, "0");
        }
    });
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* =========================================================
   ANIMACIONES AL DESPLAZARSE
========================================================= */

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.16
        }
    );

    document.querySelectorAll(".reveal").forEach((element) => {
        observer.observe(element);
    });
} else {
    document.querySelectorAll(".reveal").forEach((element) => {
        element.classList.add("visible");
    });
}

/* =========================================================
   FLORES DECORATIVAS CAYENDO
========================================================= */

function createPetal() {
    if (document.hidden) return;

    const petal = document.createElement("span");

    petal.className = "petal";
    petal.setAttribute("aria-hidden", "true");

    const left = Math.random() * 100;
    const duration = 7 + Math.random() * 7;
    const drift = `${-90 + Math.random() * 180}px`;
    const scale = 0.6 + Math.random() * 0.9;

    petal.style.left = `${left}vw`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.setProperty("--drift", drift);
    petal.style.transform = `scale(${scale})`;
    petal.style.opacity =
        `${0.25 + Math.random() * 0.45}`;

    document.body.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, duration * 1000);
}

setInterval(createPetal, 900);

/* =========================================================
   DATOS PERSONALIZADOS DEL INVITADO

   Ejemplo:
   ?invitado=Familia%20García&pases=4&mesa=5
========================================================= */

const params = new URLSearchParams(window.location.search);

const invitedGuest = params.get("invitado");
const invitedPasses = params.get("pases");
const invitedTable = params.get("mesa");

/* Nombre del invitado en varios lugares */
const guestNameElements =
    document.querySelectorAll(".guestName");

if (invitedGuest) {
    guestNameElements.forEach((element) => {
        element.textContent = invitedGuest;
    });
}

/* Número de pases */
const guestPassesElement =
    document.getElementById("guestPasses");

const peopleWordElement =
    document.getElementById("peopleWord");

if (invitedPasses && guestPassesElement) {
    const passes =
        Math.max(1, Number(invitedPasses) || 1);

    guestPassesElement.textContent = passes;

    if (peopleWordElement) {
        peopleWordElement.textContent =
            passes === 1 ? "persona" : "personas";
    }
}

/* Número de mesa */
const guestTableElement =
    document.getElementById("guestTable");

const tableTextElement =
    document.getElementById("tableText");

if (
    invitedTable &&
    guestTableElement &&
    tableTextElement
) {
    guestTableElement.textContent = invitedTable;
    tableTextElement.hidden = false;
}
