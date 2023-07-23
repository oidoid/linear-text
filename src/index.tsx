import React from 'react'
import ReactDOM from 'react-dom'
import {Provider as StoreProvider} from 'react-redux'
import {version} from '../package.json'
import {AppElement} from './elements/app-element/app-element'
import * as serviceWorker from './serviceWorker'
import {store} from './store/store'
import {reportWebVitals} from './web-vitals-reporter'

import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <AppElement />
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

console.log(`Linear Text v${version}
by ┌>°┐
   │  │idoid
   └──┘`)
