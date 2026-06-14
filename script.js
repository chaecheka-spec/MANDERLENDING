// 1. КАСТОМНЫЙ КУРСОР
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

const interactiveElements = document.querySelectorAll('a, button, input, textarea, .grid-card, .case-card, .service-row, .faq-item, .testimonial-card, .logo-placeholder');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
    });
});

// 2. PROGRESS BAR СКРОЛЛА
const scrollProgress = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// 3. МАГНИТНЫЕ КНОПКИ
const magneticButtons = document.querySelectorAll('.magnetic');
magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// 4. Плавный скролл
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

// 5. FAQ Аккордеон
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

// 6. АНИМАЦИЯ ПРОЦЕССА (ЗМЕЙКА)
const processSteps = document.querySelectorAll('.process-step');
const processConnectors = document.querySelectorAll('.process-connector');

const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Найти коннектор перед этим шагом и заполнить его
            const prevSibling = entry.target.previousElementSibling;
            if (prevSibling && prevSibling.classList.contains('process-connector')) {
                prevSibling.classList.add('filled');
            }
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
});

processSteps.forEach(step => processObserver.observe(step));

// 7. СЧЁТЧИКИ С АНИМАЦИЕЙ
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateCounters();
        }
    });
}, { threshold: 0.5 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);

function animateCounters() {
    statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        updateCounter();
    });
}

// 8. АНИМАЦИЯ ПОЯВЛЕНИЯ БЛОКОВ ПРИ СКРОЛЛЕ
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section-header, .grid-card, .service-row, .case-card, .testimonial-card, .faq-item, .stat-item, .logo-placeholder').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
});

document.querySelectorAll('.grid-card, .service-row, .stat-item').forEach((el, index) => {
    el.style.transitionDelay = (index * 0.1) + 's';
});

// 9. Отправка формы в Telegram
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