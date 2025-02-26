self.addEventListener('message', function (e) {
  const xmlString = e.data
  const parsedContent = parseOOXML(xmlString)
  // Send the parsed content back to the main thread.
  self.postMessage(parsedContent)
})

/**
 * Parse OOXML content and extract paragraphs along with formatting details.
 * @param {string} xmlString - The OOXML document as a string.
 * @return {Array} Array of objects representing paragraphs.
 */
function parseOOXML(xmlString) {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml')

  // Locate the <pkg:xmlData> element. Note the escaping for the colon.
  const xmlData = xmlDoc.querySelector('pkg\\:xmlData, xmlData')
  if (!xmlData) {
    console.error('No xmlData found in the document.')
    return []
  }

  // Assume paragraphs are represented with <w:p> elements.
  const paragraphs = xmlData.getElementsByTagName('w:p')
  const content = []

  // Process each paragraph.
  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i]
    let paraText = ''

    // Concatenate text from <w:t> elements within <w:r> elements.
    const runs = para.getElementsByTagName('w:r')
    for (let j = 0; j < runs.length; j++) {
      const run = runs[j]
      const textElem = run.getElementsByTagName('w:t')[0]
      if (textElem) {
        paraText += textElem.textContent
      }
    }

    // Determine formatting: heading, list item, etc.
    let isHeading = false
    let headingLevel = 0
    let isList = false

    const pPr = para.getElementsByTagName('w:pPr')[0]
    if (pPr) {
      const pStyle = pPr.getElementsByTagName('w:pStyle')[0]
      if (pStyle) {
        const styleVal = pStyle.getAttribute('w:val')
        if (styleVal && styleVal.indexOf('Heading') !== -1) {
          isHeading = true
          headingLevel = parseInt(styleVal.replace('Heading', '')) || 1
        }
      }
      const numPr = pPr.getElementsByTagName('w:numPr')[0]
      if (numPr) {
        isList = true
      }
    }

    content.push({
      text: paraText,
      isHeading,
      headingLevel,
      isList,
    })
  }

  return content
}
