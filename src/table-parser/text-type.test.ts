import {parseTextType} from './text-type'

test.each([
  ['empty', '', 'empty'],
  ['blank (space)', ' ', 'blank'],
  ['blank (tab)', '\t', 'blank'],
  ['bool (false, lowercase)', 'false', 'bool'],
  ['bool (true, uppercase)', 'TRUE', 'bool'],
  ['number (negative)', '-1', 'number'],
  ['number (zero)', '0', 'number'],
  ['number (float < 1)', '.333', 'number'],
  ['number (float = 1)', '1.0', 'number'],
  ['number (float > 1)', '1.5', 'number'],
  ['number (great)', '1e9', 'number'],
  ['number (hex)', '0xff', 'number'],
  ['text', 'abc', 'text']
])('%s', (_, text, expected) =>
  expect(parseTextType(text)).toStrictEqual(expected)
)
