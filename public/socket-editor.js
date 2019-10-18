'use strict';
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
const socketUrl = 'http://localhost:3000';
let socket = io(socketUrl, {
    autoConnect: false
})
socket.on('connect', () => {
    let name = document.getElementById('firepad').getAttribute('name');
    let id = document.getElementsByTagName('input')[0].getAttribute('id');
    socket.emit('user',{name, id});
    console.log('Connected');
})
/*socket.on('content',message=>{ //getting data from previously created doc
    document.getElementById('text').setAttribute('contenteditable',true);
    document.getElementById('text').innerHTML = message;
})
socket.on('message',(message,name,fn)=>{ //display message
    clearTimeout(t);
    document.getElementsByTagName('input')[0].value = fn;
    document.getElementById('text').setAttribute('contenteditable',true);
    document.getElementById('text').innerHTML = message;
    document.getElementById('text').setAttribute('title',`${name} typing...`);
    document.getElementById('text').setAttribute('data-original-title',`${name} typing...`);
    $('#text').tooltip({trigger:'manual'}).tooltip('show');
    addLines(document.getElementById('text'));
    t = setTimeout(()=>{
        document.getElementById('text').setAttribute('title',``);
        document.getElementById('text').setAttribute('data-original-title',``);
        $('#text').tooltip({trigger:'manual'}).tooltip('hide');
    },1500);
})
socket.on('users',result=>{   //display online users                
    let e = document.getElementById('users'); //Remove pre-existing nodes 
    let child = e.lastElementChild;  
    while (child) { 
        e.removeChild(child); 
        child = e.lastElementChild; 
    } 
    let text = document.getElementById('text').getAttribute('name');
    for(let i=0; i< result.length; i++){ //update nodes
        if(result[i].fname===text)
            continue;
        let l = document.createElement('li');
        let n = document.createTextNode(result[i].fname);
        l.appendChild(n);
        document.getElementById('users').appendChild(l);
    }
})
socket.on('logs',data=>{ //create logs
    let e = document.getElementById('logs'); //Remove pre-existing nodes 
    let child = e.lastElementChild;  
    while (child) { 
        e.removeChild(child); 
        child = e.lastElementChild; 
    }
    for(let i=0; i< data.length; i++){ //update nodes
        let l = document.createElement('li');
        l.setAttribute('class','text-justify');
        let n = document.createTextNode(data[i].name+ ' - ' + `"${data[i].content}"`);
        l.appendChild(n);
        document.getElementById('logs').appendChild(l);
    }
})*/

socket.on('doc',id=>{
    config(id); //creating a new file in firebase named object id of the doc
})
socket.on('err', message=>{
    document.getElementsByTagName('button')[2].disabled=true;
    document.getElementsByTagName('button')[1].disabled=false;
    document.getElementsByTagName('button')[0].disabled=false;
    alert(message);
})
const disconnect = () => { //socket disconnect
    socket.disconnect();
}
socket.open();

