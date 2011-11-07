/**
 * 下拉菜单
 */

(function( APP ){

var VIEWS = APP.views;

var VtoolMenu = Backbone.View.extend({

    initialize: function(){

        var that = this;

        this.el = $( '#J_tool-con' );
        this.handler = $( '#J_toggle-handle' );
        this.ifFold = true;

        // 设置拖拽
        this.el.drag({
            handlers: this.handler,
            dir: 'y'
        });

        this.el.bind( 'dragEnd', function(){

            if( that.ifFold ){

                that.unfold();
            }
            else {
                
                that.fold();
            }
        });

    },

    fold: function(){

        var that = this;
        
        this.el.transform( 'anim', { translateY: 0 }, 0.2, 'ease-out', function(){

            that.handler.removeClass( 'toggle-up').addClass( 'toggle-down');
            that.ifFold = true;
        });
    },

    unfold: function(){

        var that = this,
            height = this.el.height();

        this.el.transform( 'anim', { translateY: height }, 0.2, 'linear', function(){

            that.handler.removeClass( 'toggle-down').addClass( 'toggle-up');
            that.ifFold = false;
        });
    }
});

VIEWS[ 'toolMenu' ] = VtoolMenu;

})( window[ 'freenote' ] );