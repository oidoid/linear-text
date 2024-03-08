import {assert} from '@esm-bundle/chai'
import {TextEditor} from './text-editor.js'

test('tag is defined', () => {
  const el = document.createElement('text-editor')
  assert.instanceOf(el, TextEditor)
})
