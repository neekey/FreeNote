/**
 * 设置路由
 */
var Emit = require('events').EventEmitter,
	_ = require( 'underscore' );

var router = new Emit(); 

_.extend( router, {
	init: function( app ){
		
		var that = this;

		// ===== 逻辑 =====
		
		// 查看用户名是否存在
		app.get( '/logic/user/name/', function( req, res ){
			
			that.emit( 'beforeHandle', req, res );
			var id = req.params.id;
			that.emit( 'usernameCheck', req, res, id );
		});

		// 用户登陆
		app.post( '/logic/login/', function( req, res ){
			
			that.emit( 'beforeHandle', req, res );
			var data = req.body;
			that.emit( 'userLogin', req, res, data );
		});
		
		// 用户注销
		app.post( '/login/logout/', function( req, res ){
			
			that.emit( 'beforeHandle', req, res );
			that.emit( 'userLogou', req, res );
		});

		// ===== 资源操作 =====

		// 添加用户（注册)
		app.post( '/res/user/', function( req, res ){
			that.emit( 'beforeHandle', req, res );
			var data = req.body;
			that.emit( 'addUser', req, res, data );
		});

		// 修改用户信息( 修改密码 )
		app.put( '/res/user/:name/', function( req, res ){
			that.emit( 'beforeHandle', req, res );
			var data = req.body,
				name = req.params.name;
			that.emit( 'updateUser', req, res, {
				name: name,
				data: data
			});
		});

		// 添加笔记
		app.post( '/res/user/:name/note/', function( req, res ){
			that.emit( 'beforeHandle', req, res );
			var data = req.body,
				name = req.params.name;
			that.emit( 'addNote', req, res, {
				name: name,
				data: data
			});
		});

		// 修改笔记
		app.put( '/res/user/:name/note/:id/', function( req, res ){
			that.emit( 'beforeHandle', req, res );
			var data = req.body,
				name = req.params.name,
				id = req.params.id;

			that.emit( 'addNote', req, res, {
				name: name,
				id: id,
				data: data
			});
		});

		// 删除笔记
		app.del( '/res/user/:name/note/:id/', function( req, res ){
			that.emit( 'beforeHandle', req, res );
			var data = req.body,
				name = req.params.name,
				id = req.params.id;
			
			that.emit( 'delNote', req, res, {
				name: name,
				id: id,
				data: data
			});
		});

		// 获取笔记
		app.get( '/res/user/:name/note/:id/', function( req, res ){
			that.emit( 'beforeHandle', req, res );
			var name = req.params.name,
				id = req.params.id;

			that.emit( 'getNoteById', req, res, {
				name: name,
				id: id
			});
		});

		// 根据条件获取多条笔记
		app.get( '/res/user/:name/note/', function( req, res ){
			that.emit( 'beforeHandle', req, res );
			var data = req.query,
				name = req.params.name;

			that.emit( 'getNotes', req, res, {
				name: name,
				data: data
			});
		});
	}
});

module.exports = router;
