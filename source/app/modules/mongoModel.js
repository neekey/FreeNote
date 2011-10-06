/**
 * 定义freenote数据模型
 * @Author neekey<ni184775761@gmail.com>
 */
var mongoose = require('./mongoConf'),
	schema = mongoose.Schema;

var Snote = new schema({
	id: { type: Number, unique: true },
	content: { type: String },
	created: { type: Date, 'default': Date.now },
	updated: { type: Date, 'default': Date.now },
	tags: [ String ]
}),

Stag = new schema({
	value: { type: String, required: true, unique: true },
	notes: [ String ]
}),

Suser = new schema({
	name: { type: String, unique: true },
	password: { type: String },
	notes: [ Snote ],
	tags: [ Stag ] 
});

mongoose.model( 'user', Suser );

module.exports = mongoose;

