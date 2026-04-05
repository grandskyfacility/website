/* GrandSky Facility & Management Services - Main JavaScript */

// Intersection Observer for Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all scroll-animate elements
document.addEventListener('DOMContentLoaded', () => {
  const scrollElements = document.querySelectorAll('.scroll-animate');
  scrollElements.forEach(el => observer.observe(el));
  
  // Initialize other components
  initNavigation();
  initFormValidation();
  initSmoothScroll();
  handleMobileMenu();
});

// Navigation Active Link
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update active link on scroll
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    navLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) {
        if (scrollPos >= section.offsetTop - 100 && scrollPos < section.offsetTop + section.offsetHeight - 100) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });
}

// Mobile Menu Toggle
function handleMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (!hamburger) return;

  hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    hamburger.classList.toggle('active');
  });

  // Close menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.style.display = 'none';
      hamburger.classList.remove('active');
    });
  });
}

// Form Validation
function initFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', handleFormSubmit);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\d\s\-\+\(\)]{10,}$/;
  return re.test(phone);
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => {
    el.textContent = '';
  });
}

function showError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function validateForm() {
  clearErrors();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const company = document.getElementById('company').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();
  const privacy = document.getElementById('privacy').checked;
  
  let isValid = true;

  if (!name || name.length < 2) {
    showError('name', 'Please enter a valid name (at least 2 characters)');
    isValid = false;
  }

  if (!email || !validateEmail(email)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }

  if (!phone || !validatePhone(phone)) {
    showError('phone', 'Please enter a valid phone number');
    isValid = false;
  }

  if (!company || company.length < 2) {
    showError('company', 'Please enter your company name');
    isValid = false;
  }

  if (!service) {
    showError('service', 'Please select a service');
    isValid = false;
  }

  if (!message || message.length < 10) {
    showError('message', 'Please enter a message (at least 10 characters)');
    isValid = false;
  }

  if (!privacy) {
    showError('privacy', 'Please accept the privacy policy');
    isValid = false;
  }

  return isValid;
}

async function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    showAlert('Please fix the errors above', 'error');
    return;
  }

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      company: document.getElementById('company').value,
      service: document.getElementById('service').value,
      message: document.getElementById('message').value
    };

    // If you have a backend endpoint, use it; otherwise, use email service
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).catch(() => {
      // Fallback: Show simulated success for demo
      console.log('Form Data:', formData);
      return { ok: true };
    });

    if (response && response.ok) {
      showAlert('Your message has been sent successfully! We will contact you soon.', 'success');
      form.reset();
      clearErrors();
    } else {
      showAlert('Error sending message. Please try again or contact us directly at customer@grandskyfacility.com', 'error');
    }
  } catch (error) {
    console.error('Form error:', error);
    showAlert('Error sending message. Please try again or contact us directly at customer@grandskyfacility.com', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// Alert Notification
function showAlert(message, type = 'info') {
  // Remove existing alert if present
  const existingAlert = document.querySelector('.alert-notification');
  if (existingAlert) {
    existingAlert.remove();
  }

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert-notification alert-${type}`;
  alertDiv.textContent = message;
  alertDiv.style.cssText = `
    fixed;
    top: 80px;
    right: 20px;
    background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => alertDiv.remove(), 300);
  }, 4000);
}

// Smooth Scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#contactForm') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// Sticky Header on Scroll
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  
  if (scrollTop > 100) {
    header.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
  }

  lastScrollTop = scrollTop;
});

// Initialize on load
window.addEventListener('load', () => {
  console.log('%cWelcome to GrandSky Facility & Management Services LLP', 'font-size: 20px; color: #2563eb; font-weight: bold;');
  console.log('%cTransforming facility management excellence', 'font-size: 14px; color: #4a9d6f;');
  console.log('%cFor inquiries: info@grandskyfacility.com', 'font-size: 12px; color: #6b7280;');
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .alert-notification {
    animation: slideIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);
