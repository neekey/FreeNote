var Mgo = require( './mongoModel' ),
	_ = require( 'underscore' ),
	Muser = Mgo.model( 'user' );

var handle = {

	/** 
	 * 添加用户
	 */
	addUser: function( name, password, next ){
		if( _.isString( name ) && _.isString( password ) ){ 
			var user = new Muser({
				name: name,
				password: password
			});
			user.save( next );
		}
		else {
			next( { err: 'name and password must be string' } );
		}
	},

	/**
	 * 添加笔记
	 */
	addNote: function( username, note, next ){
		if( _.isObject( username ) && username._id ){
			var user = username;
			addNote( user, note, next );
		}
		else if( _.isString( username ) ){
			Muser.findOne( { name: username }, function( err, user ){
				addNote( user, note, next );
			});
		}
		else {
			next( { err: 'username must be string or the user Object' });
		}

		function addNote( user, note, next ){

			var id = user.addNote( note );

			if( id === false ){
				next( { err: 'note adding failed!' } );
			}
			else {
				user.save( function( err ){
					if( err ){
						next( err );
					}
					else {
						next( err, id );
					}
				});
			}

		}
	},

	/**
	 * 修改笔记
	 * 
	 */
	updateNote: function( username, id, note, next ){
		Muser.findOne( { username: username }, function( err, doc ){
			if( err ){
				next( err );
			}
			else {
				var user = doc,
					uptRes = doc.updateNote( id, note );
				if( uptRes === false ){
					next( { err: 'note updating failed!' } );
				}
				else {
					user.save( function( err ){
						next( err );
					});
				}
			}
		});

	},

	/**
	 * 删除笔记
	 */
	delNote: function( username, id, next ){
		Muser.findOne( { username: username }, function( err, doc ){
			if( err ){
				next( err );
			}
			else {
				var user = doc,
					delRes = doc.delNote( id );
				if( delRes === false ){
					next( { err: 'note deleting failed!' } );
				}
				else {
					user.save( function( err ){
						next( err );
					});
				}
			}
		});

	}

};
module.exports = handle;

