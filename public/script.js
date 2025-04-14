document.addEventListener('DOMContentLoaded', () => {
  const markdownInput = document.getElementById('md2email-markdown-input');
  const previewElement = document.getElementById('md2email-preview');
  const copyFormattedBtn = document.getElementById('md2email-copy-formatted');
  const copyHtmlBtn = document.getElementById('md2email-copy-html');
  const copyTextBtn = document.getElementById('md2email-copy-text');
  const statusElement = document.getElementById('md2email-status');
  const manualCopyInfo = document.getElementById('md2email-manual-copy-info');
  const hiddenTextarea = document.getElementById('md2email-textarea-html');
  const includeSignatureCheckbox = document.getElementById('md2email-include-signature');
  const signatureOptions = document.getElementById('md2email-signature-options');
  const signatureMessageSelect = document.getElementById('md2email-signature-message');
  const customSignatureInput = document.getElementById('md2email-custom-signature');
  
  // Configure marked.js
  marked.use({
    breaks: true,
    gfm: true,
    headerIds: false 
  });
  
  // Initial examples to help users
  const exampleMarkdown = `# LLM Response on Project Planning

Thank you for your question about project planning. Here's a comprehensive framework to help you get started:

## 1. Project Definition Phase

Before diving into execution, ensure you have:

- **Clear objectives**: Define what success looks like
- **Scope boundaries**: Determine what's in and out of scope
- **Key stakeholders**: Identify who needs to be involved

## 2. Planning Approach

The most effective planning typically follows this structure:

\`\`\`
1. Break down large goals into manageable tasks
2. Estimate time and resources required
3. Identify dependencies between tasks
4. Build in buffer time for unexpected issues
\`\`\`

> "Plans are worthless, but planning is everything." - Dwight D. Eisenhower

### Risk Management

Always account for potential risks:

| Risk Category | Example | Mitigation Strategy |
|---------------|---------|---------------------|
| Technical | System failure | Redundancy plans |
| Resource | Team member unavailable | Cross-training |
| External | Regulatory changes | Regular compliance checks |

I hope this helps with your project planning! Let me know if you need any clarification or have additional questions.`;

  markdownInput.value = exampleMarkdown;
  
  // Initial render
  updatePreview();
  
  // Live preview
  markdownInput.addEventListener('input', updatePreview);
  
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
  
  function updatePreview() {
    const markdown = markdownInput.value;
    try {
      const html = marked.parse(markdown);
      
      // Create the Gmail-friendly HTML
      const emailHtml = createGmailFriendlyEmail(html);
      
      // Update the preview
      previewElement.innerHTML = emailHtml;
      
      showStatus('', '');
    } catch (error) {
      console.error(error);
      showUIFeedback('Error rendering markdown', 'error');
    }
  }
  
  // Get the selected width
  function getSelectedWidth() {
    const selectedOption = document.querySelector('input[name="md2email-width"]:checked');
    if (!selectedOption) return '600px'; // Default to medium if none selected
    
    switch(selectedOption.value) {
      case 'small': return '450px';
      case 'medium': return '600px';
      case 'large': return '800px';
      default: return '600px';
    }
  }
  
  
  // Copy formatted content for Gmail - New implementation
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
  
  function createGmailFriendlyEmail(contentHtml) {
    // Process the content HTML with inline styles
    const processedContent = processContentForEmail(contentHtml);
    
    // Get the selected width
    const maxWidth = getSelectedWidth();
    
    // Check if signature should be included
    const includeSignature = includeSignatureCheckbox.checked;
    let signatureHtml = '';
    
    if (includeSignature) {
      // Get signature position
      const signaturePosition = document.querySelector('input[name="md2email-signature-position"]:checked').value;
      
      // Get signature message
      let signatureMessage = '';
      const selectedMessageType = signatureMessageSelect.value;
      
      if (selectedMessageType === 'custom') {
        signatureMessage = customSignatureInput.value.trim() || 'I\'ve verified this AI response';
      } else {
        const selectedOption = signatureMessageSelect.options[signatureMessageSelect.selectedIndex];
        signatureMessage = selectedOption.text;
      }
      
      // Create signature HTML

// Create signature HTML - Completely redesigned to stand out more
signatureHtml = `
  <div style="padding: 14px 18px; margin: ${signaturePosition === 'top' ? '0 0 28px 0' : '28px 0 0 0'}; 
              background: linear-gradient(to right, #e6f7ed, #f2f9f5); 
              border-left: 5px solid #34a853; 
              color: #0b5a2b; font-size: 15px; border-radius: 0 8px 8px 0;
              box-shadow: 0 3px 10px rgba(52, 168, 83, 0.15); 
              font-family: Arial, sans-serif;
              letter-spacing: 0.3px; line-height: 1.5;
              position: relative; overflow: hidden;">
    <div style="display: flex; align-items: center;">
      <span style="background-color: #34a853; color: white; border-radius: 50%; 
                 width: 22px; height: 22px; display: inline-flex; justify-content: center; 
                 align-items: center; margin-right: 10px; font-weight: bold; font-size: 14px;">✓</span>
      <span style="font-weight: 600;">${signatureMessage}</span>
    </div>
  </div>
`;


    }
    
    // Create a table-based layout that Gmail will preserve
    // This uses a structure Gmail is less likely to strip out
    return `
      <table cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: ${maxWidth}; border-collapse: collapse; background-color: #f9fafc; border-radius: 8px; border: 1px solid #e1e4e8; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; margin: 0 auto;">
        <tr>
          <td style="height: 6px; background-color: #4285f4; border-radius: 8px 8px 0 0;"></td>
        </tr>
        <tr>
          <td style="padding: 20px 25px;">
            ${includeSignature && document.querySelector('input[name="md2email-signature-position"]:checked').value === 'top' ? signatureHtml : ''}
            ${processedContent}
            ${includeSignature && document.querySelector('input[name="md2email-signature-position"]:checked').value === 'bottom' ? signatureHtml : ''}
          </td>
        </tr>
        <tr>
          <td style="padding: 15px 25px 20px; border-top: 1px solid #eaecef; color: #888; font-size: 12px;">
            Generated by AI assistant • Width: ${maxWidth}
          </td>
        </tr>
      </table>
    `;
  }
  
  function processContentForEmail(html) {
    // Create a temporary div to work with the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Process headings
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      let fontSize, fontWeight, margin, color, borderBottom, paddingBottom;
      
      // Default values
      fontWeight = '600';
      color = '#2c3e50';
      margin = '24px 0 16px 0';
      
      switch(heading.tagName.toLowerCase()) {
        case 'h1': 
          fontSize = '26px'; 
          borderBottom = '1px solid #eaecef';
          paddingBottom = '0.3em';
          break;
        case 'h2': 
          fontSize = '22px'; 
          borderBottom = '1px solid #eaecef';
          paddingBottom = '0.3em';
          break;
        case 'h3': fontSize = '18px'; break;
        case 'h4': fontSize = '16px'; break;
        case 'h5': fontSize = '14px'; break;
        case 'h6': 
          fontSize = '13px'; 
          color = '#6a737d'; 
          break;
      }
      
      let style = `font-size: ${fontSize}; font-weight: ${fontWeight}; margin: ${margin}; color: ${color}; line-height: 1.25;`;
      
      if (borderBottom) {
        style += ` border-bottom: ${borderBottom}; padding-bottom: ${paddingBottom};`;
      }
      
      heading.setAttribute('style', style);
    });
    
    // Process links
    const links = tempDiv.querySelectorAll('a');
    links.forEach(link => {
      link.setAttribute('style', 'color: #0366d6; text-decoration: none; font-weight: 500;');
    });
    
    // Process paragraphs
    const paragraphs = tempDiv.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.setAttribute('style', 'margin: 0 0 16px 0; line-height: 1.6;');
    });
    
    // Process lists
    const lists = tempDiv.querySelectorAll('ul, ol');
    lists.forEach(list => {
      list.setAttribute('style', 'margin: 0 0 16px 0; padding-left: 24px;');
    });
    
    // Process list items
    const listItems = tempDiv.querySelectorAll('li');
    listItems.forEach(item => {
      item.setAttribute('style', 'margin: 8px 0; line-height: 1.6;');
    });
    
    // Process blockquotes
    const blockquotes = tempDiv.querySelectorAll('blockquote');
    blockquotes.forEach(quote => {
      quote.setAttribute('style', 'margin: 0 0 16px 0; padding: 12px 16px; border-left: 4px solid #4285f4; color: #546E7A; background-color: #f8f9fa; border-radius: 0 4px 4px 0; font-style: italic;');
    });
    
    // Process code blocks
    const preBlocks = tempDiv.querySelectorAll('pre');
    preBlocks.forEach(pre => {
      pre.setAttribute('style', 'margin: 0 0 16px 0; padding: 16px; background-color: #f6f8fa; border-radius: 6px; overflow: auto; border: 1px solid #e1e4e8;');
    });
    
    // Process inline code
    const codeElements = tempDiv.querySelectorAll('code');
    codeElements.forEach(code => {
      // Skip if parent is pre (handled above)
      if (code.parentNode.tagName.toLowerCase() !== 'pre') {
        code.setAttribute('style', 'font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace; padding: 0.2em 0.4em; background-color: rgba(27, 31, 35, 0.05); border-radius: 3px; font-size: 85%; color: #24292e;');
      } else {
        code.setAttribute('style', 'font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace; background: transparent; padding: 0; font-size: 14px; line-height: 1.45; color: #24292e;');
      }
    });
    
    // Process tables
    const tables = tempDiv.querySelectorAll('table');
    tables.forEach(table => {
      table.setAttribute('style', 'border-collapse: collapse; width: 100%; margin-bottom: 16px; border: 1px solid #dfe2e5; border-radius: 4px; overflow: hidden;');
      
      // Gmail-friendly table attributes
      table.setAttribute('cellspacing', '0');
      table.setAttribute('cellpadding', '0');
      table.setAttribute('border', '1');
    });
    
    // Process table headers and cells
    const tableHeaders = tempDiv.querySelectorAll('th');
    tableHeaders.forEach(th => {
      th.setAttribute('style', 'padding: 10px 13px; border: 1px solid #dfe2e5; background-color: #f6f8fa; text-align: left; font-weight: 600;');
    });
    
    const tableCells = tempDiv.querySelectorAll('td');
    tableCells.forEach(td => {
      td.setAttribute('style', 'padding: 10px 13px; border: 1px solid #dfe2e5; text-align: left;');
    });
    
    // Make alternating rows in tables have different background colors
    const tableRows = tempDiv.querySelectorAll('tr:nth-child(2n)');
    tableRows.forEach(row => {
      row.setAttribute('style', 'background-color: #f8f9fa;');
    });
    
    // Process horizontal rules
    const hrs = tempDiv.querySelectorAll('hr');
    hrs.forEach(hr => {
      hr.setAttribute('style', 'height: 2px; background-color: #e1e4e8; border: none; margin: 24px 0;');
    });
    
    // Process bold and strong
    const boldElements = tempDiv.querySelectorAll('strong, b');
    boldElements.forEach(el => {
      el.setAttribute('style', 'font-weight: 600; color: #24292e;');
    });
    
    // Process italic and emphasis
    const italicElements = tempDiv.querySelectorAll('em, i');
    italicElements.forEach(el => {
      el.setAttribute('style', 'font-style: italic;');
    });
    
    return tempDiv.innerHTML;
  }
  
  function showStatus(message, type) {
    // Clear existing classes
    statusElement.className = 'md2email-status';
    
    if (!message) {
      statusElement.style.display = 'none';
      return;
    }
    
    statusElement.textContent = message;
    
    if (type) {
      statusElement.classList.add(type);
    }
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);
  }

  function showUIFeedback(message, type = "info") {
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
});
