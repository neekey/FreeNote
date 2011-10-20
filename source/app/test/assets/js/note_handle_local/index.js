(function( APP ){

    var Models = APP.models,
        Mnote = Models.note,
        Mtag = Models.tag,
        noteListCon;

    var Vnote = Backbone.View.extend({
        tagName: 'li',
        className: 'note',
        events: {
            'dblclick': 'removeNote'
        },
        initialize: function(){
            this.noteCon = noteListCon;
            this.render();

            this.noteCon.append( this.el );
            this.model.bind( 'change', this.render, this ).bind( 'destroy', this.remove, this );
        },

        render: function(){

            $( this.el ).html( this.model.get( 'content' ) );
        },

        removeNote: function(){

            this.model.destroy();
        }

    });

    var Notes = new Models.notes({
        model: Mnote
    });

    Notes.bind( 'add', function( m ){

        new Vnote({
            model: m
        });
    });

    $( document ).ready(function(){

        var iptAdd = $( '#J_ipt-add'),
            btnAdd = $( '#J_btn-add' );
        noteListCon = $( '#J_note-list' );

        btnAdd.bind( 'click', function(){

            var val = iptAdd.val(), newNote;

            if( val ){

                Notes.create({
                    content: val,
                    tags: [ 'a', 'b' ]
                });
            }
        });

        Notes.fetch({
            add: true
        });
    });
})( window[ 'freenote' ] );