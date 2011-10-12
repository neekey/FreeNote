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
			
			var id = req.params.id;
			that.emit( 'beforeHandle', req, res, function( auth ){
				if( !auth ){
					that.emit( 'authFailed', req, res ); 
				}
				else {
					that.emit( 'usernameCheck', req, res, id );
				}
			});
		});

		// 用户登陆
		app.post( '/logic/login/', function( req, res ){
			
			var data = req.body;
			that.emit( 'beforeHandle', req, res, function( auth ){
				// 只有用户还未登陆，才能进行该操作
				if( auth ){
					that.emit( 'authFailed', req, res );
					res.send( 404, { msg: '已经登陆！' });
				}
				else {
					that.emit( 'userLogin', req, res, data );
				}
			});
		});
		
		// 用户注销
		app.post( '/logic/logout/', function( req, res ){
			
			that.emit( 'beforeHandle', req, res, function( auth ){
				if( !auth ){
					that.emit( 'authFailed', req, res );
					res.send( 404, { msg: 'not login！' });
				}
				else {
					that.emit( 'userLogou', req, res );
				}
			});
		});

		// ===== 资源操作 =====

		// 添加用户（注册)
		app.post( '/res/user/', function( req, res ){
			var data = req.body;
			that.emit( 'beforeHandle', req, res, function( auth ){
				// 用户未登录的情况下才能注册
				if( auth ){
					that.emit( 'authFailed', req, res );
					res.send( 404, {
						msg: '已经登陆用户无法注册'
					});
				}
				else {
					that.emit( 'addUser', req, res, data );
				}

			});
		});

		// 修改用户信息( 修改密码 )
		app.put( '/res/user/:name/', function( req, res ){
			var data = req.body,
				name = req.params.name;
			that.emit( 'beforeHandle', req, res, function( auth ){
				if( !auth ){
					that.emit( 'authFailed', req, res );
				}
				else {

					that.emit( 'updateUser', req, res, {
						name: name,
						data: data
					});
				}
			});
		});

		// 添加笔记
		app.post( '/res/user/:name/note/', function( req, res ){
			var data = req.body,
				name = req.params.name;
			that.emit( 'beforeHandle', req, res, function( auth ){
				if( !auth ){
					that.emit( 'authFailed', req, res );
				}
				else {

					that.emit( 'addNote', req, res, {
						name: name,
						data: data
					});
				}
			});
		});

		// 修改笔记
		app.put( '/res/user/:name/note/:id/', function( req, res ){
			var data = req.body,
				name = req.params.name,
				id = req.params.id;

			that.emit( 'beforeHandle', req, res, function( auth ){
				if( !auth ){
					that.emit( 'authFailed', req, res );
				}
				else {

					that.emit( 'addNote', req, res, {
						name: name,
						id: id,
						data: data
					});
				}
			});
		});

		// 删除笔记
		app.del( '/res/user/:name/note/:id/', function( req, res ){
			var data = req.body,
				name = req.params.name,
				id = req.params.id;

			that.emit( 'beforeHandle', req, res, function( auth ){
				if( !auth ){
					that.emit( 'authFailed', req, res );
				}
				else {
	
					that.emit( 'delNote', req, res, {
						name: name,
						id: id,
						data: data
					});
				}
			});
		});

		// 获取笔记
		app.get( '/res/user/:name/note/:id/', function( req, res ){
			var name = req.params.name,
				id = req.params.id;
			that.emit( 'beforeHandle', req, res, function( auth ){
				if( !auth ){
					that.emit( 'authFailed', req, res );
				}
				else {

					that.emit( 'getNoteById', req, res, {
						name: name,
						id: id
					});
				}
			});
		});

		// 根据条件获取多条笔记
		app.get( '/res/user/:name/note/', function( req, res ){
			var data = req.query,
				name = req.params.name;
			that.emit( 'beforeHandle', req, res, function( auth ){
				if( !auth ){
					that.emit( 'authFailed', req, res );
				}
				else {

					that.emit( 'getNotes', req, res, {
						name: name,
						data: data
					});
				}
			});
		});
	}
});

module.exports = router;
