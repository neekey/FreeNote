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
		Mh.addNote( user.name, newNote, function( err, id ){
			if( err ){
				console.log( '==================== note adding failed!' );
				console.log( err );
			}
			else {
				console.log( '==================== note added: ' );
				console.log( user.notes.id( id ) );

				// TEST: updateNote
				var uptNote = {
					content: 'updated note',
					tags: [ 'c', 'd' ]
				};
				Mh.updateNote( user.name, id, uptNote, function( err ){
					
					if( err ){
						console.log( '==================== note updated failed!' );
						console.log( err );
					}
					else {
						console.log( '==================== note updated!' );
						console.log( user );
					}
				
				});
			}
		});
	}
}); 
