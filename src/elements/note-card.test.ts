import {assert} from '@esm-bundle/chai'
import {NoteCard} from './note-card.js'

test('tag is defined', () => {
  const el = document.createElement('note-card')
  assert.instanceOf(el, NoteCard)
})
