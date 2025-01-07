
document.addEventListener('DOMContentLoaded', () => {
    const api_url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCB9xqn9EwW91nlS2XojzuN6lQgr2Pj7Iw`;

    const inputField = document.getElementById('input');
    const sendButton = document.getElementById('send-btn');
    const messagesContainer = document.getElementById('messages');
    const deleteButton = document.getElementById('delete-btn');
    const toggleModeButton = document.getElementById('toggle-mode');
    const mainClass = document.getElementById('main');
    const historyContainer = document.getElementById('history');
    const newChatButton = document.getElementById('chatbutton');
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

    const addToHistory = (usermessage) => {
        const historyItem = document.createElement('div');
        historyItem.textContent = usermessage;
        historyItem.classList.add('history-item');
        historyItem.style.cursor = 'pointer';
        historyItem.style.marginBottom = '10px';

        historyItem.addEventListener('click', () => {
            inputField.value = usermessage;
        });

        historyContainer.appendChild(historyItem);
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
            const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text.replace(/\*\*(.*?)\*\*/g, "$1");
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

    const handleSend = () => {
        const usermessage = inputField.value.trim();
        if (usermessage) {
            if (mainClass.style.display !== 'none') {
                mainClass.style.display = 'none';
            }
            displayMessage(usermessage, 'user');
            addToHistory(usermessage);
            inputField.value = '';
            generateAIResponse(usermessage);
        }
    };

    sendButton.addEventListener('click', handleSend);

    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSend();
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

    newChatButton.addEventListener('click', () => {
        messagesContainer.innerHTML = '';
        historyContainer.innerHTML = '';
        mainClass.style.display = 'block';
    });
});


