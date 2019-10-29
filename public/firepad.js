var firepad, firepadRef, codeMirror,arr=[];
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAyQFsGbUQ-LffYj9h4BqnrqUk2Atu-498",
    authDomain: "collaboration-3170.firebaseapp.com",
    databaseURL: "https://collaboration-3170.firebaseio.com",
    projectId: "collaboration-3170",
    storageBucket: "collaboration-3170.appspot.com",
    messagingSenderId: "970071591763",
    appId: "1:970071591763:web:f011b2b2908d4dee76efa6",
    measurementId: "G-GXVT1SJK8G"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function config(doc){
    firepadRef = firebase.database().ref(`/${doc.id}`); //// Get Firebase Database reference.
    codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
    uid = document.getElementById('firepad').getAttribute('name');
    document.getElementById('firepad').style.display = 'block';
    document.getElementById('firepad').style.pointerEvents= 'auto';
    document.getElementsByTagName('input')[0].setAttribute('id',doc.id);
    firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {// Create Firepad (with rich text toolbar and shortcuts enabled).
        richTextShortcuts: true,
        richTextToolbar: true,
        userId : uid
    })

    firepad.on('ready',()=>{  
        if(doc.content && firepad.isHistoryEmpty())
            firepad.setHtml(doc.content);
    })

    let users = firebase.database().ref(`/${doc.id}`).child('/users');
    users.on('child_added',(snap)=>{
        sessionStorage.setItem(snap.key, snap.val().color);
    })

    if(document.querySelector('.offline')){
        let d = document.querySelector('.offline');
        d.classList.remove('offline');
        d.classList.add('online');
    }    
}

document.getElementsByTagName('button')[0].addEventListener('click',()=>{ //open file
    let doc= document.getElementsByTagName('input')[0].value.trim();
    if(document.getElementById('firepad').children.length==1)
        document.getElementById('firepad').removeChild(document.getElementById('firepad').lastElementChild);

    if(doc.length<=3)
      alert('File Name must be atleast 4 characters');
    else{
        document.getElementsByTagName('button')[2].disabled=false;
        document.getElementsByTagName('button')[0].disabled=true;
        document.getElementsByTagName('button')[1].disabled=true;
        socket.emit('doc',{doc : doc , op: 'open'});
    }  
})

document.getElementsByTagName('button')[1].addEventListener('click',()=>{ //create file
    let doc= document.getElementsByTagName('input')[0].value.trim();
    if(document.getElementById('firepad').children.length==1)
        document.getElementById('firepad').removeChild(document.getElementById('firepad').lastElementChild);

    if(doc.length<=3)
      alert('File Name must be atleast 4 characters');
    else{
        document.getElementsByTagName('button')[2].disabled=false;
        document.getElementsByTagName('button')[1].disabled=true;
        document.getElementsByTagName('button')[0].disabled=true;
        let id = document.getElementById('firepad').getAttribute('uid');
        socket.emit('doc',{doc : doc , op: 'create', id: id});
    }  
})

document.getElementsByTagName('button')[2].addEventListener('click',async ()=>{ //save file
    let text =  firepad.getHtml();
    let id = document.getElementsByTagName('input')[0].getAttribute('id');   
    socket.emit('save',{id,text});
    await firepadRef.remove(); 
})

document.getElementById('firepad').addEventListener('keyup',()=>{
    let rid = document.getElementsByTagName('input')[0].getAttribute('id');
    let cursorPos = codeMirror.getCursor();
    let name =  document.getElementById('firepad').getAttribute('name');
    let color = sessionStorage.getItem(name);
    socket.emit('co-ordinates',[rid,{cursorPos, name},color]);
})
  
   