import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDocStore = defineStore('doc', () => {
  // State: raw XML input and parsed content.
  const isParsing = ref(false)
  const rawXml = ref('')
  const parsedContent = ref('')

  /**
   * Parse XML content and update the store.
   * @param {string} xmlString - The XML content as a string.
   */
  function parseXml(xmlString: string) {
    console.log('#'.repeat(45), { xmlString })
    isParsing.value = true
    rawXml.value = xmlString

    const contentArray = parseOOXML(xmlString)
    console.log('#'.repeat(45), { contentArray })
    parsedContent.value = renderContent(contentArray)
    console.log('#'.repeat(45), { parsedContent })
    isParsing.value = false
  }

  return { rawXml, parsedContent, parseXml, isParsing }
})

// Function to render the parsed content to the webpage
function renderContent(contentArray: any[]) {
  const container = document.createElement('div')
  container.innerHTML = '' // Clear the "loading" text
  let listContainer: HTMLUListElement | null = null
  contentArray.forEach((item) => {
    if (item.isList) {
      if (!listContainer) {
        listContainer = document.createElement('ul')
        container.appendChild(listContainer)
      }
      const li = document.createElement('li')
      li.textContent = item.text
      listContainer.appendChild(li)
    } else {
      listContainer = null // Reset list container when switching to non-list items
      if (item.isHeading) {
        const level = Math.min(Math.max(item.headingLevel, 1), 6)
        const heading = document.createElement('h' + level)
        heading.textContent = item.text
        container.appendChild(heading)
      } else {
        const p = document.createElement('p')
        p.textContent = item.text
        container.appendChild(p)
      }
    }
  })

  return container.outerHTML
}

/**
 * Parse OOXML content and extract paragraphs along with formatting details.
 * @param {string} xmlString - The OOXML document as a string.
 * @return {Array} Array of objects representing paragraphs.
 */
function parseOOXML(xmlString: string) {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml')

  // Locate the <pkg:xmlData> element. Note the escaping for the colon.
  const xmlDataList = xmlDoc.querySelectorAll('pkg\\:xmlData, xmlData')
  console.log('#'.repeat(45), { xmlDataList })
  if (!xmlDataList.length) {
    console.error('No xmlData found in the document.')
    return []
  }

  let results: any[] = []
  xmlDataList.forEach((xmlData) => {
    // Assume paragraphs are represented with <w:p> elements.
    const paragraphs = xmlData.getElementsByTagName('w:p')
    const content = []

    console.log('#'.repeat(45), { paragraphs })

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
      console.log('#'.repeat(45), {
        pushedContent: {
          text: paraText,
          isHeading,
          headingLevel,
          isList,
        },
      })
    }
    results = results.concat(content)
  })

  return results
}
