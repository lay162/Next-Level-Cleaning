// ============================================
// Mobile Menu Toggle
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// ============================================
// Navbar Scroll Effect
// ============================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Form Handling - Netlify Forms
// ============================================
const quoteForm = document.getElementById('quote-form');

if (quoteForm) {
    quoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(quoteForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Validate form
        if (!validateForm(formObject)) {
            return;
        }

        // Show loading state
        const submitButton = quoteForm.querySelector('.btn-submit');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            // Submit to Netlify Forms
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                // Show success message
                showFormMessage('Thank you for your quote request! We\'ll be in contact with you soon with your quotation. A confirmation email has been sent to your email address.', 'success');
                
                // Reset form
                quoteForm.reset();
                
                // Scroll to success message
                setTimeout(() => {
                    const messageEl = document.querySelector('.form-message-success');
                    if (messageEl) {
                        messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showFormMessage('Sorry, there was an error submitting your request. Please try again or contact us directly at quotes@nextlevelcleaning.co.uk', 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// ============================================
// Form Validation
// ============================================
function validateForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'location', 'service-type'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            isValid = false;
            if (input) {
                input.classList.add('error');
                input.setAttribute('aria-invalid', 'true');
                
                // Remove error class after user starts typing
                input.addEventListener('input', function() {
                    this.classList.remove('error');
                    this.removeAttribute('aria-invalid');
                }, { once: true });
            }
        }
    });
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        isValid = false;
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.classList.add('error');
            emailInput.setAttribute('aria-invalid', 'true');
            showFormMessage('Please enter a valid email address.', 'error');
        }
    }
    
    // Check consent checkbox
    const consentCheckbox = quoteForm.querySelector('input[name="consent"]');
    if (!consentCheckbox || !consentCheckbox.checked) {
        isValid = false;
        showFormMessage('Please confirm that you consent to being contacted.', 'error');
    }
    
    if (!isValid) {
        showFormMessage('Please fill in all required fields.', 'error');
    }
    
    return isValid;
}

// ============================================
// Format Email Body
// ============================================
function formatEmailBody(data) {
    let body = 'New Quote Request\n';
    body += '==================\n\n';
    body += `Name: ${data.name || 'Not provided'}\n`;
    body += `Email: ${data.email || 'Not provided'}\n`;
    body += `Phone: ${data.phone || 'Not provided'}\n`;
    body += `Location: ${data.location || 'Not provided'}\n`;
    body += `Service Type: ${data['service-type'] || 'Not provided'}\n`;
    body += `Property Type: ${data['property-type'] || 'Not provided'}\n`;
    body += `Frequency: ${data.frequency || 'Not provided'}\n`;
    body += `\nAdditional Details:\n${data.message || 'None provided'}\n`;
    body += `\nSubmitted: ${new Date().toLocaleString()}\n`;
    return body;
}

// ============================================
// Form Message Display
// ============================================
function showFormMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    messageEl.setAttribute('role', 'alert');
    messageEl.setAttribute('aria-live', 'polite');
    
    // Insert before submit button
    const submitButton = quoteForm.querySelector('.btn-submit');
    if (submitButton) {
        quoteForm.insertBefore(messageEl, submitButton);
    } else {
        quoteForm.appendChild(messageEl);
    }
    
    // Auto-remove after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

// ============================================
// Update Current Year in Footer
// ============================================
const currentYearElement = document.getElementById('current-year');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// ============================================
// Intersection Observer for Animations
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe service cards, review cards, and other elements
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.service-card, .review-card, .area-group, .about-text');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});

// ============================================
// Lazy Loading Images (if images are added later)
// ============================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ============================================
// Form Input Enhancements
// ============================================
// Add real-time validation feedback
const formInputs = document.querySelectorAll('#quote-form input, #quote-form select, #quote-form textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.classList.add('error');
            this.setAttribute('aria-invalid', 'true');
        } else {
            this.classList.remove('error');
            this.removeAttribute('aria-invalid');
        }
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('error') && this.value.trim()) {
            this.classList.remove('error');
            this.removeAttribute('aria-invalid');
        }
    });
});

// ============================================
// Accessibility: Skip Link
// ============================================
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstChild);

// Add main content landmark if not present
if (!document.querySelector('main')) {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.setAttribute('id', 'main-content');
        heroSection.setAttribute('tabindex', '-1');
    }
}

// ============================================
// Performance: Debounce Scroll Events
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handler
const debouncedScrollHandler = debounce(function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// ============================================
// Error Handling
// ============================================
window.addEventListener('error', function(e) {
    console.error('Error:', e.error);
    // In production, you might want to log errors to a service
});

// ============================================
// Cookie Consent Banner
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent && cookieBanner) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 500);
    }
    
    // Accept cookies
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            hideCookieBanner();
        });
    }
    
    // Decline cookies
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            hideCookieBanner();
        });
    }
    
    function hideCookieBanner() {
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 300);
        }
    }
});

// ============================================
// Console Welcome Message (for development)
// ============================================
console.log('%cNext Level Cleaning Ltd', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cProfessional Commercial Cleaning Services', 'color: #6b7280; font-size: 14px;');

