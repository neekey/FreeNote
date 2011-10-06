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

var user = new Muser({
	name: String( Date.now() ),
	password: 'test'
});
user.tags.push({ value: String( Date.now() )});
user.addNote({
	content: String( Date.now() ),
	tags: [ 'drinking' ]
});

console.log( 'user added!' );
console.log( user );

console.log( 'del note' );
user.delNote( user.notes[ 0 ]._id );

console.log( 'note deleted!' );
console.log( user.tags );
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
