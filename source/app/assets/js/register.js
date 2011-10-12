!function( app ){
	
var iptName = null,
	iptPs = null,
	btReg = null,
	btLogin = null,
	btLogout = null,
	Muser = app.models.user;

var reg = app.mods.reg  = {
	
	init: function(){
		$( document ).ready(function(){
			
			iptName = $( '#J_username' );
			iptPs = $( '#J_password' );
			btReg = $( '#J_register' );
			btLogin = $( '#J_login' );
			btLogout = $( '#J_logout' );

			btReg.bind( 'click', function(){
				var name = iptName.val(),
					password = iptPs.val(),
					newUser;
				if( name && password ){
					
					newUser = new Muser({
						name: name,
						password: password
					});

					newUser.save({}, {
						success: function( m, data ){
							console.log( data );
						},
						error: function( m, err ){
							console.log( err );
						}
					});

				}
			});

			btLogin.bind( 'click', function(){
				var name = iptName.val(),
					password = iptPs.val(),
					newUser;
				if( name && password ){
					
					$.post( '/logic/login/', {
						name: name,
						password: password
					}, function( data ){
						console.log( data );
					});
				}

			});

			btLogout.bind( 'click', function(){
					
				$.post( '/logic/logout/', function( data ){
					console.log( data );
				});
			});

		});
	}
};

}( window[ 'freenote' ] );

APP.mods.reg.init();
