/**
 * noteForm View
 */

(function( APP ){

var MODELS = APP.models,
    MODS = APP.mods,
    VIEWS = APP.views,
    TOUCH = MODS.touch,
    TPL = MODS.tpl;

TPL.require( [ 'noteForm' ], function(){

    var Vform = Backbone.View.extend({

        initialize: function(){

            _.extend( this, Backbone.Events );
            
            this.el = $( TPL.get( 'noteForm' ) );
            this.content = this.$( '#J_note-content' );
            this.tag = this.$( '#J_note-tag' );
            this.close = this.$( '#J_note-close' );

            this.render();

            // MODEL 数据变化时
            this.model.bind( 'change', this.render, this );
            // MODEL 变更时
            this.bind( 'modelChange', this.render, this );
            // 绑定关闭事件
            TOUCH.click( this.close[ 0 ], this.hide, this );

        },

        events: {

        },

        render: function(){

            var model = this.model;

            if( model ){

                this.content.val( model.get( 'content' ) );
                this.tag.val( model.get( 'tag' ) );
            }
            else {

                this.content.val('');
                this.tag.val('');
            }
        },

        setModel: function( m ){

            this.model = m;
            this.trigger( 'modelChange' );
        },

        removeModel: function(){

            this.model = null;
            this.trigger( 'modelChange' );
        },

        show: function(){

            this.el.removeClass( 'note-form-hide' );
            this.el.addClass( 'note-form-show' );
        },

        hide: function(){
            this.el.removeClass( 'note-form-show' );
            this.el.addClass( 'note-form-hide' );
        }
    });

    VIEWS[ 'noteForm' ] = Vform;

});



})( window[ 'freenote' ]);
