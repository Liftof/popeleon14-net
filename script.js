document.addEventListener('DOMContentLoaded', () => {
    const askButton = document.getElementById('ask-button');
    const userQuestionInput = document.getElementById('user-question');
    const chatLog = document.getElementById('chat-log');

    const getDecreeButton = document.getElementById('get-decree-button');
    const decreeContent = document.getElementById('decree-content');

    const confessButton = document.getElementById('confess-button');
    const digitalSinSelect = document.getElementById('digital-sin-select');
    const customSinInput = document.getElementById('custom-sin');
    const penanceOutput = document.getElementById('penance-output');

    // --- Ask His Holiness (Chatbot) ---
    if (askButton) {
        askButton.addEventListener('click', async () => {
            const question = userQuestionInput.value.trim();
            if (!question) {
                appendMessageToChatLog("My child, you must first pose a question to receive enlightenment.", "pope-response");
                return;
            }

            appendMessageToChatLog(question, "user-input");
            userQuestionInput.value = ''; // Clear input
            appendMessageToChatLog("<em>The Pontiff consults the Sacred Algorithm...</em>", "pope-response loading");

            try {
                // Call the deployed Vercel backend endpoint
                const response = await fetch('https://popeleon14-backend.vercel.app/api/ask-pope', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question: question }),
                });

                removeLoadingMessage();

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Server error: ${response.status}`);
                }

                const data = await response.json();
                appendMessageToChatLog(data.answer, "pope-response");

            } catch (error) {
                removeLoadingMessage();
                console.error("Error consulting the Pontiff:", error);
                appendMessageToChatLog(`My apologies, child. A disturbance in the digital aether prevents my response. (Error: ${error.message})`, "pope-response error");
            }
        });
    }

    function appendMessageToChatLog(message, type) {
        const p = document.createElement('p');
        p.innerHTML = message; // Use innerHTML to render italics or other simple HTML
        p.className = type;
        chatLog.appendChild(p);
        chatLog.scrollTop = chatLog.scrollHeight; // Scroll to bottom
    }
    
    function removeLoadingMessage() {
        const loadingMessage = chatLog.querySelector('.loading');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }


    // --- Daily Papal Decree ---
    if (getDecreeButton) {
        getDecreeButton.addEventListener('click', fetchDailyDecree);
        fetchDailyDecree(); // Fetch one on page load
    }

    async function fetchDailyDecree() {
        decreeContent.innerHTML = "<p><em>Fetching today's divine edict from the digital scrolls...</em></p>";
        try {
            // Call the deployed Vercel backend endpoint
            const response = await fetch('https://popeleon14-backend.vercel.app/api/daily-decree', { method: 'GET' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }
            const data = await response.json();
            decreeContent.innerHTML = `<p>${data.decree}</p>`;
        } catch (error) {
            console.error("Error fetching daily decree:", error);
            decreeContent.innerHTML = `<p>A shadow has fallen upon the archives. The daily decree is momentarily obscured. (Error: ${error.message})</p>`;
        }
    }

    // --- Digital Confession Booth ---
    if (confessButton) {
        confessButton.addEventListener('click', async () => {
            let sin = digitalSinSelect.value;
            const customSin = customSinInput.value.trim();

            if (customSin) {
                sin = customSin;
            }

            if (!sin) {
                penanceOutput.innerHTML = "<p><em>You must confess a sin to receive penance, my child.</em></p>";
                return;
            }

            penanceOutput.innerHTML = "<p><em>His Holiness contemplates your transgression and consults the divine ledger...</em></p>";

            try {
                // Call the deployed Vercel backend endpoint
                const response = await fetch('https://popeleon14-backend.vercel.app/api/confess', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sin: sin }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Server error: ${response.status}`);
                }
                const data = await response.json();
                penanceOutput.innerHTML = `<p>${data.penance}</p>`;
                customSinInput.value = ''; // Clear custom sin input
                digitalSinSelect.value = ''; // Reset dropdown
            } catch (error) {
                console.error("Error in confession booth:", error);
                penanceOutput.innerHTML = `<p>The weight of your sin has caused a system error. Try confessing with more humility. (Error: ${error.message})</p>`;
            }
        });
    }
});