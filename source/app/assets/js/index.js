$( document ).ready(function(){
	
	
	var Mnote = Backbone.Model.extend({
		urlRoot: 'res/note/',
		initialize: function(){
			this.save();
			this.bind( 'change', this.save );
		}
	});

	var CLnote = Backbone.Collection.extend({
		model: Mnote,
		url: 'res/user/neekey/note/',
		initialize: function(){
			this.bind( 'add', function( m ){
				new Vnote({ model: m });
			});

			this._fetch = this.fetch;
			this.fetch = function( options, queryObj ){
				var _url = this.url;

				if( queryObj ){
					this.url = this.url + '?' + $.param( queryObj );
				}
				this._fetch( options );

				this.url = _url;
			};
		}
	});


	// 视图-添加新笔记
	var Vnote = Backbone.View.extend({
		tagName: 'li',
		className: 'note-item',
		stage: $( '#content .note-stage' ),
		initialize: function(){
			this.render();
			this.stage.append( this.el );
			this.model.bind( 'change', this.render, this ).bind( 'destroy', this.remove, this );
		},
		render: function(){
			var data = this.model.toJSON();
			$( this.el ).html( '['+ ( data.id || '未保存' ) + ']' + data.note );
		}
	});
	
	var CLnoteList = new CLnote;
	CLnoteList.fetch({ add: true }, { name: 'neekey' } );
	var VnoteHanle = new ( Backbone.View.extend({
		
		el: $( '#content .note-handle' ),
		
		events: {
			'click #sbmt-new': 'addNote',
			'click #sbmt-update': 'updateNote',
			'click #sbmt-del': 'deleteNote',
			'click #sbmt-read': 'readNote'
		},

		initialize: function(){
			this._newIpt = this.$( '#ipt-new' );
		},

		_newIpt: $( '#ipt-new' ),
		_updateIpt: $( '#ipt-update' ),
		_updateIdIpt: $( '#ipt-update-id' ),
		_delIpt: $( '#ipt-del' ),
		_readIpt: $( '#ipt-read' ),


		/**
		 * 添加新笔记
		 */
		addNote: function(){
			var val =  this._newIpt.val(),
				newNote;
			if( val ){
				CLnoteList.add({ note: val });
				this._newIpt.val('');
			}
		},

		updateNote: function(){
			var val = this._updateIpt.val(),
				id = this._updateIdIpt.val(),
				m;
			if( val ){
				m = CLnoteList.get( id );
				if( m ){
					m.set( { note: val } );
				}
			}
		},

		deleteNote: function(){
			var val = this._delIpt.val(), m;
			if( val ){
				m = CLnoteList.get( val );
				if( m ){
					m.destroy();
				}
			}
			
		},

		readNote: function(){
			var val = this._readIpt.val(), m;
			if( val ){
				CLnoteList.add({ id: val });
				m = CLnoteList.get( val );
				m.fetch({
					success: function( m, res ){
					},
					error: function(){
						m.destroy();
					}
				});
			}
		}

	}))();
});
