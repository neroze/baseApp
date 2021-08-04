import { cookieGet } from "./utils/cookie";

export default (App) => {
  /**
   * Util method to parse error response message from end point with different error formats
   */
  App.actions.parseError = (error) => {
    return error;
  };

  App.actions.parseUserFriendlyMessage = (error) => {
    return "error" + error;
  };

  /**
   * tests if error message is either string or object and return error message accordingly
   */
  App.actions.parseErrorMessage = (_string = "", error) => {
    return error;
  };

  /**
   * Method to show toast error message
   * @param Error Object
   * @param log Boolen true to log
   */
  App.actions.error = (error, log = false, error_name = "app_error") => {
    if (get(error, "statusText") === "abort") {
      return;
    }
    App.getConfig("debug") && console.error(error);
    console.error(error);
  };

  /**
   * Log an application error
   *
   * @param name string - Error name to log
   * @param data    object - Error data to be logged data
   * @param safe    bool   - True to not rediect
   */
  App.actions.logError = (name, data, safe) => {
    // console.important('-------ERROR CAUGHT--------');
    // console.log('name', name);
    // console.log('data', data);
    // console.log('safe', safe)

    if (!name && !data) {
      console.error("Bad error called, no name or data");
      return;
    }

    if (isString(data)) {
      data = { message: data };
    }

    const responses = {
      0: () => {
        // normally this means there is no internet connection
        // thus do not enter into a error logging loop
        okToLog = false;
      },
      400: () => {
        // Something not found, eg: document, activity
        safe = true;
      },
      401: () => {
        // console.log(name, data, safe);
        // okToLog = false;
        // if there is a specific name
        // and this is a perms issue, then display the invalid
        if (data && data.responseJSON && data.responseJSON.error) {
          console.error("Permission error");
        } else {
          // token is invaild, so clear token
          cookieGet(App.getHeader("AuthDomain").key, {});
          // do not display the auth error:
          safe = true;
        }
      },
      403: () => {
        console.error("403 Forbidden");
      },
      404: () => {
        console.error("404 found");
      },
      502: () => {
        // Bad Gateway
        safe = true;
      },
      800: () => {
        // Not entitled
        console.error("You do not have sufficient credits");
      },
      900: () => {
        // User validation error
      },
      901: () => {
        // Unknown API error - New format from Nov 2019
      },
      920: () => {
        // Unknown client error of some kind
      },
      921: () => {
        // Uncaught Javascript client error (auto)
      },
      922: () => {
        // Javascript client error, caught by error boundry
      },
      999: () => {}
    };
  };
  /**
   * Almost like App.actions.error,
   * Use this method if no need to parse error object from string returned
   *
   * @param error Object - actual error object
   * @param notify Boolen - true if need to show toast message
   * @param options Object stopThowing = true if u want to throw error in return, false for scilent error processing.
   */

  App.actions.processError = (error, notify, options = {}) => {};

  return App;
};
