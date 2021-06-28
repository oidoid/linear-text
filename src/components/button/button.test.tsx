import {Button} from './button'
import {render, fireEvent, screen} from '@testing-library/react'

test('matches snapshot', () => {
  render(
    <Button data-testid='button' title='Title'>
      Label
    </Button>
  )
  const button = screen.getByTestId('button')
  expect(button).toMatchSnapshot()
})

test('renders children and title', () => {
  render(
    <Button data-testid='button' title='Title'>
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
    <Button data-testid='button' title='Title' onClick={onClick}>
      Label
    </Button>
  )
  fireEvent.click(screen.getByTestId('button'))
  expect(onClick).toHaveBeenCalledTimes(1)
})
