import './styles.css'
import React from 'react'
import { Provider } from 'mobx-react'
import { useStore } from './stores/getStore'

const InnerComponet = () => {
  const root = useStore('root')
  console.log('stores--', root)
  const { appName, version } = root
  return (
    <div className="App">
      {appName} @ {version}
      <h2>Start editing to see some magic happen!</h2>
    </div>
  )
}

export default function App({ config, baseComponent }) {
  console.log('------all baseComponent----', baseComponent)
  const { stores } = config
  return (
    <Provider {...stores}>
      {/* <h1>Hello {config.appName}</h1> */}
      {baseComponent()}
      {/* <InnerComponet /> */}
    </Provider>
  )
}
