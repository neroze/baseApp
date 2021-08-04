import React from "react";
import { Route, Redirect } from "react-router-dom";

export default (App) => {
  // wrap <Route> or <PrivateRoute>, then when
  // sub routes are added to any route it'll work
  App.RouteBuilder = (route) => {
    App.log("Adding route:", route, "Core", 3);

    return (
      <Route
        path={route.path}
        {...(route.options || {})}
        render={(props) => {
          if (!route.public && !App.stores.general.isAuthenticated) {
            !App.stores.general.isAuthenticated && App.actions.captureUrl();
            return (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: props.location }
                }}
              />
            );
          }

          // if we have an associated model, pass that too
          if (route.model) {
            props.match.model = route.model;
          }

          props.match.options = route.options || {};

          // some routes need the app injected into the component (eg: from common components)
          if (route.app) {
            props.App = App;
          }

          return (
            // pass the sub-routes down to keep nesting
            <route.component {...props} routes={route.routes} />
          );
        }}
      />
    );
  };

  App.parseFromURL = (
    name,
    url,
    allowPlus = App.getConfig("allowPlusInQueryString")
  ) => {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return "";
    }
    if (allowPlus) {
      return decodeURIComponent(results[2]);
    }
    return decodeURIComponent(results[2].replace(/\+/g, ""));
  };

  return App;
};
