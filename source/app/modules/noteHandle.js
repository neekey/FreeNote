/**
 * 封装note的数据库操作
 */
var _ = require( 'underscore' );
var USER = 'root',
	PASSWORD = 'root',
	DATABASE = 'freenote',
	DEBUG = 'true',
	HOST = 'localhost',
	PORT = 8889,
	TABLE = 'test',
	
	// 连接数据库
	mysql = require( 'mysql' ),
	client = mysql.createClient({
		user: USER,
		password: PASSWORD,
		database: DATABASE,
		debug: DEBUG,
		host: HOST,
		port: PORT 
	});

var handle = {
	add: function( note, author, fn ){
		client.query( 'insert into ' + TABLE + '(note,author) values("' + note + '","' + author + '")', function( err, results, fields ){
			if( err ){
				throw err;
			}
			fn && fn( results, fields );
		});
	},
	
	update: function( id, data, fn ){
		var query = 'update ' + TABLE + ' set',
			field, valueArr = [];

		for( field in data ){
			query += ( ' ' + field + '=?,' );
			valueArr.push( data[ field ] );
		}
		
		if( query.lastIndexOf( ',' ) === ( query.length - 1 ) ){
			query = query.substring( 0, query.length - 1 );
		}
		query += ' where id=' + id;

		console.log( 'update query string: ' + query );

		client.query( query, valueArr, function( err, results, fields ){
			if( err ){
				throw err;
			}
			fn && fn( results, fields );
		}); 
	},

	read: function( id, fn ){
		client.query( 'select * from ' + TABLE + ' where id=' + id, function selectCb(err, results, fields) {
    		if (err) {
      			throw err;
    		}

			console.log( 'results: ' );
    		console.log(results);
			console.log( 'fields: ' );
    		console.log(fields);

			fn && fn( results, fields );
  		});
	},

	del: function( id, fn ){
		client.query( 'delete from ' + TABLE + ' where id=' + id, function selectCb(err, results, fields) {
    		if (err) {
      			throw err;
    		}

			console.log( 'results: ' );
    		console.log(results);
			console.log( 'fields: ' );
    		console.log(fields);

			fn && fn( results, fields );
  		});

	},
	search: function( fn ){
		client.query( 'select * from ' + TABLE, function selectCb(err, results, fields) {
    		if (err) {
      			throw err;
    		}

			console.log( 'results: ' );
    		console.log(results);
			console.log( 'fields: ' );
    		console.log(fields);

			fn && fn( results, fields );
  		});

	}
};

_.extend( exports, handle );



	
