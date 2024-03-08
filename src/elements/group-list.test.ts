import {assert} from '@esm-bundle/chai'
import {GroupList} from './group-list.js'

test('tag is defined', () => {
  const el = document.createElement('group-list')
  assert.instanceOf(el, GroupList)
})
