(function( APP ){

var MODS = APP.mods;
    MODELS = APP.models;

var ClNotes = new MODELS[ 'notes' ]();

var test = function(){

    $( document ).ready( function(){

        var iptContent = $( '#J_note-content' ),
            iptTag = $( '#J_note-tag' ),
            btnAdd = $( '#J_note-add' );

        btnAdd.bind( 'click', function(){

            var content = iptContent.val(),
                tag = iptTag.val(),
                tags = tag.split(/\s*/);

            if( content ){

                ClNotes.create({
                    content: content,
                    tags: tags
                });
            }
        });
    });
}

MODS[ 'modelTest' ] = test;

})( window[ 'freenote' ]);