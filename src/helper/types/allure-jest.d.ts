declare module 'allure-jest' {
  export const allure: {
    attachment: (name: string, content: string, type?: string) => void
    step: (name: string, body: () => void) => void
    epic: (name: string) => void
    feature: (name: string) => void
    story: (name: string) => void
    severity: (level: string) => void
    description: (text: string) => void
    label: (name: string, value: string) => void
  }
}
