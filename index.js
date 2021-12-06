// imports
const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

// setup
const app = express()
const server = http.createServer(app) // creating a server
const io = new Server(server, { // the server that we created (connecting socketio server with the express server)
    cors: {
        origin: 'http://localhost:3000', // which server will be calling our socketio server (react server that would be running)
        methods: ["GET", "POST"], // types of methods that the server would be accepting
    },
})

io.on("connection", (socket) => { // listening for the connection event on the socketio server ---> when listening for an event you enact an action as a clbk function
    console.log('user connected ', socket.id)

    socket.on('join_room', (data) => { // emitting from frontend & listening here in the backend
        socket.join(data)
        console.log(`user with id ${socket.id}, joined room ${data}`)
    })

    socket.on("send_message", data => {
        socket.to(data.room).emit('receive_message', data) // emitting to other people but urself
    })

    socket.on("disconnect", () => {
        console.log('user disconnected ', socket.id)
    })
})

app.use(cors())
server.listen(5000, () => console.log('server is running'))