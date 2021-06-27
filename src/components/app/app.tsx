import './app.css'
import {Trans} from '@lingui/react'

export function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <Trans id='title-long' />
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  )
}
