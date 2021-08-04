import React from 'react'

import App from '@zegal/dte/src/app'

App.module('Folders', (Folders) => {
  if (Folders.setup) {
    return
  }

  Folders.setup = true
})

export default App.Folders
