var router = require( './appRouter' ),
	ajaxCheck = require( './ajaxCheck' ),
	_ = require( 'underscore' ),
	Emit = require( 'events' ).EventEmitter;

var handle = new Emit;
_.extend( handle, {
	
	init: function( app ){
		
		var evt, that = this;

		// 初始化路由		
		router.init( app );

		// 每个请求的预处理	
		router.on( 'preHandle', function(){
			that.preHanle.apply( that, arguments ); 
		});

		// 添加每个请求的处理 
		for( evt in this._router ){
			router.on( evt, this._router[ evt ] );
		}
	},

	_router: {
		'userLogin': function(){
		}
	},

	preHandle: function( req, res ){
		if( !ajaxCheck.check( req ) ){
			this.emit( 'error', req, res );
			return false;
		}
		else {
			// auth check
			return true;
		}
	}
	
});
