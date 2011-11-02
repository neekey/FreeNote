(function( APP ){

var MODS = APP.mods,
    MODELS = APP.models,
    VIEWS = APP.views,
    TOUCH = MODS.touch,
    TRANS = MODS.transform,
    SCREEN = MODS.screen,
    TPL = MODS.tpl;

    window[ 'stack' ] = 0;
var app = function(){

$( document ).ready(function(){

    var toggleHandle = $( '#J_toggle-handle' ),
        toolCon = $( '#J_tool-con' ),
        notesStage = $( '#J_notes-stage' );

    // ====== noteStage 初始化 ======

    // 初始化noteStage的位置
    var stageW = parseInt( notesStage.css( 'width' ) ),
        stageH = parseInt( notesStage.css( 'height' ) );

    // 设置noteStage
    var MnoteStage = new MODELS[ 'noteStage' ],
        VnoteStage = new VIEWS[ 'noteStage' ]({
            model: MnoteStage,
            el: notesStage
        });


    // ====== 工具面板 ======

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

    toggleHandle.tap( function( e ){
        alert( 'test' );
    });

    // 添加设置面板的下拉效果
    toolCon.drag({
        handlers: toggleHandle,
        dir: 'y'
    });
    
    toolCon.bind( 'dragEnd', function(){

        TRANS.set( this, 'translate', { x: 0, y: 0 } );

        if( toolCon.hasClass( 'unfold' ) ){

            toolCon.removeClass( 'unfold' ).addClass( 'fold' );
            toggleHandle.removeClass( 'toggle-up').addClass( 'toggle-down');
        }
        else {
            toolCon.removeClass( 'fold' ).addClass( 'unfold' );
            toggleHandle.removeClass( 'toggle-down').addClass( 'toggle-up');
        }
    });

    // ====== noteForm ======
    var Vnote = new VIEWS[ 'noteForm' ](),
        Mnotes = new MODELS[ 'notes' ];
        var notesStr = '';

    Mnotes.each(function( note ){

        var noteItem  = new VIEWS[ 'noteItem' ]( {
            model: note,
            noteForm: Vnote
        });

        // 绑定编辑事件
        noteItem.bind( 'noteTouch', function(){

            Vnote.editNote( this.model );
        });

        notesStr += JSON.stringify( note.toJSON() );
    });

    // alert( notesStr );
    // localStorage.clear();

    // 点击空白 添加笔记
    notesStage.dbTap( function( e ){
        
        var trans = TRANS.get( notesStage[ 0 ], 'translate' );

        Vnote.createNote({
            x: e.data.pageX - trans.x,
            y: e.data.pageY - trans.y
        });
    });

    Vnote.bind( 'noteAdd', function( note ){
        
        var noteItem  = new VIEWS[ 'noteItem' ]( {
            model: Mnotes.create( note ),
            noteForm: Vnote
        });

        // 绑定编辑事件
        noteItem.bind( 'noteTouch', function(){

            Vnote.editNote( this.model );
        });
    });


    var ModelTest = MODS.modelTest;
    // ModelTest();
});
};

TPL.require( [ 'noteForm', 'noteItem' ], function(){

    // localStorage.clear();
    // 添加stage的位置信息的保存
    app();
});

})( window[ 'freenote' ] );
