document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle Logic
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');

    const toggleSidebar = () => {
        sidebar.classList.toggle('active');
        sidebarBackdrop.classList.toggle('active');
    };

    menuBtn.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', toggleSidebar);
    sidebarBackdrop.addEventListener('click', toggleSidebar);

    // Chatbot Toggle Logic
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    // Toggle Chat Window
    chatbotBtn.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });

    closeChat.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    // Handle sending message
    const handleSendMessage = () => {
        const text = chatInput.value.trim();
        if (text === '') return;

        // User message
        appendMessage(text, 'user-message');
        chatInput.value = '';

        // Show loading indicator
        const loadingId = 'loading-' + Date.now();
        appendMessage("กำลังคิด...", 'ai-message', loadingId);

        // Call Backend API
        fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        })
            .then(response => response.json())
            .then(data => {
                removeMessage(loadingId);
                if (data.reply) {
                    appendMessage(data.reply, 'ai-message');
                } else if (data.error) {
                    console.error('API Error details:', data.error);
                    appendMessage(`❌ ข้อผิดพลาดจาก API: ${data.error}`, 'ai-message');
                } else {
                    console.error('Unexpected API response:', data);
                    appendMessage("❌ ขัดข้อง: รูปแบบข้อมูลที่ได้รับไม่ถูกต้อง", 'ai-message');
                }
            })
            .catch(error => {
                console.error('Error fetching from API:', error);
                removeMessage(loadingId);
                appendMessage("🔌 ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ Backend ได้ กรุณาตรวจสอบว่าเปิด Backend แล้ว", 'ai-message');
            });
    };

    sendMessageBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    function appendMessage(text, className, id = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;
        if (id) msgDiv.id = id;

        // Use plain text to safely render response
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);

        // Auto scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeMessage(id) {
        const msgDiv = document.getElementById(id);
        if (msgDiv) {
            msgDiv.remove();
        }
    }
});
