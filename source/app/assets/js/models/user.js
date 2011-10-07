/**
 * model - user
 * @author Neekey<ni184775761@gmail.com>
 */

!function( app ){
	
	var Mtag = Backbone.Model.extend({
		defaults: {
			'value': '',
			'notes': []
		}
	}),

	Mnote = Backbone.Model.extend({
		defaults: {
			'content': '',
			'tags': [],
			'created': '',
			'updated': ''
		}
	}),

	CLtag = Backbone.Collection.extend({

		model: Mtag,

		initialize: function(){
			
		}
	}),

	CLnote = Backbone.Collection.extend({

		model: Mnote,

		initialize: function(){
		}
	}),

	Muser = Backbone.Model.extend({
		defaults: {
			'name': '',
			'password': ''
		}
	});

}( window[ 'freenote' ] );
 
