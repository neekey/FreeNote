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
	 * mongoose 2.3.0 的一个bug，一个medel实例对象, 对一个embeded document只能save一次
	 * @see https://github.com/LearnBoost/mongoose/issues/261
	 * 因此下面的addNote、delNote，updateNote方法在使用时注意
	 * 不要使用已经进行过save的user实例对象作为第一个参数
	 */

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
	 */
	updateNote: function( username, id, note, next ){
		if( _.isObject( username ) && username._id ){
			var user = username;
			updateNote( user, id, note, next );
		}
		else if( _.isString( username ) ) {
			Muser.findOne( { name: username }, function( err, user ){
				updateNote( user, id, note, next );
			});
		}
		else {
			next( { err: 'username must be string or the user Object' });
		}

		function updateNote( user, id, note, next ){

			var uptRes = user.updateNote( id, note );

			if( uptRes === false ){
				next( { err: 'note updating failed!' } );
			}
			else {
				user.save( function( err ){
					next( err );
				});
			}
		}

	},

	/**
	 * 删除笔记
	 */
	delNote: function( username, id, next ){

		if( _.isObject( username ) && username._id ){
			var user = username;
			delNote( user, id, next );
		}
		else if( _.isString( username ) ) {
			Muser.findOne( { name: username }, function( err, user ){
				delNote( user, id, next );
			});
		}
		else {
			next( { err: 'username must be string or the user Object' });
		}

		function delNote( user, id, next ){

			var delRes = user.delNote( id );

			if( delRes === false ){
				next( { err: 'note deleting failed!' } );
			}
			else {
				user.save( function( err ){
					next( err );
				});
			}
		}
	}
};
module.exports = handle;

