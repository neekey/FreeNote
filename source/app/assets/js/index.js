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

    var notesStage = $( '#J_notes-stage' );

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

    var VtoolMenu = new VIEWS[ 'toolMenu' ];

    // ====== noteForm ======
    var VnoteForm = new VIEWS[ 'noteForm' ](),
        Mnotes = new MODELS[ 'notes' ];
        var notesStr = '';

    Mnotes.each(function( note ){

        var noteItem  = new VIEWS[ 'noteItem' ]( {
            model: note,
            noteForm: VnoteForm
        });

        // 绑定编辑事件
        noteItem.bind( 'noteTouch', function(){

            VnoteForm.editNote( this.model );
        });

        notesStr += JSON.stringify( note.toJSON() );
    });

    // alert( notesStr );
    // localStorage.clear();

    // 点击空白 添加笔记
    notesStage.tap( function( e ){
        
        var trans = notesStage.transform( 'get', 'translate' );

        VnoteForm.createNote({
            x: e.data.pageX - trans.x,
            y: e.data.pageY - trans.y
        });
    });

    VnoteForm.bind( 'noteAdd', function( note ){

        var newModel = Mnotes.create( note ),
            noteItem  = new VIEWS[ 'noteItem' ]( {
            model: newModel,
            noteForm: VnoteForm
        });

        // 绑定编辑事件
        noteItem.bind( 'noteTouch', function(){

            VnoteForm.editNote( this.model );
        });

        VnoteStage.scrollToNote( noteItem.model );
    });

    VnoteForm.bind( 'noteSave', function( m ){

        VnoteStage.scrollToNote( m );
    });

    VnoteForm.bind( 'show', function(){

        VnoteStage.hide();
    });

    VnoteForm.bind( 'hide', function(){

        VnoteStage.show();
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
