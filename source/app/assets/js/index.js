(function( APP ){

var MODS = APP.mods,
    MODELS = APP.models,
    TOUCH = MODS.touch,
    TRANS = MODS.transform;

$( document ).ready(function(){

    var toggleHandle = $( '#J_toggle-handle' ),
        toolCon = $( '#J_tool-con' ),
        noteItem = $( '#J_note-item' ),
        notesStage = $( '#J_notes-stage' ),
        btnCancel = $( '#J_note-cancel' ),
        noteForm = $( '#J_note-form' );

    var stageW = parseInt( notesStage.css( 'width' ) ),
        stageH = parseInt( notesStage.css( 'height' ) );

    TRANS.set( notesStage[ 0 ], 'translate', {
        x: -parseInt( stageW / 2 ),
        y: -parseInt( stageH / 2 )
    });


    function touchStart( event ) {

        if( toolCon.hasClass( 'unfold' ) ){
            toolCon.removeClass( 'unfold' ).addClass( 'fold' );
            toggleHandle.removeClass( 'toggle-up').addClass( 'toggle-down');
        }
        else {
            toolCon.removeClass( 'fold' ).addClass( 'unfold' );
            toggleHandle.removeClass( 'toggle-down').addClass( 'toggle-up');

        }
    }

    // toggleHandle[ 0 ].addEventListener( 'touchstart', touchStart, false );
    //TOUCH.click( toggleHandle[ 0 ], touchStart );
    //toggleHandle.bind( 'click', touchStart );
    TOUCH.drag( toggleHandle[ 0 ], toolCon[ 0 ], {
        dir: 'y',
        move: function(){
            //alert( 'move');
        },
        touch: function(){
            //alert( 'touch');
        },
        end: function(){
            
            toolCon[ 0 ].style.webkitTransform = '';

            if( toolCon.hasClass( 'unfold' ) ){

                toolCon.removeClass( 'unfold' ).addClass( 'fold' );
                toggleHandle.removeClass( 'toggle-up').addClass( 'toggle-down');
            }
            else {

                toolCon.removeClass( 'fold' ).addClass( 'unfold' );
                toggleHandle.removeClass( 'toggle-down').addClass( 'toggle-up');
            }
        }
    } );

    TOUCH.drag( noteItem[ 0 ], noteItem[ 0 ] );
    TOUCH.drag( notesStage[ 0 ], notesStage[ 0 ], {
        move: function(){
        }
    });

    TOUCH.tab( notesStage[ 0 ], function(){


        noteForm.addClass( 'note-from-show' );
        noteForm.removeClass( 'note-form-hide' );
        
    });

    TOUCH.click( btnCancel[ 0 ], function(){

        noteForm.addClass( 'note-form-hide' );
        noteForm.removeClass( 'note-from-show' );
    });
    var ModelTest = MODS.modelTest;
    ModelTest();
});
})( window[ 'freenote' ] );
