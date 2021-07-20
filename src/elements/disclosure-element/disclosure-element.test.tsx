import {DisclosureElement} from './disclosure-element'
import {fireEvent, render, screen} from '@testing-library/react'

test('matches snapshot', () => {
  render(
    <DisclosureElement data-testid='disclosure' summary='Summary'>
      Children
    </DisclosureElement>
  )
  const disclosure = screen.getByTestId('disclosure')
  expect(disclosure).toMatchSnapshot()
})

test('renders summary and children', () => {
  render(
    <DisclosureElement data-testid='disclosure' open summary='Summary'>
      Children
    </DisclosureElement>
  )
  const disclosure = screen.getByTestId('disclosure')
  expect(disclosure).toHaveTextContent('SummaryChildren')
})

test('reports toggle', () => {
  const onToggle = jest.fn()
  render(
    <DisclosureElement
      data-testid='disclosure'
      onToggle={onToggle}
      summary='Summary'
    >
      Children
    </DisclosureElement>
  )

  const disclosure = screen.getByTestId('disclosure')
  fireEvent(disclosure, new Event('toggle'))
  expect(onToggle).toHaveBeenCalledTimes(1)
})
