import React from 'react'
import { MobXProviderContext } from 'mobx-react'

export function useStores() {
  return React.useContext(MobXProviderContext)
}

export function useStore(name = 'root') {
  const stores = useStores()
  console.log('stores--', stores)
  return stores[name]
}
