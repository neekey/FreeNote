
var iptName = null,
	iptNote = null,
    iptId = null,
    iptTag = null,
	btAdd = null,
	btUpdate = null,
	btDel = null,
    resultCon = null;

$( document ).ready(function(){

    iptName = $( '#J_username' );
    iptNote = $( '#J_note' );
    iptId = $( '#J_id' );
    iptTag = $( '#J_tag' );
    btAdd = $( '#J_add' );
    btUpdate = $( '#J_update' );
    btDel = $( '#J_del' );
    resultCon = $( '#J_result ');

    btAdd.bind( 'click', function(){

        var name = iptName.val(),
            note = iptNote.val(),
            tags = iptTag.val().replace( /^(\s+)|(\s+)$/g, '' ).split(/\s+/);

        if( name && note ){

            $.ajax({
                type: 'POST',
                data: {
                    type: 'add',
                    name: name,
                    note: note,
                    tags: tags
                },
                url: '/unittest/mongoNoteHandle/',
                success: function( data ){

                    console.log( data );
                    resultCon.html( JSON.stringify( data ) );
                },
                error: function( err ){

                    console.log( err );
                    resultCon.html( JSON.stringify( err ) );
                },
                dataType: 'json'
            });
        }
    });

    btUpdate.bind( 'click', function(){

        var name = iptName.val(),
            note = iptNote.val(),
            id = iptId.val(),
            tags = iptTag.val().replace( /^(\s+)|(\s+)$/g, '' ).split(/\s+/);

        if( name && note ){

            $.ajax({
                type: 'POST',
                data: {
                    type: 'update',
                    name: name,
                    note: note,
                    tags: tags,
                    id: id
                },
                url: '/unittest/mongoNoteHandle/',
                success: function( data ){

                    console.log( data );
                    resultCon.html( JSON.stringify( data ) );
                },
                error: function( err ){

                    console.log( err );
                    resultCon.html( JSON.stringify( err ) );
                },
                dataType: 'json'
            });
        }

    });

    btDel.bind( 'click', function(){

        var name = iptName.val(),
            id = iptId.val();

        $.ajax({
            type: 'POST',
            url: '/unittest/mongoNoteHandle/',
            data: {
                type: 'del',
                name: name,
                id: id
            },
            success: function( data ){

                console.log( data );
                resultCon.html( JSON.stringify( data ) );
            },
            error: function( err ){

                console.log( err );
                resultCon.html( JSON.stringify( err ) );
            },
            dataType: 'json'
        });
    });

});
