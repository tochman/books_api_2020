const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection',  (ws, req) => {
  ws.on('message', (message) => {
    console.table(message)
  })
  ws.send(JSON.stringify({message: `<h1>Really, You ARE connected!</h1>`}))
})

function broadcast(message) {
  let payload = typeof(message) === 'object' ? JSON.stringify(message) : message
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({message: payload}))
    }
  })
}

module.exports = { broadcast }