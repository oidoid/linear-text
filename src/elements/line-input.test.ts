import {assert, expect, fixture} from '@open-wc/testing'
import {html} from 'lit'
import {LineInput} from './line-input.js'

it('tag is defined', () => {
  const el = document.createElement('line-input')
  assert.instanceOf(el, LineInput)
})

it('text input dispatches an edit', async () => {
  const el = await fixture<LineInput>(html`<line-input></line-input>`)
  const edit = await new Promise<CustomEvent<string>>(resolve => {
    el.addEventListener('edit-text', resolve)
    el.shadowRoot!.querySelector('p')!.dispatchEvent(
      new InputEvent('beforeinput', {data: 'abc', inputType: 'insertText'})
    )
  })
  expect(edit.detail).eq('abc')
})
