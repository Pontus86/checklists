// modals.js
/**
 *@module Modals
 */

 class Modals {
    INACTIVITY_WARNING_MINUTES = 3;
    INACTIVITY_FINAL_MINUTES = 10;
    inactivityTimeout = null;
    lastWarningShown = null;
  
    createModalContainer() {
      const modal = document.createElement('div');
      modal.classList.add('modal');
  
      const modalContent = document.createElement('div');
      modalContent.classList.add('modal-content');
      modal.appendChild(modalContent);
  
      document.body.appendChild(modal);
      return { modal, modalContent };
    }
  
    createCloseButton(modal, modalContent) {
      const closeBtn = document.createElement('span');
      closeBtn.classList.add('close');
      closeBtn.innerHTML = '&times;';
      modalContent.appendChild(closeBtn);
  
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
  
    createInputLabelPair(labelText, id, required = false) {
      const label = document.createElement('label');
      label.setAttribute('for', id);
      label.textContent = labelText;
  
      const input = document.createElement('input');
      input.type = 'text';
      input.id = id;
      input.name = id;
      input.required = required;
  
      return { label, input };
    }
  
    createLevelSelector() {
      const label = document.createElement('label');
      label.setAttribute('for', 'level');
      label.textContent = 'Läkare Nivå:';
  
      const select = document.createElement('select');
      select.id = 'level';
      select.name = 'level';
  
      ['junior', 'st', 'specialist'].forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        select.appendChild(option);
      });
  
      return { label, select };
    }
  
    showLoginModal(session) {
      const { modal, modalContent } = this.createModalContainer();
      this.createCloseButton(modal, modalContent);
  
      const form = document.createElement('form');
      form.id = 'loginForm';
  
      const heading = document.createElement('h2');
      heading.textContent = 'Logga in för forskningsprojektet';
      form.appendChild(heading);
  
      //const rsid = this.createInputLabelPair('RSID:', 'rsid', true);
      //form.appendChild(rsid.label);
      //form.appendChild(rsid.input);
  
      const patient = this.createInputLabelPair('PatientID:', 'patientID', true);
      form.appendChild(patient.label);
      form.appendChild(patient.input);
  
      //const level = this.createLevelSelector();
      //form.appendChild(level.label);
      //form.appendChild(level.select);
  
      const errorDiv = document.createElement('div');
      errorDiv.style.color = 'red';
      form.appendChild(errorDiv);
  
      const submit = document.createElement('input');
      submit.type = 'submit';
      submit.value = 'Logga in';
      form.appendChild(submit);
  
      form.addEventListener('submit', (event) => {
        event.preventDefault();
          //session.userRSID = rsid.input.value.trim();
          //session.physicianLevel = level.select.value;
          session.patientID = patient.input.value.trim();
          document.getElementById('inputUser').textContent = session.patientID;
            
          modal.style.display = 'none';

        
      });
  
      modalContent.appendChild(form);
      modal.style.display = 'block';
    }
  
    showTimeoutModal(session, timePassedMinutes) {
      const { modal, modalContent } = this.createModalContainer();
      modal.classList.add('timeout-modal');
      this.createCloseButton(modal, modalContent);
  
      const form = document.createElement('form');
      const heading = document.createElement('h2');
      heading.textContent = `Inaktivitet i ${timePassedMinutes} minuter`;
      form.appendChild(heading);
  
      const question = document.createElement('p');
      question.textContent = 'Är det samma patient?';
      form.appendChild(question);
  
      const sameBtn = document.createElement('button');
      sameBtn.type = 'button';
      sameBtn.textContent = 'Ja';
  
      const newBtn = document.createElement('button');
      newBtn.type = 'button';
      newBtn.textContent = 'Nej, ny patient';
  
      form.appendChild(sameBtn);
      form.appendChild(newBtn);
  
      sameBtn.addEventListener('click', () => {
        if (timePassedMinutes >= this.INACTIVITY_FINAL_MINUTES) {
                const pid = prompt('Skriv in patientens personnummer (det döljs vid sparning):');
                if (pid == session.patientID) {
                    //modal.style.display = 'none';
                    document.querySelectorAll('.timeout-modal').forEach(modal => {
                      modal.style.display = 'none';
                    });
                    this.showTemporaryMessage("Du är fortfarande inloggad och kan fortsätta arbeta.", "info");
                    //break;
                }
                else {
                    this.showTemporaryMessage("Du har skrivit in fel personnummer eller inte skrivit in något.", "error");
                    
                }
            
        } 
        else {
          modal.style.display = 'none';
          
          this.showTemporaryMessage("Du är fortfarande inloggad och kan fortsätta arbeta.", "info");
        }
      });
  
      newBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        window.location.reload();
      });
  
      modalContent.appendChild(form);
      modal.style.display = 'block';
    }
  
    async showLogoutModal(session, onSubmit) {
      const { modal, modalContent } = this.createModalContainer();
      this.createCloseButton(modal, modalContent);
    
      const form = document.createElement('form');
      const heading = document.createElement('h2');
      heading.textContent = 'Fyll i innan utloggning';
      form.appendChild(heading);
    
      // Doctor competence section
      const experience = this.createInputLabelPair('Högsta läkarkompetens:', 'experience');
      const experienceSelect = document.createElement('select');
      ['-', 'Specialist akut', 'Specialist annat', 'ST akut', 'ST annat'].forEach(text => {
      const option = document.createElement('option');
      option.value = text;
      option.textContent = text;
      experienceSelect.appendChild(option);
      });
      form.appendChild(experience.label);
      form.appendChild(experienceSelect);
    
      // Checklist usage section
      const usedChecklistLabel = document.createElement('label');
      usedChecklistLabel.textContent = 'Användes checklista?';
      const usedChecklist = document.createElement('select');
      ['-','Ja', 'Nej'].forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val;
      usedChecklist.appendChild(opt);
      });
      form.appendChild(usedChecklistLabel);
      form.appendChild(usedChecklist);
    
      // Dynamic elements for checklist usage
      const doConfirmLabel = document.createElement('label');
      doConfirmLabel.textContent = 'Användes checklista som do/confirm?';
      const doConfirm = document.createElement('select');
      ['-', 'Ja', 'Nej'].forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val;
      doConfirm.appendChild(opt);
      });
    
      const valueLabel = document.createElement('label');
      valueLabel.textContent = 'Hur värdefull var checklistan? (1 ej värdefull, 6 mycket värdefull):';
      const valueInput = document.createElement('input');
      valueInput.type = 'number';
      valueInput.min = 1;
      valueInput.max = 6;
      valueInput.required = true;
    
      const whyLabel = document.createElement('label');
      whyLabel.id = 'whyLabel';
      whyLabel.textContent = 'Varför användes checklistan inte?';
      const whyInput = document.createElement('select');
      ['-', 'Brist på tid', 'Läkare ville inte', 'Ej relevant för fallet', 'Annat'].forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val;
      whyInput.appendChild(opt);
      });
      whyInput.id = 'whyInput';
      whyInput.required = true;
    
      usedChecklist.addEventListener('change', () => {
      if (usedChecklist.value === 'Ja') {
        if (!form.contains(doConfirmLabel)) form.appendChild(doConfirmLabel);
        if (!form.contains(doConfirm)) form.appendChild(doConfirm);
        if (!form.contains(valueLabel)) form.appendChild(valueLabel);
        if (!form.contains(valueInput)) form.appendChild(valueInput);
        if (form.contains(whyLabel)) whyLabel.remove();
        if (form.contains(whyInput)) whyInput.remove();
        feedbackBtn.remove();
        submitBtn.remove();
        form.appendChild(feedbackBtn);
        form.appendChild(submitBtn);
      } else {
        if (!form.contains(whyLabel)) form.appendChild(whyLabel);
        if (!form.contains(whyInput)) form.appendChild(whyInput);
        if (form.contains(doConfirmLabel)) doConfirmLabel.remove();
        if (form.contains(doConfirm)) doConfirm.remove();
        if (form.contains(valueLabel)) valueLabel.remove();
        if (form.contains(valueInput)) valueInput.remove();
        feedbackBtn.remove();
        submitBtn.remove();
        form.appendChild(feedbackBtn);
        form.appendChild(submitBtn);
      }
      });
    
      // Feedback button
      const feedbackBtn = document.createElement('button');
      feedbackBtn.type = 'button';
      feedbackBtn.textContent = 'Klicka här om du vill diskutera med projektansvarig';
      

      feedbackBtn.addEventListener('click', () => {
      //alert(`Skicka feedback från ${session.setUserRSID}`);
        this.showDiscussModal(session);
      });
    
      // Logout button
      const submitBtn = document.createElement('input');
      submitBtn.type = 'submit';
      submitBtn.value = 'Logga ut';
    
      form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = {
        experience: experienceSelect.value,
        usedChecklist: usedChecklist.value,
        doConfirm: doConfirm.value,
        valueScore: valueInput.value,
      };
    
      session.checklistUse = usedChecklist.value === 'Ja';
      if (usedChecklist.value === 'Nej') {
        session.no_use = whyInput.value;
      }
      session.do_confirm = doConfirm.value;
      session.likert_scale = valueInput.value;
      session.physicianLevel = experienceSelect.value;
      console.log("Experience level to be sent to session:", experienceSelect.value);
      console.log("Session data before logout:", session);
      console.log();
      session.addEvent("logout");
    
      if (onSubmit) onSubmit(data);
      let attempts = 0;
      let response;
      try {
        while (attempts < 3) {
          response = await session.saveChoices();
          if (response && response.url && response.url.includes("upload")) {
            console.log("Data successfully saved after " + (attempts + 1) + " attempts.");
            break;
          }
          attempts++;
        }
        this.showTemporaryMessage("Data sparad!", "info");
        if (!response || !response.url || !response.url.includes("upload") || attempts >= 3) {
          throw new Error("Fel vid sparning!");
        }
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } catch (err) {
        this.showTemporaryMessage("Fel vid sparning!", "info");
        console.log("Error during save:", response ? response : "No response");
        console.log("Attempts made:", attempts);
        
        // Optionally: don't reload, or offer retry
      }
      setTimeout(() => {
        modal.style.display = 'none';
        }, 2000);
      
    });
    
    modalContent.appendChild(form);
    //form.appendChild(feedbackBtn);
    //form.appendChild(submitBtn);
    modal.style.display = 'block';
      addModalCloseOptions(modal);

      
    }

    showDiscussModal(session) {
      const { modal: discussmodal, modalContent: discussmodalContent } = this.createModalContainer();
      const RSID = this.createInputLabelPair('RSID:', 'userRSID', true);
      session.discuss = 'Ja';
    
      const discussform = document.createElement('form');
      
      discussform.appendChild(RSID.label);
      discussform.appendChild(RSID.input);

      const submitBtn = document.createElement('input');
      submitBtn.type = 'submit';
      submitBtn.value = 'Skicka';
      discussform.appendChild(submitBtn);

      discussmodalContent.appendChild(discussform);
      discussmodal.style.display = 'block';
  
      discussform.addEventListener('submit', (event) => {
        event.preventDefault();
        session.userRSID = RSID.input.value.trim();
        discussmodal.style.display = 'none';
        this.showTemporaryMessage("Vi kontaktar dig!", "info");
      });
    }
  
    resetInactivityTimer(session) {
      if (this.inactivityTimeout) clearTimeout(this.inactivityTimeout);
  
      this.inactivityTimeout = setTimeout(() => {
        const now = Date.now();
        const minutesSinceLast = this.lastWarningShown ? (now - this.lastWarningShown) / 60000 : Infinity;
  
        if (minutesSinceLast >= this.INACTIVITY_WARNING_MINUTES) {
          this.lastWarningShown = now;
          this.showTimeoutModal(session, this.INACTIVITY_WARNING_MINUTES);
        }
  
        setTimeout(() => {
          const laterNow = Date.now();
          const minutesSinceWarning = (laterNow - this.lastWarningShown) / 60000;
          if (minutesSinceWarning >= (this.INACTIVITY_FINAL_MINUTES - this.INACTIVITY_WARNING_MINUTES)) {
            this.showTimeoutModal(session, this.INACTIVITY_FINAL_MINUTES);
          }
        }, (this.INACTIVITY_FINAL_MINUTES - this.INACTIVITY_WARNING_MINUTES) * 60000);
  
      }, this.INACTIVITY_WARNING_MINUTES * 60000);
    }
  
    validateInput(value) {
      return value.length >= 3; // Anpassa efter RSID-regel
    }


    showTemporaryMessage(message, type = 'info', duration = 3000) {
        const container = document.getElementById('alert-container');
        if (!container) return;
      
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.role = 'alert';
        alert.innerText = message;
      
        container.appendChild(alert);
      
        setTimeout(() => {
          alert.remove();
        }, duration);
    }

    showCheckboxExplainerModal(){
      const { modal, modalContent } = this.createModalContainer();
      this.createCloseButton(modal, modalContent);
        
      const form = document.createElement('form');
      form.id = 'checkboxExplainerForm';

      const explanation = document.createElement('p');
      const greenText = "Utfört innan checklistan öppnats.";
      const yellowText = "Utfört tack vare checklistan.";
      const redText = "Inte indicerat.";

      explanation.innerHTML = '<span style=" background-color: #89bd9e; color: white; padding: 2px 5px; border-radius: 3px;">Grön checkbox:</span> ' + greenText + '<br>' +
        '<span style="background-color: #f3d250; color: white; padding: 2px 5px; border-radius: 3px;">Gul checkbox:</span> ' + yellowText + '<br>' +
        '<span style="background-color: #ea907a; color: white; padding: 2px 5px; border-radius: 3px;">Röd checkbox:</span> ' + redText;
      explanation.style.textAlign = 'left';
        form.appendChild(explanation);

      const submit = document.createElement('input');
      submit.type = 'submit';
      submit.value = 'Stäng';
      form.appendChild(submit);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        modal.style.display = 'none';
      });

      modalContent.appendChild(form);
      modal.style.display = 'block';
      
    }

  }

  addModalCloseOptions = (modal) => {
    // Close modal on click outside
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
      modal.style.display = 'none';
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
      modal.style.display = 'none';
      }
    });

    
  };

  

  
  
  
  module.exports = Modals;
  