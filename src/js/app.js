import { marked } from 'marked';
import { setupMarkdownProcessor } from './markdown-processor.js';
import { setupClipboardManager } from './clipboard-manager.js';
import { setupUIController } from './ui-controller.js';
import { initSignatureModule } from './signature.js';

// Initialize marked with options
marked.use({
  breaks: true,
  gfm: true,
  headerIds: false
});

// Set up global modules
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the markdown processor
  const updatePreview = setupMarkdownProcessor(marked);
  
  // Initialize the clipboard manager
  setupClipboardManager(updatePreview);
  
  // Initialize UI controller
  setupUIController(updatePreview);
  
  // Initialize signature module
  initSignatureModule(updatePreview);

  // Expose updatePreview for modules that need to trigger a refresh
  window.updatePreview = updatePreview;
  
  // Run the initial preview update
  updatePreview();
});
