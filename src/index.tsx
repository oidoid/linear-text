import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {App} from './components/app/app'
import {reportWebVitals} from './web-vitals-reporter'
import {version} from '../package.json'
import {i18n} from '@lingui/core'
import {t} from '@lingui/macro'
import {I18nProvider} from '@lingui/react'
import {loadLocales} from './locale-loader'

loadLocales()

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
