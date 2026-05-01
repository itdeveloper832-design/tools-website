// Schema Generator JavaScript

class SchemaGenerator {
  constructor() {
    this.currentSchemaType = 'article';
    this.schemaTemplates = {
      article: {
        fields: [
          { name: 'headline', label: 'Article Title', type: 'text', required: true },
          { name: 'description', label: 'Article Description', type: 'textarea', required: true },
          { name: 'author', label: 'Author Name', type: 'text', required: true },
          { name: 'datePublished', label: 'Publication Date', type: 'date', required: true },
          { name: 'dateModified', label: 'Last Modified Date', type: 'date', required: false },
          { name: 'image', label: 'Featured Image URL', type: 'url', required: false },
          { name: 'publisher', label: 'Publisher Name', type: 'text', required: true },
          { name: 'url', label: 'Article URL', type: 'url', required: true }
        ]
      },
      blogposting: {
        fields: [
          { name: 'headline', label: 'Blog Post Title', type: 'text', required: true },
          { name: 'description', label: 'Blog Post Description', type: 'textarea', required: true },
          { name: 'author', label: 'Author Name', type: 'text', required: true },
          { name: 'datePublished', label: 'Publication Date', type: 'date', required: true },
          { name: 'dateModified', label: 'Last Modified Date', type: 'date', required: false },
          { name: 'image', label: 'Featured Image URL', type: 'url', required: false },
          { name: 'publisher', label: 'Publisher Name', type: 'text', required: true },
          { name: 'url', label: 'Blog Post URL', type: 'url', required: true },
          { name: 'wordCount', label: 'Word Count', type: 'number', required: false }
        ]
      },
      faq: {
        fields: [
          { name: 'name', label: 'FAQ Page Title', type: 'text', required: true },
          { name: 'questions', label: 'Questions and Answers (JSON format)', type: 'textarea', required: true, placeholder: '[{"question": "What is...?", "answer": "The answer is..."}]' }
        ]
      },
      howto: {
        fields: [
          { name: 'name', label: 'How-to Title', type: 'text', required: true },
          { name: 'description', label: 'How-to Description', type: 'textarea', required: true },
          { name: 'image', label: 'Featured Image URL', type: 'url', required: false },
          { name: 'totalTime', label: 'Total Time (e.g., PT30M)', type: 'text', required: false },
          { name: 'estimatedCost', label: 'Estimated Cost', type: 'text', required: false },
          { name: 'supply', label: 'Required Supplies (comma separated)', type: 'textarea', required: false },
          { name: 'tool', label: 'Required Tools (comma separated)', type: 'textarea', required: false },
          { name: 'steps', label: 'Steps (JSON format)', type: 'textarea', required: true, placeholder: '[{"name": "Step 1", "text": "Description of step 1"}]' }
        ]
      },
      product: {
        fields: [
          { name: 'name', label: 'Product Name', type: 'text', required: true },
          { name: 'description', label: 'Product Description', type: 'textarea', required: true },
          { name: 'image', label: 'Product Image URL', type: 'url', required: false },
          { name: 'brand', label: 'Brand Name', type: 'text', required: true },
          { name: 'sku', label: 'SKU', type: 'text', required: false },
          { name: 'price', label: 'Price', type: 'number', required: true },
          { name: 'priceCurrency', label: 'Currency Code (e.g., USD)', type: 'text', required: true },
          { name: 'availability', label: 'Availability', type: 'select', required: true, options: ['InStock', 'OutOfStock', 'PreOrder'] },
          { name: 'condition', label: 'Condition', type: 'select', required: false, options: ['NewCondition', 'UsedCondition', 'RefurbishedCondition'] },
          { name: 'ratingValue', label: 'Rating Value (1-5)', type: 'number', required: false },
          { name: 'reviewCount', label: 'Review Count', type: 'number', required: false }
        ]
      },
      organization: {
        fields: [
          { name: 'name', label: 'Organization Name', type: 'text', required: true },
          { name: 'description', label: 'Organization Description', type: 'textarea', required: false },
          { name: 'url', label: 'Website URL', type: 'url', required: true },
          { name: 'logo', label: 'Logo URL', type: 'url', required: false },
          { name: 'contactType', label: 'Contact Type', type: 'text', required: false },
          { name: 'telephone', label: 'Phone Number', type: 'tel', required: false },
          { name: 'email', label: 'Email Address', type: 'email', required: false },
          { name: 'address', label: 'Street Address', type: 'text', required: false },
          { name: 'city', label: 'City', type: 'text', required: false },
          { name: 'state', label: 'State/Province', type: 'text', required: false },
          { name: 'postalCode', label: 'Postal Code', type: 'text', required: false },
          { name: 'country', label: 'Country', type: 'text', required: false }
        ]
      },
      localbusiness: {
        fields: [
          { name: 'name', label: 'Business Name', type: 'text', required: true },
          { name: 'description', label: 'Business Description', type: 'textarea', required: false },
          { name: 'url', label: 'Website URL', type: 'url', required: false },
          { name: 'telephone', label: 'Phone Number', type: 'tel', required: true },
          { name: 'address', label: 'Street Address', type: 'text', required: true },
          { name: 'city', label: 'City', type: 'text', required: true },
          { name: 'state', label: 'State/Province', type: 'text', required: true },
          { name: 'postalCode', label: 'Postal Code', type: 'text', required: true },
          { name: 'country', label: 'Country', type: 'text', required: true },
          { name: 'priceRange', label: 'Price Range (e.g., $$)', type: 'text', required: false },
          { name: 'openingHours', label: 'Opening Hours (e.g., Mo-Fr 09:00-17:00)', type: 'text', required: false },
          { name: 'ratingValue', label: 'Rating Value (1-5)', type: 'number', required: false },
          { name: 'reviewCount', label: 'Review Count', type: 'number', required: false }
        ]
      },
      breadcrumb: {
        fields: [
          { name: 'items', label: 'Breadcrumb Items (JSON format)', type: 'textarea', required: true, placeholder: '[{"name": "Home", "url": "/"}, {"name": "Category", "url": "/category"}]' }
        ]
      },
      website: {
        fields: [
          { name: 'name', label: 'Website Name', type: 'text', required: true },
          { name: 'description', label: 'Website Description', type: 'textarea', required: false },
          { name: 'url', label: 'Website URL', type: 'url', required: true },
          { name: 'potentialAction', label: 'Search Action URL', type: 'url', required: false, placeholder: 'https://example.com/search?q={search_term_string}' }
        ]
      }
    };
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderForm();
  }

