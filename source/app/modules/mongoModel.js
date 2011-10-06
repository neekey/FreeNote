/**
 * 定义freenote数据模型
 * @Author neekey<ni184775761@gmail.com>
 */
var mongoose = require('./mongoConf'),
	_ = require('underscore'),
	schema = mongoose.Schema;

/* define schema */

// note
var Snote = new schema({
	content: { type: String, required: true },
	created: { type: Date, 'default': Date.now },
	updated: { type: Date, 'default': Date.now },
	tags: [ String ]
}),

// tag
Stag = new schema({
	value: { type: String, required: true, unique: true },
	notes: [ String ]
}),

// user
Suser = new schema({
	name: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	notes: [ Snote ],
	tags: [ Stag ] 
});

/* define schema method */

// add note
Suser.methods.addNote = function( note ){
	if( !note.content ){
		return false;
	}
	else {
		var newNote = { content: note.content },
			that = this;

		if( note.tags ){
			newNote.tags = note.tags; 
		}

		this.notes.push( newNote );

		// this is the added note with _id
		newNote =  _.last( this.notes );

		// add note record to tags
		if( note.tags ){
			_.each( note.tags, function( tag ){
				that.addTagNote( tag, newNote._id );
			});
		}
		return true;
	}
};

// update note
Suser.methods.updateNote = function( id, update ){
	var note = this.notes.id( id ), tags, i;
	if( note ){
		if( update.content ){
			note.content = update.content;
		}
		if( update.tags ){
			note.tags = update.tags;
		}
		return true;
	}
	return false;
};

// delete note
Suser.methods.delNote = function( id ){
	var note = this.notes.id( id ), 
		that = this, tags;

	if( note ){
		tags = note.tags;
		note.remove();

		// remove records from tags
		_.each( tags, function( tag ){
			that.delTagNote( tag, id );
		});
		return true;
	}
	return false;
};

// get tag by tagName
Suser.methods.getTagByName = function( name ){
	var tag = _.select( this.tags, function( tag ){
		return tag.value === name;
	});

	if( tag[ 0 ] ){
		return tag[ 0 ];
	}
	return false;
};

// add tag
Suser.methods.addTag = function( tag ){
	if( _.indexOf( this.tags, tag ) >= 0 ){
		return false;
	}
	else {
		this.tags.push({ value: tag });
		return true;
	}
};

// delete tag
Suser.methods.delTagById = function( id ){
	var tag = this.tags.id( id );
	if( tag ){
		tag.remove();
		return true;
	}
	return false;
};

Suser.methods.delTagByName = function( t ){
	var tag = this.getTagByName( t );
	if( tag !== false ){
		tags.remove();
		return true;
	}
	return false;
};

// add tag-note
Suser.methods.addTagNote = function( t, id ){
	var tag = this.getTagByName( t ),
		note = this.notes.id( id );

	// if note is not exist
	if( !note ){
		return false;
	}
	// if tag is not exist, add one
	if( tag === false ){

		this.addTag( t );
		tag = this.getTagByName( t );
	}
	// if id is already in tag.notes
	if( _.indexOf( tag.notes, String( id ) ) >= 0 ){
		return false;
	}

	tag.notes.push( id );

	console.log( this.tags );
	return true;
};

// del tag-note
Suser.methods.delTagNote = function( t, id ){
	var tag = this.getTagByName( t ), noteIndex;
	console.log( 'del -tag-note');
	console.log( tag );
	if( tag !== false ){
		noteIndex = _.indexOf( tag.notes, String( id ) );
		console.log( 'noteIndex' );
		console.log( noteIndex );
		if( noteIndex >= 0 ){
			tag.notes.splice( noteIndex, 1 );
			return true;
		}
		return false;
	}
	return false;
};


mongoose.model( 'user', Suser );

module.exports = mongoose;

