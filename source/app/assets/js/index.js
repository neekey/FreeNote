(function( APP ){

var MODS = APP.mods,
    MODELS = APP.models,
    VIEWS = APP.views,
    TOUCH = MODS.touch,
    TRANS = MODS.transform,
    SCREEN = MODS.screen,
    TPL = MODS.tpl;

var app = function(){

$( document ).ready(function(){

    var toggleHandle = $( '#J_toggle-handle' ),
        toolCon = $( '#J_tool-con' ),
        notesStage = $( '#J_notes-stage' );

    // 设置noteStage
    var MnoteStage = new MODELS[ 'noteStage' ],
        VnoteStage = new VIEWS[ 'noteStage' ]({
            model: MnoteStage,
            el: notesStage
        });

    TOUCH.drag( notesStage[ 0 ], notesStage[ 0 ], {
        
        move: function(){

            VnoteStage.trigger( 'move' );
        }
    });

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



    // noteForm veiw test
    Vnote = new VIEWS[ 'noteForm' ](),
        Mnotes = new MODELS[ 'notes' ];

    TOUCH.tab( notesStage[ 0 ], function(){

        Vnote.createNote();
    });

    Vnote.bind( 'noteAdd', function( note ){

        var noteItem  = new VIEWS[ 'noteItem' ]( {
            model: Mnotes.create( note ),
            noteForm: Vnote
        });

        noteItem.bind( 'noteTouch', function(){

            Vnote.editNote( this.model );
        });
    });

    (new VIEWS[ 'noteItem' ]( {
            model: Mnotes.create( { content: 'neekey', tags: [ '1', '2' ] } ),
            noteForm: Vnote
        })).bind( 'noteTouch', function(){

            Vnote.editNote( this.model );
        });


    var ModelTest = MODS.modelTest;
    // ModelTest();
});
};

TPL.require( [ 'noteForm', 'noteItem' ], function(){
    app();
});

})( window[ 'freenote' ] );
