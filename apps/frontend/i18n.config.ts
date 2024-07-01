import { availableLocales, datetimeFormats, defaultLocale, numberFormats } from './src/i18n'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  availableLocales,
  numberFormats,
  datetimeFormats,
  pluralizationRules: {
    ru: (choice: number, choicesLength: number) => {
      let pluralizationResult = 0
      const teen = choice > 10 && choice < 20
      const endsWithOne = choice % 10 === 1

      if (choice === 0)
        pluralizationResult = 0

      else if (!teen && endsWithOne)
        pluralizationResult = 1

      else if (!teen && choice % 10 >= 2 && choice % 10 <= 4)
        pluralizationResult = 2

      else
        pluralizationResult = choicesLength < 4 ? 2 : 3

      return pluralizationResult
    },
  },
}))
