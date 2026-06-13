// 1. Плавный скролл
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 2. Отправка формы в Telegram
const form = document.getElementById('telegramForm');
const statusText = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

// ⚠️ ЗАМЕНИТЕ НА СВОИ ДАННЫЕ
const BOT_TOKEN = 'ВАШ_BOT_TOKEN'; 
const CHAT_ID = 'ВАШ_CHAT_ID'; 

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    statusText.textContent = '';
    statusText.className = 'form-status mono-text';

    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact_method').value;
    const message = document.getElementById('message').value;

    const text = `
🔔 *Новая заявка с сайта!*

👤 *Имя:* ${name}
📱 *Контакт:* ${contact}
📝 *Задача:* ${message}
    `.trim();

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            statusText.textContent = '✓ Заявка успешно отправлена! Я свяжусь с вами в ближайшее время.';
            statusText.classList.add('success');
            form.reset();
        } else {
            throw new Error('Ошибка сети');
        }
    } catch (error) {
        statusText.textContent = '✕ Произошла ошибка. Пожалуйста, напишите мне напрямую в Telegram.';
        statusText.classList.add('error');
        console.error('Telegram API Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
    }
});