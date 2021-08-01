import {IDFactory} from '../id/id-factory'
import {Line} from './line'

test('A newly constructed line is an empty divider.', () => {
  const line = Line(IDFactory(), {text: 0})
  expect(Line.isEmpty(line)).toStrictEqual(true)
  expect(line.state).toStrictEqual('divider')
})

test('An empty line is an empty divider.', () => {
  const line = Line(IDFactory(), {text: 0}, false, '')
  expect(Line.isEmpty(line)).toStrictEqual(true)
  expect(line.state).toStrictEqual('divider')
})

test('An undefined line is an empty divider.', () => {
  const line = Line(IDFactory(), {text: 0}, undefined)
  expect(Line.isEmpty(line)).toStrictEqual(true)
  expect(line.state).toStrictEqual('divider')
})

test('A nonempty line is a nonempty note.', () => {
  const line = Line(IDFactory(), {text: 0}, false, 'abc')
  expect(Line.isEmpty(line)).toStrictEqual(false)
  expect(line.state).toStrictEqual('note')
})

test('An empty draft is a draft.', () => {
  const line = Line(IDFactory(), {text: 0}, true)
  expect(line.state).toStrictEqual('draft')
})

test('Setting a note to empty changes it to a draft.', () => {
  const line = Line(IDFactory(), {text: 0}, false, 'abc')
  expect(line.state).toStrictEqual('note')
  Line.setText(line, {text: 0}, '')
  expect(line.state).toStrictEqual('draft')
})

test('Setting a divider to empty retains it as a divider.', () => {
  const line = Line(IDFactory(), {text: 0})
  expect(line.state).toStrictEqual('divider')
  Line.setText(line, {text: 0}, '')
  expect(line.state).toStrictEqual('divider')
})

test("Setting a note's text changes the row.", () => {
  const line = Line(IDFactory(), {text: 0}, false, 'abc')
  expect(line.row[0]).toStrictEqual('abc')
  Line.setText(line, {text: 0}, 'def')
  expect(line.row[0]).toStrictEqual('def')
})

test("Setting a note's text to undefined deletes the column.", () => {
  const line = Line(IDFactory(), {text: 0}, false, 'abc')
  expect([...line.row]).toStrictEqual(['abc'])
  expect(line.row[0]).toStrictEqual('abc')
  Line.setText(line, {text: 0}, undefined)
  expect([...line.row]).toStrictEqual([undefined])
  expect(line.row[0]).toStrictEqual(undefined)
})

test("Setting a note's text sparsely sets the column.", () => {
  const line = Line(IDFactory(), {text: 2}, false, 'abc')
  expect([...line.row]).toStrictEqual([undefined, undefined, 'abc'])
  expect(line.row[2]).toStrictEqual('abc')
  Line.setText(line, {text: 2}, 'def')
  expect([...line.row]).toStrictEqual([undefined, undefined, 'def'])
  expect(line.row[2]).toStrictEqual('def')
})

test("Setting a note's text to undefined deletes the sparse column.", () => {
  const line = Line(IDFactory(), {text: 2}, false, 'abc')
  expect([...line.row]).toStrictEqual([undefined, undefined, 'abc'])
  expect(line.row[2]).toStrictEqual('abc')
  Line.setText(line, {text: 2}, undefined)
  expect([...line.row]).toStrictEqual([undefined, undefined, undefined])
  expect(line.row[2]).toStrictEqual(undefined)
})

test("Setting a note's text to undefined deletes the sparse column but doesn't change subsequent columns.", () => {
  const line = Line(IDFactory(), {text: 2}, false, 'c', [
    'a',
    'b',
    '',
    'd',
    'e',
    'f'
  ])
  expect([...line.row]).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f'])
  expect(line.row[2]).toStrictEqual('c')
  expect(line.text).toStrictEqual('c')
  Line.setText(line, {text: 2}, undefined)
  expect([...line.row]).toStrictEqual(['a', 'b', undefined, 'd', 'e', 'f'])
  expect(line.row[2]).toStrictEqual(undefined)
  expect(line.text).toStrictEqual(undefined)
})
