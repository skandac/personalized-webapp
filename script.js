// Apple-Inspired Portfolio JavaScript

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 52; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced navbar with Apple-style blur effect
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScrollY = window.scrollY;
    
    if (navbar) {
        // Add blur effect based on scroll
        if (currentScrollY > 10) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'saturate(180%) blur(20px)';
            navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            navbar.style.backdropFilter = 'saturate(180%) blur(20px)';
            navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.05)';
        }
        
        // Hide/show navbar on scroll (Apple-style)
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
    }
    
    lastScrollY = currentScrollY;
});

// Active navigation link highlighting with smooth transitions
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

// Throttled scroll handler for better performance
let ticking = false;
function onScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateActiveNavLink();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);

// Enhanced scroll animations with Apple-style easing
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(
        '.skill-category, .project-card, .about-text, .contact-info, .contact-form, .highlight-item, .ed-timeline-item'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Apple-style typing animation for hero
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Enhanced contact form with Apple-style validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Enhanced validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Real submission: prefer a POST to a configured endpoint (e.g., Formspree).
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        const endpoint = this.dataset.endpoint || ''; // set data-endpoint on the form if using Formspree

        if (endpoint) {
            // POST form data as JSON
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            }).then(res => {
                if (res.ok) {
                    showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    return res.text().then(text => Promise.reject(text || 'Submission failed'));
                }
            }).catch(err => {
                console.error('Form submission error:', err);
                showNotification('Submission failed. Opening your mail client as fallback.', 'error');
                openMailClient(name, email, subject, message);
            }).finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        } else {
            // No endpoint configured — fallback to mailto (opens user's mail client)
            openMailClient(name, email, subject, message);
            showNotification('Opening your mail client to send the message (fallback).', 'info');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.reset();
        }
    });
}

// Helper: open user's mail client with prefilled content
function openMailClient(name, email, subject, message) {
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const mailto = `mailto:${encodeURIComponent('skanda473@gmail.com')}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;
}

// Resume download button (in case you want to trigger via JS)
const resumeLink = document.getElementById('download-resume');
if (resumeLink) {
    resumeLink.addEventListener('click', (e) => {
        // allow default link behavior; this handler is here if you want analytics or confirmation later
    });
}

// Enhanced email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Apple-style notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Apple-style notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#30d158' : type === 'error' ? '#ff3b30' : '#007aff'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        max-width: 400px;
        backdrop-filter: saturate(180%) blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in with Apple-style easing
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 400);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 400);
        }
    }, 5000);
}

// Enhanced floating cards animation
document.addEventListener('DOMContentLoaded', () => {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add random delay and duration for more natural movement
        const delay = index * 0.5;
        const duration = 6 + (index * 0.5);
        
        card.style.animationDelay = `${delay}s`;
        card.style.animationDuration = `${duration}s`;
        
        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.animationPlayState = 'paused';
            card.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.animationPlayState = 'running';
            card.style.transform = 'scale(1)';
        });
    });
});

// Enhanced project card interactions
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add subtle tilt effect on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
});

// Enhanced skill items with Apple-style interactions
document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05) translateY(-2px)';
            item.style.boxShadow = '0 8px 25px rgba(0, 122, 255, 0.2)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1) translateY(0)';
            item.style.boxShadow = 'none';
        });
    });
});

// Apple-style loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Create Apple-style loader
    const loader = document.createElement('div');
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
        transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    loader.innerHTML = `
        <div style="
            width: 60px;
            height: 60px;
            border: 3px solid #f5f5f7;
            border-top: 3px solid #007aff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        "></div>
    `;
    
    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loader);
    
    // Remove loader after page is fully loaded
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            if (loader.parentNode) {
                loader.remove();
            }
        }, 600);
    }, 1200);
});

// Add CSS for enhanced interactions
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    .nav-link.active {
        color: #007aff;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    .loaded {
        animation: fadeIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .floating-card {
        cursor: pointer;
    }
    
    .skill-item,
    .project-card,
    .highlight-item {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    /* Enhanced button hover effects */
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }
    
    .btn:hover::before {
        left: 100%;
    }
    
    /* Smooth focus states */
    .form-group input:focus,
    .form-group textarea:focus {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    /* Enhanced social links */
    .social-link {
        position: relative;
        overflow: hidden;
    }
    
    .social-link::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        transform: translate(-50%, -50%);
    }
    
    .social-link:hover::before {
        width: 100%;
        height: 100%;
    }
`;
document.head.appendChild(enhancedStyles);

// Parallax effect for hero section (subtle Apple-style)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (hero && heroVisual) {
        const rate = scrolled * -0.3;
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
});

// Enhanced scroll performance with throttling
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
        // Parallax and other scroll effects here
    }, 10);
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    updateActiveNavLink();
    
    // Add smooth transitions to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .btn');
    interactiveElements.forEach(el => {
        el.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
});