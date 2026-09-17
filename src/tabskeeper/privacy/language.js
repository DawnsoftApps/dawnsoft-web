export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'zh-Hans', label: '简体中文' },
  { value: 'zh-Hant', label: '繁體中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
]

const exactLanguages = new Map(
  languageOptions.map(({ value }) => [value.toLowerCase(), value]),
)

export function normalizeLanguage(value) {
  if (!value) return null

  const language = value.replaceAll('_', '-').toLowerCase()
  const exact = exactLanguages.get(language)
  if (exact) return exact

  if (language.startsWith('zh')) {
    if (language.includes('hant') || /-(tw|hk|mo)(-|$)/.test(language)) {
      return 'zh-Hant'
    }
    return 'zh-Hans'
  }

  return languageOptions.find(({ value }) =>
    language.startsWith(`${value.toLowerCase()}-`),
  )?.value ?? null
}
export function resolveLanguage(search, preferredLanguages = []) {
  const requested = new URLSearchParams(search).get('lang')
  if (requested !== null) return normalizeLanguage(requested) ?? 'en'

  for (const language of preferredLanguages) {
    const supported = normalizeLanguage(language)
    if (supported) return supported
  }

  return 'en'
}
