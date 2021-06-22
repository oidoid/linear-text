import {render, screen} from '@testing-library/react'
import App from './App'
import {messages as stringsEn} from './locales/en'
import {en} from 'make-plural/plurals'
import {i18n} from '@lingui/core'
import {I18nProvider} from '@lingui/react'

beforeEach(() => {
  i18n.loadLocaleData('en', {plurals: en})
  i18n.load({en: stringsEn})
  i18n.activate('en')
})

test('renders learn react link', () => {
  render(
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  )
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})

test('matches snapshot', () => {
  const app = render(
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  )
  expect(app.container).toMatchSnapshot()
})
