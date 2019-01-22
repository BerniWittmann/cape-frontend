import axios from 'axios'

export default function pong(msg) {
  let clientID = msg.data.clientID
  const oldClientID = sessionStorage.getItem('websocket_client_id')
  if (oldClientID) {
    clientID = oldClientID
  } else {
    sessionStorage.setItem('websocket_client_id', clientID)
  }
  axios.defaults.headers.common['Websocket-Client-ID'] = clientID

  this.send(JSON.stringify({
    type: 'pong',
    msg: 'Hello back from Client',
    data: {
      clientID: clientID
    }
  }))
}
