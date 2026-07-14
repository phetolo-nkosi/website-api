document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const contactCardContainer = document.getElementById('contact-card-container');
  const successPanel = document.getElementById('contact-success-panel');
  const submitBtn = document.getElementById('btn-submit-contact');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');
  const arrowIcon = submitBtn.querySelector('.arrow-icon');
  
  // 1. Query Parameter Pre-selection (e.g. ?service=digital)
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  if (serviceParam) {
    const serviceSelect = document.getElementById('contact-service');
    if (serviceSelect) {
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
  contactForm.addEventListener('submit', (e) => {
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

  // 4. Back button return routing
  const backBtn = document.getElementById('btn-success-back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // --- Meeting Scheduler Logic ---
  const bookingModal = document.getElementById('booking-modal');
  const btnOpenScheduler = document.getElementById('btn-open-scheduler');
  const btnCloseScheduler = document.getElementById('btn-close-scheduler');
  const btnCloseSchedulerEnd = document.getElementById('btn-close-scheduler-end');
  const schedulerBackdrop = document.getElementById('scheduler-backdrop');
  
  const schedulerForm = document.getElementById('scheduler-form');
  const calendarDaysGrid = document.getElementById('calendar-days-grid');
  const timeSlotsContainer = document.getElementById('time-slots-container');
  
  const summaryDateLbl = document.getElementById('summary-date-lbl');
  const summaryTimeLbl = document.getElementById('summary-time-lbl');
  
  const stepForm = document.getElementById('scheduler-step-form');
  const stepStatus = document.getElementById('scheduler-step-status');
  
  // Status panel fields
  const statusClientName = document.getElementById('status-client-name');
  const statusClientEmail = document.getElementById('status-client-email');
  const statusClientTopic = document.getElementById('status-client-topic');
  const statusMeetingDt = document.getElementById('status-meeting-dt');
  const statusBadgeVal = document.getElementById('status-badge-val');
  const teamsJoinBox = document.getElementById('teams-join-box');
  const teamsMeetingUrl = document.getElementById('teams-meeting-url');
  
  // Admin buttons
  const btnAdminApprove = document.getElementById('btn-admin-approve');
  const btnAdminReject = document.getElementById('btn-admin-reject');
  const btnCopyTeams = document.getElementById('btn-copy-teams');

  // Input fields
  const schedulerClientName = document.getElementById('scheduler-client-name');
  const schedulerClientEmail = document.getElementById('scheduler-client-email');
  const schedulerClientTopic = document.getElementById('scheduler-client-topic');
  
  // Errors
  const errorSlotSelection = document.getElementById('error-slot-selection');
  const errorSchedulerFields = document.getElementById('error-scheduler-fields');

  let selectedDay = null;
  let selectedTimeSlot = null;

  // Open scheduler modal
  if (btnOpenScheduler) {
    btnOpenScheduler.addEventListener('click', () => {
      resetSchedulerState();
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Disable background scroll
    });
  }

  // Close scheduler modal
  const closeModal = () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (btnCloseScheduler) btnCloseScheduler.addEventListener('click', closeModal);
  if (btnCloseSchedulerEnd) btnCloseSchedulerEnd.addEventListener('click', closeModal);
  if (schedulerBackdrop) schedulerBackdrop.addEventListener('click', closeModal);

  // Reset function to clear inputs, selections and step screen
  function resetSchedulerState() {
    selectedDay = null;
    selectedTimeSlot = null;
    if (summaryDateLbl) summaryDateLbl.textContent = 'Select date on calendar';
    if (summaryTimeLbl) summaryTimeLbl.textContent = 'Select time slot';
    
    // Clear inputs
    if (schedulerClientName) schedulerClientName.value = '';
    if (schedulerClientEmail) schedulerClientEmail.value = '';
    if (schedulerClientTopic) schedulerClientTopic.value = '';
    
    // Reset forms and statuses
    if (stepForm) stepForm.style.display = 'grid';
    if (stepStatus) stepStatus.style.display = 'none';
    if (teamsJoinBox) teamsJoinBox.style.display = 'none';
    
    if (errorSlotSelection) errorSlotSelection.style.display = 'none';
    if (errorSchedulerFields) errorSchedulerFields.style.display = 'none';
    
    // Reset day and slot elements class lists
    renderCalendar();
    resetTimeSlotPills();
  }

  // Render Calendar Days for June 2026
  function renderCalendar() {
    if (!calendarDaysGrid) return;
    calendarDaysGrid.innerHTML = '';

    // June 2026 starts on Monday. Sun is first column (empty spacer)
    const emptyCell = document.createElement('div');
    calendarDaysGrid.appendChild(emptyCell);

    // June has 30 days
    for (let d = 1; d <= 30; d++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.classList.add('calendar-day-btn');
      btn.textContent = d;

      // Disable past days (prior to June 15, 2026) and weekends
      const isPast = d < 15;
      const isWeekend = (d % 7 === 6 || d % 7 === 0);

      if (isPast || isWeekend) {
        btn.classList.add('disabled');
      } else {
        if (d === 15) {
          btn.classList.add('today');
        }
        btn.addEventListener('click', () => {
          // Deselect previous
          const currentSelected = calendarDaysGrid.querySelector('.calendar-day-btn.selected');
          if (currentSelected) {
            currentSelected.classList.remove('selected');
          }
          btn.classList.add('selected');
          selectedDay = d;
          if (summaryDateLbl) summaryDateLbl.textContent = `June ${d}, 2026`;
          if (errorSchedulerFields) errorSchedulerFields.style.display = 'none';
        });
      }
      calendarDaysGrid.appendChild(btn);
    }
  }

  // Reset Time Slot selections
  function resetTimeSlotPills() {
    if (!timeSlotsContainer) return;
    const pills = timeSlotsContainer.querySelectorAll('.slot-pill');
    pills.forEach(pill => {
      pill.classList.remove('selected');
    });
  }

  // Time Slot Pill selection
  if (timeSlotsContainer) {
    const pills = timeSlotsContainer.querySelectorAll('.slot-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        resetTimeSlotPills();
        pill.classList.add('selected');
        selectedTimeSlot = pill.getAttribute('data-time');
        if (summaryTimeLbl) summaryTimeLbl.textContent = selectedTimeSlot;
        if (errorSlotSelection) errorSlotSelection.style.display = 'none';
      });
    });
  }

  // Handle Scheduler Form submission
  if (schedulerForm) {
    schedulerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      if (errorSlotSelection) errorSlotSelection.style.display = 'none';
      if (errorSchedulerFields) errorSchedulerFields.style.display = 'none';

      // 1. Validate inputs
      const name = schedulerClientName ? schedulerClientName.value.trim() : '';
      const email = schedulerClientEmail ? schedulerClientEmail.value.trim() : '';
      const topic = schedulerClientTopic ? schedulerClientTopic.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !topic || !emailRegex.test(email)) {
        isValid = false;
        if (errorSchedulerFields) {
          errorSchedulerFields.textContent = 'All fields are required and email must be valid.';
          errorSchedulerFields.style.display = 'block';
        }
      }

      // 2. Validate calendar selection
      if (!selectedDay) {
        isValid = false;
        if (errorSchedulerFields) {
          errorSchedulerFields.textContent = 'Please select an available date on the calendar.';
          errorSchedulerFields.style.display = 'block';
        }
      }

      // 3. Validate slot selection
      if (!selectedTimeSlot) {
        isValid = false;
        if (errorSlotSelection) {
          errorSlotSelection.style.display = 'block';
        }
      }

      if (!isValid) return;

      // Submission animation
      const submitBtn = document.getElementById('btn-teams-schedule');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Scheduling...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Transition screen
        if (stepForm) stepForm.style.display = 'none';
        if (stepStatus) {
          stepStatus.style.display = 'block';
          
          // Populate status step fields
          if (statusClientName) statusClientName.textContent = name;
          if (statusClientEmail) statusClientEmail.textContent = email;
          if (statusClientTopic) statusClientTopic.textContent = topic;
          if (statusMeetingDt) statusMeetingDt.textContent = `June ${selectedDay}, 2026 at ${selectedTimeSlot}`;
          
          // Set to pending initially
          if (statusBadgeVal) {
            statusBadgeVal.textContent = 'Pending Approval';
            statusBadgeVal.className = 'status-badge status-pending';
          }
          if (teamsJoinBox) teamsJoinBox.style.display = 'none';
        }
      }, 1000);
    });
  }

  // Admin approval flow simulations
  if (btnAdminApprove) {
    btnAdminApprove.addEventListener('click', () => {
      if (statusBadgeVal) {
        statusBadgeVal.textContent = 'Approved';
        statusBadgeVal.className = 'status-badge status-approved';
      }
      
      // Generate a mock Microsoft Teams URL
      const mockId = Math.floor(100000000 + Math.random() * 900000000);
      const mockLink = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_NzM5YmViZDktM2M2YS00OTM2LWJjZDctYzkxM${mockId}%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%228e146a81-d0db-4654-8e34-58e1dc1f2518%22%7d`;
      
      if (teamsMeetingUrl) {
        teamsMeetingUrl.value = mockLink;
      }
      if (teamsJoinBox) {
        teamsJoinBox.style.display = 'block';
      }
    });
  }

  if (btnAdminReject) {
    btnAdminReject.addEventListener('click', () => {
      if (statusBadgeVal) {
        statusBadgeVal.textContent = 'Rejected / Rescheduled';
        statusBadgeVal.className = 'status-badge status-rejected';
      }
      if (teamsJoinBox) {
        teamsJoinBox.style.display = 'none';
      }
    });
  }

  // Copy teams link helper
  if (btnCopyTeams && teamsMeetingUrl) {
    btnCopyTeams.addEventListener('click', () => {
      teamsMeetingUrl.select();
      teamsMeetingUrl.setSelectionRange(0, 99999); // For mobile devices
      navigator.clipboard.writeText(teamsMeetingUrl.value).then(() => {
        const originalText = btnCopyTeams.textContent;
        btnCopyTeams.textContent = 'Copied!';
        setTimeout(() => {
          btnCopyTeams.textContent = originalText;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }
});
