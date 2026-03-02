/* ============================================
   PORTFOLIO JAVASCRIPT
   Fullstack Developer Portfolio
   ============================================ */

// ============================================
// THEME TOGGLE FUNCTIONALITY
// ============================================

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check localStorage for saved theme
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// ============================================
// MOBILE NAVIGATION (HAMBURGER MENU)
// ============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================

const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// SCROLL ANIMATION (INTERSECTION OBSERVER)
// ============================================

const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
    fadeObserver.observe(element);
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Efek navbar saat scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-navbar)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// DOWNLOAD CV BUTTON HANDLER
// ============================================

const downloadCvBtn = document.getElementById('downloadCvBtn');

downloadCvBtn.addEventListener('click', (e) => {
    // Cek apakah file CV tersedia
    fetch('cv.pdf')
        .then(response => {
            if (!response.ok) {
                e.preventDefault();
                showNotification('File CV belum tersedia. Silakan upload file cv.pdf ke folder yang sama dengan index.html', 'warning');
            } else {
                showNotification('CV sedang di-download...', 'success');
            }
        })
        .catch(() => {
            e.preventDefault();
            showNotification('File CV belum tersedia. Silakan upload file cv.pdf terlebih dahulu.', 'warning');
        });
});

// ============================================
// SKILL CARD CLICK HANDLER
// ============================================

function showSkillDetail(skillType) {
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    
    const skillNames = {
        'fullstack': 'Fullstack Development',
        'design': 'Desain Grafis',
        'photography': 'Photography'
    };
    
    showNotification(`Menampilkan project ${skillNames[skillType]}`);
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    // Hapus notifikasi yang sudah ada
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Pilih icon berdasarkan type
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'error') icon = 'fa-times-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    // Style untuk notifikasi
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        max-width: 400px;
        border: 1px solid rgba(255,255,255,0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove setelah 4 detik
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// CONTACT FORM VALIDATION
// ============================================

const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset previous errors
    clearErrors();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;

    // Validate name
    if (name.length < 3) {
        showError('name', 'Nama harus diisi minimal 3 karakter');
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email', 'Email tidak valid');
        isValid = false;
    }

    // Validate message
    if (message.length < 10) {
        showError('message', 'Pesan harus diisi minimal 10 karakter');
        isValid = false;
    }

    // If valid, show success message
    if (isValid) {
        successMessage.style.display = 'block';
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
});

function showError(fieldId, message) {
    const formGroup = document.getElementById(fieldId).closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    errorElement.textContent = message;
    formGroup.classList.add('error');
}

function clearErrors() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error');
    });
    successMessage.style.display = 'none';
}

// Remove error on input
const formInputs = document.querySelectorAll('.form-input');
formInputs.forEach(input => {
    input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('error');
    });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

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