import { ref } from 'vue'
import { defineStore } from 'pinia'
import { parseDocumentXML } from '../helpers'

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
    isParsing.value = true
    rawXml.value = xmlString

    parsedContent.value = parseDocumentXML(xmlString)
    isParsing.value = false
  }

  return { rawXml, parsedContent, parseXml, isParsing }
})
