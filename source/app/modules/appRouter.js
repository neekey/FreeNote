/**
 * 设置路由
 */
var Emit = require('events').EventEmitter;

var router = new Emit(); 

_.extend( router, {
    init: function( app ){

        var that = this;

        // ===== 逻辑 =====

        app.get( '/', function( req, res ){

            that.emit( 'index', req, res );
        });


        // 查看用户名是否存在
        app.get( '/logic/user/name/', function( req, res ){

            that.emit( 'usernameCheck', req, res );
        });

        // 用户登陆
        app.post( '/logic/login/', function( req, res ){

            that.emit( 'login', req, res );
        });

        // 用户注销
        app.post( '/logic/logout/', function( req, res ){

            that.emit( 'logout', req, res );
        });

        // ===== 资源操作 =====

        // 添加用户（注册)
        app.post( '/res/user/', function( req, res ){

            that.emit( 'register', req, res );
        });

        // 修改用户信息( 修改密码 )
        app.put( '/res/user/:name/', function( req, res ){

            that.emit( 'updateUser', req, res );
        });

        // 添加笔记
        app.post( '/res/user/:name/note/', function( req, res ){

            that.emit( 'addNote', req, res );
        });

        // 修改笔记
        app.put( '/res/user/:name/note/:id/', function( req, res ){

            that.emit( 'updateNote', req, res );
        });

        // 删除笔记
        app.del( '/res/user/:name/note/:id/', function( req, res ){

            that.emit( 'delNote', req, res );
        });

        // 获取笔记
        app.get( '/res/user/:name/note/:id/', function( req, res ){

            that.emit( 'getNote', req, res );
        });

        // 根据条件获取多条笔记
        app.get( '/res/user/:name/note/', function( req, res ){

            that.emit( 'getNotes', req, res );
        });

        // 同步
        app.post( '/res/sync/', function( req, res ){

            that.emit( 'sync', req, res );
        });
    }
});

module.exports = router;
