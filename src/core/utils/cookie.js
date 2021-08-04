// import {isEmpty} from "lodash-es";
import Cookies from 'js-cookie'
/**
 * Safely returns a cookie, or a cookie's property
 *  - extra-safe facade for js-cookie's get
 *
 * @param {string} key - e.g. DragonRegister
 * @param {string} prop - e.g. token
 * @param {boolean} isString - if we do not need to parse string cookie -e.g. nextUrl
 * @returns {object} item
 */
export const cookieGet = function (key, prop, isString = false) {
  try {
    const value = Cookies.get(key)
    const cookie = isEmpty(value) ? undefined : value
    // console.log('Found cookie:', cookie)

    return cookie ? (isString ? Cookies.get(key) : prop ? JSON.parse(cookie)[prop] : JSON.parse(cookie)) : false
  } catch (error) {
    console.error('cookieGet:', error)
    return false
  }
}

export const cookieAxe = (App) =>
  function (
    key,
    opt = {
      path: App.getConfig('cookies').path || '/',
      domain: App.getConfig('cookies').domain
    }
  ) {
    Cookies.remove(key, opt)
  }

export const cookieWithConverter = Cookies.withConverter({
  // read(value) {
  // 	console.log('value', value);
  // 	// Read converter
  //  var rdecode = /(%[0-9A-Z]{2})+/g;
  //  value.replace(rdecode, decodeURIComponent);
  // 	return value
  // },
  write(value) {
    // Write converter override
    // console.log('Before value:', value);
    value = encodeURIComponent(String(value))
    // console.log('After value:', value);

    return value
  }
})

export const cookieSet = (App) =>
  function (key, value) {
    if (App.getConfig('cookies').enabled) {
      // set cookie too
      if (value === undefined) {
        // then smoke the cookie
        Cookies.remove(key)
        return
      }

      // console.log('Setting cookie:', key);

      let options = {
        expires: App.getConfig('cookies').expires || 7,
        secure: App.getConfig('cookies').secure || false,
        path: App.getConfig('cookies').path || '/',
        domain: App.getConfig('cookies').domain || 'localhost'
      }

      // console.log('Setting cookie:', key);
      // console.log('With value:', value);
      // console.log('With options:', options);
      // Cookies.set(key, value, options);
      cookieWithConverter.set(key, value, options)
      // console.log('Gettting;', Cookies.get(key));
    } else {
      console.error('Trying to set cookie, but they are disabled in config.')
    }
  }

export const cookiesEnabled = () => {
  let cookieEnabled = navigator.cookieEnabled ? true : false

  if (!cookieEnabled) {
    document.cookie = 'testcookie=test'
    cookieEnabled = document.cookie.indexOf('testcookie') !== -1 ? true : false
  }

  return cookieEnabled ? true : false
}
