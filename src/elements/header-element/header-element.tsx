import type {ReactNode} from 'react'

import './header-element.css'

export type HeaderProps = Readonly<{
  actionEnd?: JSX.Element
  /** Fragment identifier for linking. */
  id: string
  label: string
  level: HeaderLevel
}>

export type HeaderLevel = 1 | 2 | 3 | 4 | 5 | 6

type HProps = Readonly<{className: string; id: string; children: ReactNode}>

export function HeaderElement({
  actionEnd,
  id,
  label,
  level
}: HeaderProps): JSX.Element {
  const H = headerLevelToElement[level]
  return (
    <H className={`header header--${level}`} id={id}>
      <a className='header__link' href={`#${id}`}>
        {label} <span className='header__fragment'>#</span>
      </a>
      <ActionEndElement action={actionEnd} />
    </H>
  )
}

const headerLevelToElement: Readonly<
  Record<HeaderLevel, (props: HProps) => JSX.Element>
> = Object.freeze({
  1: props => <h1 {...props} />, // eslint-disable-line jsx-a11y/heading-has-content
  2: props => <h2 {...props} />, // eslint-disable-line jsx-a11y/heading-has-content
  3: props => <h3 {...props} />, // eslint-disable-line jsx-a11y/heading-has-content
  4: props => <h4 {...props} />, // eslint-disable-line jsx-a11y/heading-has-content
  5: props => <h5 {...props} />, // eslint-disable-line jsx-a11y/heading-has-content
  6: props => <h6 {...props} /> // eslint-disable-line jsx-a11y/heading-has-content
})

type ActionProps = Readonly<{action?: JSX.Element | undefined}>

function ActionEndElement({action}: ActionProps): JSX.Element | null {
  if (action == null) return null
  return <div className='header__action-end'>{action}</div>
}
