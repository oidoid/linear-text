import {assert} from '@esm-bundle/chai'
import {DragArea} from './drag-area.js'

test('tag is defined', () => {
  const el = document.createElement('drag-area')
  assert.instanceOf(el, DragArea)
})
