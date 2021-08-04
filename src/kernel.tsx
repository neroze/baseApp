// // import each from "lodash-es/";
// import { each } from "lodash";
// import isBoolean from "lodash-es/isBoolean";
// import isString from "lodash-es/isString";
// import isFunction from "lodash-es/isFunction";
// import get from "lodash-es/get";
// import map from "lodash-es/map";

// import React from "react";
// import ReactDOM from "react-dom";
// import { Provider } from "mobx-react";

// import { lsSet } from "./core/utils/localstorage";

import App from './core/base'
// import addCoreAjax from "./core/ajax";
import addCoreRoute from './core/routes'
import addCoreHeaders from './core/headers'
import addCoreLogs from './core/logs'
import addCoreConfig from './core/config'
// import addCoreLoading, { addLoadingActions } from "./core/loading";
import addErrorActions from './core/error'

// console.log('Loading baseapp core!');
// console.log('========================');

// App.cache = {};
addCoreLogs(App)
// addCoreAjax(App);
addCoreRoute(App)
addCoreHeaders(App)
// addCoreLoading(App);
addCoreConfig(App)
addErrorActions(App)

export default App
