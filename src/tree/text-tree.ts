import { treeAdd, treeRemove, treeRoot, treeTouch } from './tree.ts'

/**
 * End of line; an empty line ("\n" or "\r\n"). These voids are tracked to allow
 * for spacing groups apart arbitrarily.
 *
 * Only editable in the text editor not the UI.
 *
 * Numerical IDs are used over symbols since they can be serialized. to-do: do I
 * need that? Is that even desirable for un/redo?
 */
export type EOL = {
  readonly end: LineEnding | ''
  readonly id: number
  readonly type: 'EOL'
  readonly up: Group
}

/**
 * Top-level array of lines with optional trailing EOLs.
 *
 * A group can be empty in the UI but is parsed out.
 *
 * Doesn't imply indentation.
 */
export type Group = {
  readonly down: (Line | EOL)[]
  readonly id: number
  readonly type: 'Group'
  readonly up: TextTree
}

/** Positive integral indentation width in spaces or tab. */
export type IndentW = number | 'Tab'

/**
 * A line of text and any subordinate lines. Lines can have empty text but are
 * parsed out.
 *
 * Indentation is implied by parent.
 */
export type Line = {
  readonly down: Line[]
  /** Line ending. */
  end: LineEnding | ''
  expand: boolean
  readonly id: number
  /** Integral indentation level. Spacing is synthesized on serialization. */
  indent: number
  text: string
  readonly type: 'Line'
  up: Line | Group
}

/**
 * Unix newline (\n) or Windows carriage return (\r) + newline.
 *
 * An encoding is used instead of escape sequences so snapshots don't get
 * jumbled.
 */
export type LineEnding = 'CRLF' | 'LF'

export type PositionLine = 'End' | 'In' | 'Start'

/**
 * A text file tree representation.
 *
 * This is a plain object without any methods since the store is expected to be
 * the only caller for mutations and the UI only reads.
 *
 * IDs are used to key the UI since changing an object reference would otherwise
 * disassociate an updated model from its UI.
 */
export type TextTree = {
  readonly down: Group[]
  readonly id: number
  readonly indentW: IndentW
  readonly type: 'TextTree'
}

export type IDFactory = () => number
export function IDFactory(): IDFactory {
  let id = 0
  return () => id++ // to-do: this could be a symbol but then can't serialize.
}
const factory: IDFactory = IDFactory()

export function TextTree(
  str: string,
  indentW: IndentW,
  id: IDFactory = factory,
): TextTree {
  const tree: TextTree = { down: [], id: id(), indentW, type: 'TextTree' }
  let prev: Line | undefined

  for (const { start, text, end } of split(str)) {
    if (!text && !start) {
      // EOL. Create group if none exists.
      const group = tree.down.at(-1) ??
        treeAdd<Group>({ id: id(), type: 'Group' }, tree, -1)
      treeAdd<EOL>({ id: id(), end, type: 'EOL' }, group, -1)
      continue
    }

    // Line

    const lineIndent = measureIndent(start, indentW)

    if (lineIndent && tree.down.at(-1)?.down.at(-1)?.type === 'EOL') {
      // Unexpected continuation (indent after EOL). Replace EOL with line as a
      // child of any previous line or group.
      const eol = treeRemove(tree.down.at(-1)!.down.at(-1)!)
      prev = treeAdd<Line>(
        {
          end: eol.end,
          expand: false,
          id: eol.id,
          indent: prev ? (prev.indent + 1) : 0,
          text: '',
          type: 'Line',
        },
        prev ?? eol.up,
        -1,
      )
    }

    if (
      tree.down.length === 0 ||
      tree.down.at(-1)!.down.at(-1)?.type === 'EOL'
    ) {
      // No group or last line was EOL.
      const group = treeAdd<Group>({ id: id(), type: 'Group' }, tree, -1)
      prev = treeAdd<Line>(
        { end, expand: false, id: id(), indent: 0, text, type: 'Line' },
        group,
        -1,
      )
      continue
    }

    // Parent is existing group / line.

    // Walk up tree by indent.
    while (prev!.up.type === 'Line' && lineIndent < prev!.indent) {
      prev = prev!.up
    }

    prev = treeAdd<Line>(
      {
        end,
        expand: false,
        id: id(),
        indent: lineIndent,
        text,
        type: 'Line',
      },
      // Indent matches a previous depth or previous depth was too deep?
      lineIndent <= prev!.indent
        ? prev!.up // Peer of line.
        : prev!, // Child of line.
      -1,
    )
  }

  return tree
}

