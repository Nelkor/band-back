export const parseJson = <T>(source: string): T => {
  try {
    return JSON.parse(source) || Object.create(null)
  } catch (e) {
    return Object.create(null)
  }
}
