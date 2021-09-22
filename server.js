var express = require('express');
const { message } = require('statuses');
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(express.urlencoded({extended: false})); 
app.use(express.json());

mongoose.Promise = Promise

var dbUrl = 'mongodb+srv://user:user@learning-node.geipr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})


app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
    
})

app.post('/messages', async (req, res) => {

    try {
        var message = new Message(req.body)

        var savedMessage = await message.save()
        
        console.log('saved')
    
        var censored = await Message.findOne({message: 'badword'})
        
        if(censored) 
            await Message.deleteOne({_id: censored.id})
        else
            io.emit('message', req.body)
        
        res.sendStatus(200)  
        
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    } finally {
        console.log('message post calld')
    }

})

 

io.on('connection', (socket) => {
    console.log('a user is connected')
})

mongoose.connect(dbUrl, (err) => {
    console.log('mongo db connection', err)
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})