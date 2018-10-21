/* ============
 * Axios
 * ============
 *
 * This file installs Axios (https://github.com/axios/axios)
 *
 * Axios is used as a HTTP Client to make HTTP Requests
 */

import Vue from 'vue'
import Axios from 'axios'

Axios.defaults.baseURL = process.env.API_LOCATION
Axios.defaults.headers.common.Accept = 'application/json'

Vue.$http = Axios
Object.defineProperty(Vue.prototype, '$http', {
  get() {
    return Axios
  }
})
