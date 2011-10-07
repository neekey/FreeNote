var Mgo = require( '../modules/mongoModel' ),
	Muser = Mgo.model( 'user' );

// TEST: addUser
var user = new Muser({
	name: String( Date.now() ),
	password: 'test'
});

console.log( '==================== user added!' );
console.log( user );

// TEST: addNote
user.addNote({
	content: String( Date.now() ),
	tags: [ 'neekey' ]
});

console.log( '==================== note added!' );
console.log( user );
console.log( user.notes );
console.log( user.tags );

// TEST: updateNote
user.updateNote( user.notes[ 0 ]._id, {
	content: 'update Note!',
	tags: [ 'neekey', 'test' ]
});

console.log( '==================== note updated!' );
console.log( user );
console.log( user.notes );
console.log( user.tags );

// TEST: deleteNote
user.delNote( user.notes[ 0 ]._id );
console.log( '==================== note deleted!' );
console.log( user );
console.log( user.notes );
console.log( user.tags );

user.save( function( err ){
	console.log( arguments );
	if( err ){
		console.log( err );
	}
	else {
		console.log( '==================== save success!' );
	}
});

module.exports = Mgo;

