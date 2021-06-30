import {Button} from './button'
import {render, screen} from '@testing-library/react'

test('matches snapshot', () => {
  render(
    <Button data-testid='button' onClick={() => {}} title='Title'>
      Label
    </Button>
  )
  const button = screen.getByTestId('button')
  expect(button).toMatchSnapshot()
})

test('renders children and title', () => {
  render(
    <Button data-testid='button' onClick={() => {}} title='Title'>
      Label
    </Button>
  )
  const button = screen.getByTestId('button')
  expect(button).toHaveTextContent('Label')
  expect(button).toHaveAttribute('title', 'Title')
})

test('reports clicks', () => {
  const onClick = jest.fn()
  render(
    <Button data-testid='button' onClick={onClick} title='Title'>
      Label
    </Button>
  )
  screen.getByTestId('button').click()
  expect(onClick).toHaveBeenCalledTimes(1)
})
