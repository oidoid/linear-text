import {App} from './app'
import {en} from 'make-plural/plurals'
import {i18n} from '@lingui/core'
import {I18nProvider} from '@lingui/react'
import {Provider} from 'react-redux'
import {render, screen} from '@testing-library/react'
import {store} from '../../store/store'
import {messages as stringsEn} from '../../locales/en'

beforeEach(() => {
  i18n.loadLocaleData('en', {plurals: en})
  i18n.load({en: stringsEn})
  i18n.activate('en')
})

test('matches snapshot', () => {
  render(
    <Provider store={store}>
      <I18nProvider i18n={i18n}>
        <App data-testid='app' />
      </I18nProvider>
    </Provider>
  )
  expect(screen.getByTestId('app')).toMatchSnapshot()
})
