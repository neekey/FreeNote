var mongoose = require('mongoose');

var HOST = 'localhost',
	PORT = '27017',
	DATABASE = 'freenote';
	
// 连接
mongoose.connect( HOST, DATABASE, PORT );



