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
    const firepadRef = firebase.database().ref(`/${doc}`); //// Get Firebase Database reference.
    const codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });
    const uid = document.getElementById('firepad').getAttribute('name');
    // Create Firepad (with rich text toolbar and shortcuts enabled).
    const firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        richTextShortcuts: true,
        richTextToolbar: true,
        userId : uid,
        defaultText: 'Document Created !'
    })    
}

document.getElementsByTagName('button')[0].addEventListener('click',()=>{ //open file
    let doc= document.getElementsByTagName('input')[0].value.trim();
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
    if(doc.length<=3)
      alert('File Name must be atleast 4 characters');
    else{
        document.getElementsByTagName('button')[2].disabled=false;
        document.getElementsByTagName('button')[1].disabled=true;
        document.getElementsByTagName('button')[0].disabled=true;
        let id = document.getElementsByTagName('input')[0].getAttribute('id');
        socket.emit('doc',{doc : doc , op: 'create', id: id});
    }  
})


  
   