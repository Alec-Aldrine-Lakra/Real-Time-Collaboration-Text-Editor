const QuillCursors = require('quill-cursors');
Quill.register('modules/cursors', QuillCursors);

var editor = new Quill('#text', {
    modules: {
        cursors :true,
        toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
        ]
    },
    placeholder: 'Compose an Epic...',
    theme: 'snow'  // or 'bubble'
});

editor.on('text-change', function(delta, source) {
        //socket.emit('text change', {'who': my_id, 'delta': JSON.stringify(delta)});
});