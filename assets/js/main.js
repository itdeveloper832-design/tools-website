// =====================================================
// HEADER FUNCTION - Renders impactful header on all pages
// =====================================================
function createHeader(currentPage = '') {
  const header = document.createElement('header');
  header.innerHTML = `
    <div class="header-container">
      <a href="/" class="logo">⚡ ToolSpark</a>
      <nav>
        <ul class="nav-links">
          <li><a href="/" class="${currentPage === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="/tools.html" class="${currentPage === 'tools' ? 'active' : ''}">Tools</a></li>
          <li><a href="/about.html" class="${currentPage === 'about' ? 'active' : ''}">About</a></li>
          <li><a href="/contact.html" class="${currentPage === 'contact' ? 'active' : ''}">Contact</a></li>
        </ul>
      </nav>
      <button class="mobile-menu-btn">☰</button>
    </div>
  `;
  
  const body = document.body;
  body.insertBefore(header, body.firstChild);
  
  // Mobile menu functionality
  const mobileMenuBtn = header.querySelector('.mobile-menu-btn');
  const navLinks = header.querySelector('.nav-links');
  
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  });
}

// =====================================================
// FOOTER FUNCTION - Renders impactful footer on all pages
// =====================================================
function createFooter() {
  const footer = document.createElement('footer');
  footer.innerHTML = `
    <div class="footer-content">
      <div class="footer-section">
        <h4>ToolSpark</h4>
        <p>Your go-to platform for free, powerful online tools.</p>
        <div class="social-links">
          <a href="#" title="Twitter">𝕏</a>
          <a href="#" title="Facebook">f</a>
          <a href="#" title="LinkedIn">in</a>
        </div>
      </div>
      
      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li><a href="/tools.html">Tools</a></li>
          <li><a href="/about.html">About Us</a></li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4>Categories</h4>
        <ul>
          <li><a href="/tools.html">Text Tools</a></li>
          <li><a href="/tools.html">Image Tools</a></li>
          <li><a href="/tools.html">Developer Tools</a></li>
          <li><a href="/tools.html">Utility Tools</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4>Support</h4>
        <ul>
          <li><a href="/contact.html">Get Help</a></li>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#terms">Terms of Service</a></li>
          <li><a href="#feedback">Send Feedback</a></li>
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2026 ToolSpark. All rights reserved. | Free online tools for everyone. | Made with ❤️</p>
    </div>
  `;
  
  document.body.appendChild(footer);
}

// =====================================================
// TOOLS DATA - Shared across pages
// =====================================================
const tools = [
  { name: 'Age Calculator', description: 'Calculate your exact age from date of birth', link: '/tools/age-calculator.html' },
  { name: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64 strings instantly', link: '/tools/base64.html' },
  { name: 'BMI Calculator', description: 'Calculate your Body Mass Index in seconds', link: '/tools/bmi-calculator.html' },
  { name: 'Character Counter', description: 'Count characters, words, and lines in text', link: '/tools/character-counter.html' },
  { name: 'Color Picker', description: 'Pick and convert colors easily', link: '/tools/color-picker.html' },
  { name: 'CSS Minifier', description: 'Minify CSS code for faster loading', link: '/tools/css-minifier.html' },
  { name: 'HTML Formatter', description: 'Format and beautify HTML code', link: '/tools/html-formatter.html' },
  { name: 'Image to PDF', description: 'Convert images to PDF format', link: '/tools/image-to-pdf.html' },
  { name: 'JPG to PNG', description: 'Convert JPG images to PNG format', link: '/tools/jpg-to-png.html' },
  { name: 'JS Minifier', description: 'Minify JavaScript code for optimization', link: '/tools/js-minifier.html' },
  { name: 'JSON Formatter', description: 'Format and validate JSON data', link: '/tools/json-formatter.html' },
  { name: 'Lorem Ipsum', description: 'Generate dummy text for design mockups', link: '/tools/lorem-ipsum.html' },
  { name: 'Markdown Previewer', description: 'Preview markdown in real-time', link: '/tools/markdown-previewer.html' },
  { name: 'Password Generator', description: 'Generate strong, secure passwords', link: '/tools/password-generator.html' },
  { name: 'PDF to Image', description: 'Convert PDF pages to images', link: '/tools/pdf-to-image.html' },
  { name: 'QR Code Generator', description: 'Create QR codes for any text or URL', link: '/tools/qr-code.html' },
  { name: 'Text Case Converter', description: 'Convert text between different cases', link: '/tools/text-case.html' },
  { name: 'Timezone Converter', description: 'Convert times across different timezones', link: '/tools/timezone-converter.html' },
  { name: 'URL Encoder/Decoder', description: 'Encode and decode URLs instantly', link: '/tools/url-encoder.html' },
  { name: 'Word Counter', description: 'Count words, sentences, and paragraphs', link: '/tools/word-counter.html' },
];

// =====================================================
// AUTO-INITIALIZE HEADER & FOOTER ON PAGE LOAD
// =====================================================
function renderToolsGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  tools.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
      <a href="${tool.link}" class="btn btn-primary btn-small">Open Tool</a>
    `;
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Auto-create header and footer if they don't exist
  if (!document.querySelector('header')) {
    createHeader();
  }
  if (!document.querySelector('footer')) {
    createFooter();
  }
});
