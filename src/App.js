
import { useState,useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ScrollableFeed from 'react-scrollable-feed'
import './App.css';
import { Button,TextField,Box } from '@material-ui/core';
let socket;
const Connection_Port ='http://localhost:5000/';
function App() {
  const [isLogged,setisLogged]=useState(false);
  const [userName,setUserName]=useState("");
  const [room,setRoom]=useState("");
  const divRef = useRef(null);
  // const [members,setMembers]=useState([])
  const inputRoom=useRef();

  const[msg,setMsg]=useState("");
  const[msgList,setMsgList]=useState([]);

  useEffect(() => {
   socket=io(Connection_Port,{transports: ['websocket', 'polling', 'flashsocket']})
  },[Connection_Port])

   useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: 'smooth' });
  });

  useEffect(()=>{
    socket.on('recieve-msg',(data)=>{
      setMsgList([...msgList,data])
    })
  });

  const connectToRoom=()=>{
    socket.emit('join-room',room);
    setisLogged(true);
    // setMembers([...members,{room:room,userName:userName}])
  }
  const sendMessage=(e)=>{
    let messageContent={
      room:room,
      content:{
      author:userName,
      message:msg
      } 
    }
    socket.emit('send-message',messageContent);
    setMsgList([...msgList,messageContent.content])
    setMsg("");
    // console.log(e.target);
    // e.target.value="";
  }
  const handleRoom=(e)=>{
    setRoom(e.target.value)
    inputRoom.current.value=room;

    
  }
 
  return (
     <>
    
      {isLogged? 
      <div className="chat-screen">
        <div className="chat-area">
        {msgList.map((chat)=>{
          return  <div className="single-msg" ref={divRef}>
            
            <div className={userName==chat.author?"me":"others"}>
              
            <div className="color-here" >
              <h3 className="h3">{chat.message} <span className="tiny">{chat.author}</span> </h3>
            </div>
            
              
              
            </div>
            
            </div>
            
        })}
        {/* {members.map((members)=>{
          (room==members.room)?<h1>{members.userName}</h1>: <div></div>
        })} */}
        </div>
        <Box className="msg-input">
          <TextField  className="msg-input"  autoFocus="true" placeholder="Type a message" variant="outlined" type="text" value={msg} onChange={(e)=>{setMsg(e.target.value)}}  onKeyDown={(e)=>{
            if(e.key === 'Enter')
            {
              e.preventDefault();
              sendMessage()
            }
          }} />
          <Button className="send-btn"  variant="outlined" onClick={sendMessage} color="primary">Send</Button>
        </Box>
      </div> 

      : 
     
      <div  className="screen">
      <form className="input_" onSubmit={connectToRoom}>
        <div className="input__name">
          <i className="far fa-user"></i>
        <input type="text" id="name"  required="true" placeholder="User Name" onChange={(e)=>setUserName(e.target.value)}/>
        </div>
        <div className="input__room">
        <i className="fas fa-icons"></i>
        <input ref={inputRoom} type="text" id="room" placeholder="Room (Select from below)" required="true" onChange={(e)=>setRoom(e.target.value)}/>
        </div>
        <div className="input__btn">
        <button type="submit"  id="btn">Join Room</button>
        </div>
        
      </form>
      <div className="input_room">
       <i className="far fa-comment fa-4x" ></i>

        <div>
        <button id="btn" onClick={handleRoom} value="Advice">Advice</button>
        <button id="btn" onClick={handleRoom} value="Music">Music</button>
        <button id="btn" onClick={handleRoom} value="Fashion">Fashion</button>
        <button id="btn" onClick={handleRoom} value="Travel">Travel</button>
        </div>
        
      </div>
     </div>
      }
      
    
     </>
  );
}

export default App;
