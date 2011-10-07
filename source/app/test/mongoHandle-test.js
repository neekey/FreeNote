var Mh = require( '../modules/mongoHandle' );

// TEST: addUser
Mh.addUser( String( Date.now() ), 'ps', function( err, user ){
	if( err ){
		console.log( err );
	}
	else {
		console.log( 'user added: ' );
		console.log( user );

		var newNote = {
			content: 'first-note', 
			tags: [ 'a', 'b' ]
		};

		// TEST: addNote
		Mh.addNote( user, newNote, function( err, id ){
			if( err ){
				console.log( err );
			}
			else {
				console.log( 'user' );
				console.log( user );
				console.log( 'note added: ' );
				console.log( user.notes.id( id ) );
			}
		});
	}
}); 
