import { types } from 'mobx-state-tree'
import { MobXProviderContext } from 'mobx-react'
import React from 'react'

export const RootStore = types.model('Root', {
  appName: 'Boot App',
  version: '0.0.1'
})

export function useStores() {
  return React.useContext(MobXProviderContext)
}
