// 1. Плавный скролл
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 2. FAQ Аккордеон
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        const isActive = item.classList.contains('active');
        
        // Закрыть все
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        
        // Открыть текущий, если он был закрыт
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// 3. АНИМАЦИЯ ПРОЦЕССА ПРИ СКРОЛЛЕ (Intersection Observer)
const processSteps = document.querySelectorAll('.process-step');
const processLine = document.querySelector('.process-line__progress');

const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            updateProcessLine();
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
});

processSteps.forEach(step => processObserver.observe(step));

// Обновление линии прогресса
function updateProcessLine() {
    const visibleSteps = document.querySelectorAll('.process-step.visible');
    const totalSteps = processSteps.length;
    const progress = (visibleSteps.length / totalSteps) * 100;
    if (processLine) {
        processLine.style.height = progress + '%';
    }
}

// 4. АНИМАЦИЯ ПОЯВЛЕНИЯ БЛОКОВ ПРИ СКРОЛЛЕ
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Применяем к секциям
document.querySelectorAll('.section-header, .grid-card, .service-row, .case-card, .testimonial-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
});

// 5. Отправка формы в Telegram
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