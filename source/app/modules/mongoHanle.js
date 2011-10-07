var Mgo = require( './mongoModel' );

handle = {

	/** 
	 * 添加用户
	 */
	addUser: function( name, password, next ){
	},

	/**
	 * 添加笔记
	 */
	addNote: function( username, note, next ){
	},

	/**
	 * 删除笔记
	 */
	delNote: function( username, id, next ){
	}

};
var Muser = Mgo.model( 'user' );

// TEST: addUser
var user = new Muser({
	name: String( Date.now() ),
	password: 'test'
});

console.log( 'user added!' );
console.log( user );

// TEST: addNote
user.addNote({
	content: String( Date.now() ),
	tags: [ 'neekey' ]
});

console.log( 'note added!' );
console.log( user );

// TEST: updateNote
user.updateNote( user.notes[ 0 ]._id, {
	content: 'update Note!',
	tags: [ 'neekey', 'test' ]
});

console.log( 'note updated!' );
console.log( user );

user.save( function( err ){
	if( err ){
		console.log( err );
	}
	else {
		console.log( 'save success!' );
	}
});

module.exports = Mgo;
