import {Disclosure} from './disclosure'
import {fireEvent, render, screen} from '@testing-library/react'

test('matches snapshot', () => {
  render(
    <Disclosure data-testid='disclosure' summary='Summary'>
      Children
    </Disclosure>
  )
  const disclosure = screen.getByTestId('disclosure')
  expect(disclosure).toMatchSnapshot()
})

test('renders summary and children', () => {
  render(
    <Disclosure data-testid='disclosure' open summary='Summary'>
      Children
    </Disclosure>
  )
  const disclosure = screen.getByTestId('disclosure')
  expect(disclosure).toHaveTextContent('SummaryChildren')
})

test('reports toggle', () => {
  const onToggle = jest.fn()
  render(
    <Disclosure data-testid='disclosure' onToggle={onToggle} summary='Summary'>
      Children
    </Disclosure>
  )

  const disclosure = screen.getByTestId('disclosure')
  fireEvent(disclosure, new Event('toggle'))
  expect(onToggle).toHaveBeenCalledTimes(1)
})