  bindEvents() {
    // Schema type selection
    document.querySelectorAll('.schema-type-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.schema-type-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentSchemaType = e.target.dataset.type;
        this.renderForm();
      });
    });

    // Generate schema button
    document.getElementById('generate-schema').addEventListener('click', () => {
      this.generateSchema();
    });

    // Clear form button
    document.getElementById('clear-form').addEventListener('click', () => {
      this.clearForm();
    });

    // Copy schema button
    document.getElementById('copy-schema').addEventListener('click', () => {
      this.copySchema();
    });

    // Download schema button
    document.getElementById('download-schema').addEventListener('click', () => {
      this.downloadSchema();
    });

    // Validate schema button
    document.getElementById('validate-schema').addEventListener('click', () => {
      this.validateSchema();
    });
  }

  renderForm() {
    const container = document.getElementById('schema-inputs');
    const template = this.schemaTemplates[this.currentSchemaType];
    
    container.innerHTML = '';
    
    template.fields.forEach(field => {
      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';
      
      const label = document.createElement('label');
      label.textContent = field.label + (field.required ? ' *' : '');
      label.setAttribute('for', field.name);
      
      let input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = 3;
      } else if (field.type === 'select') {
        input = document.createElement('select');
        field.options.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option;
          optionElement.textContent = option;
          input.appendChild(optionElement);
        });
      } else {
        input = document.createElement('input');
        input.type = field.type;
      }
      
      input.id = field.name;
      input.name = field.name;
      input.required = field.required;
      
      if (field.placeholder) {
        input.placeholder = field.placeholder;
      }
      
      formGroup.appendChild(label);
      formGroup.appendChild(input);
      container.appendChild(formGroup);
    });
  }

  generateSchema() {
    const formData = new FormData(document.querySelector('#schema-inputs'));
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    let schema;
    
    try {
      schema = this.buildSchema(data);
      const jsonOutput = JSON.stringify(schema, null, 2);
      document.getElementById('schema-result').textContent = jsonOutput;
    } catch (error) {
      document.getElementById('schema-result').textContent = `Error generating schema: ${error.message}`;
    }
  }

  buildSchema(data) {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": this.getSchemaType()
    };

    switch (this.currentSchemaType) {
      case 'article':
      case 'blogposting':
        return {
          ...baseSchema,
          headline: data.headline,
          description: data.description,
          author: {
            "@type": "Person",
            name: data.author
          },
          datePublished: data.datePublished,
          dateModified: data.dateModified || data.datePublished,
          image: data.image || undefined,
          publisher: {
            "@type": "Organization",
            name: data.publisher
          },
          url: data.url,
          wordCount: data.wordCount || undefined
        };

      case 'faq':
        const questions = JSON.parse(data.questions || '[]');
        return {
          ...baseSchema,
          name: data.name,
          mainEntity: questions.map(q => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: q.answer
            }
          }))
        };

      case 'howto':
        const steps = JSON.parse(data.steps || '[]');
        const supplies = data.supply ? data.supply.split(',').map(s => s.trim()) : [];
        const tools = data.tool ? data.tool.split(',').map(t => t.trim()) : [];
        
        return {
          ...baseSchema,
          name: data.name,
          description: data.description,
          image: data.image || undefined,
          totalTime: data.totalTime || undefined,
          estimatedCost: data.estimatedCost || undefined,
          supply: supplies.length > 0 ? supplies : undefined,
          tool: tools.length > 0 ? tools : undefined,
          step: steps.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.name,
            text: step.text
          }))
        };

      case 'product':
        return {
          ...baseSchema,
          name: data.name,
          description: data.description,
          image: data.image || undefined,
          brand: {
            "@type": "Brand",
            name: data.brand
          },
          sku: data.sku || undefined,
          offers: {
            "@type": "Offer",
            price: data.price,
            priceCurrency: data.priceCurrency,
            availability: `https://schema.org/${data.availability}`,
            itemCondition: data.condition ? `https://schema.org/${data.condition}` : undefined
          },
          aggregateRating: (data.ratingValue && data.reviewCount) ? {
            "@type": "AggregateRating",
            ratingValue: data.ratingValue,
            reviewCount: data.reviewCount
          } : undefined
        };

      case 'organization':
        return {
          ...baseSchema,
          name: data.name,
          description: data.description || undefined,
          url: data.url,
          logo: data.logo || undefined,
          contactPoint: (data.telephone || data.email) ? {
            "@type": "ContactPoint",
            contactType: data.contactType || "customer service",
            telephone: data.telephone || undefined,
            email: data.email || undefined
          } : undefined,
          address: (data.address || data.city) ? {
            "@type": "PostalAddress",
            streetAddress: data.address || undefined,
            addressLocality: data.city || undefined,
            addressRegion: data.state || undefined,
            postalCode: data.postalCode || undefined,
            addressCountry: data.country || undefined
          } : undefined
        };

      case 'localbusiness':
        return {
          ...baseSchema,
          name: data.name,
          description: data.description || undefined,
          url: data.url || undefined,
          telephone: data.telephone,
          address: {
            "@type": "PostalAddress",
            streetAddress: data.address,
            addressLocality: data.city,
            addressRegion: data.state,
            postalCode: data.postalCode,
            addressCountry: data.country
          },
          priceRange: data.priceRange || undefined,
          openingHours: data.openingHours || undefined,
          aggregateRating: (data.ratingValue && data.reviewCount) ? {
            "@type": "AggregateRating",
            ratingValue: data.ratingValue,
            reviewCount: data.reviewCount
          } : undefined
        };

      case 'breadcrumb':
        const items = JSON.parse(data.items || '[]');
        return {
          ...baseSchema,
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        };

      case 'website':
        return {
          ...baseSchema,
          name: data.name,
          description: data.description || undefined,
          url: data.url,
          potentialAction: data.potentialAction ? {
            "@type": "SearchAction",
            target: data.potentialAction,
            "query-input": "required name=search_term_string"
          } : undefined
        };

      default:
        throw new Error('Unknown schema type');
    }
  }

  getSchemaType() {
    const typeMap = {
      'article': 'Article',
      'blogposting': 'BlogPosting',
      'faq': 'FAQPage',
      'howto': 'HowTo',
      'product': 'Product',
      'organization': 'Organization',
      'localbusiness': 'LocalBusiness',
      'breadcrumb': 'BreadcrumbList',
      'website': 'WebSite'
    };
    return typeMap[this.currentSchemaType];
  }

  clearForm() {
    document.querySelectorAll('#schema-inputs input, #schema-inputs textarea, #schema-inputs select').forEach(input => {
      input.value = '';
    });
    document.getElementById('schema-result').textContent = '// Your generated schema markup will appear here';
  }

  async copySchema() {
    const schemaText = document.getElementById('schema-result').textContent;
    
    if (schemaText === '// Your generated schema markup will appear here') {
      alert('Please generate schema markup first');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(schemaText);
      
      // Show success feedback
      const btn = document.getElementById('copy-schema');
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.background = '#10B981';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = schemaText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Schema markup copied to clipboard!');
    }
  }

  downloadSchema() {
    const schemaText = document.getElementById('schema-result').textContent;
    
    if (schemaText === '// Your generated schema markup will appear here') {
      alert('Please generate schema markup first');
      return;
    }
    
    const blob = new Blob([schemaText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentSchemaType}-schema.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  validateSchema() {
    const schemaText = document.getElementById('schema-result').textContent;
    
    if (schemaText === '// Your generated schema markup will appear here') {
      alert('Please generate schema markup first');
      return;
    }
    
    try {
      JSON.parse(schemaText);
      // Open Google's Rich Results Test
      const encodedSchema = encodeURIComponent(schemaText);
      window.open(`https://search.google.com/test/rich-results?code=${encodedSchema}`, '_blank');
    } catch (error) {
      alert('Invalid JSON format. Please check your schema markup.');
    }
  }
}

// Initialize the schema generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new SchemaGenerator();
});

// Clean up undefined values from schema
function cleanSchema(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cleanSchema).filter(item => item !== undefined);
  } else if (obj !== null && typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = cleanSchema(value);
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }
  return obj === '' ? undefined : obj;
}