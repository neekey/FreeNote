(function( APP ){

var MODS = APP.mods,
    MODELS = APP.models,
    VIEWS = APP.views,
    SCREEN = MODS.screen,
    TPL = MODS.tpl;

var app = function(){

$( document ).ready(function(){

    // ====== noteStage 初始化 ======

    // 设置noteStage
    var MnoteStage = new MODELS[ 'noteStage' ],
        VnoteStage = new VIEWS[ 'noteStage' ]({
            model: MnoteStage
        });

    // ====== 工具面板 ======

    var VtoolMenu = new VIEWS[ 'toolMenu' ];

    // ====== noteForm ======
    var VnoteForm = new VIEWS[ 'noteForm' ](),
        Mnotes = new MODELS[ 'notes' ];

    Mnotes.each(function( note ){

        var noteItem  = new VIEWS[ 'noteItem' ]( {
            model: note,
            noteForm: VnoteForm
        });

        // 绑定编辑事件
        noteItem.bind( 'noteTouch', function(){

            VnoteForm.editNote( this.model );
        });
    });

    Mnotes.bind( 'add', function( m ){

        var noteItem  = new VIEWS[ 'noteItem' ]( {
            model: m,
            noteForm: VnoteForm
        });

        // 绑定编辑事件
        noteItem.bind( 'noteTouch', function(){

            VnoteForm.editNote( this.model );
        });

    });

    // 点击空白 添加笔记
    VnoteStage.bind( 'tap', function( e ){
        
        var stage = VnoteStage.el,
            trans = stage.transform( 'get', 'translate' );

        VnoteForm.createNote({
            x: e.data.pageX - trans.x,
            y: e.data.pageY - trans.y
        });
    });

    // 点击表单的添加
    VnoteForm.bind( 'noteAdd', function( note ){

        var newModel = Mnotes.create( note );

        VnoteStage.scrollToNote( newModel );
    });

    // 点击表单的保存
    VnoteForm.bind( 'noteSave', function( m ){
        
        VnoteStage.scrollToNote( m );
    });

    // 表单显示
    VnoteForm.bind( 'show', function(){

        VnoteStage.hide();
    });

    // 表单隐藏
    VnoteForm.bind( 'hide', function(){

        VnoteStage.show();
    });


    // firebug fix
    //$( '#FirebugUI' ).css( 'position', 'absolute' );
    // $( '#fbWindowButtons' ).css( 'right', 'auto' ).css( 'left', '200px' );
});
};

TPL.require( [ 'noteForm', 'noteItem' ], function(){

     localStorage.clear();
    // 添加stage的位置信息的保存
    app();
});

})( window[ 'freenote' ] );
