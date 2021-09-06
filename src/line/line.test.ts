import {IDFactory} from '../id/id-factory'
import {Line} from './line'

test('A newly constructed line is empty.', () => {
  const line = Line(IDFactory())
  expect(line.text).toStrictEqual('')
  expect(Line.isEmpty(line)).toStrictEqual(true)
})

test('A nonempty line is not empty.', () => {
  const line = Line(IDFactory(), 'abc')
  expect(line.text).toStrictEqual('abc')
  expect(Line.isEmpty(line)).toStrictEqual(false)
})

test('Newlines are forbidden on construction.', () =>
  expect(() => Line(IDFactory(), 'abc\n')).toThrow())

test('Newlines cannot be set.', () => {
  const line = Line(IDFactory(), 'abc')
  expect(() => Line.setText(line, 'abc\n')).toThrow()
})
