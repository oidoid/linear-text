import {Group} from '../group/group'
import {MenuCard} from '../menu/menu'
import {selectRecords} from '../../store/records/records-slice'
import {useAppSelector} from '../../hooks/use-store'

import './app.css'

export type AppProps = Readonly<{'data-testid'?: string}>

export function App({'data-testid': testID}: AppProps) {
  const records = useAppSelector(selectRecords)
  return (
    <div className='app' data-testid={testID}>
      <header className='app__header'>
        <MenuCard />
      </header>
      <main className='app__body'>
        <Group lines={records.tab.records} />
      </main>
    </div>
  )
}
