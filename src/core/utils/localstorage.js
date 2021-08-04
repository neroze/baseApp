import { extend, omit, attempt } from "lodash";

export const lsGet = function (key) {
  return attempt(JSON.parse.bind(null, window.localStorage.getItem(key)));
};

export const lsSet = function (key, data) {
  return window.localStorage.setItem(key, JSON.stringify(data));
};

export const lsRemove = function (key) {
  return window.localStorage.removeItem(key);
};

export const lsClearAll = function () {
  return window.localStorage.clear();
};

export const supportsLocalStorage = () =>
  "localStorage" in window && window.localStorage !== null;

/**
 * Merge some data into a key
 *
 * @param {String} key -
 * @param {Object} addKeys -
 * @param {Object} removeKeys -
 */
export const lsUpdate = function (key, addKeys, removeKeys) {
  return window.localStorage.setItem(
    key,
    JSON.stringify(extend(omit(lsGet(key), removeKeys), addKeys))
  );
};
