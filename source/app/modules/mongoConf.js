var mongoose = require('mongoose');

var HOST = 'localhost',
	PORT = '27017',
	DATABASE = 'freenote';
	
// 连接
mongoose.connect( HOST, DATABASE, PORT );

module.exports = mongoose;

// mongoose.connect('mongodb://localhost:27017/freenote');


