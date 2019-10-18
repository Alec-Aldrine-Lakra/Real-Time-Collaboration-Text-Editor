const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const server = http.createServer(app);
const socket = require('socket.io');
const Online = require('../model/online-model');
const User = require('../model/user-model');
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
    console.log(`User connected To Socket Id: ${socket.id}`);
    socket.on('user',async (ob)=>{ //Adding the new user to online database
        let user = new Online({uid: ob.id, fname : ob.name, sid: socket.id});
        await user.save();
        emitEverywhere();
    })
    socket.on('disconnect',async ()=>{
       let d = await Online.deleteOne({sid : socket.id});
       console.log(d);
       emitEverywhere();
    })
    /*socket.on('message',async (m,fname,fn)=>{ //fetching data to all other users connected
        let s={}; //removing div and br tags 
        let d = await Docs.findOne({name: fn},{_id:1});
        if(d === null){ //Checking if the doc exists from before
            let doc = new Docs({name:fn, content:m});
            s = await doc.save();
            if(s)
                console.log('Doc Created');
        }
        else
            await Docs.updateOne({name:fn},{content : m}); //updates the doc if it already exists

        let user = await User.findOne({fname: fname},{_id:1}); //finding _id of user who is typing
        let uid = user.id;
        let did = s._id || d._id ;
        let l = await Logs.findOne({did},{_id:1}); //getting the doc id
        if(l===null){ //If document does not exist in the log
            let log = new Logs({uid, did, sub_content:'Created the Document'}); //Creating the first log of document
            await log.save();
            console.log('Log Updated first time');
        }
        else{
            let f = await Logs.find({did}).sort({ '_id' : -1 }).limit(1); //Finding the latest record
            if(f[0].uid.equals(uid) && f[0].sub_content !== 'Created the Document') //If user just created the document and is editing
                await Logs.updateOne({_id : f[0]._id},{sub_content : m});
            else if (f[0].uid.equals(uid)==false){ //If different user is editing then add a new log
                let log = new Logs({uid, did, sub_content:m});
                await log.save();
            }
        }
        emitLogs(did);
        socket.broadcast.emit('message',m,fname,fn);
    })*/
    socket.on('doc',async (v)=>{
        if(v.op==='open'){ //file open
            let d = await Docs.findOne({name:v.doc},{_id:1});
            if(d)
                socket.emit('doc',d._id);
            else
                socket.emit('err','File Does Not Exist');
        }
        else if(v.op==='create'){ //file create
            let d = await Docs.findOne({name:v.doc},{_id:1});
            if(d)
                socket.emit('err','File Already Exists');
            else{
                let doc = new Docs({name: v.doc, created_by: v.id});
                await doc.save();
                let d = await Docs.findOne({name:v.doc},{_id:1});
                socket.emit('doc',d._id);
            }
        }
    })
});

const emitEverywhere = async ()=>{
    let users = await Online.find({},{_id:0,uid:1,fname:1})
    console.log(users);
}

const emitLogs= async (did)=>{
    let ls = await Logs.find({did},{_id:0,uid:1,sub_content:1});
    let p=[], r = new RegExp('</*[a-zA-Z]*>','g'); //removing tags from the actual sub-content to display in log
    for(let i=0; i<ls.length; i++){
        let n = await User.findOne({_id:ls[i].uid},{_id:0,fname:1});
        let exp =ls[i].sub_content.replace(r,'');
        p.push({name : n.fname, content : exp}); //Pushing all the logs in the array
    }
    io.emit('logs',p);
}

server.listen(creds.port,()=>{
    console.log(`Server started at port ${creds.port}`);
})