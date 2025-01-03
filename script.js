
document.addEventListener('DOMContentLoaded', () => {
    const api_url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCB9xqn9EwW91nlS2XojzuN6lQgr2Pj7Iw`;

    const inputField = document.getElementById('input');
    const sendButton = document.getElementById('send-btn');
    const messagesContainer = document.getElementById('messages');
    const deleteButton = document.getElementById('delete-btn');
    const toggleModeButton = document.getElementById('toggle-mode');
    let isDarkMode = true;
    const displayMessage = (message, sender, isTypingEffect = false) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (isTypingEffect) {
            showTypingEffect(message, messageElement);
        } else {
            messageElement.textContent = message;
        }
    };
    const showTypingEffect = (text, textElement) => {
        const words = text.split(' ');
        let currentWordIndex = 0;
        const typingInterval = setInterval(() => {
            textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex];
            currentWordIndex++;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            if (currentWordIndex === words.length) {
                clearInterval(typingInterval);
            }
        }, 100);
    };
    const generateAIResponse = async (usermessage) => {
        displayMessage("...", 'bot');
        try {
            const response = await fetch(api_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [ 
                        { role: "user", parts: [{ text: usermessage }] }
                    ]
                })
            });
            const data = await response.json();
            const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text.replace(/\*\*(.*?)\*\*/g,"$1");
            const lastBotMessage = messagesContainer.querySelector('.bot:last-child');
            if (lastBotMessage) lastBotMessage.remove();
            displayMessage(aiResponse, 'bot', true);
        } catch (error) {
            console.error(error);
            const lastBotMessage = messagesContainer.querySelector('.bot:last-child');
            if (lastBotMessage) lastBotMessage.remove();
            displayMessage("An error occurred. Please try again later.", 'bot');
        }
    };
    sendButton.addEventListener('click', () => {
        const usermessage = inputField.value.trim();
        if (usermessage) {
            displayMessage(usermessage, 'user');
            inputField.value = '';
            generateAIResponse(usermessage);
        }
    });
    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
    deleteButton.addEventListener('click', () => {
        messagesContainer.innerHTML = '';
    });
    toggleModeButton.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('light-mode');
        toggleModeButton.textContent = isDarkMode
            ? 'Light Mode'
            : 'Dark Mode';
    });
});

