`use strict`;
const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const server = http.createServer(app);
const socket = require('socket.io');
const Online = require('../model/online-model');
const Docs = require('../model/docs-model');
const Logs = require('../model/logs-model.js');
const creds = require('../config/creds.json');
const io = socket(server);

const mongoose = require('mongoose');
const mongoDB = creds.db_uri;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../view'));
app.use(express.static(path.join(__dirname,'../public')));
app.use(require(path.join(__dirname,'../controller/account')))

io.on('connection',(socket)=>{
    console.log(`User Connected To Socket Id: ${socket.id}`);  
    socket.on('user',async (ob)=>{ //Adding the new user to online database
        let user = new Online({uid: ob.id, fname : ob.name, sid: socket.id});
        await user.save();
    })

    socket.on('disconnect',async ()=>{
      let user = await Online.findOne({sid : socket.id},{_id:0, fname:1, roomid : 1});
       await Online.deleteOne({sid : socket.id});
       if(user.roomid){
            socket.broadcast.to(user.roomid).emit('userleft',user); //old user left
            let users = await Online.find({roomid: user.roomid},{_id:0,uid:1,fname:1});
            socket.broadcast.to(user.roomid).emit('users',users);
       }  
       console.log(`User Disconnected At Socket Id: ${socket.id}`); 
    })

    socket.on('doc',async (v)=>{
        if(v.op==='open'){ //file open
            let d = await Docs.findOne({name:v.doc},{_id:1,content: 1}); //searching of file exists
            if(d){
                let roomid = d._id;
                socket.join(roomid);
                await Online.updateOne({sid : socket.id},{roomid});
                socket.emit('doc',{id: d._id,content: d.content});

                let user =  await Online.findOne({sid : socket.id},{_id:0, fname: 1});
                socket.broadcast.to(roomid).emit('userjoins',user); //new user 
                let users = await Online.find({roomid},{_id:0,uid:1,fname:1});
                io.to(roomid).emit('users',users); //sending everyone online user list to the user
            }
            else
                socket.emit('message','Error : File Not Found');
        }
        else if(v.op==='create'){ //file create
            let d = await Docs.findOne({name:v.doc},{_id:1}); //searching if file exists
            if(d)
                socket.emit('message','Error : File Already Exists');
            else{
                let doc = new Docs({name: v.doc, created_by: v.id});
                await doc.save();
                let d = await Docs.findOne({name:v.doc},{_id:1});
                let roomid = d._id;
                socket.join(roomid);
                await Online.updateOne({sid : socket.id},{roomid});
                socket.emit('doc',{id: roomid, content: null});


                let user =  await Online.findOne({sid : socket.id},{_id:0, uid:1, fname: 1});
                socket.broadcast.to(roomid).emit('userjoins',user); //new user joined
                let users = await Online.find({roomid},{_id:0,uid:1,fname:1});
                io.to(roomid).emit('users',users); //sending everyone online user list to the user
            }
        }
    })

    socket.on('save',async(doc)=>{
        await Docs.updateOne({_id : doc.id},{content : doc.text});
        io.to(doc.id).emit('message','Document Saved');
    })

    socket.on('co-ordinates', ([rid , cd,c])=>{
        socket.broadcast.to(rid).emit('co-ordinates',[cd,c]);
    })
})

server.listen(creds.port,()=>{
    console.log(`Server started at port ${creds.port}`);
})