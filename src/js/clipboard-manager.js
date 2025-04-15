import { showUIFeedback } from './utility.js';


export function setupClipboardManager() {
  const copyFormattedBtn = document.getElementById('md2email-copy-formatted');
  const copyHtmlBtn = document.getElementById('md2email-copy-html');
  const copyTextBtn = document.getElementById('md2email-copy-text');
  const previewElement = document.getElementById('md2email-preview');
  const hiddenTextarea = document.getElementById('md2email-textarea-html');
  const manualCopyInfo = document.getElementById('md2email-manual-copy-info');
  
  // Copy formatted content for Gmail
  copyFormattedBtn.addEventListener('click', () => {
    try {
      // Get the content to copy
      const contentToCopy = previewElement.innerHTML;
      
      // METHOD 1: Use the ClipboardItem API (modern browsers)
      if (navigator.clipboard && navigator.clipboard.write) {
        const htmlBlob = new Blob([contentToCopy], { type: 'text/html' });
        const textBlob = new Blob([previewElement.textContent], { type: 'text/plain' });
        
        navigator.clipboard.write([
          new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob
          })
        ]).then(() => {
          showUIFeedback('Content copied! Paste directly into Gmail composer.', 'success');
          manualCopyInfo.classList.remove('show');
        }).catch(err => {
          console.warn('Clipboard API write failed, trying alternative method', err);
          fallbackCopyMethod();
        });
      } else {
        fallbackCopyMethod();
      }
    } catch (error) {
      console.error('Copy error:', error);
      fallbackCopyMethod();
    }
    
    // Fallback method using execCommand
    function fallbackCopyMethod() {
      try {
        // Select the content in the preview
        const range = document.createRange();
        range.selectNodeContents(previewElement);
        
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Try to copy
        const successful = document.execCommand('copy');
        
        if (successful) {
          showUIFeedback('Content copied! Paste directly into Gmail composer.', 'success');
          manualCopyInfo.classList.remove('show');
        } else {
          showManualCopyInfo();
        }
        
        // Clear selection
        selection.removeAllRanges();
      } catch (err) {
        console.error('Fallback copy method failed', err);
        showManualCopyInfo();
      }
    }
    
    function showManualCopyInfo() {
      showUIFeedback('Automatic copy failed. Please try manual selection or HTML copy.', 'error');
      manualCopyInfo.classList.add('show');
    }
  });
  
  // Copy HTML button
  copyHtmlBtn.addEventListener('click', () => {
    try {
      const htmlContent = previewElement.innerHTML;
      hiddenTextarea.value = htmlContent;
      hiddenTextarea.select();
      
      const successful = document.execCommand('copy');
      
      if (successful) {
        showUIFeedback('HTML copied! Use Gmail\'s "Insert as HTML" option.', 'success');
      } else {
        showUIFeedback('Failed to copy HTML. Try again.', 'error');
      }
    } catch (error) {
      console.error('HTML copy error:', error);
      showUIFeedback('Error copying HTML.', 'error');
    }
  });
  
  // Copy plain text
  copyTextBtn.addEventListener('click', () => {
    try {
      const text = previewElement.textContent;
      hiddenTextarea.value = text;
      hiddenTextarea.select();
      
      const successful = document.execCommand('copy');
      
      if (successful) {
        showUIFeedback('Plain text copied!', 'success');
      } else {
        showUIFeedback('Failed to copy text. Try again.', 'error');
      }
    } catch (error) {
      console.error('Text copy error:', error);
      showUIFeedback('Error copying text.', 'error');
    }
  });
}
