// d:\AI-2025\js\rice_price.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Generate Realistic "Real-time" Data aligned with the current Date
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11
    
    // Base price around 14,500 THB/ton for Jasmine Rice for 2026
    const basePrice = 14500;
    
    // Function to generate a deterministic random number based on year, month and day
    function pseudoRandom(seed) {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    // Generate price for each month of the current year (12 months)
    const monthsName = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const priceData = [];
    
    let lastPrice = basePrice;
    for(let i = 0; i < 12; i++) {
        // Seasonal factors: price drops near harvest (Nov-Dec), rises in dry season (Mar-May)
        let seasonalOffset = pseudoRandom(currentYear * 12 + i) * 600 - 300; 
        if(i >= 10) seasonalOffset -= 800; // Harvest season drop
        else if (i >= 2 && i <= 4) seasonalOffset += 500; // Dry season increase
        
        // Random walk
        let change = seasonalOffset + (pseudoRandom(currentYear + i*7) * 400 - 200);
        let currentMonthPrice = Math.round((basePrice + change) / 100) * 100; 
        priceData.push(currentMonthPrice);
    }
    
    // Derive Today's Price
    // Slightly tweak the current month's price to simulate daily fluctuation
    const dailyFluctuation = Math.round((pseudoRandom(today.getDate() * currentMonth) * 400 - 200) / 10) * 10;
    const todayPrice = priceData[currentMonth] + dailyFluctuation;
    
    // Yesterday's price for the trend
    const yesterdayFluctuation = Math.round((pseudoRandom((today.getDate() - 1) * currentMonth) * 400 - 200) / 10) * 10;
    const yesterdayPrice = priceData[currentMonth] + yesterdayFluctuation;
    
    const priceDiff = todayPrice - yesterdayPrice;
    
    // 2. Update UI Elements
    // Updating Today's Price Section
    const priceElement = document.getElementById('todayPriceValue');
    const trendElement = document.getElementById('priceTrendBox');
    const trendIcon = document.getElementById('priceTrendIcon');
    const trendText = document.getElementById('priceTrendText');
    
    if(priceElement) priceElement.textContent = todayPrice.toLocaleString();
    
    if(trendElement && trendIcon && trendText) {
        if(priceDiff > 0) {
            trendElement.className = 'price-trend up-trend float-anim';
            trendIcon.className = 'fa-solid fa-arrow-trend-up';
            trendText.textContent = `+${Math.abs(priceDiff)} บาท (ขึ้นจากเมื่อวาน)`;
        } else if (priceDiff < 0) {
            trendElement.className = 'price-trend down-trend float-anim'; // Assuming down-trend exists in CSS
            trendIcon.className = 'fa-solid fa-arrow-trend-down';
            trendText.textContent = `-${Math.abs(priceDiff)} บาท (ลดลงจากเมื่อวาน)`;
        } else {
            trendElement.className = 'price-trend float-anim';
            trendElement.style.color = '#cbd5e1';
            trendElement.style.background = 'rgba(255,255,255,0.05)';
            trendIcon.className = 'fa-solid fa-minus';
            trendText.textContent = `ราคาทรงตัว`;
        }
    }
    
    // Updating Forecast Section (Next 3 Months)
    const forecastContainer = document.getElementById('forecastContainer');
    if (forecastContainer) {
        let forecastHTML = '';
        let maxForecast = 0;
        let minForecast = 99999;
        let peakMonthIdx = currentMonth;
        
        for(let j = 1; j <= 3; j++) {
            let nextM = (currentMonth + j) % 12;
            let expectedPrice = priceData[nextM];
            if (expectedPrice > maxForecast) { maxForecast = expectedPrice; peakMonthIdx = nextM; }
            if (expectedPrice < minForecast) { minForecast = expectedPrice; }
        }
        
        for(let j = 1; j <= 3; j++) {
            let nextM = (currentMonth + j) % 12;
            let mName = monthsName[nextM];
            let rawPrice = priceData[nextM];
            
            // Normalize height between 30% and 90%
            let normHeight = 30 + ((rawPrice - 11000) / (15000 - 11000)) * 60;
            normHeight = Math.max(20, Math.min(100, normHeight));
            
            // Determine bar color class based on comparing to todayPrice
            let barClass = (rawPrice >= todayPrice) ? 'bar-up' : 'bar-down';
            
            forecastHTML += `
                <div class="forecast-item">
                    <span class="month">${mName}</span>
                    <div class="forecast-bar ${barClass}" style="height: ${normHeight}%;"></div>
                    <span class="f-price">${rawPrice.toLocaleString()}</span>
                </div>
            `;
        }
        forecastContainer.innerHTML = forecastHTML;
        
        const summaryObj = document.getElementById('forecastSummaryText');
        if(summaryObj) summaryObj.textContent = `คาดว่าราคาจะพุ่งสูงสุดในเดือน${monthsName[peakMonthIdx]} ที่ ${maxForecast.toLocaleString()} บาท`;
        
        // Update AI Advice based on data
        const actionStatus = document.getElementById('aiActionStatus');
        const actionText = document.getElementById('aiActionText');
        const actionTitle = document.getElementById('aiActionTitle');
        const aiIcon = document.getElementById('aiActionIcon');
        
        if (actionStatus && actionText) {
            if(todayPrice < priceData[(currentMonth + 1) % 12]) {
                actionStatus.className = 'insight-status highlight-hold';
                actionTitle.innerHTML = 'กลยุทธ์: <strong>ชะลอการขาย</strong>';
                aiIcon.className = 'fa-solid fa-boxes-stacked';
                actionText.innerHTML = `<p><strong>ผลการวิเคราะห์:</strong> ราคาปัจจุบัน (${todayPrice.toLocaleString()}) ยังต่ำกว่าแนวโน้มเดือนหน้า</p>
                <p><strong>คำแนะนำสำหรับคุณ:</strong> หากคุณมียุ้งฉางที่ได้มาตรฐาน ควรเก็บข้าวหอมมะลิรอจำหน่ายในเดือน${monthsName[peakMonthIdx]} ซึ่ง AI คาดการณ์ว่าราคาจะแตะ ${maxForecast.toLocaleString()} บาท/ตัน จะทำให้ได้กำไรสูงสุด</p>`;
            } else {
                actionStatus.className = 'insight-status highlight-sell'; // Assume highlight-sell exists
                actionStatus.style.background = 'rgba(239, 68, 68, 0.1)';
                actionStatus.style.color = '#ef4444';
                actionStatus.style.border = '1px solid rgba(239, 68, 68, 0.2)';
                actionTitle.innerHTML = 'กลยุทธ์: <strong>แนะนำให้ขาย</strong>';
                aiIcon.className = 'fa-solid fa-truck-fast';
                actionText.innerHTML = `<p><strong>ผลการวิเคราะห์:</strong> ราคาพุ่งสูงถึง ${todayPrice.toLocaleString()} บาท/ตัน ซึ่งสูงที่สุดในระยะเวลาอันใกล้</p>
                <p><strong>คำแนะนำสำหรับคุณ:</strong> เป็นช่วงเวลาที่ดีที่สุดในการเทขายข้าวหอมมะลิในสต็อกของคุณ AI วิเคราะห์ว่าแนวโน้มในเดือนถัดไปตลาดจะชะลอตัวลง รีบขายตอนนี้เพื่อกำไรสูงสุด!</p>`;
            }
        }
    }

    // 3. Render Chart
    const ctx = document.getElementById('ricePriceChart').getContext('2d');

    let gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
    gradientFill.addColorStop(0, 'rgba(14, 165, 233, 0.4)'); 
    gradientFill.addColorStop(1, 'rgba(14, 165, 233, 0)');   

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthsName,
            datasets: [{
                label: 'ราคาข้าวหอมมะลิต่อตัน (บาท)',
                data: priceData,
                backgroundColor: gradientFill,
                borderColor: '#0ea5e9',
                borderWidth: 3,
                pointBackgroundColor: function(context) {
                    return context.dataIndex === currentMonth ? '#facc15' : '#ffffff'; // Highlight current month
                },
                pointBorderColor: '#0ea5e9',
                pointBorderWidth: function(context) {
                    return context.dataIndex === currentMonth ? 3 : 2; 
                },
                pointRadius: function(context) {
                    return context.dataIndex === currentMonth ? 6 : 4; 
                },
                pointHoverRadius: 8,
                fill: true,
                tension: 0.4 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    titleColor: '#0ea5e9',
                    bodyColor: '#334155',
                    borderColor: 'rgba(0,0,0,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return ' ' + context.parsed.y.toLocaleString() + ' บาท/ตัน';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
                    ticks: { color: '#e2e8f0', font: { family: "'Prompt', sans-serif" } }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false, borderDash: [5, 5] },
                    ticks: {
                        color: '#cbd5e1',
                        font: { family: "'Prompt', sans-serif" },
                        callback: function (value) { return value.toLocaleString() + ' ฿'; }
                    },
                    min: 10000,
                    max: 16000 // Increased range for realistic prices
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            }
        }
    });
});
