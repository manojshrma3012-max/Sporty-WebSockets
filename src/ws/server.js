import {WebSocketServer,WebSocket} from 'ws';

function sendjson(socket,payload){
    if(!socket || !payload) {
        console.error("Invalid socket or payload");
        return;
    }
    socket.send(JSON.stringify(payload));
}
function broadcastjson(wss,payload){
    if(!wss || !payload) {
        console.error("Invalid WebSocket server or payload");
        return;
    }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(payload));
        }
    });
}
export  function startWebSocketServer(server) {
    const wss = new WebSocketServer({ 
        server,
        path: '/ws',
        maxPayload: 1024 * 1024, 
     });
     wss.on('connection', (socket) => {
        sendjson(socket, { message: 'Welcome to the WebSocket server!' });
        socket.on('error',console.error)
     })
     function broadcast(match){
        broadcastjson(wss, { message: 'New match created', data:match });
     }
     return {broadcast};
    }
