export function initSignatureModule(updatePreview) {
  // DOM elements
  const includeSignatureCheckbox = document.getElementById('md2email-include-signature');
  const signatureButton = document.getElementById('md2email-include-signature-btn');
  const signatureOptions = document.getElementById('md2email-signature-options');
  const modal = document.getElementById('signature-modal');
  const closeBtn = document.querySelector('.signature-modal-close');
  const cancelBtn = document.getElementById('cancel-signature');
  const saveBtn = document.getElementById('save-signature');
  const tabButtons = document.querySelectorAll('.signature-tab-btn');
  const tabContents = document.querySelectorAll('.signature-tab-content');
  const initialsInput = document.getElementById('initials-input');
  const initialsPreview = document.getElementById('initials-preview');
  const signatureCanvas = document.getElementById('signature-canvas');
  const clearSignatureBtn = document.getElementById('clear-signature');
  
  // Variables to store signature data
  let signatureType = 'initials'; // Default to initials
  let signatureData = null;
  let isDrawing = false;
  let ctx = null;
  
  // Show signature button when "Include message" is checked
  includeSignatureCheckbox.addEventListener('change', function() {
    signatureButton.style.display = this.checked ? 'inline-block' : 'none';
    signatureOptions.style.display = this.checked ? 'inline' : 'none';
  });
  
  // Open the modal when signature button is clicked
  signatureButton.addEventListener('click', () => {
    modal.style.display = 'block';
    setupCanvas();
    
    // Pre-populate with any saved signature
    loadSavedSignature();
  });
  
  // Close modal functions
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Close modal if clicking outside the content
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Show corresponding tab content
      const tabName = button.dataset.tab;
      document.getElementById(`${tabName}-tab`).classList.add('active');
      
      // Set current signature type
      signatureType = tabName;
      
      // Setup canvas if switching to draw tab
      if (tabName === 'draw') {
        setupCanvas();
      }
    });
  });
  
  // Handle initials input
  initialsInput.addEventListener('input', () => {
    const initials = initialsInput.value.trim();
    if (initials) {
      initialsPreview.textContent = initials;
      initialsPreview.style.display = 'flex';
      signatureData = initials;
    } else {
      initialsPreview.style.display = 'none';
      signatureData = null;
    }
  });
  
  // Setup canvas for signature drawing
  function setupCanvas() {
    // Get the canvas context
    ctx = signatureCanvas.getContext('2d');
    
    // Set canvas size based on container with pixel ratio adjustment
    const container = signatureCanvas.parentElement;
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Set display size (css pixels)
    const width = container.offsetWidth;
    const height = 150;
    signatureCanvas.style.width = width + 'px';
    signatureCanvas.style.height = height + 'px';
    
    // Set actual size in memory (scaled for hi-DPI)
    signatureCanvas.width = width * pixelRatio;
    signatureCanvas.height = height * pixelRatio;
    
    // Scale context to match pixel ratio
    ctx.scale(pixelRatio, pixelRatio);
    
    // Clear canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    
    // Set drawing style
    ctx.lineWidth = 3; // Slightly thicker line for better visibility
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';
    ctx.imageSmoothingEnabled = true; // Enable anti-aliasing
    
    // Remove existing event listeners to prevent duplicates
    signatureCanvas.removeEventListener('pointerdown', startDrawing);
    signatureCanvas.removeEventListener('pointermove', draw);
    signatureCanvas.removeEventListener('pointerup', stopDrawing);
    signatureCanvas.removeEventListener('pointerout', stopDrawing);
    
    // Setup pointer events for drawing
    signatureCanvas.addEventListener('pointerdown', startDrawing);
    signatureCanvas.addEventListener('pointermove', draw);
    signatureCanvas.addEventListener('pointerup', stopDrawing);
    signatureCanvas.addEventListener('pointerout', stopDrawing);
    
    // Prevent touch scrolling when interacting with canvas
    signatureCanvas.style.touchAction = 'none';
  }
  
  // Drawing functions
  function startDrawing(e) {
    isDrawing = true;
    ctx.beginPath();
    const point = getPointFromEvent(e);
    ctx.moveTo(point.x, point.y);
    e.preventDefault();
  }
  
  function draw(e) {
    if (!isDrawing) return;
    
    const point = getPointFromEvent(e);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    e.preventDefault();
  }
  
  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      signatureData = signatureCanvas.toDataURL('image/png', 1.0); // Higher quality
    }
  }
  
  // Get point coordinates from pointer event
  function getPointFromEvent(e) {
    const rect = signatureCanvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
  
  // Clear canvas
  function clearCanvas() {
    const width = signatureCanvas.width / (window.devicePixelRatio || 1);
    const height = signatureCanvas.height / (window.devicePixelRatio || 1);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    signatureData = null;
  }
  
  clearSignatureBtn.addEventListener('click', clearCanvas);
  
  // Save signature and update verification message
  saveBtn.addEventListener('click', () => {
    if (!signatureData) {
      alert('Please provide initials or draw your signature first.');
      return;
    }
    
    // Save the signature
    saveSignature(signatureType, signatureData);
    
    // Close the modal
    modal.style.display = 'none';
    
    // Update the verification message with the signature
    updateVerificationMessage();
    
    // Update the preview
    if (typeof updatePreview === 'function') {
      updatePreview();
    }
  });
  
  // Update the verification message with signature
  function updateVerificationMessage() {
    // Store the signature data in a global variable or data attribute
    document.body.dataset.signatureType = signatureType;
    document.body.dataset.signatureData = signatureData;
  }
  
  // Save signature to localStorage
  function saveSignature(type, data) {
    try {
      localStorage.setItem('sendai-signature-type', type);
      localStorage.setItem('sendai-signature-data', data);
      
      // Show success message
      const event = new CustomEvent('ui-feedback', {
        detail: {
          message: 'Signature saved successfully!',
          type: 'success'
        }
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error('Error saving signature:', error);
      
      // Show error message
      const event = new CustomEvent('ui-feedback', {
        detail: {
          message: 'Failed to save signature. Browser storage may be full or disabled.',
          type: 'error'
        }
      });
      document.dispatchEvent(event);
    }
  }
  
  // Load saved signature from localStorage
  function loadSavedSignature() {
    try {
      const savedType = localStorage.getItem('sendai-signature-type');
      const savedData = localStorage.getItem('sendai-signature-data');
      
      if (savedType && savedData) {
        // Set the signature type tab
        const tabBtn = document.querySelector(`.signature-tab-btn[data-tab="${savedType}"]`);
        if (tabBtn) tabBtn.click();
        
        // Load the signature data
        signatureType = savedType;
        signatureData = savedData;
        
        if (savedType === 'initials') {
          initialsInput.value = savedData;
          initialsPreview.textContent = savedData;
          initialsPreview.style.display = 'flex';
        } else if (savedType === 'draw') {
          // Load image to canvas
          const img = new Image();
          img.onload = function() {
            if (!ctx) {
              setupCanvas(); // Ensure canvas is set up
            }
            const width = signatureCanvas.width / (window.devicePixelRatio || 1);
            const height = signatureCanvas.height / (window.devicePixelRatio || 1);
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
          };
          img.src = savedData;
        }
        
        // Update body dataset
        document.body.dataset.signatureType = signatureType;
        document.body.dataset.signatureData = signatureData;
      }
    } catch (error) {
      console.error('Error loading saved signature:', error);
    }
  }
  
  // Initialize by loading any saved signature
  loadSavedSignature();
  
  // If there's a saved signature, show the signature button if checkbox is checked
  if (localStorage.getItem('sendai-signature-data') && includeSignatureCheckbox.checked) {
    signatureButton.style.display = 'inline-block';
    signatureOptions.style.display = 'inline';
  }
  
  // Listen for UI feedback events
  document.addEventListener('ui-feedback', (e) => {
    if (typeof window.showUIFeedback === 'function') {
      window.showUIFeedback(e.detail.message, e.detail.type);
    }
  });
  
  // Expose necessary functions to the global scope
  window.signatureModule = {
    getSignature: function() {
      return {
        type: document.body.dataset.signatureType,
        data: document.body.dataset.signatureData
      };
    },
    hasSignature: function() {
      return !!document.body.dataset.signatureData;
    },
    clearSignature: function() {
      delete document.body.dataset.signatureType;
      delete document.body.dataset.signatureData;
      try {
        localStorage.removeItem('sendai-signature-type');
        localStorage.removeItem('sendai-signature-data');
        
        // Show success message
        const event = new CustomEvent('ui-feedback', {
          detail: {
            message: 'Signature cleared successfully!',
            type: 'info'
          }
        });
        document.dispatchEvent(event);
        
        return true;
      } catch (e) {
        console.error('Error clearing signature data:', e);
        return false;
      }
    }
  };
}
