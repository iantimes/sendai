// src/js/utility.js
export function showUIFeedback(message, type = "info") {
    let uiFeedbackContainer = document.querySelector(".ui-feedback-container");
  
    if (!uiFeedbackContainer) {
      uiFeedbackContainer = document.createElement("div");
      uiFeedbackContainer.classList.add("ui-feedback-container");
      document.body.appendChild(uiFeedbackContainer);
    }
  
    const uiFeedback = document.createElement("div");
    uiFeedback.classList.add("ui-feedback");
    uiFeedback.classList.add(type);
  
    const messageText = document.createElement("span");
    messageText.textContent = message;
    uiFeedback.appendChild(messageText);
    uiFeedback.style.cursor = "pointer";
  
    const removeFeedback = () => {
      uiFeedback.classList.remove("show");
      setTimeout(() => {
        if (uiFeedbackContainer.contains(uiFeedback)) {
          uiFeedbackContainer.removeChild(uiFeedback);
        }
      }, 300);
    };
  
    uiFeedback.addEventListener("click", removeFeedback);
    uiFeedbackContainer.appendChild(uiFeedback);
  
    const maxMessages = 5;
    if (uiFeedbackContainer.childElementCount > maxMessages) {
      uiFeedbackContainer.removeChild(uiFeedbackContainer.firstChild);
    }
  
    requestAnimationFrame(() => {
      uiFeedback.classList.add("show");
    });
  
    const timeout = setTimeout(() => {
      removeFeedback();
    }, 4000);
  
    uiFeedback.addEventListener("click", () => {
      clearTimeout(timeout);
    });
  }
  
  export function showStatus(message, type) {
    const statusElement = document.getElementById('md2email-status');
    statusElement.className = 'md2email-status';
    
    if (!message) {
      statusElement.style.display = 'none';
      return;
    }
    
    statusElement.textContent = message;
    
    if (type) {
      statusElement.classList.add(type);
    }
    
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);
  }
  