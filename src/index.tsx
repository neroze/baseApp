import { render } from 'react-dom'
import Kernal from './kernel'

import { RootStore } from './stores/root'

import App from './App'

const MyApp = ({ config = { appName: 'Wild World' }, baseComponent }) => {
  const rootElement = document.getElementById('root')
  return render(<App config={config} baseComponent={baseComponent} />, rootElement)
}

const moduleRoutes = [import('./modules/home/routes'), import('./modules/register/routes')]

Kernal.processes.beforeStart = () => {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      const stores = {
        root: RootStore.create()
      }
      console.log('----------- before start is resolve now')
      return resolve({
        appName: 'Boot App q111',
        stores
      })
    }, 1000)
  })
}
Kernal.start({}, MyApp, moduleRoutes)
