import {assert} from '@esm-bundle/chai'
import {AppMenu} from './app-menu.js'

test('tag is defined', () => {
  const el = document.createElement('app-menu')
  assert.instanceOf(el, AppMenu)
})
