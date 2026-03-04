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
    const riceStage = document.getElementById('riceStage') ? document.getElementById('riceStage').value : 'seedling';
    const soil = document.getElementById('soilType').value;
    const expectedYieldInput = document.getElementById('expectedYield').value || 500;

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

    // วิเคราะห์ปัจจัยการผลิตตามเป้าหมายผลผลิต
    const targetYieldPerRai = parseInt(expectedYieldInput);

    // คำนวณอัตราเมล็ดพันธุ์ที่ต้องใช้ (ถ้าหวังผลผลิตสูง อาจต้องใช้เมล็ดพันธุ์หรือการจัดการที่ดีขึ้น)
    // สูตรสมมติ: 15 กก./ไร่ เป็นพื้นฐานสำหรับผลผลิต 400 กก., ถ้าหวัง 600 ต้องเพิ่มเป็น 18-20 กก./ไร่
    let seedRate = 15;
    if (targetYieldPerRai > 500) { seedRate = 20; }
    else if (targetYieldPerRai > 400) { seedRate = 18; }

    const seedAmount = size * seedRate;
    const totalExpectedYield = size * targetYieldPerRai;

    recommendation += `<br><div style="background-color: #ffffff99; padding: 15px; border-radius: 8px; margin-top: 10px; border-left: 4px solid var(--chatbot-btn);">
        <strong><i class="fa-solid fa-bullseye" style="color: var(--accent-red);"></i> AI วิเคราะห์เป้าหมาย ${targetYieldPerRai.toLocaleString()} กก./ไร่ (พื้นที่ ${size} ไร่):</strong><br>
        <ul style="margin-top: 8px; padding-left: 20px; line-height: 1.6;">
            <li><strong>ผลผลิตรวมที่คาดหวัง:</strong> ${totalExpectedYield.toLocaleString()} กิโลกรัม</li>
            <li><strong>เมล็ดพันธุ์ที่ควรเตรียม:</strong> ประมาณ ${seedAmount.toLocaleString()} กิโลกรัม (อัตรา ${seedRate} กก./ไร่)</li>
            <li><strong>คำแนะนำพิเศษ:</strong> ${targetYieldPerRai > 450 ? "เพื่อบรรลุเป้าหมายที่ตั้งไว้สูง ควรเน้นการจัดการปุ๋ยธาตุอาหารรองเสริม และฉีดพ่นฮอร์โมนในช่วงข้าวตั้งท้อง" : "เป้าหมายอยู่ในเกณฑ์มาตรฐาน สามารถใช้วิธีการเพาะปลูกและใส่ปุ๋ยตามปกติได้"}</li>
        </ul>
    </div>`;

    // --------------------------------------------------------------------------------
    // NEW Feature: Unified AI Report Generation
    // --------------------------------------------------------------------------------
    const unifiedReportObj = document.getElementById('unifiedAiReportContent');
    if (unifiedReportObj) {

        // 1. Get Current Weather Logic (Simple check from DOM if available)
        const weatherCondition = document.getElementById('dashCondition') ? document.getElementById('dashCondition').textContent : '';
        const tempText = document.getElementById('dashTemp') ? document.getElementById('dashTemp').textContent : '';
        const humidityText = document.getElementById('dashHumidity') ? document.getElementById('dashHumidity').textContent : '';
        const rainProbText = document.getElementById('dashRainProb') ? document.getElementById('dashRainProb').textContent : '';
        const waterText = document.getElementById('dashWater') ? document.getElementById('dashWater').textContent : '';
        const phText = document.getElementById('dashPH') ? document.getElementById('dashPH').textContent : '';

        const temp = parseInt(tempText) || 0;
        const humidity = parseInt(humidityText) || 0;
        const rainProb = parseInt(rainProbText) || 0;
        const waterLevel = parseInt(waterText) || 0;
        const soilPH = parseFloat(phText) || 0;

        let weatherWarning = "";
        let isRaining = weatherCondition.includes('ฝน') || weatherCondition.includes('พายุ');

        if (isRaining) {
            weatherWarning = `<strong style="color: #e53e3e;">ระมัดระวังฝนตก:</strong> งดการฉีดพ่นปุ๋ยทางใบในระยะนี้ และเตรียมสูบน้ำออกจากแปลงหากน้ำท่วมขังเกินเกณฑ์`;
        } else if (temp > 35) {
            weatherWarning = `<strong style="color: #d69e2e;">อากาศร้อนจัด:</strong> ควรรักษาระดับน้ำในแปลงให้เหมาะสมเพื่อช่วยลดอุณหภูมิของรากข้าว`;
        } else {
            weatherWarning = `<strong style="color: #38a169;">สภาพอากาศเหมาะสม:</strong> เป็นช่วงเวลาที่ดีในการบำรุงรักษาแปลงนา หรือลงพื้นที่เพื่อฉีดพ่นฮอร์โมน`;
        }

        let stageName = "ระยะกล้า";
        if (riceStage === 'tillering') stageName = "ระยะแตกกอ";
        if (riceStage === 'booting') stageName = "ระยะตั้งท้อง";
        if (riceStage === 'flowering') stageName = "ระยะออกรวง";

        // 1.1 Water Management
        let waterAction = "";
        if (waterLevel <= 2 && rainProb < 30) {
            waterAction = `ระดับน้ำจำลองต่ำมากแค่ ${waterLevel} ซม. <strong>ควรรีบสูบน้ำเข้าเติม</strong> รักษาระดับ 3-5 ซม.`;
            if (riceStage === 'booting' || riceStage === 'flowering') waterAction += ` <span style="color:#e53e3e;">(สำคัญ: ข้าว${stageName}ขาดน้ำไม่ได้เด็ดขาด จะทำให้รวงลีบ)</span>`;
        } else if (rainProb > 80 || waterLevel > 12) {
            waterAction = `โอกาสฝนสูง (${rainProb}%) หรือระดับน้ำมากเกินไป (${waterLevel} ซม.) <strong>เตรียมระบายน้ำออก</strong>`;
            if (riceStage === 'seedling') waterAction += ` <span style="color:#d69e2e;">(ระวังต้นกล้าจมน้ำตาย)</span>`;
        } else {
            waterAction = `ระดับน้ำเหมาะสม สภาพการจัดการน้ำอยู่ในเกณฑ์ปลอดภัย`;
            if (riceStage === 'tillering') waterAction += ` <span style="color:#38a169;">(สามารถปล่อยน้ำแห้งสลับเปียกเพื่อกระตุ้นรากได้)</span>`;
        }

        // 1.2 Temp Management
        let tempAction = "";
        if (temp >= 35) {
            tempAction = `อุณหภูมิ ${temp}°C <strong>ร้อนจัด</strong> แนะนำให้เพิ่มระดับน้ำช่วยระบายความร้อนที่ราก`;
            if (riceStage === 'booting' || riceStage === 'flowering') tempAction += ` <span style="color:#e53e3e;">(เฝ้าระวังดอกร่วงและเกสรหมันในช่วง${stageName})</span>`;
        } else if (temp <= 20) {
            tempAction = `อากาศเย็น ${temp}°C อาจทำให้ข้าวชะงักการเติบโต เพิ่มระดับน้ำรักษาอุณหภูมิดิน`;
            if (riceStage === 'seedling') tempAction += ` <span style="color:#d69e2e;">(ระวังต้นกล้าแคระแกร็น)</span>`;
        } else {
            tempAction = `อุณหภูมิกำลังดี (${temp}°C) เหมาะกับการเจริญเติบโตในช่วง${stageName}`;
        }

        // 1.3 Disease Management
        let diseaseAction = "";
        if (humidity > 80 && temp >= 28 && temp <= 32) {
            diseaseAction = `<strong>เสี่ยงเกิดโรคไหม้/เพลี้ยกระโดด</strong> เนื่องจากอากาศร้อนชื้น ควรชะลอการใส่ปุ๋ยยูเรีย`;
        } else if (rainProb > 70) {
            diseaseAction = `ระวังการระบาดของโรคขอบใบแห้ง ควรเลี่ยงทางเดินลุยแปลงขณะใบเปียก`;
        } else {
            diseaseAction = `ความเสี่ยงโรคและแมลงอยู่ในเกณฑ์ต่ำ ควรหมั่นถอนวัชพืชเพื่อให้แสงสาดส่องทั่วถึง`;
        }
        if (riceStage === 'seedling') diseaseAction += ` <span style="color:#d69e2e;">(ระวังศัตรูพืชจำพวกหอยเชอรี่และปูนาทำลายต้นกล้า)</span>`;
        if (riceStage === 'tillering') diseaseAction += ` <span style="color:#d69e2e;">(หมั่นสำรวจแปลงนาหาหนอนกอหรือเพลี้ย)</span>`;

        // 1.4 Soil Management
        let soilAction = "";
        if (soilPH > 0) { // check if simulated ph exists
            if (soilPH < 5.5) {
                soilAction = `ค่า pH ดิน ${soilPH} <strong>ระวังภาวะดินเปรี้ยว</strong> ส่งผลให้ห้วงติดดอกออกผลน้อย พิจารณาใช้ปูนขาวปรับสภาพเผื่อรอบถัดไป`;
            } else if (soilPH > 6.5) {
                soilAction = `ค่า pH ดิน ${soilPH} มีความเป็นด่าง ข้าวอาจดูดซึมเหล็ก/สังกะสีได้น้อย เลี่ยงใช้ปุ๋ยด่างแรง`;
            } else {
                soilAction = `ค่า pH ดิน ${soilPH} เหมาะสมอย่างยิ่งกับการปลูกข้าว ระบบรากดูดซึมสารอาหารได้เต็มที่`;
            }
            if (riceStage === 'tillering') soilAction += ` <span style="color:#38a169;">(ระยะนี้ควรเน้นปุ๋ยไนโตรเจนสูงเพื่อเร่งการแตกกอ)</span>`;
            if (riceStage === 'booting') soilAction += ` <span style="color:#38a169;">(ระยะนี้ควรเน้นปุ๋ยสูตรตัวท้ายสูงเพื่อบำรุงรวง)</span>`;
        }

        // 2. Get Price Forecast Logic (From DOM)
        const priceIcon = document.getElementById('dashRiceIcon');
        let priceAction = "";
        if (priceIcon && priceIcon.className.includes('up')) {
            priceAction = "แนวโน้มราคาตลาดกำลังจะ <strong>ปรับตัวสูงขึ้นในเดือนหน้า</strong> แนะนำให้ <span style='background-color: #fefcbf; padding: 2px 6px; border-radius: 4px;'>ชะลอการขายข้าวเปลือกออกไปก่อน</span> เพื่อรอทำกำไรในช่วงที่ราคาขึ้นสูงสุด";
        } else if (priceIcon && priceIcon.className.includes('down')) {
            priceAction = "แนวโน้มราคาตลาดกำลังจะ <strong>ปรับตัวลดลงในเดือนหน้า</strong> ควรรีบ <span style='background-color: #fed7d7; padding: 2px 6px; border-radius: 4px;'>เร่งระบายข้าวในสต็อก หรือตกลงราคาขายล่วงหน้า</span> เพื่อลดความเสี่ยงจากภาวะราคาตกต่ำ";
        } else {
            priceAction = "ราคาตลาดอยู่ในเกณฑ์ ทรงตัว สามารถวางแผนการขายตามรอบปกติได้";
        }

        // 3. Farm Specific Logic (From above calculations)
        let farmAction = `สำหรับพื้นที่ ${size} ไร่ ที่ปลูก${rice === 'white_jasmine105' ? 'ข้าวขาวดอกมะลิ 105' : (rice === 'khorgor15' ? 'ข้าว กข15' : 'ข้าวขาวดอกมะลิ 105')} ในสภาพ${soil === 'clay' ? 'ดินเหนียว' : (soil === 'sand' ? 'ดินทราย' : 'ดินร่วน')}`;

        // Assemble Unified Report
        let unifiedHTML = `
            <p>สวัสดีครับเกษตรกร! จากข้อมูลฟาร์ม สภาพอากาศ และแนวโน้มราคาในปัจจุบัน นี่คือบทสรุปคำแนะนำที่ AI ประมวลผลให้คุณโดยเฉพาะ:</p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <h4 style="color: #d97706; margin-bottom: 8px; border-bottom: 1px solid #fde68a; padding-bottom: 5px;"><i class="fa-solid fa-cloud-sun"></i> 1. การรับมือสภาพอากาศ ภาพรวม</h4>
                <p style="font-size: 0.95rem; margin-bottom: 0;">${weatherWarning}</p>
            </div>

             <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <h4 style="color: #0284c7; margin-bottom: 8px; border-bottom: 1px solid #bae6fd; padding-bottom: 5px;"><i class="fa-solid fa-droplet"></i> 2. การจัดการสภาพต้นข้าวเชิงลึก</h4>
                <ul style="font-size: 0.9rem; padding-left: 20px; margin-bottom: 0; line-height: 1.6;">
                    <li><strong><i class="fa-solid fa-water" style="color:#0284c7; width:20px;"></i> น้ำ:</strong> ${waterAction}</li>
                    <li><strong><i class="fa-solid fa-temperature-half" style="color:#ea580c; width:20px;"></i> อุณหภูมิ:</strong> ${tempAction}</li>
                    <li><strong><i class="fa-solid fa-bug" style="color:#e11d48; width:20px;"></i> โรค/แมลง:</strong> ${diseaseAction}</li>
                    <li><strong><i class="fa-solid fa-flask" style="color:#8b5cf6; width:20px;"></i> สภาพดิน:</strong> ${soilAction}</li>
                </ul>
            </div>

            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <h4 style="color: #059669; margin-bottom: 8px; border-bottom: 1px solid #a7f3d0; padding-bottom: 5px;"><i class="fa-solid fa-seedling"></i> 3. การจัดการที่ดินของคุณ</h4>
                <p style="font-size: 0.95rem; margin-bottom: 5px;">${farmAction}</p>
                <ul style="font-size: 0.9rem; padding-left: 20px; margin-bottom: 0; line-height: 1.5;">
                    <li><strong>เป้าหมายผลผลิต:</strong> ${totalExpectedYield.toLocaleString()} กก. (เป้า ${targetYieldPerRai} กก./ไร่)</li>
                    <li><strong>อัตราเมล็ดพันธุ์ที่แนะนำ:</strong> ${seedRate} กก./ไร่ (รวม ${seedAmount.toLocaleString()} กก.)</li>
                    <li>${targetYieldPerRai > 450 ? "จำเป็นต้องเสริมปุ๋ยธาตุอาหารรองเพื่อให้ถึงเป้าหมายระดับสูง" : "การดูแลตามมาตรฐานเพียงพอต่อการบรรลุเป้าหมาย"}</li>
                </ul>
            </div>

            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin-top: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <h4 style="color: #2563eb; margin-bottom: 8px; border-bottom: 1px solid #bfdbfe; padding-bottom: 5px;"><i class="fa-solid fa-chart-line"></i> 4. กลยุทธ์การขายข้าว</h4>
                <p style="font-size: 0.95rem; margin-bottom: 0;">${priceAction}</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 0.9rem; color: #64748b; text-align: center;">ข้อมูลนี้ประมวลผลอัตโนมัติจากอัลกอริทึม Smart Rice AI เพื่อช่วยประกอบการตัดสินใจของเกษตรกร</p>
        `;

        unifiedReportObj.innerHTML = unifiedHTML;
    }

    // --- NEW: Update Dashboard Rice Price Chart ---
    if (typeof updateDashboardRicePrice === 'function') {
        updateDashboardRicePrice(rice);
    }

    // Scroll to the unified report at the bottom
    if (unifiedReportObj) {
        unifiedReportObj.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
