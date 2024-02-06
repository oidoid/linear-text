import {assert, expect, fixture, html} from '@open-wc/testing'
import {LineInput} from './line-input.js'
import {pressKeys} from './test/element-test-util.js'

it('tag is defined', () => {
  const el = document.createElement('line-input')
  assert.instanceOf(el, LineInput)
})

it('text input dispatches an edit', async () => {
  const {el, p} = await lineInputFixture()
  const edit = await new Promise<CustomEvent<string>>(resolve => {
    el.addEventListener('edit-text', resolve)
    p.dispatchEvent(TextEvent('abc'))
  })
  expect(edit.detail).eq('abc')
})

it('a newline dispatches a break', async () => {
  const {el, p} = await lineInputFixture()
  p.dispatchEvent(TextEvent('abc'))
  const edit = await new Promise<CustomEvent<number>>(resolve => {
    el.addEventListener('break-text', resolve)
    p.dispatchEvent(TextEvent('', 'insertLineBreak'))
  })
  expect(edit.detail).eq(3)
})

it('a newline dispatches a break at the cursor position', async () => {
  const {el, p} = await lineInputFixture()
  p.focus()
  p.dispatchEvent(TextEvent('abc'))
  await pressKeys('ArrowLeft', 'ArrowLeft')
  const edit = await new Promise<CustomEvent<number>>(resolve => {
    el.addEventListener('break-text', resolve)
    p.dispatchEvent(TextEvent('', 'insertLineBreak'))
  })
  expect(edit.detail).eq(1)
})

it('text input renders', async () => {
  const {p} = await lineInputFixture()
  p.dispatchEvent(TextEvent('abc'))
  expect(p.textContent).equal('abc')
})

it('updated text input renders', async () => {
  const {p} = await lineInputFixture()
  p.dispatchEvent(TextEvent('abc'))
  p.dispatchEvent(TextEvent('def'))
  expect(p.textContent).equal('abcdef')
})

it('backspace removes backwards', async () => {
  const {p} = await lineInputFixture()
  p.dispatchEvent(TextEvent('abc'))
  await pressKeys('Backspace')
  expect(p.textContent).equal('ab')
})

it('delete removes forwards', async () => {
  const {p} = await lineInputFixture()
  p.dispatchEvent(TextEvent('abc'))
  await pressKeys('Home', 'Delete')
  expect(p.textContent).equal('bc')
})

// to-do: test for insertText of abc\n\def\nghi
// to-do: test for rich text and other insert commands noted in beforeinput
//        callback.
// to-do: test copy and paste
// to-do: test text selection operations like delete
// to-do: test focus behavior when empty / nonempty

async function lineInputFixture(): Promise<{
  el: LineInput
  p: HTMLParagraphElement
}> {
  const el = await fixture<LineInput>(html`<line-input></line-input>`)
  const p = el.shadowRoot!.querySelector('p')!
  return {el, p}
}

function TextEvent(
  text: string,
  // to-do: all of these
  inputType: 'insertText' | 'insertLineBreak' = 'insertText'
): InputEvent {
  return new InputEvent('beforeinput', {data: text, inputType})
}
