import {useEffect} from 'react'
import {useAppSelector} from '../../hooks/use-store'
import {selectTableState} from '../../store/table-slice/table-slice'
import {MenuCardElement} from '../menu-element/menu-element'
import {TableElement} from '../table-element/table-element'

import './app-element.css'

export type AppProps = Readonly<{'data-testid'?: string}>

export function AppElement({'data-testid': testID}: AppProps): JSX.Element {
  const tableState = useAppSelector(selectTableState)
  useEffect(() => {
    setTitle(tableState.filename, tableState.invalidated)
    setFavicon(tableState.invalidated)
  }, [tableState.filename, tableState.invalidated])
  return (
    <div className='app' data-testid={testID}>
      <header className='app__header'>
        <MenuCardElement />
      </header>
      <main className='app__main'>
        <TableElement table={tableState.table} />
      </main>
    </div>
  )
}

function setTitle(filename: string | undefined, invalidated: boolean): void {
  document.title = invalidated
    ? filename == null
      ? '• (Unsaved) – Linear Text'
      : `• ${filename} (Unsaved) – Linear Text`
    : filename == null
    ? 'Linear Text'
    : `${filename} – Linear Text`
}

function setFavicon(invalidated: boolean): void {
  const favicon: HTMLLinkElement | null =
    document.querySelector('link[rel="icon"]')
  if (favicon == null) return
  favicon.href = `${process.env.PUBLIC_URL}/favicon${
    invalidated ? '-unsaved' : ''
  }.svg`
}
