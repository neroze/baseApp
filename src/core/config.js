import get from "lodash/get";
import set from "lodash/set";

export default (App) => {
  App.config = {
    setConfig(key, value) {
      set(App, `features.${key}`, value);
    }
  };

  /**
   * Get App config
   *
   * @todo - make this more generic, move the config into it's own object
   * not just for 'features'. Currently they all polute the app namespace
   *
   * @param {String} feature - Item to get config for
   * @returns {String} Config value
   */
  App.getConfig = function (feature) {
    // console.log('App.features', App.features, feature);
    // console.log('App.settings', App.settings, feature);
    // console.log('App.defaults', App.defaults, feature);

    // features are things like: what is on and off in the app, eg: steps
    const firstCheck = get(App.features, feature);

    if (firstCheck !== undefined) {
      return firstCheck;
    }

    const found = App[feature];

    if (found) {
      return found;
    }

    // settings are checked next, if they are not found above
    // settings are things like: api endpoints
    // NOTE: there is too much crap in here, need to move the features out into features.
    let value = get(App, `settings.${feature}`);
    if (value === undefined) {
      if (App.settings && App.settings.debug) {
        App.log("missing_setting", "Setting missing: " + feature, "Main", 1);
      }
    }

    App.log(
      "get_setting",
      "Setting is set to: " + feature + ": " + value,
      "Main",
      3
    );
    return value;
  };
};
