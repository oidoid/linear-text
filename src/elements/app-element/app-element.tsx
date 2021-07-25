import {TableElement} from '../table-element/table-element'
import {MenuCardElement} from '../menu-element/menu-element'
import {selectTableState} from '../../store/table-slice/table-slice'
import {t} from '@lingui/macro'
import {useAppSelector} from '../../hooks/use-store'
import {useEffect} from 'react'

import './app-element.css'

export type AppProps = Readonly<{'data-testid'?: string}>

export function AppElement({'data-testid': testID}: AppProps): JSX.Element {
  const tableState = useAppSelector(selectTableState)
  useEffect(() => {
    const filename = tableState.filename
    document.title = tableState.invalidated
      ? filename == null
        ? t`app-title-with-unsaved`
        : t`app-title-with-unsaved-${filename}`
      : filename == null
      ? t`app-title-with-saved`
      : t`app-title-with-saved-${filename}`

    const favicon = getFavicon()
    if (!favicon) return
    favicon.href = `${process.env.PUBLIC_URL}/favicon${
      tableState.invalidated ? '-unsaved' : ''
    }.svg`
  }, [tableState.filename, tableState.invalidated])
  return (
    <div className='app-element' data-testid={testID}>
      <header className='app-element__header'>
        <MenuCardElement />
      </header>
      <main>
        <TableElement table={tableState.table} />
      </main>
    </div>
  )
}

function getFavicon(): HTMLLinkElement | null {
  return document.querySelector('link[rel="icon"]')
}
