/**
 * model - user
 * @author Neekey<ni184775761@gmail.com>
 */

(function( app ){
	
	var Mtag = app.models.tag =  Backbone.Model.extend({
		defaults: {
			'value': '',
			'notes': []
		}
	}),

	Mnote = app.models.note = Backbone.Model.extend({
		defaults: {
			'content': '',
			'tags': [],
			'created': '',
			'updated': ''
		}
	}),

	CLtag = app.collections.tag = Backbone.Collection.extend({

		model: Mtag,

		initialize: function(){
			
		}
	}),

	CLnote = app.collections.note = Backbone.Collection.extend({

		model: Mnote,

		initialize: function(){
		}
	}),

	Muser = app.models.user = Backbone.Model.extend({
		defaults: {
			'name': '',
			'password': ''
		},

		urlRoot: '/res/user/'
	});

    var models = app[ 'models' ];

    models[ 'tag' ] = Mtag;
    models[ 'note' ] = Mnote;
    models[ 'tags' ] = CLtag;
    models[ 'notes' ] = CLnote;
    models[ 'user' ] = Muser;

})( window[ 'freenote' ] );
 
