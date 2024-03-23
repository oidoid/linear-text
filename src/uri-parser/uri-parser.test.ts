import {expect, test} from 'vitest'
import {parseDataURI} from './uri-parser.js'

for (const [name, uri, expected] of <const>[
  [
    'empty data URI',
    'data:,',
    {
      scheme: 'data',
      mediaType: undefined,
      mimeType: undefined,
      params: {},
      encoding: undefined,
      data: ''
    }
  ],
  [
    'text',
    'data:,abc',
    {
      scheme: 'data',
      mediaType: undefined,
      mimeType: undefined,
      params: {},
      encoding: undefined,
      data: 'abc'
    }
  ],
  [
    'Wikipedia example 0',
    'data:text/vnd-example+xyz;foo=bar;base64,R0lGODdh',
    {
      scheme: 'data',
      mediaType: 'text/vnd-example+xyz;foo=bar',
      mimeType: 'text/vnd-example+xyz',
      params: {foo: 'bar'},
      encoding: 'base64',
      data: 'R0lGODdh'
    }
  ],
  [
    'Wikipedia example 1',
    'data:text/plain;charset=UTF-8;page=21,the%20data:1234,5678',
    {
      scheme: 'data',
      mediaType: 'text/plain;charset=UTF-8;page=21',
      mimeType: 'text/plain',
      params: {charset: 'UTF-8', page: '21'},
      encoding: undefined,
      data: 'the%20data:1234,5678'
    }
  ],
  [
    'Wikipedia example 2',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
    {
      scheme: 'data',
      mediaType: 'image/png',
      mimeType: 'image/png',
      params: {},
      encoding: 'base64',
      data: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    }
  ],
  ['missing protocol', ',', undefined],
  ['missing separator', 'data:', undefined]
])
  test(name, () => expect(parseDataURI(uri)).toStrictEqual(expected))
