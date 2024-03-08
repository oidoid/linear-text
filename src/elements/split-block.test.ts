import {assert} from '@esm-bundle/chai'
import {SplitBlock} from './split-block.js'

test('tag is defined', () => {
  const el = document.createElement('split-block')
  assert.instanceOf(el, SplitBlock)
})
