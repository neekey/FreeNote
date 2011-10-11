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
	// 代码维护其唯一性
	value: { type: String, required: true },
	notes: [ String ]
}),

// user
Suser = new schema({
	name: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	sessions: {},
	notes: [ Snote ],
	tags: [ Stag ] 
});

/* define schema method */

/**
 * add note
 * @param {Object} note
 * @returns {id|Boolean} 成功返回新插入的note对象_id值，否则返回false
 */
Suser.methods.addNote = function( note ){
	if( !note.content || !_.isString( note.content ) ){
		return false;
	}
	else {
		var newNote = { content: note.content },
			that = this;

		if( note.tags && _.isArray( note.tags ) ){
			// 删除重复
			note.tags = _.uniq( note.tags );
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
		return newNote._id;
	}
};

/**
 * update note
 * @param {id} id
 * @param {Object} update
 * @returns {Boolean}
 */
Suser.methods.updateNote = function( id, update ){
	var note = this.notes.id( id ), 
		that = this,
		tags, oldTags, newTags, delTags, i;

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
 * delete note
 * @param {id} id
 * @returns {Boolean}
 */
Suser.methods.delNote = function( id ){
	var note = this.notes.id( id ), 
		that = this, tags;

	if( note ){
		tags = note.tags;

		// remove records from tags
		_.each( tags, function( tag ){
			that.delTagNote( tag, id );
		});

		note.remove();

		return true;
	}
	return false;
};

/**
 * get tag by tagName
 * @param {String} name
 * @returns {Object|boolean} 成功返回tag对象，否则为false
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
 * add tag
 * @param {String} tag
 * @returns {Boolean}
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
 * delete tag
 * @param {id} id
 * @returns {Boolean}
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
 * delete tag
 * @param {String} t 
 * @returns {Boolean}
 */
Suser.methods.delTagByName = function( t ){

	if( !_.isString( t ) ){
		return false;
	}

	var tag = this.getTagByName( t );
	if( tag !== false ){
		tags.remove();
		return true;
	}
	return false;
};

/**
 * add tag-note
 * @param {String} t -tag name
 * @param {id} id -note id
 * @returns {Boolean}
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
	if( _.indexOf( tag.notes, String( id ) ) >= 0 ){
		return false;
	}

	tag.notes.push( id );

	return true;
};

/**
 * delete tag-note
 * @param {String} t -tag name
 * @param {id} id -note id
 * @returns {Boolean}
 */
Suser.methods.delTagNote = function( t, id ){

	var tag = this.getTagByName( t ), noteIndex;

	if( tag !== false ){

		noteIndex = _.indexOf( tag.notes, String( id ) );

		if( noteIndex >= 0 ){
			tag.notes.splice( noteIndex, 1 );
			return true;
		}
		return false;
	}
	return false;
};

/**
 * 更新session数据
 * @param {Session} se
 */
Suser.methods.updateSession = function( se ){
	var news = {}, olds = {}, 
		keys = _.keys( se ), i, hasNew = false;
	
	for( i = 0; keys[ i ]; i++ ){
		if( keys[ i ] in this.sessions ){
			olds[ keys[ i ] ] = se[ keys[ i ] ];
		}
		else {
			news[ keys[ i ] ] = se[ keys[ i ] ];
			hasNew = true;
		}
	}

	// 新更新已经存在的
	_.extend( this.sessions, olds );
};

/**
 * 删除指定的登陆序列
 * @param {String} serial
 */
Suser.methods.delSession = function( serial ){
	delete this.sessions[ serial ];
};

/**
 * 清空用户的session数据
 */
Suser.methods.delAllSession = function(){
	this.sessions = {};
};

mongoose.model( 'user', Suser );

module.exports = mongoose;
