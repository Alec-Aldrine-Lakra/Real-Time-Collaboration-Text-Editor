'use strict';
var marker,t;

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

socket.on('users',result=>{   //sending users list first time when user enters a room              
    let e = document.getElementById('users'); //Remove pre-existing nodes 
    let child = e.lastElementChild;  
    while (child) { 
        e.removeChild(child); 
        child = e.lastElementChild; 
    } 
    let id = document.getElementById('firepad').getAttribute('uid');
    for(let i=0; i< result.length; i++){ //update nodes
        if(result[i].uid === id)
            continue;
        let l = document.createElement('li');
        l.setAttribute('id',result[i].uid);
        let n = document.createTextNode(result[i].fname); //name of person who is online
        l.appendChild(n);
        document.getElementById('users').appendChild(l);
    }
})

socket.on('userjoins',user=>{ //inform the entire room that a new user has joined
    createModal(`${user.fname} has joined the collaboration`);
})

socket.on('userleft', user=>{ //inform the entire room that a user has left
    createModal(`${user.fname} has left the collaboration`);
})

socket.on('doc',id=>{
    config(id); //creating a new file in firebase named object id of the doc
})

socket.on('message', message=>{
    if(message!='Document Saved' && document.querySelector('.online')){
        let d = document.querySelector('.online');
        d.classList.remove('online');
        d.classList.add('offline');
    }
    document.getElementsByTagName('button')[2].disabled=true;
    document.getElementsByTagName('button')[1].disabled=false;
    document.getElementsByTagName('button')[0].disabled=false;
    createModal(message);
    if(message=='Document Saved')
       document.getElementById('firepad').style.pointerEvents= 'none';
})

socket.on('co-ordinates', ([cursor,c])=>{
    clearTimeout(t);
    if(marker)
        marker.clear();
    let {cursorPos, name} = cursor;
    const cursorElement = document.createElement('span');
    cursorElement.appendChild(document.createTextNode(name));
    cursorElement.style.backgroundColor = c;
    cursorElement.setAttribute('name',name);
    // Set the generated DOM node at the position of the cursor sent from another client
    // setBookmark first argument: The position of the cursor sent from another client
    // Second argument widget: Generated DOM node
    marker = codeMirror.setBookmark(cursorPos, { widget: cursorElement });
    t = setTimeout(()=>{
        marker.clear();
    },7000);
});

const disconnect = () => { //socket disconnect
    socket.disconnect();
}

function createModal(m){
    if(document.querySelector('.modal'))
         document.body.removeChild(document.querySelector('.modal'));
    let d1 = document.createElement('div');
    d1.classList.add('modal','fade');
    d1.setAttribute('role','dialog');
    let d2= document.createElement('div');
    d2.classList.add('modal-dialog','modal-lg');
    let d3 = document.createElement('div');
    d3.classList.add('modal-content');
    let d4 = document.createElement('div');
    d4.classList.add('modal-header');
    let h5 = document.createElement('h5');
    h5.classList.add('modal-title');
    h5.appendChild(document.createTextNode(m));
    d4.appendChild(h5);
    d3.appendChild(d4);
    d2.appendChild(d3);
    d1.appendChild(d2);
    document.body.appendChild(d1);
    $('.modal').modal('show');
    setTimeout(()=>{
        $('.modal').modal('hide');
    },2000)
}

socket.open();

