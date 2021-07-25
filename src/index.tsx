import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {AppElement} from './elements/app-element/app-element'
import {reportWebVitals} from './web-vitals-reporter'
import {version} from '../package.json'
import {i18n} from '@lingui/core'
import {t} from '@lingui/macro'
import {I18nProvider} from '@lingui/react'
import {loadLocales} from './locale-loader'
import {store} from './store/store'
import {Provider as StoreProvider} from 'react-redux'
import * as serviceWorker from './serviceWorker'

loadLocales()

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <I18nProvider i18n={i18n}>
        <AppElement />
      </I18nProvider>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

console.log(`${t`app-title-with-${version}`}
by ┌>°┐
   │  │idoid
   └──┘`)
