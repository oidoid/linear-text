import {GroupElement} from '../group-element/group-element'
import {MenuCardElement} from '../menu-element/menu-element'
import {selectTableState} from '../../store/table-slice/table-slice'
import {useAppSelector} from '../../hooks/use-store'

import './app-element.css'

export type AppElementProps = Readonly<{'data-testid'?: string}>

export function AppElement({
  'data-testid': testID
}: AppElementProps): JSX.Element {
  const tableState = useAppSelector(selectTableState)
  return (
    <div className='app-element' data-testid={testID}>
      <header className='app-element__header'>
        <MenuCardElement />
      </header>
      <main className='app-element__body'>
        <GroupElement lines={tableState.table.lines} />
      </main>
    </div>
  )
}
