import {Counter} from '../counter/counter'
import {NavigationCard} from '../navigation/navigation'

import './app.css'

export type AppProps = Readonly<{'data-testid'?: string}>

export function App({'data-testid': testID}: AppProps) {
  return (
    <div className='app' data-testid={testID}>
      <header className='app__header'>
        <NavigationCard />
      </header>
      <main className='app__body'>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <Counter />
      </main>
    </div>
  )
}
