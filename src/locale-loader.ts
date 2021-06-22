import {
  fromUrl,
  fromStorage,
  fromNavigator,
  multipleDetect
} from '@lingui/detect-locale'
import {en, cs} from 'make-plural/plurals'
import {messages as stringsEn} from './locales/en'
import {messages as stringsEs} from './locales/es'
import {i18n} from '@lingui/core'

export function loadLocales() {
  i18n.loadLocaleData('en', {plurals: en})
  i18n.loadLocaleData('cs', {plurals: cs})
  i18n.load({en: stringsEn, es: stringsEs})

  const locales = multipleDetect(
    fromUrl('lang'),
    fromStorage('lang'),
    fromNavigator(),
    'en'
  )
  i18n.activate('en', locales)
}
