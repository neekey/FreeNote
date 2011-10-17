/**
 * 定义freenote数据模型
 * @Author neekey<ni184775761@gmail.com>
 */
var mongoose = require( 'mongoose' ),
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
	// 代码维护其唯一性
	value: { type: String, required: true },
	notes: [ String ]
}),

// user
Suser = new schema({
	name: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	sessions: {},
    syncs: {},
	notes: [ Snote ],
	tags: [ Stag ] 
});

/* define schema method */

/* ====== note methods ====== */

/**
 * 添加笔记
 * @param note
 * @return id
 */
Suser.methods.addNote = function( note ){

    var newNote = { content: note.content },
        that = this;

    if( note.tags && _.isArray( note.tags ) ){
        // 删除重复
        note.tags = _.uniq( note.tags );
        newNote.tags = note.tags;
    }

    var _id = this.notes.push( newNote );

    console.log( _id );

    // this is the added note with _id
    newNote =  _.last( this.notes );

    return newNote._id;
};

/**
 * update note by id
 * @param id
 * @param update
 * @return true|false
 */
Suser.methods.updateNote = function( id, update ){

	var note = this.notes.id( id ), 
		that = this;

	if( note ){

		if( update.content && _.isString( update.content ) ){

			note.content = update.content;
			note.updated = Date.now();
		}

		if( update.tags && _.isArray( update.tags ) ){

			// 删除重复
			note.tags = _.uniq( update.tags );
			// 更新时间
			note.updated = Date.now();
		}

		return true;
	}

	return false;
};

/**
 * delete note by id
 * @param id
 * @return true|false
 */
Suser.methods.delNote = function( id ){

	var note = this.notes.id( id ), 
		that = this, tags;

	if( note ){

		tags = note.tags;

		// delete according recode from tags
		_.each( tags, function( tag ){

			that.delTagNote( tag, id );
		});

		note.remove();

		return true;
	}

	return false;
};

/**
 * get tag object by tag name
 * @param name
 * @return false | tag
 */
Suser.methods.getTagByName = function( name ){

	var tag = _.select( this.tags, function( tag ){

		return tag.value === name;
	});

	if( tag[ 0 ] ){

		return tag[ 0 ];
	}

	return false;
};

/**
 * add an new tag by tag name
 * @param tag
 * @return false | tag._id
 */
Suser.methods.addTag = function( tag ){
	
	if( !_.isString( tag ) ){

		return false;
	}

	var tagObj = this.getTagByName( tag );
    
	if( tagObj ){

		return false;
	}

	this.tags.push({ value: tag });

	return _.last( this.tags )._id;
};

/**
 * delete tag by tag._id
 * @param id
 * @return true|false
 */
Suser.methods.delTagById = function( id ){

	var tag = this.tags.id( id );

	if( tag ){

		tag.remove();
		return true;
	}

	return false;
};

/**
 * delete tag by tab name
 * @param t
 * @return true|false
 */
Suser.methods.delTagByName = function( t ){

	var tag = this.getTagByName( t );

	if( tag !== false ){

		tags.remove();
		return true;
	}

	return false;
};

/**
 * add a note recode to tag
 * @param t
 * @param id
 * @return true | false
 */
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
	if( _.indexOf( tag.notes, String( id ) ) < 0 ){

		tag.notes.push( id );
	}

	return true;
};

/**
 * delete note recode form tag
 * @param t
 * @param id
 */
Suser.methods.delTagNote = function( t, id ){

	var tag = this.getTagByName( t ), noteIndex;

	if( tag !== false ){

		noteIndex = _.indexOf( tag.notes, String( id ) );

		if( noteIndex >= 0 ){

			tag.notes.splice( noteIndex, 1 );
		}
	}
};

/* ====== session method ====== */

/**
 * 更新session数据
 * @param {Session} se
 */
Suser.methods.updateSession = function( se ){

    var _tempSessions = this.sessions;

    if( !_tempSessions ){
        _tempSessions = {};
    }
    
	_.extend( _tempSessions, se );

    this.sessions = _tempSessions;

    // as the type of sessions is 'any', so every change of sessions should call markModified( 'sessions' )
    this.markModified('sessions');
};

/**
 * 删除指定的登陆序列
 * @param {String} serial
 */
Suser.methods.delSession = function( serial ){
    var _tempSessions = this.sessions;

    if( !_tempSessions ){
        _tempSessions = {};
    }

	delete _tempSessions[ serial ];

    this.sessions = _tempSessions;

    this.markModified('sessions');
};

/**
 * 清空用户的session数据
 */
Suser.methods.delAllSession = function(){

	this.sessions = {};
    this.markModified('sessions');
};

/* ====== sync methods ====== */

/**
 * update sync
 * @param sy
 */
Suser.methods.updateSync = function( sy ){

    var _tempSync = this.syncs;

    if( !_tempSync ){
        _tempSync = {};
    }

    _.extend( _tempSync, sy );

    this.syncs = _tempSync;

    this.markModified( 'syncs' );
};

/**
 * delete serial
 * @param serial
 */
Suser.methods.delSync = function( serial ){

    var _tempSync = this.syncs;

    if( !_tempSync ){

        _tempSync = {};
    }

    delete _tempSync[ serial ];

    this.syncs = _tempSync;

    this.markModified( 'syncs' );
};

mongoose.model( 'user', Suser );

module.exports = mongoose;
