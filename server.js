const express = require('express')
const app = express()
const server = require('http').Server(app)   // server to be used with socket
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')


app.set('view engine', 'ejs')  // how are we render oue view
app.use(express.static('public')) // setup static folder

app.get('/', (req, res) => {   // request , response  create a brand new room and redirect the user to that room
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {   // create room
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)