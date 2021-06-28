import {App} from './app'
import {en} from 'make-plural/plurals'
import {messages as stringsEn} from '../../locales/en'
import {i18n} from '@lingui/core'
import {I18nProvider} from '@lingui/react'
import {render, screen} from '@testing-library/react'

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
  render(
    <I18nProvider i18n={i18n}>
      <App data-testid='app' />
    </I18nProvider>
  )
  expect(screen.getByTestId('app')).toMatchSnapshot()
})
