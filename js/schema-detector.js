// Schema Detector JavaScript

class SchemaDetector {
  constructor() {
    this.apiEndpoint = 'https://corsproxy.io/?';
    this.detectedSchemas = [];
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Detect schema button
    document.getElementById('detect-schema').addEventListener('click', () => {
      this.detectSchema();
    });

    // Enter key on URL input
    document.getElementById('website-url').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.detectSchema();
      }
    });

    // Copy results button
    document.getElementById('copy-results').addEventListener('click', () => {
      this.copyResults();
    });

    // Download results button
    document.getElementById('download-results').addEventListener('click', () => {
      this.downloadResults();
    });
  }

  async detectSchema() {
    const urlInput = document.getElementById('website-url');
    const url = urlInput.value.trim();

    if (!this.isValidURL(url)) {
      this.showError('Please enter a valid URL including https://');
      return;
    }

    this.showLoading();
    this.hideError();
    this.hideResults();

    try {
      const response = await this.fetchPageContent(url);
      const schemas = this.parseSchemaMarkup(response);
      
      if (schemas.length === 0) {
        this.showNoResults();
      } else {
        this.displayResults(schemas, url);
      }
    } catch (error) {
      console.error('Detection error:', error);
      this.showError('Unable to analyze the website. The site may be blocking requests or the URL may be incorrect.');
    } finally {
      this.hideLoading();
    }
  }

  async fetchPageContent(url) {
    try {
      // Use CORS proxy to fetch the page content
      const proxyUrl = `${this.apiEndpoint}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const htmlContent = await response.text();
      return htmlContent;
    } catch (error) {
      throw new Error('Unable to fetch page content. The website may be blocking cross-origin requests.');
    }
  }

  parseSchemaMarkup(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const schemas = [];

    // Detect JSON-LD
    const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    jsonLdScripts.forEach((script, index) => {
      try {
        const jsonData = JSON.parse(script.textContent);
        schemas.push({
          type: 'JSON-LD',
          index: index + 1,
          schemaType: this.getSchemaType(jsonData),
          data: jsonData,
          raw: script.textContent
        });
      } catch (error) {
        schemas.push({
          type: 'JSON-LD',
          index: index + 1,
          schemaType: 'Invalid',
          data: null,
          raw: script.textContent,
          error: 'Invalid JSON format'
        });
      }
    });

    // Detect Microdata
    const microdataElements = doc.querySelectorAll('[itemscope]');
    microdataElements.forEach((element, index) => {
      const itemType = element.getAttribute('itemtype');
      const microdataObj = this.extractMicrodata(element);
      
      schemas.push({
        type: 'Microdata',
        index: index + 1,
        schemaType: this.getSchemaTypeFromUrl(itemType),
        data: microdataObj,
        raw: element.outerHTML,
        itemType: itemType
      });
    });

    // Detect RDFa
    const rdfaElements = doc.querySelectorAll('[typeof]');
    rdfaElements.forEach((element, index) => {
      const typeOf = element.getAttribute('typeof');
      const rdfaObj = this.extractRDFa(element);
      
      schemas.push({
        type: 'RDFa',
        index: index + 1,
        schemaType: typeOf,
        data: rdfaObj,
        raw: element.outerHTML,
        typeof: typeOf
      });
    });

    this.detectedSchemas = schemas;
    return schemas;
  }

  getSchemaType(jsonData) {
    if (Array.isArray(jsonData)) {
      return jsonData.map(item => item['@type'] || 'Unknown').join(', ');
    }
    return jsonData['@type'] || 'Unknown';
  }

  getSchemaTypeFromUrl(url) {
    if (!url) return 'Unknown';
    const parts = url.split('/');
    return parts[parts.length - 1] || 'Unknown';
  }

  extractMicrodata(element) {
    const data = {};
    const properties = element.querySelectorAll('[itemprop]');
    
    properties.forEach(prop => {
      const name = prop.getAttribute('itemprop');
      let value = prop.getAttribute('content') || 
                  prop.getAttribute('datetime') || 
                  prop.textContent.trim();
      
      if (data[name]) {
        if (Array.isArray(data[name])) {
          data[name].push(value);
        } else {
          data[name] = [data[name], value];
        }
      } else {
        data[name] = value;
      }
    });
    
    return data;
  }

  extractRDFa(element) {
    const data = {};
    const properties = element.querySelectorAll('[property]');
    
    properties.forEach(prop => {
      const name = prop.getAttribute('property');
      let value = prop.getAttribute('content') || 
                  prop.getAttribute('datetime') || 
                  prop.textContent.trim();
      
      if (data[name]) {
        if (Array.isArray(data[name])) {
          data[name].push(value);
        } else {
          data[name] = [data[name], value];
        }
      } else {
        data[name] = value;
      }
    });
    
    return data;
  }

  displayResults(schemas, url) {
    // Update summary statistics
    const totalSchemas = schemas.length;
    const jsonLdCount = schemas.filter(s => s.type === 'JSON-LD').length;
    const microdataCount = schemas.filter(s => s.type === 'Microdata').length;
    const rdfaCount = schemas.filter(s => s.type === 'RDFa').length;

    document.getElementById('total-schemas').textContent = totalSchemas;
    document.getElementById('jsonld-count').textContent = jsonLdCount;
    document.getElementById('microdata-count').textContent = microdataCount;
    document.getElementById('rdfa-count').textContent = rdfaCount;

    // Display schema types
    this.displaySchemaTypes(schemas);

    // Display detailed results
    this.displayDetailedResults(schemas);

    this.showResults();
  }

  displaySchemaTypes(schemas) {
    const container = document.getElementById('schema-types-grid');
    container.innerHTML = '';

    // Group schemas by type
    const schemaTypes = {};
    schemas.forEach(schema => {
      const type = schema.schemaType;
      if (!schemaTypes[type]) {
        schemaTypes[type] = 0;
      }
      schemaTypes[type]++;
    });

    // Create badges for each schema type
    Object.entries(schemaTypes).forEach(([type, count]) => {
      const badge = document.createElement('div');
      badge.className = 'schema-type-badge';
      
      badge.innerHTML = `
        <svg class="schema-type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${this.getSchemaIcon(type)}
        </svg>
        <div class="schema-type-info">
          <div class="schema-type-name">${type}</div>
          <div class="schema-type-count">${count} instance${count > 1 ? 's' : ''}</div>
        </div>
      `;
      
      container.appendChild(badge);
    });
  }

  getSchemaIcon(schemaType) {
    const icons = {
      'Article': '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>',
      'BlogPosting': '<path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>',
      'Product': '<path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>',
      'Organization': '<path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>',
      'LocalBusiness': '<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>',
      'FAQ': '<path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      'WebSite': '<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>',
      'default': '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>'
    };
    
    return icons[schemaType] || icons.default;
  }

  displayDetailedResults(schemas) {
    const container = document.getElementById('schema-results');
    const formattedResults = {
      url: document.getElementById('website-url').value,
      detectionDate: new Date().toISOString(),
      totalSchemas: schemas.length,
      schemas: schemas.map(schema => ({
        type: schema.type,
        schemaType: schema.schemaType,
        data: schema.data,
        error: schema.error || null
      }))
    };

    container.textContent = JSON.stringify(formattedResults, null, 2);
  }

  showLoading() {
    document.getElementById('loading-section').classList.remove('hidden');
  }

  hideLoading() {
    document.getElementById('loading-section').classList.add('hidden');
  }

  showResults() {
    document.getElementById('results-section').classList.remove('hidden');
  }

  hideResults() {
    document.getElementById('results-section').classList.add('hidden');
  }

  showError(message) {
    document.getElementById('error-message-text').textContent = message;
    document.getElementById('error-section').classList.remove('hidden');
  }

  hideError() {
    document.getElementById('error-section').classList.add('hidden');
  }

  showNoResults() {
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = `
      <div class="no-results">
        <svg class="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3>No Schema Markup Found</h3>
        <p>This website doesn't appear to have any structured data markup. Consider implementing schema markup to improve SEO performance.</p>
        <a href="schema-generator.html" class="btn btn-primary">Create Schema Markup</a>
      </div>
    `;
    resultsSection.classList.remove('hidden');
  }

  async copyResults() {
    const resultsText = document.getElementById('schema-results').textContent;
    
    if (resultsText === '// Schema markup details will appear here') {
      this.showNotification('No results to copy', 'warning');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(resultsText);
      this.showNotification('Results copied to clipboard!', 'success');
    } catch (err) {
      this.showNotification('Failed to copy results', 'error');
    }
  }

  downloadResults() {
    const resultsText = document.getElementById('schema-results').textContent;
    
    if (resultsText === '// Schema markup details will appear here') {
      this.showNotification('No results to download', 'warning');
      return;
    }
    
    const blob = new Blob([resultsText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const hostname = new URL(document.getElementById('website-url').value).hostname;
    a.href = url;
    a.download = `schema-detection-${hostname}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showNotification('Results downloaded successfully!', 'success');
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      color: 'white',
      fontWeight: '500',
      zIndex: '9999',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });

    if (type === 'success') {
      notification.style.background = '#10B981';
    } else if (type === 'error') {
      notification.style.background = '#EF4444';
    } else if (type === 'warning') {
      notification.style.background = '#F59E0B';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  isValidURL(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }
}

// Initialize the schema detector when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new SchemaDetector();
});