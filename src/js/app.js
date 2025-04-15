// In src/js/app.js
import { marked } from 'marked';
import { setupMarkdownProcessor } from './markdown-processor.js';
import { setupClipboardManager } from './clipboard-manager.js';
import { setupUIController } from './ui-controller.js';
import { initSignatureModule } from './signature.js';
import { showUIFeedback } from './utility.js';

// Initialize marked with options
marked.use({
  breaks: true,
  gfm: true,
  headerIds: false
});

// Set up global modules
document.addEventListener('DOMContentLoaded', () => {
  // Make showUIFeedback available globally for backward compatibility
  window.showUIFeedback = showUIFeedback;
  
  // Initialize the markdown processor
  const updatePreview = setupMarkdownProcessor(marked);
  
  // Initialize the other modules
  setupClipboardManager();
  setupUIController(updatePreview);
  initSignatureModule(updatePreview);

  // Expose updatePreview for other modules
  window.updatePreview = updatePreview;
  
  // Run the initial preview update
  updatePreview();
});
