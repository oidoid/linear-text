import {assert} from '@esm-bundle/chai'
import {DragLine} from './drag-line.js'

test('tag is defined', () => {
  const el = document.createElement('drag-line')
  assert.instanceOf(el, DragLine)
})
