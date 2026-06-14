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
        
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// 3. Анимация процесса
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

function updateProcessLine() {
    const visibleSteps = document.querySelectorAll('.process-step.visible');
    const totalSteps = processSteps.length;
    const progress = (visibleSteps.length / totalSteps) * 100;
    if (processLine) {
        processLine.style.height = progress + '%';
    }
}

// 4. Анимация появления блоков
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section-header, .grid-card, .service-row, .case-card, .testimonial-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
});

// 5. Прогресс-бар скролла
const progressBar = document.querySelector('.scroll-progress__bar');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// 6. Кастомный курсор
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// Плавное следование большого круга
function animateFollower() {
    const distX = mouseX - followerX;
    const distY = mouseY - followerY;
    
    followerX += distX * 0.15;
    followerY += distY * 0.15;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Эффект при наведении на интерактивные элементы
const hoverElements = document.querySelectorAll('a, button, input, textarea, .case-card, .grid-card, .service-row');

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('hover');
    });
});

// 7. Магнитный эффект на кнопках
const magneticBtns = document.querySelectorAll('.magnetic');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// 8. Отправка формы в Telegram
const form = document.getElementById('telegramForm');
const statusText = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

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