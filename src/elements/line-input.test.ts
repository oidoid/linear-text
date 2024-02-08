import {assert, expect, fixture, html} from '@open-wc/testing'
import {TextTree, type Line} from '../tree/text-tree.js'
import {LineInput} from './line-input.js'
import {pressKeys} from './test/element-test-util.js'

it('tag is defined', () => {
  const el = document.createElement('line-input')
  assert.instanceOf(el, LineInput)
})

it('a line is rendered', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  const {el, p} = await lineInputFixture(line)
  expect(el.line).equal(line)
  expect(p.textContent).equal('abc')
})

it('a new line is rendered', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  const {el, p} = await lineInputFixture(line)
  el.line = {...line, text: 'def'}
  await el.updateComplete
  expect(p.textContent).equal('def')
})

it('text input dispatches an edit', async () => {
  const {el, p} = await lineInputFixture()
  const edit = await new Promise<CustomEvent<string>>(resolve => {
    el.addEventListener('edit-text', resolve)
    p.dispatchEvent(TextEvent('abc'))
  })
  expect(edit.detail).equal('abc')
})

it('a newline dispatches a break', async () => {
  const {el, p} = await lineInputFixture()
  p.dispatchEvent(TextEvent('abc'))
  const edit = await new Promise<CustomEvent<number>>(resolve => {
    el.addEventListener('break-text', resolve)
    p.dispatchEvent(TextEvent('', 'insertLineBreak'))
  })
  expect(edit.detail).equal(3)
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
  expect(edit.detail).equal(1)
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

it('escape blurs', async () => {
  const {el, p} = await lineInputFixture()
  p.focus()
  expect(document.activeElement).equal(el)
  await pressKeys('Escape')
  expect(document.activeElement).not.equal(el)
})

it('click focuses', async () => {
  const {el} = await lineInputFixture()
  el.click()
  expect(document.activeElement).equal(el)
})

it('spellcheck is initially disabled', async () => {
  const {p} = await lineInputFixture()
  expect(p.spellcheck).equal(false)
})

it('focus dispatches', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  const {el, p} = await lineInputFixture(line)
  const focus = await new Promise<CustomEvent<Line>>(resolve => {
    el.addEventListener('focus-line', resolve)
    p.focus()
  })
  await el.updateComplete
  expect(focus.detail).equal(line)
})

it('focus enables spellcheck', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  const {el, p} = await lineInputFixture(line)
  expect(p.spellcheck).equal(false)
  p.focus()
  await el.updateComplete
  expect(p.spellcheck).equal(true)
})

it('blur dispatches', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  const {el, p} = await lineInputFixture(line)
  p.focus()
  await el.updateComplete
  const blur = await new Promise<CustomEvent<Line>>(resolve => {
    el.addEventListener('blur-line', resolve)
    p.blur()
  })
  await el.updateComplete
  expect(blur.detail).equal(line)
})

it('blur disables spellcheck', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  const {el, p} = await lineInputFixture(line)
  p.focus()
  await el.updateComplete
  expect(p.spellcheck).equal(true)
  p.blur()
  await el.updateComplete
  expect(p.spellcheck).equal(false)
})

it('blur clears selection', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  const {el, p} = await lineInputFixture(line)
  p.focus()
  await el.updateComplete
  const sel = el.getSelection()!
  sel.selectAllChildren(p)
  expect(sel.focusNode!.textContent).equal('abc')
  p.blur()
  await el.updateComplete
  expect(sel.focusNode).equal(null)
})

// to-do: entering text does not trigger re-render.
// to-do: test focus when line is context.focus and start / end of line
// to-do: test for insertText of abc\n\def\nghi
// to-do: test for insertFromPaste
// to-do: test text selection operations like delete and select + enter
// to-do: test focus behavior when empty / nonempty
// to-do: test focus when context matches
// to-do: look at implementation again less for logic and more for important
//        behavior that shouldn't regress.

async function lineInputFixture(line?: Readonly<Line>): Promise<{
  el: LineInput
  p: HTMLParagraphElement
}> {
  const el = await fixture<LineInput>(
    html`<line-input .line=${line}></line-input>`
  )
  const p = el.renderRoot!.querySelector('p')!
  return {el, p}
}

function TextEvent(
  text: string,
  inputType: 'insertText' | 'insertLineBreak' = 'insertText'
): InputEvent {
  return new InputEvent('beforeinput', {data: text, inputType})
}
