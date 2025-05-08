document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const askButton = document.getElementById('ask-button');
    const userQuestionInput = document.getElementById('user-question');
    const chatLog = document.getElementById('chat-log');
    const questionChips = document.querySelectorAll('.question-chip');

    const getDecreeButton = document.getElementById('get-decree-button');
    const decreeContent = document.getElementById('decree-content');

    const confessButton = document.getElementById('confess-button');
    const digitalSinSelect = document.getElementById('digital-sin-select');
    const customSinInput = document.getElementById('custom-sin');
    const penanceOutput = document.getElementById('penance-output');

    // Name Generator Elements
    const generateNameButton = document.getElementById('generate-name-button');
    const userNameInput = document.getElementById('user-name-input');
    const papalNameOutput = document.getElementById('papal-name-output');


    // --- Pope Chat (Main Feature) ---
    if (askButton && userQuestionInput) {
        // Event listener for the ask button
        askButton.addEventListener('click', () => {
            submitQuestion();
        });

        // Allow submitting with Enter key (but Shift+Enter for new line)
        userQuestionInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitQuestion();
            }
        });

        // Setup click handlers for question chips
        if (questionChips) {
            questionChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    userQuestionInput.value = chip.textContent;
                    submitQuestion();
                });
            });
        }

        // Function to submit user question
        async function submitQuestion() {
            const question = userQuestionInput.value.trim();
            if (!question) {
                showTemporaryMessage("Please enter a question first, my child.", "error");
                return;
            }

            // Add user message to chat
            appendUserMessage(question);
            userQuestionInput.value = ''; // Clear input
            
            // Show loading animation
            appendPopeMessage("<em>His Holiness is contemplating your inquiry...</em>", "loading");
            
            try {
                // Add typing indicator
                const typingIndicator = document.createElement('div');
                typingIndicator.className = 'typing-indicator';
                typingIndicator.innerHTML = '<span></span><span></span><span></span>';
                chatLog.appendChild(typingIndicator);
                
                // Call the deployed Vercel backend endpoint
                const response = await fetch('https://popeleon14-backend.vercel.app/api/ask-pope', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question: question }),
                });

                // Remove typing indicator
                const indicator = chatLog.querySelector('.typing-indicator');
                if (indicator) indicator.remove();
                
                // Remove loading message
                removeLoadingMessage();

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Server error: ${response.status}`);
                }

                const data = await response.json();
                appendPopeMessage(data.answer);
                
                // Scroll to the bottom of chat
                scrollChatToBottom();

            } catch (error) {
                console.error("Error consulting the Pontiff:", error);
                removeLoadingMessage();
                appendPopeMessage(`My apologies, child. A disturbance in the digital aether prevents my response. (Error: ${error.message})`, "error");
            }
        }
    }

    // Function to append user message
    function appendUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = message;
        chatLog.appendChild(messageDiv);
        scrollChatToBottom();
    }
    
    // Function to append pope's message
    function appendPopeMessage(message, className = '') {
        // Create a wrapper for the avatar and the message bubble
        const messageRow = document.createElement('div');
        messageRow.className = 'message-row pope-row'; // Add pope-row for specific styling

        // Create avatar element
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'chat-avatar';
        const avatarImg = document.createElement('img');
        avatarImg.src = 'img/popeGPT.png'; // Path to your pope avatar
        avatarImg.alt = 'Pope Avatar';
        avatarDiv.appendChild(avatarImg);

        // Create message bubble element
        const messageBubble = document.createElement('div');
        messageBubble.className = `pope-message ${className}`;
        messageBubble.innerHTML = message; // Use innerHTML as before

        // Append avatar and bubble to the row
        messageRow.appendChild(avatarDiv);
        messageRow.appendChild(messageBubble);

        // Append the whole row to the chat log
        chatLog.appendChild(messageRow);
        scrollChatToBottom();
    }
    
    // Function to remove loading message
    function removeLoadingMessage() {
        const loadingMessage = chatLog.querySelector('.loading');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }
    
    // Show temporary message and fade out
    function showTemporaryMessage(message, type = '') {
        const tempMessage = document.createElement('div');
        tempMessage.className = `pope-message ${type}`;
        tempMessage.innerHTML = message;
        tempMessage.style.opacity = '0';
        chatLog.appendChild(tempMessage);
        
        // Fade in
        setTimeout(() => {
            tempMessage.style.transition = 'opacity 0.5s ease-in-out';
            tempMessage.style.opacity = '1';
        }, 10);
        
        // Fade out after 3 seconds
        setTimeout(() => {
            tempMessage.style.opacity = '0';
            setTimeout(() => {
                tempMessage.remove();
            }, 500);
        }, 3000);
    }
    
    // Scroll chat to bottom
    function scrollChatToBottom() {
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    // --- Daily Papal Decree ---
    if (getDecreeButton) {
        getDecreeButton.addEventListener('click', fetchDailyDecree);
        // Fetch decree on page load with a slight delay for UX
        setTimeout(fetchDailyDecree, 1000);
    }

    async function fetchDailyDecree() {
        decreeContent.innerHTML = "<p><em>Fetching today's divine edict from the sacred servers...</em></p>";
        
        // Add loading animation to button
        getDecreeButton.classList.add('loading');
        getDecreeButton.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i><span>Loading...</span>';
        
        try {
            // Call the deployed Vercel backend endpoint
            const response = await fetch('https://popeleon14-backend.vercel.app/api/daily-decree', { method: 'GET' });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Apply fade transition
            decreeContent.style.opacity = '0';
            setTimeout(() => {
                decreeContent.innerHTML = `<p>${data.decree}</p>`;
                decreeContent.style.transition = 'opacity 0.5s ease-in-out';
                decreeContent.style.opacity = '1';
            }, 300);
            
        } catch (error) {
            console.error("Error fetching daily decree:", error);
            decreeContent.innerHTML = `<p>A shadow has fallen upon the archives. The daily decree is momentarily obscured. (Error: ${error.message})</p>`;
        } finally {
            // Reset button
            setTimeout(() => {
                getDecreeButton.classList.remove('loading');
                getDecreeButton.innerHTML = '<i class="fas fa-sync-alt"></i><span>New Decree</span>';
            }, 500);
        }
    }

    // --- Digital Confession Booth ---
    if (confessButton) {
        confessButton.addEventListener('click', submitConfession);
        
        // Toggle between dropdown and custom sin input
        digitalSinSelect.addEventListener('change', () => {
            if (digitalSinSelect.value) {
                customSinInput.value = '';
            }
        });
        
        customSinInput.addEventListener('input', () => {
            if (customSinInput.value) {
                digitalSinSelect.value = '';
            }
        });
    }

    async function submitConfession() {
        let sin = digitalSinSelect.value;
        const customSin = customSinInput.value.trim();

        if (customSin) {
            sin = customSin;
        }

        if (!sin) {
            penanceOutput.innerHTML = "<p><em>You must confess a sin to receive penance, my child.</em></p>";
            // Add shake animation
            penanceOutput.classList.add('shake');
            setTimeout(() => {
                penanceOutput.classList.remove('shake');
            }, 500);
            return;
        }

        // Add loading state
        penanceOutput.innerHTML = "<p><em>His Holiness contemplates your transgression and consults the divine ledger...</em></p>";
        confessButton.classList.add('loading');
        confessButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';

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
            
            // Apply fade transition for result
            penanceOutput.style.opacity = '0';
            setTimeout(() => {
                penanceOutput.innerHTML = `<p>${data.penance}</p>`;
                penanceOutput.style.transition = 'opacity 0.5s ease-in-out';
                penanceOutput.style.opacity = '1';
            }, 300);
            
            // Clear inputs
            customSinInput.value = '';
            digitalSinSelect.value = '';
            
        } catch (error) {
            console.error("Error in confession booth:", error);
            penanceOutput.innerHTML = `<p>The weight of your sin has caused a system error. Try confessing with more humility. (Error: ${error.message})</p>`;
        } finally {
            // Reset button
            setTimeout(() => {
                confessButton.classList.remove('loading');
                confessButton.innerHTML = '<i class="fas fa-pray"></i><span>Confess</span>';
            }, 500);
        }
    }

    // --- Papal Name Generator ---
    if (generateNameButton && userNameInput && papalNameOutput) {
        generateNameButton.addEventListener('click', generatePapalName);
        userNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                generatePapalName();
            }
        });
    }

    async function generatePapalName() {
        const userName = userNameInput.value.trim();
        if (!userName) {
            papalNameOutput.innerHTML = "<p><em>Please enter your name first, seeker of holy designation.</em></p>";
            papalNameOutput.classList.add('shake');
            setTimeout(() => papalNameOutput.classList.remove('shake'), 500);
            return;
        }

        // Add loading state
        papalNameOutput.innerHTML = "<p><em>Consulting the sacred name generator...</em></p>";
        generateNameButton.classList.add('loading');
        generateNameButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Generating...</span>';

        try {
            // Call the (to be created) backend endpoint
            const response = await fetch('https://popeleon14-backend.vercel.app/api/generate-papal-name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: userName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Check if the error is specifically 404 (Not Found)
                if (response.status === 404) {
                     throw new Error("The Papal Name Generator service is not yet available. Please check back later.");
                }
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();

            // Display result with fade transition
            papalNameOutput.style.opacity = '0';
            setTimeout(() => {
                papalNameOutput.innerHTML = `<p>Henceforth, you shall be known as:</p><p class="generated-name">${data.papalName}</p>`;
                papalNameOutput.style.transition = 'opacity 0.5s ease-in-out';
                papalNameOutput.style.opacity = '1';
            }, 300);

        } catch (error) {
            console.error("Error generating papal name:", error);
            papalNameOutput.innerHTML = `<p>An error occurred during the sacred naming ritual. ${error.message}</p>`;
        } finally {
            // Reset button
            setTimeout(() => {
                generateNameButton.classList.remove('loading');
                generateNameButton.innerHTML = '<i class="fas fa-magic"></i><span>Generate Papal Name</span>';
            }, 500);
        }
    }


    // Add CSS animation classes
    const style = document.createElement('style');
    style.textContent = `
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-2px, 0, 0); }
            40%, 60% { transform: translate3d(2px, 0, 0); }
        }
        .typing-indicator {
            display: flex;
            padding: 10px;
            margin-bottom: 15px;
            align-items: center;
        }
        .typing-indicator span {
            height: 8px;
            width: 8px;
            background: var(--vatican-red);
            display: block;
            border-radius: 50%;
            opacity: 0.4;
            margin: 0 3px;
            animation: typing 1s infinite;
        }
        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
            0% { transform: translateY(0px); opacity: 0.4; }
            50% { transform: translateY(-5px); opacity: 0.8; }
            100% { transform: translateY(0px); opacity: 0.4; }
        }
    `;
    document.head.appendChild(style);
});