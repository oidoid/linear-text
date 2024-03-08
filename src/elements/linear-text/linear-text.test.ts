import {assert} from '@esm-bundle/chai'
import {LinearText} from './linear-text.js'

test('tag is defined', () => {
  const el = document.createElement('linear-text')
  assert.instanceOf(el, LinearText)
})
