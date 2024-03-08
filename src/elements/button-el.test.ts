import {assert} from '@esm-bundle/chai'
import {ButtonEl} from './button-el.js'

test('tag is defined', () => {
  const el = document.createElement('button-el')
  assert.instanceOf(el, ButtonEl)
})
