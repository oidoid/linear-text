import {DisclosureElement} from './disclosure-element'
import {fireEvent, render, screen} from '@testing-library/react'

test('Matches snapshot.', () => {
  render(
    <DisclosureElement data-testid='disclosure' summary='Summary' title='Title'>
      Children
    </DisclosureElement>
  )
  const disclosure = screen.getByTestId('disclosure')
  expect(disclosure).toMatchSnapshot()
})

test('Renders summary and children.', () => {
  render(
    <DisclosureElement
      data-testid='disclosure'
      open
      summary='Summary'
      title='Title'
    >
      Children
    </DisclosureElement>
  )
  const disclosure = screen.getByTestId('disclosure')
  expect(disclosure).toHaveTextContent('SummaryChildren')
})

test('Reports toggle.', () => {
  const onToggle = jest.fn()
  render(
    <DisclosureElement
      data-testid='disclosure'
      onToggle={onToggle}
      summary='Summary'
      title='Title'
    >
      Children
    </DisclosureElement>
  )

  const disclosure = screen.getByTestId('disclosure')
  fireEvent(disclosure, new Event('toggle'))
  expect(onToggle).toHaveBeenCalledTimes(1)
})
