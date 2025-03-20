document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const connectButton = document.getElementById("connectButton");
    const gameDiv = document.getElementById("game");
    const betHighButton = document.getElementById("betHigh");
    const betLowButton = document.getElementById("betLow");
    const resultP = document.getElementById("result");
    const statusP = document.getElementById("status");
    const titleH1 = document.getElementById("title");
    const betPromptP = document.getElementById("betPrompt");
    const languageSelect = document.getElementById("languageSelect");
    let isConnected = false;

    // Verificar si MiniKit está disponible
    if (!window.MiniKit) {
        console.log("MiniKit no está disponible");
        statusP.textContent = "Por favor, abre esta app en World App.";
        return; // Detiene la ejecución si MiniKit no está presente
    }

    console.log("MiniKit cargado correctamente");
    statusP.textContent = "MiniKit listo. Conéctate para jugar.";

    // Textos en ambos idiomas
    const translations = {
        es: {
            title: "Juego de Cartas",
            statusDisconnected: "Conéctate para jugar",
            statusConnected: "¡Conectado! Listo para jugar.",
            statusError: "Error al conectar. Intenta de nuevo.",
            connectButton: "Conectar con World ID",
            betPrompt: "¿La carta será alta (8-13) o baja (1-7)?",
            betHigh: "Apostar Alta",
            betLow: "Apostar Baja",
            win: "¡Ganaste!",
            lose: "Perdiste."
        },
        en: {
            title: "Card Game",
            statusDisconnected: "Connect to play",
            statusConnected: "Connected! Ready to play.",
            statusError: "Connection error. Try again.",
            connectButton: "Connect with World ID",
            betPrompt: "Will the card be high (8-13) or low (1-7)?",
            betHigh: "Bet High",
            betLow: "Bet Low",
            win: "You won!",
            lose: "You lost."
        }
    };

    // Función para actualizar el idioma
    function updateLanguage(lang) {
        titleH1.textContent = translations[lang].title;
        connectButton.textContent = translations[lang].connectButton;
        betPromptP.textContent = translations[lang].betPrompt;
        betHighButton.textContent = translations[lang].betHigh;
        betLowButton.textContent = translations[lang].betLow;
        if (!isConnected) {
            statusP.textContent = translations[lang].statusDisconnected;
        } else {
            statusP.textContent = translations[lang].statusConnected;
        }
    }

    // Evento para cambiar idioma
    languageSelect.addEventListener("change", (e) => {
        updateLanguage(e.target.value);
    });

    // Inicializar en español
    updateLanguage("es");

    // Conectar con World ID
    connectButton.addEventListener("click", () => {
        try {
            MiniKit.commands.send("world-id-connect", { app_id: app_14a7e0b7a8ea8ebfac001b7b8256e0b5 });
        } catch (error) {
            console.error("Error al enviar comando de conexión:", error);
            statusP.textContent = translations[languageSelect.value].statusError;
        }
    });

    // Escuchar respuesta de World ID
    MiniKit.responses.listen("world-id-connect", (response) => {
        const lang = languageSelect.value;
        if (response.status === "success") {
            isConnected = true;
            statusP.textContent = translations[lang].statusConnected;
            connectButton.classList.add("hidden");
            gameDiv.classList.remove("hidden");
        } else {
            console.error("Fallo en la conexión con World ID:", response);
            statusP.textContent = translations[lang].statusError;
        }
    });

    // Función para sacar una carta
    function drawCard() {
        const cardValue = Math.floor(Math.random() * 13) + 1; // 1-13 (As a Rey)
        const suits = ["♠", "♥", "♣", "♦"];
        const suit = suits[Math.floor(Math.random() * 4)];
        const cardNames = {
            1: "A", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7",
            8: "8", 9: "9", 10: "10", 11: "J", 12: "Q", 13: "K"
        };
        return { value: cardValue, display: `${cardNames[cardValue]}${suit}` };
    }

    // Lógica de apuesta
    function play(bet) {
        try {
            const card = drawCard();
            const isHigh = card.value >= 8;
            const win = (bet === "high" && isHigh) || (bet === "low" && !isHigh);
            const lang = languageSelect.value;
            resultP.textContent = `Carta: ${card.display}. ${win ? translations[lang].win : translations[lang].lose}`;
        } catch (error) {
            console.error("Error durante el juego:", error);
            resultP.textContent = "Error en el juego. Intenta de nuevo.";
        }
    }

    // Event listeners para las apuestas
    betHighButton.addEventListener("click", () => play("high"));
    betLowButton.addEventListener("click", () => play("low"));
});