document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const contactCardContainer = document.getElementById('contact-card-container');
  const successPanel = document.getElementById('contact-success-panel');
  const submitBtn = document.getElementById('btn-submit-contact');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
  const arrowIcon = submitBtn ? submitBtn.querySelector('.arrow-icon') : null;
  
  // 1. Query Parameter Pre-selection (e.g. ?service=digital)
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  if (serviceParam) {
    const serviceSelect = document.getElementById('contact-service');
    if (serviceSelect && serviceSelect.options) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value === serviceParam.toLowerCase()) {
          serviceSelect.selectedIndex = i;
          // Trigger style adjustments if browser needs to update display
          serviceSelect.dispatchEvent(new Event('change'));
          break;
        }
      }
    }
  }

  // 2. Input Field Focus Effects & Error Reset
  const inputs = contactForm.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      resetError(input);
    });
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => {
        resetError(input);
      });
    }
  });

  function showError(input, errorId) {
    input.classList.add('input-error');
    const errMsg = document.getElementById(errorId);
    if (errMsg) {
      errMsg.style.display = 'block';
      setTimeout(() => {
        errMsg.style.opacity = '1';
        errMsg.style.transform = 'translateY(0)';
      }, 10);
    }
  }

  function resetError(input) {
    input.classList.remove('input-error');
    // Find sibling error message
    const parent = input.parentElement;
    const errMsg = parent.querySelector('.error-msg');
    if (errMsg) {
      errMsg.style.opacity = '0';
      errMsg.style.transform = 'translateY(-5px)';
      setTimeout(() => {
        errMsg.style.display = 'none';
      }, 200);
    }
  }

  // 3. Form Submission Validation and Simulation
  if(contactForm) { contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Validate Name
    const nameInput = document.getElementById('contact-name');
    if (!nameInput.value.trim()) {
      showError(nameInput, 'error-name');
      isValid = false;
    }

    // Validate Email
    const emailInput = document.getElementById('contact-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'error-email');
      isValid = false;
    }

    // Validate Service
    const serviceSelect = document.getElementById('contact-service');
    if (!serviceSelect.value) {
      showError(serviceSelect, 'error-service');
      isValid = false;
    }

    // Validate Message
    const messageInput = document.getElementById('contact-message');
    if (!messageInput.value.trim()) {
      showError(messageInput, 'error-message');
      isValid = false;
    }

    if (!isValid) {
      // Shake form container for visual alert on errors
      contactCardContainer.classList.add('shake-anim');
      setTimeout(() => {
        contactCardContainer.classList.remove('shake-anim');
      }, 500);
      return;
    }

    // Pass: Animate submission loader HUD state
    submitBtn.disabled = true;
    btnText.style.opacity = '0.3';
    arrowIcon.style.display = 'none';
    btnSpinner.style.display = 'inline-block';
    
    setTimeout(() => {
      // Generate reference number
      const randomRef = 'EA-' + Math.floor(1000 + Math.random() * 9000) + '-' + String.fromCharCode(65 + Math.floor(Math.random() * 26));
      document.getElementById('ref-num').textContent = randomRef;
      document.getElementById('success-email-display').textContent = emailInput.value.trim();

      // Trigger beautiful slide transition to success screen
      contactForm.style.opacity = '0';
      contactForm.style.transform = 'translateY(15px)';
      
      setTimeout(() => {
        contactForm.style.display = 'none';
        successPanel.style.display = 'block';
        setTimeout(() => {
          successPanel.style.opacity = '1';
          successPanel.style.transform = 'translateY(0)';
          
          // Trigger checkmark animation
          const circle = successPanel.querySelector('.checkmark-circle');
          const check = successPanel.querySelector('.checkmark-check');
          if (circle && check) {
            circle.style.animation = 'stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards';
            check.style.animation = 'stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards';
          }
        }, 50);
      }, 300);

    }, 1500); // 1.5s simulated connection delay
  });

  } // 4. Back button return routing
  const backBtn = document.getElementById('btn-success-back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

});
