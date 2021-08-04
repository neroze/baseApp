import { get, set, filter, reduce } from "lodash";

export default (App) => {
  /**
   * Set the headers for the ajax requests
   *
   */
  App.setHeader = function (key, value) {
    // console.log('key,', key);
    const headers = App.getConfig("headers");
    set(headers, key + ".value", value);

    // console.log('Headers set to:', App.headers);
  };

  App.getHeaderValue = (name) => get(App.getConfig("headers"), name + ".value");
  App.getHeader = (name) => get(App.getConfig("headers"), name);
  App.getHeaders = () =>
    reduce(
      App.getCustomHeaders(),
      (result, header) => {
        result[header.key] = header.value;
        return result;
      },
      {}
    );

  App.filterHeaders = function (
    mode,
    value = true,
    headers = App.getConfig("headers")
  ) {
    return filter(headers, { [mode]: value });
  };

  /**
   * Get the current headers for the ajax requests
   *
   * @param {boolean} disableAuth - True to not include the auth headers
   */
  App.getCustomHeaders = function (disableAuth, all = false) {
    // console.log('disableAuth', disableAuth);
    if (all) {
      return App.getConfig("headers");
    }

    let standard = App.filterHeaders("standard");

    return disableAuth ? App.filterHeaders("auth", true, standard) : standard;
  };

  return App;
};
