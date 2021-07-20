import {IDFactory} from '../id/id-factory'
import {Line} from './line'

test('A newly constructed line is empty.', () =>
  expect(Line.isEmpty(Line(IDFactory()))).toStrictEqual(true))

test('An empty line is empty.', () =>
  expect(Line.isEmpty(Line(IDFactory(), ''))).toStrictEqual(true))

test('An undefined line is empty.', () =>
  expect(Line.isEmpty(Line(IDFactory(), undefined))).toStrictEqual(true))
