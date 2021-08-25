import {DialogCardElement} from '../card-element/dialog-card-element'
import {HeaderElement} from '../header-element/header-element'
import {t} from '@lingui/macro'
import {version} from '../../../package.json'

export type HelpDialogCardProps = Readonly<{onDismissClick(): void}>

export function HelpDialogCardElement({
  onDismissClick
}: HelpDialogCardProps): JSX.Element {
  return (
    <DialogCardElement
      id='help'
      label={t`app-title-with-${version}`}
      onDismissClick={onDismissClick}
    >
      <HelpElement />
    </DialogCardElement>
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
        <HeaderElement id='data-format' label='Data Format' level={2} />

        <p>
          Linear Text reads and writes lines of text. If it makes sense in plain
          text, it makes sense visually in Linear Text and vice versa. Linear
          Text is kind of like enabling "pretty mode" for your text. It's just a
          temporary lens or different way to see them.
        </p>

        <ul>
          <li>Each line is an atom of text.</li>
          <li>Empty lines are divisions between groups of lines.</li>
          <li>
            Groups are arrayed horizontally and lines within a group are arrayed
            vertically.
          </li>
          <li>
            The text is the UI (HTML) and the UI is text. Switch between plain
            text and UI seamlessly and losslessly. The two representations
            always correspond so use whichever you prefer whenever you prefer.
            Editing within Linear Text or externally produces the same results.
          </li>
          <li>
            The data format is discardable. When Linear Text vanishes, the data
            remains unmarred by the format.
          </li>
        </ul>

        <p>Text can be indented.</p>
      </section>

      <section>
        <HeaderElement id='use-and-misuse' label='Use and Misuse' level={2} />

        <p>Linear Text is designed for:</p>
        <ul>
          <li>
            A pleasing visual editing and organization of lines and lists of
            lines. For example, a list of favorite video games.
          </li>
          <li>Outlining.</li>
          <li>Local file editing.</li>
          <li>Lightweight project management.</li>
          <li>Small collections and lists.</li>
        </ul>

        <p>Linear Text is not designed for:</p>
        <ul>
          <li>Editing large files.</li>
          <li>Sophisticated project management.</li>
        </ul>
      </section>

      <section>
        <HeaderElement id='similar-tools' label='Similar Tools' level={2} />
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
