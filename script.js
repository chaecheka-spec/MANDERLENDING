/* ============================================
   SCRIPT.JS — Версия 3.0
   Модули:
   1. Кастомный курсор
   2. Progress bar скролла
   3. Магнитные кнопки
   4. Плавный скролл
   5. Бургер-меню
   6. FAQ аккордеон
   7. Анимация процесса (круговая инфографика)
   8. Счётчики с анимацией
   9. Анимация появления блоков
   10. Валидация формы + honeypot
   11. Отправка в Telegram
   ============================================ */

// ============ 1. КАСТОМНЫЙ КУРСОР ============
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && follower) {
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

    // Увеличение курсора при наведении на интерактивные элементы
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .grid-card, .case-card, .service-row, .faq-item, .testimonial-card, .clients-logos__item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor--active');
            follower.classList.add('cursor-follower--active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor--active');
            follower.classList.remove('cursor-follower--active');
        });
    });
}

// ============ 2. PROGRESS BAR СКРОЛЛА ============
const scrollProgress = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    if (!scrollProgress) return;
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
}, { passive: true });

// ============ 3. МАГНИТНЫЕ КНОПКИ ============
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

// ============ 4. ПЛАВНЫЙ СКРОЛЛ ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Закрываем мобильное меню при клике
            closeMobileMenu();
        }
    });
});

// ============ 5. БУРГЕР-МЕНЮ ============
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');

function openMobileMenu() {
    if (!burger || !mobileMenu) return;
    burger.classList.add('burger--active');
    mobileMenu.classList.add('mobile-menu--active');
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Блокируем скролл
}

function closeMobileMenu() {
    if (!burger || !mobileMenu) return;
    burger.classList.remove('burger--active');
    mobileMenu.classList.remove('mobile-menu--active');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (burger) {
    burger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('mobile-menu--active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});

// ============ 6. FAQ АККОРДЕОН ============
document.querySelectorAll('.faq-item__question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        const isActive = item.classList.contains('faq-item--active');
        
        // Закрываем все
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('faq-item--active');
            i.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
        });
        
        // Открываем текущий, если был закрыт
        if (!isActive) {
            item.classList.add('faq-item--active');
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

// ============ 7. АНИМАЦИЯ ПРОЦЕССА (КРУГОВАЯ ИНФОГРАФИКА) ============
const processSteps = document.querySelectorAll('.process-step');
const processBalls = document.querySelectorAll('.process-circle__ball');

const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const step = entry.target;
        const stepNumber = step.getAttribute('data-step');
        const ball = document.querySelector(`.process-circle__ball[data-ball="${stepNumber}"]`);
        
        if (entry.isIntersecting) {
            step.classList.add('process-step--active');
            if (ball) ball.classList.add('process-circle__ball--active');
        } else {
            step.classList.remove('process-step--active');
            if (ball) ball.classList.remove('process-circle__ball--active');
        }
    });
}, {
    threshold: 0.5,
    rootMargin: '0px 0px -20% 0px'
});

processSteps.forEach(step => processObserver.observe(step));

// ============ 8. СЧЁТЧИКИ С АНИМАЦИЕЙ ============
const statNumbers = document.querySelectorAll('.stats-grid__number');
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

// ============ 9. АНИМАЦИЯ ПОЯВЛЕНИЯ БЛОКОВ ============
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section-header, .grid-card, .service-row, .case-card, .testimonial-card, .faq-item, .stats-grid__item, .clients-logos__item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
});

// Каскадное появление
document.querySelectorAll('.grid-card, .service-row, .stats-grid__item').forEach((el, index) => {
    el.style.transitionDelay = (index * 0.1) + 's';
});

// ============ 10. ВАЛИДАЦИЯ ФОРМЫ + HONEYPOT ============
const form = document.getElementById('telegramForm');
const statusText = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

// Регулярные выражения для валидации
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEGRAM_REGEX = /^@[a-zA-Z0-9_]{3,}$/;

function showError(fieldName, message) {
    const errorEl = document.querySelector(`[data-error="${fieldName}"]`);
    const group = errorEl?.closest('.contact-form__group');
    if (errorEl) errorEl.textContent = message;
    if (group) group.classList.add('contact-form__group--error');
}

function clearError(fieldName) {
    const errorEl = document.querySelector(`[data-error="${fieldName}"]`);
    const group = errorEl?.closest('.contact-form__group');
    if (errorEl) errorEl.textContent = '';
    if (group) group.classList.remove('contact-form__group--error');
}

function validateContact(value) {
    // Может быть email или @username в Telegram
    return EMAIL_REGEX.test(value) || TELEGRAM_REGEX.test(value);
}

// Живая валидация при потере фокуса
if (form) {
    const contactInput = document.getElementById('contact_method');
    if (contactInput) {
        contactInput.addEventListener('blur', () => {
            const value = contactInput.value.trim();
            if (value && !validateContact(value)) {
                showError('contact_method', 'Введите email или @username в Telegram');
            } else {
                clearError('contact_method');
            }
        });
        contactInput.addEventListener('input', () => {
            clearError('contact_method');
        });
    }
}

// ============ 11. ОТПРАВКА В TELEGRAM ============
// ⚠️ ЗАМЕНИТЕ НА СВОИ ДАННЫЕ
const BOT_TOKEN = 'ВАШ_BOT_TOKEN';
const CHAT_ID = 'ВАШ_CHAT_ID';

if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Honeypot проверка: если бот заполнил скрытое поле — блокируем
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value) {
            console.warn('Обнаружен бот!');
            return;
        }
        
        // Валидация
        let isValid = true;
        const name = document.getElementById('name').value.trim();
        const contact = document.getElementById('contact_method').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Очищаем все ошибки
        ['name', 'contact_method', 'message'].forEach(clearError);
        
        if (!name || name.length < 2) {
            showError('name', 'Введите ваше имя (минимум 2 символа)');
            isValid = false;
        }
        
        if (!contact) {
            showError('contact_method', 'Укажите контакт для связи');
            isValid = false;
        } else if (!validateContact(contact)) {
            showError('contact_method', 'Введите email или @username в Telegram');
            isValid = false;
        }
        
        if (!message || message.length < 10) {
            showError('message', 'Опишите задачу подробнее (минимум 10 символов)');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Отправка
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        statusText.textContent = '';
        statusText.className = 'contact-form__status mono-text';

        const text = `
🔔 *Новая заявка с сайта!*

👤 *Имя:* ${name}
📱 *Контакт:* ${contact}
📝 *Задача:* ${message}
        `.trim();

        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: text,
                    parse_mode: 'Markdown'
                })
            });

            if (response.ok) {
                statusText.textContent = '✓ Заявка успешно отправлена! Я свяжусь с вами в ближайшее время.';
                statusText.classList.add('contact-form__status--success');
                form.reset();
            } else {
                throw new Error('Ошибка сети');
            }
        } catch (error) {
            statusText.textContent = '✕ Произошла ошибка. Пожалуйста, напишите мне напрямую в Telegram.';
            statusText.classList.add('contact-form__status--error');
            console.error('Telegram API Error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
        }
    });
}