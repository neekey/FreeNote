!function( app ){
	
var iptName = null,
	iptPs = null,
	btReg = null,
	Muser = app.models.user;

var reg = app.mods.reg  = {
	
	init: function(){
		$( document ).ready(function(){
			
			iptName = $( '#J_username' );
			iptPs = $( '#J_password' );
			btReg = $( '#J_register' );

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
		});
	}
};

}( window[ 'freenote' ] );

APP.mods.reg.init();
