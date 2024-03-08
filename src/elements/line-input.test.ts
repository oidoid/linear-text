import {assert, expect} from '@esm-bundle/chai'
import {html, render, type PropertyValues} from 'lit'
import {TextTree, type Line} from '../tree/text-tree.js'
import {LineInput} from './line-input.js'
import {pressKey} from './test/element-test-util.js'

test('tag is defined', () => {
  const el = document.createElement('line-input')
  assert.instanceOf(el, LineInput)
})

test('a line is rendered', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  using fix = await lineInputFixture(line)
  expect(fix.el.line).equal(line)
  expect(fix.p.textContent).equal('abc')
})

test('a new line is rendered', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  using fix = await lineInputFixture(line)
  fix.el.line = {...line, text: 'def'}
  await fix.el.updateComplete
  expect(fix.p.textContent).equal('def')
})

test('text input dispatches an edit', async () => {
  using fix = await lineInputFixture()
  fix.p.focus()
  const edit = await new Promise<CustomEvent<string>>(async resolve => {
    fix.el.addEventListener('edit-text', resolve)
    await pressKey('a')
  })
  expect(edit.detail).equal('a')
})

test('a newline dispatches a break', async () => {
  using fix = await lineInputFixture()
  fix.p.focus()
  await pressKey(...'abc')
  const edit = await new Promise<CustomEvent<number>>(async resolve => {
    fix.el.addEventListener('break-text', resolve)
    await pressKey('\n')
  })
  expect(edit.detail).equal(3)
})

test('a newline dispatches a break at the cursor position', async () => {
  using fix = await lineInputFixture()
  fix.p.focus()
  await pressKey(...'abc', 'ArrowLeft', 'ArrowLeft')
  const edit = await new Promise<CustomEvent<number>>(async resolve => {
    fix.el.addEventListener('break-text', resolve)
    await pressKey('\n')
  })
  expect(edit.detail).equal(1)
})

test('text input renders', async () => {
  using fix = await lineInputFixture()
  fix.p.focus()
  await pressKey('a')
  expect(fix.p.textContent).equal('a')
})

test('updated text input renders', async () => {
  using fix = await lineInputFixture()
  fix.p.focus()
  await pressKey(...'abc')
  expect(fix.p.textContent).equal('abc')
})

test('backspace removes backwards', async () => {
  using fix = await lineInputFixture()
  fix.p.focus()
  await pressKey(...'abc', 'Backspace')
  expect(fix.p.textContent).equal('ab')
})

test('delete removes forwards', async () => {
  using fix = await lineInputFixture()
  fix.p.focus()
  await pressKey(...'abc', 'Home', 'Delete')
  expect(fix.p.textContent).equal('bc')
})

test('escape blurs', async () => {
  using fix = await lineInputFixture()
  fix.p.focus()
  expect(document.activeElement).equal(fix.el)
  await pressKey('Escape')
  expect(document.activeElement).not.equal(fix.el)
})

test('click focuses', async () => {
  using fix = await lineInputFixture()
  fix.el.click()
  expect(document.activeElement).equal(fix.el)
})

test('spellcheck is initially disabled', async () => {
  using fix = await lineInputFixture()
  expect(fix.p.spellcheck).equal(false)
})

test('focus dispatches', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  using fix = await lineInputFixture(line)
  const focus = await new Promise<CustomEvent<Line>>(resolve => {
    fix.el.addEventListener('focus-line', resolve)
    fix.p.focus()
  })
  await fix.el.updateComplete
  expect(focus.detail).equal(line)
})

test('focus enables spellcheck', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  using fix = await lineInputFixture(line)
  expect(fix.p.spellcheck).equal(false)
  fix.p.focus()
  await fix.el.updateComplete
  expect(fix.p.spellcheck).equal(true)
})

test('blur dispatches', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  using fix = await lineInputFixture(line)
  fix.p.focus()
  await fix.el.updateComplete
  const blur = await new Promise<CustomEvent<Line>>(resolve => {
    fix.el.addEventListener('blur-line', resolve)
    fix.p.blur()
  })
  await fix.el.updateComplete
  expect(blur.detail).equal(line)
})

test('blur disables spellcheck', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  using fix = await lineInputFixture(line)
  fix.p.focus()
  await fix.el.updateComplete
  expect(fix.p.spellcheck).equal(true)
  fix.p.blur()
  await fix.el.updateComplete
  expect(fix.p.spellcheck).equal(false)
})

test('blur clears selection', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  using fix = await lineInputFixture(line)
  fix.p.focus()
  await fix.el.updateComplete
  const sel = fix.el.getSelection()!
  sel.selectAllChildren(fix.p)
  expect(sel.focusNode!.textContent).equal('abc')
  fix.p.blur()
  await fix.el.updateComplete
  expect(sel.focusNode).equal(null)
})

test('providing text that matches input does not re-render', async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  using fix = await lineInputFixture(line)
  const updatable = fix.el as unknown as {
    shouldUpdate(props: PropertyValues): boolean
  }

  fix.el.line = line
  expect(updatable.shouldUpdate(new Map([['line', line]]))).equal(false)
  fix.p.focus()
  await pressKey(...'def')
  fix.el.line = {...line, text: 'abcdef'}
  expect(updatable.shouldUpdate(new Map([['line', fix.el.line]]))).equal(false)
})

test("providing text that doesn't match input re-renders", async () => {
  const line = <Line>TextTree('abc', 2).down[0]!.down[0]
  using fix = await lineInputFixture(line)
  const updatable = fix.el as unknown as {
    shouldUpdate(props: PropertyValues): boolean
  }

  fix.el.line = line
  expect(updatable.shouldUpdate(new Map([['line', line]]))).equal(false)
  fix.p.focus()
  await pressKey(...'def')
  expect(updatable.shouldUpdate(new Map([['line', fix.el.line]]))).equal(true)
})

// to-do: test focus when line is context.focus and start / end of line
// to-do: test for insertText of abc\n\def\nghi
// to-do: test for insertFromPaste
// to-do: test text selection operations like delete and select + enter
// to-do: test focus behavior when empty / nonempty
// to-do: test focus when context matches
// to-do: look at implementation again less for logic and more for important
//        behavior that shouldn't regress.

async function lineInputFixture(
  line?: Readonly<Line>
): Promise<{el: LineInput; p: HTMLParagraphElement} & Disposable> {
  const root = document.createElement('div')
  document.body.append(root)
  render(html`<line-input .line=${line}></line-input>`, root)
  const el = document.querySelector<LineInput>('line-input')!
  await el.updateComplete
  const p = el.renderRoot!.querySelector('p')!
  return {el, p, [Symbol.dispose]: () => root.remove()}
}
