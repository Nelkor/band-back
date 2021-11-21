import { appendFile } from 'fs'

const createLogger = (filename: string) => (text: string) => {
  const path = `/log/${filename}`
  const content = `${new Date().toLocaleString()}: ${text}\n`

  // Boolean as no operation
  appendFile(path, content, Boolean)
}

export const log = createLogger('application.log')
