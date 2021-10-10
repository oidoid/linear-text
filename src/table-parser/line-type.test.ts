import {parseLineType} from './line-type'

test.each([
  ['empty', '', 'empty'],
  ['blank (space)', ' ', 'blank'],
  ['blank (tab)', '\t', 'blank'],
  ['boolean (false, lowercase)', 'false', 'boolean'],
  ['boolean (true, uppercase)', 'TRUE', 'boolean'],
  ['number (negative)', '-1', 'number'],
  ['number (zero)', '0', 'number'],
  ['number (float < 1)', '.333', 'number'],
  ['number (float = 1)', '1.0', 'number'],
  ['number (float > 1)', '1.5', 'number'],
  ['number (great)', '1e9', 'number'],
  ['number (hex)', '0xff', 'number'],
  ['text', 'abc', 'text'],
  ['text (no period in image extension)', 'abcgif', 'text'],
  ['text (no stem)', '.gif', 'text'],
  ['image', 'abc.gif', 'image'],
  ['image (data)', 'data:image/gif;title=Title;base64,abc=', 'image'],
  ['image (http)', 'https://example.com/abc.gif', 'image'],
  ['image (file)', 'file:///home/user/abc.gif', 'image'],
  ['uri-data', 'data:', 'uri-data'],
  ['uri-http (HTTP)', 'http://lineartext.com', 'uri-http'],
  ['uri-http (HTTPS)', 'https://lineartext.com', 'uri-http'],
  ['uri-file', 'file://', 'uri-file']
])('%s', (_, text, expected) =>
  expect(parseLineType(text)).toStrictEqual(expected)
)