TextTree.addLine = (
  to: Line | Group,
  at: PositionLine,
  end: LineEnding,
  id: IDFactory = factory,
): TextTree => {
  let i
  let indent
  let up
  if (to.type === 'Group') {
    if (at !== 'In') throw Error('adding to group requires in position')
    up = to
    indent = 0
    i = 0
  } else {
    up = at === 'In' ? to : to.up
    indent = to.indent + (at === 'In' ? 1 : 0)
    // Hack: when In, i is -1 + 1.
    i = up.down.indexOf(to) + (at === 'Start' ? 0 : 1)
  }

  const line = treeAdd<Line>(
    { end, expand: false, id: id(), indent, text: '', type: 'Line' },
    up,
    i,
  )

  return treeRoot(treeTouch(line))
}

TextTree.breakLine = (
  line: Line,
  at: number,
  end: LineEnding,
  id: IDFactory = factory,
): { root: TextTree; new: Line } => {
  if (at < 0 || at > line.text.length) {
    return { root: treeRoot(line), new: line }
  }
  const lhs = line.text.slice(0, at)
  const rhs = line.text.slice(at)

  line.text = lhs
  line = treeTouch(line)

  const next = treeAdd<Line>(
    {
      end,
      expand: false,
      id: id(),
      indent: line.indent,
      text: rhs,
      type: 'Line',
    },
    line.up,
    line.up.down.indexOf(line) + 1,
  )
  return { root: treeRoot(next), new: next }
}

TextTree.moveLine = (
  from: Line,
  to: Line | Group,
  at: PositionLine,
): TextTree => {
  if (from === to) return treeRoot(from)

  // to-do: consolidate with textTreeAddLine().
  let i
  let indent
  let up
  if (to.type === 'Group') {
    if (at !== 'In') throw Error('adding to group requires in position')
    up = to
    indent = 0
    i = 0
  } else {
    up = at === 'In' ? to : to.up
    indent = to.indent + (at === 'In' ? 1 : 0)
    // Hack: when In, i is -1 + 1.
    i = up.down.indexOf(to) + (at === 'Start' ? 0 : 1)
    // to-do: might need `to.lines.findLastIndex(line => line.type !== 'EOL') + 1` for appending.
  }

  const old = from.up
  treeRemove(from)
  treeAdd(from, up, i)
  from.indent = indent
  if (to.type === 'Line' && at === 'In') to.expand = true

  // Update old ancestors. old is not under node so node is current.
  treeTouch(old)

  return treeRoot(treeTouch(from))
}

TextTree.removeLine = (line: Line): TextTree => {
  treeRemove(line)
  return treeRoot(treeTouch(line.up))
}

TextTree.setLineText = (line: Line, str: string): TextTree => {
  line.text = str.replaceAll(/\r?\n/g, '')
  return treeRoot(treeTouch(line))
}

TextTree.setLineExpand = (line: Line, expand: boolean): TextTree => {
  line.expand = expand
  return treeRoot(treeTouch(line))
}

TextTree.toString = (tree: TextTree): string => {
  return nodesToString([tree], tree.indentW)
}

function endToString(end: LineEnding | ''): string {
  return end === 'LF' ? '\n' : end === 'CRLF' ? '\r\n' : end
}

function measureIndent(str: string, indentW: IndentW): number {
  let indent = 0
  for (const char of str) {
    // If tabs expected but got spaces, default to 2.
    if (char === ' ') indent += 1 / (indentW === 'Tab' ? 2 : indentW)
    else if (char === '\t') indent++
    else break
  }
  return Math.floor(indent)
}

function nodesToString(
  nodes: readonly Readonly<TextTree | EOL | Group | Line>[],
  indentW: IndentW,
): string {
  let str = ''
  for (const node of nodes) {
    if (node.type === 'TextTree') str += nodesToString(node.down, indentW)
    else if (node.type === 'EOL') str += endToString(node.end)
    else if (node.type === 'Group') str += nodesToString(node.down, indentW)
    else if (node.type === 'Line') {
      const indent = (indentW === 'Tab' ? '\t' : ' '.repeat(indentW)).repeat(
        node.indent,
      )
      str += `${indent}${node.text}${endToString(node.end)}${
        nodesToString(
          node.down,
          indentW,
        )
      }`
    } else node satisfies never
  }
  return str
}

function* split(
  str: string,
): Generator<{ start: string; text: string; end: LineEnding | '' }> {
  let start = ''
  let text = ''
  let end: LineEnding | '' = ''
  for (const char of str) {
    if (text) {
      if (char === '\n') {
        if (text.at(-1) === '\r') {
          end = 'CRLF'
          text = text.slice(0, -1)
        } else end = 'LF'
        yield { start, text, end }
        start = text = end = ''
      } else text += char
    } else {
      if (char === ' ' || char === '\t') start += char
      else if (char === '\n') {
        end = 'LF'
        yield { start, text, end }
        start = text = end = ''
      } else text += char
    }
  }
  if (start || text || end) yield { start, text, end }
}
