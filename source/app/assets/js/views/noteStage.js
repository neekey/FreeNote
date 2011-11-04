/**
 * noteStage view
 */
(function( APP ){

var MODS = APP.mods,
    VIEWS = APP.views,
    SCREEN = MODS.screen;

var VnoteStage = Backbone.View.extend({

    initialize: function(){

        var that = this, screenInfo = SCREEN.info;

        _.extend( this, Backbone.Events );

        this.model.bind( 'change', this.position, this );

        this.el.bind( 'dragEnd', function(){

            that.render();
        });

        if( this.model.get( 'located' ) ){

            this.position();
        }
        else {

            this.iniLocate();
            this.model.set({ located: true } );
        }

        // 添加拖拽
        this.el.drag();

        // 设置parent的宽高
        this.el.parent().width( screenInfo.width );
        this.el.parent().height( screenInfo.height );
        $( document.documentElement ).height( screenInfo.height );
        $( document.documentElement ).width( screenInfo.width );
        $( document.body ).height( screenInfo.height );
        $( document.body ).width( screenInfo.width );
        

    },

    iniLocate: function(){

        this.model.set( {
            x: parseInt( this.el.css( 'width' ) ) / 2 * ( -1 ),
            y: parseInt( this.el.css( 'height' ) ) / 2 * ( -1 )
        });
    },
    /**
     * 根据view来更新mdoel
     */
    render: function(){

        var trans = this.el.transform( 'get', 'translate' );

        this.model.set( trans, {
            silent: true
        });

        this.model.save({}, { silent: true });
    },

    /**
     * 根据model 来更新view
     */
    position: function(){

        var model = this.model.toJSON();

        this.el.transform( 'set', { translateX: model.x, translateY: model.y } );
    },

    show: function(){

        alert( 'showe' );
        var that = this;
        //this.el.show();
        this.el.transform( 'anim', { scale: 1 }, 0.2, 'linear', function(){
            alert( that.el.css( 'webkitTransform') );
        });

    },

    hide: function(){

        //this.el.hide();
        this.el.transform( 'anim', { scale: 0 }, 0.2 );

    },

    /**
     * 设置noteStage的位置偏移量
     * @param x
     * @param y
     */
    scrollTo: function( x, y ){
        //Todo 解决动画scroll出现空白的bug
        this.el.transform( 'anim', { translateX: trans.x, translateY: trans.y }, 0.5, 'linear', function(){

            var trans = that.el.transform( 'get', 'translate' ),
                scale = that.el.transform( 'get', 'scale' ),
                rotate = that.el.transform( 'get', 'rotate' );
        });

        this.el.transform( 'set', { translateX: x, translateY: y } );

    },

    /**
     * 滚动stage使得指定note处于屏幕中央
     * @param m
     */
    //todo 解决定位的问题
    scrollToNote: function( m ){

        var model = m.toJSON(),
            trans = this.el.transform( 'get', 'translate' ),
            screenInfo = SCREEN.info,
            dest = {
                x: parseInt( - model.x - trans.x + screenInfo.width / 3 ),
                y: parseInt( - model.y - trans.y + screenInfo.height / 4 )
            };

        this.scrollTo( dest.x + trans.x, dest.y + trans.y );
    }
});

VIEWS[ 'noteStage' ] = VnoteStage;

})( window[ 'freenote' ] );