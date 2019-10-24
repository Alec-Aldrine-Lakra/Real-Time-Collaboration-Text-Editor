'use strict';
var marker;
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
const socketUrl = 'http://localhost:3000';
let socket = io(socketUrl, {
    autoConnect: false
})
socket.on('connect', () => {
    let name = document.getElementById('firepad').getAttribute('name');
    let id =  document.getElementById('firepad').getAttribute('uid');
    socket.emit('user',{name, id});
    console.log('Connected');
})

socket.on('users',result=>{   //display online users                
    let e = document.getElementById('users'); //Remove pre-existing nodes 
    let child = e.lastElementChild;  
    while (child) { 
        e.removeChild(child); 
        child = e.lastElementChild; 
    } 
    let id = document.getElementById('firepad').getAttribute('uid');
    for(let i=0; i< result.length; i++){ //update nodes
        if(result[i].uid==id)
            continue;
        let l = document.createElement('li');
        l.setAttribute('id',result[i].uid);
        let n = document.createTextNode(result[i].fname);
        l.appendChild(n);
        document.getElementById('users').appendChild(l);
    }
})

socket.on('doc',id=>{
    config(id); //creating a new file in firebase named object id of the doc
})

socket.on('message', message=>{
    document.getElementsByTagName('button')[2].disabled=true;
    document.getElementsByTagName('button')[1].disabled=false;
    document.getElementsByTagName('button')[0].disabled=false;
    alert(message);
})

socket.on('co-ordinates', (cursor)=>{
    console.log('Clicked');
    if(marker)
        marker.clear();
    let {cursorPos, name} = cursor;
    const cursorElement = document.createElement('span');
    cursorElement.appendChild(document.createTextNode(name));
    cursorElement.style.backgroundColor = 'black';
    cursorElement.style.color = 'white';
    cursorElement.setAttribute('name',name);
    cursorElement.style.zIndex = 3;
    cursorElement.style.padding = '3px';
    // Set the generated DOM node at the position of the cursor sent from another client
    // setBookmark first argument: The position of the cursor sent from another client
    // Second argument widget: Generated DOM node
    marker = codeMirror.setBookmark(cursorPos, { widget: cursorElement });
});

const disconnect = () => { //socket disconnect
    socket.disconnect();
}
socket.open();

