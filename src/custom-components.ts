class ViewerContent extends HTMLElement {
  container: HTMLDivElement

  constructor() {
    super()
    // Attach shadow DOM in open mode so it can be accessed for debugging if needed.
    this.attachShadow({ mode: 'open' })

    // Create a <style> element and add the provided CSS.
    const style = document.createElement('style')
    style.textContent = `
        body { font-family: Arial, sans-serif; margin: 20px; }
        .page-segment {
          margin: 20px 0;
          padding: 20px;
          border: 1px solid #ddd;
          background: #ffffff;
        }
      `

    // Create a container element to hold the content.
    this.container = document.createElement('div')

    // Append the style and container elements to the shadow root.
    this.shadowRoot?.append(style, this.container)

    // Initial render of the content passed via the 'content' attribute.
    this.updateContent()
  }

  // Monitor the "content" attribute for changes.
  static get observedAttributes() {
    return ['content']
  }

  attributeChangedCallback(name: string) {
    if (name === 'content') {
      this.updateContent()
    }
  }

  updateContent() {
    // Set the container's innerHTML to the attribute value.
    this.container.innerHTML = this.getAttribute('content') || ''
  }
}

// Define the custom element.
customElements.define('viewer-content', ViewerContent)
