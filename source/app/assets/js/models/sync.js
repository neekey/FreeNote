/**
 * sync table in client
 */

(function( app ){

    var Mchange = Backbone.Model.extend({
        defaults: {
            type: null,
            date: null,
            id: null,
            _id: null,
            note: null,
            noteModel: null
        },

        initailize: function(){

            var that = this;

            this.set( 'date', Date.now() );
            this.set( 'id', this.noteModel.get( 'id' ) );
            this.set( 'id', this.noteModel.get( '_id' ) );

            this.noteModel.on( 'update', function( m ){

                that.set( 'note', m.toJSON() );
                that.set( 'date', Date.now() );
                that.set( 'type', 'update' );
            })
        }
    }),

    CLchange = Backbone.Collection.extend({

        model: Mchange,

        initailize: function(){

        }
    });

})( window[ 'freenote' ] );