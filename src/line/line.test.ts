import {IDFactory} from '../id/id-factory'
import {Line} from './line'

test('A newly constructed line is empty.', () =>
  expect(Line.isEmpty(Line(IDFactory(), {text: 0}, 'note'))).toStrictEqual(
    true
  ))

test('An empty line is empty.', () =>
  expect(Line.isEmpty(Line(IDFactory(), {text: 0}, 'note', ''))).toStrictEqual(
    true
  ))

test('An undefined line is empty.', () =>
  expect(
    Line.isEmpty(Line(IDFactory(), {text: 0}, 'note', undefined))
  ).toStrictEqual(true))

test('Setting a note to empty changes it to a draft.', () => {
  const line = Line(IDFactory(), {text: 0}, 'note', 'abc')
  Line.setText(line, {text: 0}, '')
  expect(line.state).toStrictEqual('draft')
})
