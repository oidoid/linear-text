import './header-element.css'

export type HeaderProps = Readonly<{
  actionEnd?: JSX.Element
  /** Fragment identifier for linking. */
  id: string
  label: string
  level: 1 | 2 | 3 | 4 | 5 | 6
}>

export type HProps = Omit<HeaderProps, 'level'>

export function HeaderElement({level, ...props}: HeaderProps): JSX.Element {
  // [to-do]: Is there a trick to consolidate these to a single implementation
  //   that can vary by level?
  switch (level) {
    case 1:
      return <H1Element {...props} />
    case 2:
      return <H2Element {...props} />
    case 3:
      return <H3Element {...props} />
    case 4:
      return <H4Element {...props} />
    case 5:
      return <H5Element {...props} />
    case 6:
      return <H6Element {...props} />
  }
}

export function H1Element({actionEnd, label, ...props}: HProps): JSX.Element {
  return (
    <h1 className='header header--1' {...props}>
      {label}
      <ActionEndElement action={actionEnd} />
    </h1>
  )
}

export function H2Element({actionEnd, label, ...props}: HProps): JSX.Element {
  return (
    <h2 className='header header--2' {...props}>
      {label}
      <ActionEndElement action={actionEnd} />
    </h2>
  )
}

export function H3Element({actionEnd, label, ...props}: HProps): JSX.Element {
  return (
    <h3 className='header header--3' {...props}>
      {label}
      <ActionEndElement action={actionEnd} />
    </h3>
  )
}

export function H4Element({actionEnd, label, ...props}: HProps): JSX.Element {
  return (
    <h4 className='header header--4' {...props}>
      {label}
      <ActionEndElement action={actionEnd} />
    </h4>
  )
}

export function H5Element({actionEnd, label, ...props}: HProps): JSX.Element {
  return (
    <h5 className='header header--5' {...props}>
      {label}
      <ActionEndElement action={actionEnd} />
    </h5>
  )
}

export function H6Element({actionEnd, label, ...props}: HProps): JSX.Element {
  return (
    <h6 className='header header--6' {...props}>
      {label}
      <ActionEndElement action={actionEnd} />
    </h6>
  )
}

type ActionProps = Readonly<{action?: JSX.Element | undefined}>

function ActionEndElement({action}: ActionProps): JSX.Element | null {
  if (action == null) return null
  return <div className='header__action-end'>{action}</div>
}
