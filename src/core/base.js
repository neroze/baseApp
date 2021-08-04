// import QS from 'query-string'
import React from 'react'
import isFunction from 'lodash-es/isFunction'
import bind from 'lodash/bind'
import set from 'lodash/set'
import get from 'lodash/get'
import each from 'lodash/each'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
// import omit from "lodash/omit";
// import defaults from "lodash/defaults";
import last from 'lodash/last'

export const init = () => {
  // App.setNamespaceBySubDomain();
  return Promise.all([Promise.resolve({})]).then(async ([theme, i18n]) => {
    return {}
  })
}

/**
 * Base App
 *
 * @module App
 * @namespace App
 *
 * Order of events on startup:
 * ---------------------------
 *
 * App: before:start
 * App: start (implementation)
 * App: start (base app)
 *
 */
let App = {
  modules: [],
  processes: {
    // you should override this if you want, in your implementing app
    preAuth: async () => {
      // App.log("load_event", { message: "App.processes.preAuth" }, 3);

      try {
        // const result = await init();
        App?.processes?.beforeLogin && App.processes.beforeLogin()
      } catch (error) {
        return error
      }
    },

    postAuth: function (depn = [new Promise((resolve) => resolve({ name: 'niraj' }))]) {
      return Promise.all([depn()])
    },

    afterSetup: () => Promise.resolve(),

    /**
     * When the user log's in
     *
     * Note, this is before the app modules load
     */
    afterLoginInternal: (depn = [new Promise((resolve) => resolve({ name: 'niraj' }))], data) => {
      App.processes.afterLogin && App.processes.afterLogin(data)
    },

    beforeStart: (depn = [new Promise((resolve) => resolve({ name: 'niraj' }))]) => {
      return Promise.all([depn()])
    },

    start: () => {},

    // this should be updated by the implementing app:
    afterStart: () => console.warn('Error: calling default after start'),

    beforeLogout: () => Promise.resolve(),

    postLogout: function () {
      App.log('load_event', { message: 'App.processes.postLogout' }, 3)
      App.processes.beforeLogout && App.processes.beforeLogout()

      // make sure all modules that are not defaults are stopped
      each(App.submodules, function (module) {
        if (!module.startWithParent) {
          module.stop()
        }
      })

      if (App.actions) {
        App?.actions?.resetCache()
        // custom app version
        App?.actions?.resetAppCache && App.actions.resetAppCache()
      }

      if (App?.socket) {
        App?.socket?.close()
      }

      App?.processes?.afterLogout && App.processes.afterLogout()
    },

    afterLogout: () => Promise.resolve()
  },

  actions: {},
  module(name, data) {
    if (!get(App, name)) {
      const newModule = {}
      // const newModule = Backbone.Radio.channel(name)
      let nameList = name.split('.')
      newModule.moduleName = last(nameList)

      let parent = false
      if (nameList.length > 1) {
        parent = nameList[nameList.length - 2]

        if (parent !== name) {
          // console.log('Parent:', parent);
          const parentExists = App[parent]
          if (parentExists) {
            // console.log('parentExists', parentExists);
            newModule.parent = parentExists
          }
        }
      }

      set(App, name, newModule)
      App.modules.push(newModule)
    } else {
      // console.log('Found module:', name);
      // return get(App, name)
    }

    const module = get(App, name)

    if (isFunction(data)) {
      // console.info('Function data:', name, data);
      // console.log('old module', module);
      data(module)
    } else {
      // console.info('Data is funny:', name, data);
      if (data && data.define) {
        bind(data.define, module)()
      }
    }

    // console.log('Returning module:', module);
    return module
  },

  /**
   * This is run after start
   *
   */
  setup(options = {}) {
    App.processes.afterSetup()
  },
  /**
   * App.Start
   *
   * @param {object} options - generic options
   * @param {object} processes -
   */
  async start(options = {}, app, routes = []) {
    const config = await App.processes.beforeStart()
    console.log('config', config)
    this.setup(options)
    let allRoutes = []
    console.log('-->>', routes)
    Promise.all(routes).then((appRoutes) => {
      console.log('appRoutes ++++', appRoutes)
      appRoutes.forEach((moduleRoute) => {
        console.log('module Routes :::', moduleRoute.default)
        allRoutes = allRoutes.concat(moduleRoute.default)
        console.log('--- routes', allRoutes)
      })
      App.Menus = []
      console.log('App.routes all ==>', allRoutes)
      const baseComponent = RouteMaker(allRoutes)
      app && app({ config, baseComponent })

      return App.processes.start()
    })
  }
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  )
}

function Reg() {
  return (
    <div>
      <h2>Reg Home</h2>
    </div>
  )
}

const RouteMaker = (routes2 = []) => () => {
  const routes = [
    {
      path: '/home',
      component: Home
    },
    {
      path: '/reg',
      component: Reg
    },
    {
      path: '/register',
      component: Reg
    }
  ]

  console.log('======= routes ::', routes, routes2)

  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/register">Reg</Link>
          </li>
          <li>
            <Link to="/reg">reg-home</Link>
          </li>
        </ul>

        <hr />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          {routes2.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </div>
    </Router>
  )
}

function RouteWithSubRoutes(route) {
  console.log('+++++ with sub routes', route)
  return (
    <Route
      path={route.path}
      render={(props) => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  )
}

export default App
