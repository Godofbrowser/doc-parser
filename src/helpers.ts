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
