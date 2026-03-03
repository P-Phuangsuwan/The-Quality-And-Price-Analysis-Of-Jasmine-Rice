// d:\AI-2025\pages\js\rice_price.js

document.addEventListener('DOMContentLoaded', () => {
    // Rice Price Chart Initialization
    const ctx = document.getElementById('ricePriceChart').getContext('2d');

    // Create Premium Gradient Fill for Line Chart (Light Theme)
    let gradientFill = ctx.createLinearGradient(0, 0, 0, 300);
    gradientFill.addColorStop(0, 'rgba(14, 165, 233, 0.4)'); // Sky blue translucent at top
    gradientFill.addColorStop(1, 'rgba(14, 165, 233, 0)');   // Transparent at bottom

    // Mock Data for 12 months (Hom Mali Rice 105)
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const priceData = [11800, 12000, 12500, 13200, 12800, 12500, 12400, 12600, 12700, 12900, 11500, 11700];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'ราคาข้าวหอมมะลิต่อตัน (บาท)',
                data: priceData,
                backgroundColor: gradientFill,
                borderColor: '#0ea5e9', // Sky blue line
                borderWidth: 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#0ea5e9',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4 // Smooth curves
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hide legend for cleaner look
                },
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,0.9)',
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
                    grid: {
                        color: 'rgba(0,0,0,0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            family: "'Prompt', sans-serif"
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0,0,0,0.05)',
                        drawBorder: false,
                        borderDash: [5, 5]
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            family: "'Prompt', sans-serif"
                        },
                        callback: function (value) {
                            return value.toLocaleString() + ' ฿';
                        }
                    },
                    min: 10000,
                    max: 14000
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        }
    });

    // Chatbot functionality (handled by app.js essentially)
});
