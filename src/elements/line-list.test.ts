import {assert} from '@esm-bundle/chai'
import {LineList} from './line-list.js'

test('tag is defined', () => {
  const el = document.createElement('line-list')
  assert.instanceOf(el, LineList)
})
