'use strict';

const mobileNav = document.querySelector('nav');
const mobileNavBtn = document.querySelector('.btn-mobile-nav');

// Improved mobile navigation handling
const toggleMobileNav = () => {
  const isOpen = mobileNav.classList.contains('nav-open');
  mobileNav.classList.toggle('nav-open');
  mobileNavBtn.setAttribute('aria-expanded', !isOpen);
};

document.querySelector('.icon-mobile-nav[name="menu-outline"]').addEventListener('click', toggleMobileNav);
document.querySelector('.icon-mobile-nav[name="close-outline"]').addEventListener('click', toggleMobileNav);

// Improved smooth scrolling animation with performance optimization
const allLinks = document.querySelectorAll('a:link');
allLinks.forEach((link) => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Only prevent default for internal links
    if (href.startsWith('#') && href !== '#') {
      e.preventDefault();
      
      // Close mobile nav if open
      if (mobileNav.classList.contains('nav-open')) {
        toggleMobileNav();
      }

      // Handle scroll behavior
      const targetSection = document.querySelector(href);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Optimized sticky navigation using Intersection Observer
const sectionHeroEl = document.querySelector('.hero');
const obs = new IntersectionObserver(
  ([entry]) => {
    document.body.classList.toggle('sticky', !entry.isIntersecting);
  },
  {
    root: null,
    threshold: 0,
    rootMargin: '-80px'
  }
);

if (sectionHeroEl) {
  obs.observe(sectionHeroEl);
}

// Add page load performance optimization
document.addEventListener('DOMContentLoaded', () => {
  // Set minimum date for appointment date picker
  const dateInput = document.getElementById('preferred_date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
  
  // Lazy load images that aren't immediately visible
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) {
    lazyImages.forEach(img => {
      img.loading = 'lazy';
    });
  }
  
  // Track page views and user interactions
  trackUserInteractions();
});

// Enhanced tracking function
function trackUserInteractions() {
  // Track appointment form opens
  const appointmentButtons = document.querySelectorAll('[onclick*="openAppointmentModal"]');
  appointmentButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'appointment_form_open', {
          'event_category': 'engagement',
          'event_label': 'appointment_booking'
        });
      }
    });
  });
  
  // Track phone calls
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_call', {
          'event_category': 'engagement',
          'event_label': 'contact'
        });
      }
    });
  });
  
  // Track WhatsApp clicks
  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
  whatsappLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          'event_category': 'engagement',
          'event_label': 'contact'
        });
      }
    });
  });
  
  // Track email clicks
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'email_click', {
          'event_category': 'engagement',
          'event_label': 'contact'
        });
      }
    });
  });
  
  // Track service section views
  const serviceSection = document.querySelector('#service');
  if (serviceSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'service_section_view', {
              'event_category': 'engagement',
              'event_label': 'services'
            });
          }
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(serviceSection);
  }
  
  // Track map interactions
  const mapSection = document.querySelector('#map');
  if (mapSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'map_view', {
              'event_category': 'engagement',
              'event_label': 'location'
            });
          }
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(mapSection);
  }
  
  // Track emergency button clicks
  const emergencyButtons = document.querySelectorAll('.btn-emergency');
  emergencyButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'emergency_call', {
          'event_category': 'conversion',
          'event_label': 'emergency_contact'
        });
      }
    });
  });
  
  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      if (typeof gtag !== 'undefined') {
        gtag('event', 'scroll_depth', {
          'event_category': 'engagement',
          'event_label': `${scrollPercent}%`
        });
      }
    }
  });
  
  // Track time on page
  let startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'time_on_page', {
        'event_category': 'engagement',
        'event_label': `${timeSpent}s`
      });
    }
  });
}

// Enhanced form validation
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      isValid = false;
    } else {
      input.classList.remove('error');
    }
  });
  
  return isValid;
}

// Enhanced appointment submission
function submitAppointment(event) {
  event.preventDefault();
  
  const form = event.target;
  
  // Validate form
  if (!validateForm(form)) {
    showMessage('Please fill in all required fields.', 'error');
    return;
  }
  
  // Show loading state
  const submitBtn = form.querySelector('.submit-btn');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  // Track form submission
  if (typeof gtag !== 'undefined') {
    gtag('event', 'appointment_form_submit', {
      'event_category': 'conversion',
      'event_label': 'appointment_request'
    });
  }
  
  // Get form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  // Create email body
  const emailBody = `
New Appointment Request:

Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Service: ${data.service}
Preferred Date: ${data.preferred_date}
Preferred Time: ${data.preferred_time}
Additional Notes: ${data.message || 'None'}
  `.trim();
  
  // Simulate processing time
  setTimeout(() => {
    // Create mailto link with pre-filled details
    const mailtoLink = `mailto:mercywaymedicalcenter@gmail.com?subject=New Appointment Request&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showMessage('Thank you for your appointment request. Please complete the email to send your request. We will contact you shortly to confirm your appointment.', 'success');
    
    // Close modal
    closeAppointmentModal();
    
    // Reset form
    form.reset();
    
    // Remove loading state
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }, 1000);
}

// Show message function
function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `${type}-message`;
  messageDiv.textContent = message;
  messageDiv.style.display = 'block';
  
  const modal = document.getElementById('appointmentModal');
  const form = modal.querySelector('form');
  form.insertBefore(messageDiv, form.firstChild);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Appointment Modal Functions
function openAppointmentModal() {
  const modal = document.getElementById('appointmentModal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    
    // Close mobile nav if open
    if (mobileNav.classList.contains('nav-open')) {
      toggleMobileNav();
    }
    
    // Set minimum date to today
    const dateInput = document.getElementById('preferred_date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }
  }
}

function closeAppointmentModal() {
  const modal = document.getElementById('appointmentModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('appointmentModal');
  if (event.target == modal) {
    closeAppointmentModal();
  }
}