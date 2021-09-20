var express = require('express');
const { message } = require('statuses');
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(express.urlencoded({extended: false})); 
app.use(express.json());

var messages = [
    {name: 'Tim', message:'hii'},
    {name: 'Jane', message:'Hello'}

]

app.get('/messages', (req, res) => {
    res.send(messages)
})

app.post('/messages', (req, res) => {
    messages.push(req.body)
    res.sendStatus(200)
})

io.on('connection', (socket) => {
    console.log('a user is connected')
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})