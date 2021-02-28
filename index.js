const express=require('express');
const socket=require('socket.io');
const app=express();
const cors=require('cors')

app.use(cors())
app.use(express.json());


const server=app.listen(5000,()=>{
 console.log("server is up and running!")

})
const io=socket(server);

io.on('connection',(socket)=>{

console.log(socket.id);

socket.on('join-room',(data)=>{
 socket.join(data);
 console.log(`joined room ${data}`)
})

socket.on('send-message',(data)=>{
 socket.to(data.room).emit('recieve-msg',data.content)
})

socket.on('disconnect',()=>{
 console.log('user disconnected ;-;')
})
}
)