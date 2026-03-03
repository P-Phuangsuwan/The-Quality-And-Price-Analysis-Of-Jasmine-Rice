const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Enable CORS for frontend connection
app.use(cors());
app.use(express.json());

// Serve static frontend files from the 'pages' directory
app.use(express.static(path.join(__dirname, '../pages')));

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Use gemini-2.5-flash model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Add System Prompt Context for the Agricultural AI
        const prompt = `คุณคือ AI ผู้ช่วยฟาร์มอัจฉริยะ (Smart Rice AI) ที่เชี่ยวชาญด้านการเกษตร สภาพอากาศ การทำนาข้าวหอมมะลิ และราคาข้าวหอมมะลิ
คอยให้คำแนะนำชาวนาและเกษตรกรเกี่ยวกับการเกษตร โดยเฉพาะข้าวหอมมะลิ
ตอบคำถามด้วยภาษาที่สุภาพ เป็นกันเอง เข้าใจง่าย และกระชับ
คำถามจากผู้ใช้: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running perfectly.`);
    console.log(`🌐 Frontend Web App:   http://localhost:${port}/index.html`);
    console.log(`⚙️  API Endpoint:      http://localhost:${port}/api/chat`);
});
