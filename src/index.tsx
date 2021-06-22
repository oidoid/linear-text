import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {version} from '../package.json'
import {messages as stringsEn} from './locales/en'
import {messages as stringsEs} from './locales/es'
import {i18n} from '@lingui/core'
import {t} from '@lingui/macro'
import {I18nProvider} from '@lingui/react'
import {
  multipleDetect,
  fromUrl,
  fromStorage,
  fromNavigator
} from '@lingui/detect-locale'
import {en, cs} from 'make-plural/plurals'

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

ReactDOM.render(
  <React.StrictMode>
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

console.log(`${t`title-with-${version}`}
by ┌>°┐
   │  │idoid
   └──┘`)
