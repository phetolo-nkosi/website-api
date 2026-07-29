const fs = require('fs');
let content = fs.readFileSync('js/contact.js', 'utf-8');
const index = content.indexOf('// 2. Input Field Focus Effects');
if (index !== -1) {
  const newHeader = \document.addEventListener('DOMContentLoaded', () => {
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
    if (serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value === serviceParam.toLowerCase()) {
          serviceSelect.selectedIndex = i;
          serviceSelect.dispatchEvent(new Event('change'));
          break;
        }
      }
    }
  }

  \;
  content = newHeader + content.substring(index);
  
  // Also wrap section 3 with if(submitBtn)
  content = content.replace(\contactForm.addEventListener('submit', (e) => {\, \if(contactForm && submitBtn) { contactForm.addEventListener('submit', (e) => {\);
  content = content.replace(\// 4. Back button return routing\, \}\\n  // 4. Back button return routing\);

  fs.writeFileSync('js/contact.js', content, 'utf-8');
  console.log('Fixed contact.js');
}

