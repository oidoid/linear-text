import {IDFactory} from '../id/id-factory'
import {Line} from './line'

test('A newly constructed line is an empty divider.', () => {
  const line = Line(IDFactory())
  expect(line.text).toStrictEqual('')
  expect(line.state).toStrictEqual('divider')
})

test('An empty line is an empty divider.', () => {
  const line = Line(IDFactory(), false, '')
  expect(line.text).toStrictEqual('')
  expect(line.state).toStrictEqual('divider')
})

test('An undefined line is an empty divider.', () => {
  const line = Line(IDFactory(), undefined)
  expect(line.text).toStrictEqual('')
  expect(line.state).toStrictEqual('divider')
})

test('A nonempty line is a nonempty note.', () => {
  const line = Line(IDFactory(), false, 'abc')
  expect(line.text).toStrictEqual('abc')
  expect(line.state).toStrictEqual('note')
})

test('An empty draft is a draft.', () => {
  const line = Line(IDFactory(), true)
  expect(line.state).toStrictEqual('draft')
})

test('Setting a note to empty changes it to a draft.', () => {
  const line = Line(IDFactory(), false, 'abc')
  expect(line.state).toStrictEqual('note')
  Line.setText(line, '')
  expect(line.state).toStrictEqual('draft')
})

test('Setting a divider to empty retains it as a divider.', () => {
  const line = Line(IDFactory())
  expect(line.state).toStrictEqual('divider')
  Line.setText(line, '')
  expect(line.state).toStrictEqual('divider')
})

test('Newlines are forbidden on construction.', () =>
  expect(() => Line(IDFactory(), false, 'abc\n')).toThrow())

test('Newlines cannot be set.', () => {
  const line = Line(IDFactory(), false, 'abc')
  expect(() => Line.setText(line, 'abc\n')).toThrow()
})
