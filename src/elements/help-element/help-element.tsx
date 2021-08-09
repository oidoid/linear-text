import {DialogCardElement} from '../dialog-card-element/dialog-card-element'
import {H2Element} from '../header-element/header-element'

import './help-element.css'

export type HelpDialogCardProps = Readonly<{onDismissClick(): void}>

export function HelpDialogCardElement({
  onDismissClick
}: HelpDialogCardProps): JSX.Element {
  return (
    <div className='menu-card'>
      <DialogCardElement
        id='help'
        label='Linear Text'
        onDismissClick={onDismissClick}
      >
        <HelpElement />
      </DialogCardElement>
    </div>
  )
}

function HelpElement(): JSX.Element {
  // [to-do] Translate and add support for loading HTML.
  return (
    <article>
      <section>
        <p>Linear Text is a graphical line editor for plain text.</p>

        <ul>
          <li>
            <a href='#data-format'>Data Format</a>
          </li>
          <li>
            <a href='#use-and-misuse'>Use and Misuse</a>
          </li>
          <li>
            <a href='#similar-tools'>Similar Tools</a>
          </li>
        </ul>
      </section>

      <section>
        <H2Element id='data-format' label='Data Format' />

        <p>
          Linear Text reads and writes lines of text. If it makes sense in plain
          text, it makes sense visually in Linear Text and vice versa.
        </p>

        <ul>
          <li>Each line is an atom of text.</li>
          <li>Empty lines are divisions between groups of lines.</li>
          <li>
            Groups are arrayed horizontally and lines within a group are arrayed
            vertically.
          </li>
          <li>
            The text is the UI and the UI is text. Switch between plain text and
            UI seamlessly and losslessly. The two representations always
            correspond so use whichever you prefer whenever you prefer. Editing
            within Linear Text or externally produces the same results.
          </li>
          <li>
            The data format is discardable. When Linear Text vanishes, the data
            remains unmarred by the format.
          </li>
        </ul>
      </section>

      <section>
        <H2Element id='use-and-misuse' label='Use and Misuse' />

        <p>Linear Text is designed for:</p>
        <ul>
          <li>
            A pleasing visual editing and organization of lines and lists of
            lines. For example, a list of favorite video games.
          </li>
          <li>Outlining.</li>
          <li>Local file editing.</li>
          <li>Lightweight project management.</li>
        </ul>

        <p>Linear Text is not designed for:</p>
        <ul>
          <li>Editing large files.</li>
          <li>Sophisticated project management.</li>
        </ul>
      </section>

      <section>
        <H2Element id='similar-tools' label='Similar Tools' />
        <ul>
          <li>
            <a href='https://trello.com'>Trello</a>
          </li>
          <li>
            <a href='https://en.wikipedia.org/wiki/Ed_(text_editor)'>ed</a>{' '}
            (Standard UNIX Line Editor with a Command Line Interface)
          </li>
          <li>
            <a href='https://wikipedia.org/wiki/Line_editor'>
              Line Editor Wikipedia Entry
            </a>
          </li>
          <li>
            <a href='https://github.com/todotxt/todo.txt'>todo.txt Format</a>
          </li>
        </ul>
      </section>
    </article>
  )
}
