import Vue from 'vue'

import reloadProcesses from './reloadProcesses'
import reloadProcess from './reloadProcess'
import pong from './pong'

const MAX_RECONNECT_INTERVAL = 30000
const START_RECONNECT_INTERVAL = 1000

export default class WebSocketService {
  constructor() {
    this.messageHandlers = {
      'reload_processes': reloadProcesses,
      'reload_process': reloadProcess,
      'ping': pong
    }
    this.reconnectInterval = START_RECONNECT_INTERVAL
    this.connect()
  }

  connect() {
    this.connection = new WebSocket(process.env.VUE_APP_API_LOCATION.replace(/http/, 'ws'))

    this.connection.onopen = this.onopen.bind(this)
    this.connection.onmessage = this.onmessage.bind(this)
    this.connection.onclose = this.onclose.bind(this)
    this.connection.onerror = this.onerror.bind(this)
  }

  close() {
    if (this.connection) {
      this.connection.close()
    }
  }

  onopen() {
    console.log('WebSocket Connection opened')
    this.reconnectInterval = START_RECONNECT_INTERVAL
    if (this.closedMessage) {
      this.closedMessage.close()
      this.closedMessage = undefined
    }
  }

  onmessage(msg) {
    let data
    try {
      data = JSON.parse(msg.data)
    } catch (e) {
      console.error('Invalid Websocket Message received', {
        error: e,
        message: msg
      })
      return
    }

    const handler = data.type ? this.messageHandlers[data.type] : undefined
    if (handler) {
      handler.bind(this.connection)(data)
    } else {
      console.warn('WebSocket received unkown message type', data)
    }
  }

  onclose(ev) {
    if (ev.wasClean) {
      console.log('WebSocket Connection closed.')
      return
    }

    console.log('WebSocket Connection closed. Reconnecting in ' + this.reconnectInterval + 'ms.')
    if (!this.closedMessage) {
      this.closedMessage = Vue.$message({
        message: Vue.i18n.t('websocket.connection_closed'),
        type: 'error',
        duration: 0,
        showClose: true
      })
    }

    setTimeout(() => {
      this.reconnectInterval = Math.min(this.reconnectInterval * 1.5, MAX_RECONNECT_INTERVAL)
      this.connect()
    }, this.reconnectInterval)
  }

  onerror(err) {
    console.error('WebSocket errored: ', err)
    this.connection.close()
  }
}
