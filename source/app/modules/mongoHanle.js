var Mgo = require( './mongoModel' );

/*
var Muser = Mgo.model( 'user' ),
	user =  new Muser({
		name: 'neekey',
		password: 'password'
	});

user.tags.push({ value: 'study' });

user.save(function( err ){
	if( err ){
		console.log( err );
	}
	else {
		console.log( 'save success' );
	}
});
*/

module.exports = Mgo;
