import {ButtonElement} from './button-element'
import {render, screen} from '@testing-library/react'

test('matches snapshot', () => {
  render(
    <ButtonElement data-testid='button' onClick={() => {}} title='Title'>
      Label
    </ButtonElement>
  )
  const button = screen.getByTestId('button')
  expect(button).toMatchSnapshot()
})

test('renders children and title', () => {
  render(
    <ButtonElement data-testid='button' onClick={() => {}} title='Title'>
      Label
    </ButtonElement>
  )
  const button = screen.getByTestId('button')
  expect(button).toHaveTextContent('Label')
  expect(button).toHaveAttribute('title', 'Title')
})

test('reports clicks', () => {
  const onClick = jest.fn()
  render(
    <ButtonElement data-testid='button' onClick={onClick} title='Title'>
      Label
    </ButtonElement>
  )
  screen.getByTestId('button').click()
  expect(onClick).toHaveBeenCalledTimes(1)
})
