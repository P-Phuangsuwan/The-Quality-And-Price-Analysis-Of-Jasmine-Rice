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

        // Determine the API base URL depending on the environment
        // หากอัปโหลดขึ้นเว็บจริง (Production) ให้เปลี่ยน 'https://your-backend-domain.com' เป็น URL ของ Backend ของคุณ
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const API_BASE_URL = isLocal ? 'http://localhost:3000' : 'https://ai-2025.onrender.com'; // <--- เปลี่ยนตรงนี้ถ้า Backend อยู่คนละที่

        // Call Backend API
        fetch(`${API_BASE_URL}/api/chat`, {
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

// --- Farm Data Update Logic ---
function updateFarmData() {
    const size = document.getElementById('farmSize').value || 15;
    const rice = document.getElementById('riceType').value;
    const soil = document.getElementById('soilType').value;

    let recommendation = "";

    // วิเคราะห์ตามสายพันธุ์ข้าว
    if (rice === 'white_jasmine105') {
        recommendation += "<strong>ขาวดอกมะลิ 105:</strong> เป็นสายพันธุ์ที่ทนแล้งได้ดี ทนดินเปรี้ยว ข้าวสุกจะอ่อนนุ่มและมีกลิ่นหอมมาก ควรระวังเรื่องน้ำหลากในช่วงใกล้เก็บเกี่ยว<br>";
    } else if (rice === 'khorgor15') {
        recommendation += "<strong>กข15:</strong> อายุเก็บเกี่ยวสั้นกว่าขาวดอกมะลิ 105 ประมาณ 10 วัน เหมาะกับพื้นที่ที่ฝนอาจหมดเร็วหรือน้ำน้อยตอนปลายฤดู<br>";
    } else {
        recommendation += "<strong>หอมมะลิทุ่งกุลาฯ:</strong> ต้องการการดูแลพิเศษในพื้นที่ที่มีความแห้งแล้งและดินร่วนปนทรายเพื่อให้ได้ความหอมสูงสุด<br>";
    }

    // วิเคราะห์ตามสภาพดิน
    if (soil === 'clay') {
        recommendation += "สภาพ <strong>ดินเหนียว</strong> ช่วยอุ้มน้ำและธาตุอาหารได้ดี ทนแล้งได้ดีกว่าดินประเภทอื่น ลดการสูญเสียน้ำในนา<br>";
    } else if (soil === 'sand') {
        recommendation += "สภาพ <strong>ดินทราย</strong> ระบายน้ำได้เร็วมาก ควรหมั่นสังเกตระดับน้ำและอาจต้องเติมปุ๋ยอินทรีย์เพื่อช่วยเพิ่มความสามารถในการอุ้มน้ำ<br>";
    } else {
        recommendation += "สภาพ <strong>ดินร่วน</strong> มีความอุดมสมบูรณ์ปานกลางถึงดี ระบายน้ำได้ดี เหมาะกับการเพาะปลูกทั่วไป<br>";
    }

    // วิเคราะห์ปัจจัยการผลิตตามขนาดพื้นที่
    const seedAmount = size * 15; // ประมาณ 15 กก. ต่อไร่
    const expectedYieldMin = size * 350; // ขั้นต่ำ 350 กก./ไร่
    const expectedYieldMax = size * 500; // สูงสุด 500 กก./ไร่

    recommendation += `<br><div style="background-color: #ffffff99; padding: 10px; border-radius: 5px; margin-top: 10px;">
        <strong><i class="fa-solid fa-calculator"></i> AI วิเคราะห์สำหรับพื้นที่ ${size} ไร่:</strong><br>
        - แนะนำเตรียมเมล็ดพันธุ์: ประมาณ ${seedAmount.toLocaleString()} กิโลกรัม (สูตร 15 กก./ไร่)<br>
        - คาดการณ์ผลผลิต: ${expectedYieldMin.toLocaleString()} - ${expectedYieldMax.toLocaleString()} กิโลกรัม (ขึ้นอยู่กับสภาพอากาศและการปฏิบัติดูแล)
    </div>`;

    // แสดงผล
    const box = document.getElementById('aiRecommendationBox');
    const content = document.getElementById('aiRecommendationContent');

    content.innerHTML = recommendation;
    box.style.display = 'block';

    // เลื่อนลงมาให้เห็นชัดเจน
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
