import {XY} from './xy'

test.each([
  [XY(-2, -1), '(-2, -1)'],
  [XY(0, 1), '(0, 1)'],
  [XY(2, 3), '(2, 3)'],
  [XY(4.4, 5.5), '(4.4, 5.5)']
])('Format %p.', (xy, expected) =>
  expect(XY.format(xy)).toStrictEqual(expected)
)
