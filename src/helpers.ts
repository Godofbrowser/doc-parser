/**
 * Reads the content of a file and returns a promise that resolves with the content.
 * @param {File} file - The file object obtained from an HTML file input.
 * @return {Promise<string>} A promise that resolves with the file's content.
 */
export function readFileContent(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }

    // Read the file as text. Change to readAsArrayBuffer or readAsDataURL if needed.
    reader.readAsText(file)
  })
}

// Parse the OOXML and render as HTML
export function parseDocumentXML(xmlString: string) {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml')

  // Container to hold page segments
  const pagesContainer = document.createElement('div')
  let currentPage = document.createElement('div')
  currentPage.className = 'page-segment'

  // Helper to extract paragraph-level styling (e.g., indentation)
  function getParagraphStyle(pPr: Element) {
    let style = ''
    if (pPr) {
      const ind = pPr.getElementsByTagName('w:ind')[0]
      if (ind && ind.getAttribute('w:left')) {
        // OOXML indentation is in twips (1/20th of a point)
        const leftTwips = parseInt(ind.getAttribute('w:left') as string, 10)
        const leftPx = (leftTwips / 20) * 1.33
        style += `padding-left: ${leftPx}px;`
      }
      // Additional styling (tabs, spacing, etc.) can be added here...
    }
    return style
  }

  // Process each paragraph (<w:p>) in the document
  const paragraphs = xmlDoc.getElementsByTagName('w:p')
  let currentList = null // Track if we're inside a list

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i]
    const pPr = p.getElementsByTagName('w:pPr')[0]

    // Determine type: heading, list item, or normal paragraph
    let isHeading = false
    let headingLevel = 1
    if (pPr) {
      const pStyle = pPr.getElementsByTagName('w:pStyle')[0]
      if (pStyle && pStyle.getAttribute('w:val')) {
        const styleVal = pStyle?.getAttribute('w:val')?.toLowerCase()
        if (styleVal?.startsWith('heading')) {
          isHeading = true
          const match = styleVal.match(/\d/)
          headingLevel = match ? parseInt(match[0], 10) : 1
        }
      }
    }
    const isList = pPr && pPr.getElementsByTagName('w:numPr').length > 0

    // Check if this paragraph contains a page break marker
    let isPageBreak = false
    const brs = p.getElementsByTagName('w:br')
    for (let j = 0; j < brs.length; j++) {
      if (brs[j].getAttribute('w:type') === 'page') {
        isPageBreak = true
        break
      }
    }

    // Extract the text by concatenating all <w:t> elements
    let paraText = ''
    const texts = p.getElementsByTagName('w:t')
    for (let j = 0; j < texts.length; j++) {
      paraText += texts[j].textContent
    }

    // Retrieve any inline styling from paragraph properties
    const inlineStyle = getParagraphStyle(pPr)

    // Build HTML output based on paragraph type
    if (isList) {
      // Start a new list if necessary
      if (!currentList) {
        currentList = document.createElement('ul')
        currentPage.appendChild(currentList)
      }
      const li = document.createElement('li')
      li.style.cssText = inlineStyle
      li.innerText = paraText
      currentList.appendChild(li)
    } else {
      // If not a list, reset any active list
      currentList = null
      if (isHeading) {
        const h = document.createElement('h' + Math.min(headingLevel, 6))
        h.style.cssText = inlineStyle
        h.innerText = paraText
        currentPage.appendChild(h)
      } else {
        const pElement = document.createElement('p')
        pElement.style.cssText = inlineStyle
        pElement.innerText = paraText
        currentPage.appendChild(pElement)
      }
    }

    // If a page break marker is found, finish this page segment and start a new one
    if (isPageBreak) {
      pagesContainer.appendChild(currentPage)
      currentPage = document.createElement('div')
      currentPage.className = 'page-segment'
    }
  }
  // Append any remaining content as the last page segment
  if (currentPage.childNodes.length > 0) {
    pagesContainer.appendChild(currentPage)
  }
  return pagesContainer.outerHTML
}
