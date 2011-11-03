/**
 * noteForm View
 */

(function( APP ){

var MODS = APP.mods,
    VIEWS = APP.views,
    SCREEN = MODS.screen,
    TPL = MODS.tpl;

TPL.require( [ 'noteForm' ], function(){

    var Vform = Backbone.View.extend({

        initialize: function(){

            var that = this, screenInfo = SCREEN.info;
            
            _.extend( this, Backbone.Events );
            
            this.el = $( TPL.get( 'noteForm' ) );
            this.content = this.$( '#J_note-content' );
            this.tags = this.$( '#J_note-tag' );
            this.btnClose = this.$( '#J_note-close' );
            this.btnAdd = this.$( '#J_note-add' );
            this.btnSave = this.$( '#J_note-save' );
            
            this.el.appendTo( '#content' );

            this.render();

            // MODEL
            this.bind( 'modelChange', this.render, this );

            this.btnClose.tap( function(){
                
                that.hide();
                that.removeModel();
            });

            this.btnAdd.tap( function(){

                that._noteAdd();
            });

            this.btnSave.tap( function(){

                that._noteSave();
            });

            this.hide();
        },

        events: {

        },

        render: function(){

            var model = this.model;

            if( model ){

                this.content.val( model.get( 'content' ) );
                this.tags.val( model.get( 'tags' ) );
            }
            else {

                this.content.val('');
                this.tags.val('');
            }
        },

        setModel: function( m ){

            this.model = m;
            this.trigger( 'modelChange' );
            this._modelInit();
        },

        removeModel: function(){

            this.model = null;
            this.trigger( 'modelChange' );
        },

        _modelInit: function(){

            if( this.model ){

                this.model.bind( 'change', this.render, this );
            }
        },

        editNote: function( model ){

            this.setModel( model );
            this._editInit();
            this.show();
        },

        _editInit: function(){

            this.btnAdd.hide();
            this.btnSave.show();
        },

        createNote: function( posInfo ){

            this.posX = posInfo.x;
            this.posY = posInfo.y;
            
            this._createInit( posInfo );
            this.show();
        },

        _createInit: function(){

            this.model
            this.btnSave.hide();
            this.btnAdd.show();
        },


        show: function(){

            this.trigger( 'show' );
            this.el.transform( 'anim', { scale: 1 }, 0.2, 'linear' );
        },

        hide: function(){

            this.trigger( 'hide' );
            this.el.transform( 'anim', { scale: 0 }, 0.2, 'linear' );
            this.setModel( null );
        },

        _noteAdd: function(){

            if( this.formCheck() ){
                this.trigger( 'noteAdd', {
                    content: this.content.val(),
                    tags: this.tags.val().split( /\s+/ ),
                    x: this.posX,
                    y: this.posY
                });

                this.hide();
            }
        },

        _noteSave: function(){

            if( this.formCheck() ){

                this.model.set({
                    content: this.content.val(),
                    tags: this.tags.val().split( /\s+/ )
                });

                this.hide();

                this.trigger( 'noteSave', this.model );
            }
        },

        formCheck: function(){

            var content = this.content.val(),
                tags = this.tags.val();

            if( content === '' || tags === '' ){

                return false;
            }
            else {
                return true;
            }
        }
    });

    VIEWS[ 'noteForm' ] = Vform;

});



})( window[ 'freenote' ]);
