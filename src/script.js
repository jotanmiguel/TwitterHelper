console.log("Twitter Share Fix carregado!");

// Observa mudanças na página para detectar o botão "Share"
const observer = new MutationObserver(() => {
    const shareButtons = document.querySelectorAll('button[aria-label="Share post"]');

    shareButtons.forEach((button) => {
        if (!button.dataset.listenerAdded) {
            // Adiciona um evento de clique para detetar quando o menu é aberto
            button.addEventListener("click", () => {
                observeShareMenu();
            });

            button.dataset.listenerAdded = "true";
        }
    });
});

// Observa mudanças no menu de partilha para capturar "Copy Link"
function observeShareMenu() {
    setTimeout(() => {
        const shareMenuItems = document.querySelectorAll('div[role="menuitem"]');

        shareMenuItems.forEach((menuItem) => {
            const textElement = menuItem.querySelector("span");

            if (textElement && textElement.innerText.trim() === "Copy link") {
                // Evita múltiplos eventos no mesmo botão
                menuItem.removeEventListener("click", interceptClipboard);
                menuItem.addEventListener("click", interceptClipboard, { once: true });
            }
        });
    }, 500); // Pequeno atraso para garantir que o menu carregue
}

// Intercepta o link gerado pelo Twitter antes de ser copiado para o Clipboard
function interceptClipboard(event) {
    event.preventDefault();

    // Aguarda um pequeno tempo para garantir que o Twitter gerou o link correto
    setTimeout(async () => {
        try {
            // Captura o link copiado para o Clipboard
            const tweetURL = await navigator.clipboard.readText();

            // Converte o link para fxtwitter.com
            const fixedURL = tweetURL.replace(/(x|twitter)\.com/, "fxtwitter.com");

            // Copia o link modificado para o Clipboard
            await navigator.clipboard.writeText(fixedURL);
        } catch (err) {
            console.warn("⚠️ Erro ao acessar o Clipboard.");
        }
    }, 200); // Pequeno atraso para garantir que o link do Twitter foi atualizado no Clipboard
}

// Configura o observador para detetar mudanças no DOM
observer.observe(document.body, { childList: true, subtree: true });
