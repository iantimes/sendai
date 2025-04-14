export function setupUIController(updatePreview) {
    const includeSignatureCheckbox = document.getElementById('md2email-include-signature');
    const signatureOptions = document.getElementById('md2email-signature-options');
    const signatureMessageSelect = document.getElementById('md2email-signature-message');
    const customSignatureInput = document.getElementById('md2email-custom-signature');
    
    // Add event listeners for width options
    document.querySelectorAll('input[name="md2email-width"]').forEach(radio => {
      radio.addEventListener('change', updatePreview);
    });
    
    // Add event listeners for signature options
    includeSignatureCheckbox.addEventListener('change', function() {
      signatureOptions.style.display = this.checked ? 'inline' : 'none';
      updatePreview();
    });
  
    signatureMessageSelect.addEventListener('change', function() {
      customSignatureInput.style.display = this.value === 'custom' ? 'inline-block' : 'none';
      updatePreview();
    });
  
    customSignatureInput.addEventListener('input', updatePreview);
  
    document.querySelectorAll('input[name="md2email-signature-position"]').forEach(radio => {
      radio.addEventListener('change', updatePreview);
    });
    
    // Load saved preferences from localStorage
    loadPreferences();
    
    // Save preferences when they change
    function savePreferences() {
      const preferences = {
        width: document.querySelector('input[name="md2email-width"]:checked').value,
        includeSignature: includeSignatureCheckbox.checked,
        signaturePosition: document.querySelector('input[name="md2email-signature-position"]:checked')?.value,
        signatureMessage: signatureMessageSelect.value,
        customMessage: customSignatureInput.value
      };
      
      localStorage.setItem('sendai-preferences', JSON.stringify(preferences));
    }
    
    function loadPreferences() {
      try {
        const savedPrefs = localStorage.getItem('sendai-preferences');
        if (savedPrefs) {
          const preferences = JSON.parse(savedPrefs);
          
          // Set width
          if (preferences.width) {
            const widthRadio = document.querySelector(`input[name="md2email-width"][value="${preferences.width}"]`);
            if (widthRadio) widthRadio.checked = true;
          }
          
          // Set signature options
          if (preferences.includeSignature !== undefined) {
            includeSignatureCheckbox.checked = preferences.includeSignature;
            signatureOptions.style.display = preferences.includeSignature ? 'inline' : 'none';
          }
          
          if (preferences.signaturePosition) {
            const positionRadio = document.querySelector(`input[name="md2email-signature-position"][value="${preferences.signaturePosition}"]`);
            if (positionRadio) positionRadio.checked = true;
          }
          
          if (preferences.signatureMessage) {
            signatureMessageSelect.value = preferences.signatureMessage;
          }
          
          if (preferences.customMessage) {
            customSignatureInput.value = preferences.customMessage;
          }
          
          customSignatureInput.style.display = 
            signatureMessageSelect.value === 'custom' ? 'inline-block' : 'none';
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
    
    // Add event listeners to save preferences when changes are made
    document.querySelectorAll('input[name="md2email-width"]').forEach(radio => {
      radio.addEventListener('change', savePreferences);
    });
    
    includeSignatureCheckbox.addEventListener('change', savePreferences);
    document.querySelectorAll('input[name="md2email-signature-position"]').forEach(radio => {
      radio.addEventListener('change', savePreferences);
    });
    signatureMessageSelect.addEventListener('change', savePreferences);
    customSignatureInput.addEventListener('input', savePreferences);
  }
  