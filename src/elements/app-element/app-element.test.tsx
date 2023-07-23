import {render, screen} from '@testing-library/react'
import {Provider} from 'react-redux'
import {store} from '../../store/store'
import {AppElement} from './app-element'

test('matches snapshot', () => {
  render(
    <Provider store={store}>
      <AppElement data-testid='app' />
    </Provider>
  )
  expect(screen.getByTestId('app')).toMatchSnapshot()
})
