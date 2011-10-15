!function( app ){
	
var iptName = null,
	iptPs = null,
	btReg = null,
	btLogin = null,
	btLogout = null,
    resultCon = null,
	Muser = app.models.user;

var reg = app.mods.reg  = {
	
	init: function(){
		$( document ).ready(function(){
			
			iptName = $( '#J_username' );
			iptPs = $( '#J_password' );
			btReg = $( '#J_register' );
			btLogin = $( '#J_login' );
			btLogout = $( '#J_logout' );
            resultCon = $( '#J_result ');

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
                            resultCon.html( JSON.stringify( data ) );
						},
						error: function( m, err ){
							console.log( err );
                            resultCon.html( JSON.stringify( err ) );
						}
					});

				}
			});

			btLogin.bind( 'click', function(){
				var name = iptName.val(),
					password = iptPs.val(),
					newUser;
				if( name && password ){

                    $.ajax({
                        type: 'POST',
                        data: {
                            name: name,
                            password: password
                        },
                        url: '/logic/login/',
                        success: function( data ){
                            console.log( data );
                            resultCon.html( JSON.stringify( data ) );
                        },
                        error: function( err ){
                            console.log( err );
                            resultCon.html( JSON.stringify( err ) );
                        },
                        dataType: 'json'
                    });
				}

			});

			btLogout.bind( 'click', function(){

                $.ajax({
                    type: 'POST',
                    url: '/logic/logout/',
                    success: function( data ){
					    console.log( data );
                        resultCon.html( JSON.stringify( data ) );
				    },
                    error: function( err ){
                        console.log( err );
                        resultCon.html( JSON.stringify( err ) );
                    },
                    dataType: 'json'
                });
			});

		});
	}
};

}( window[ 'freenote' ] );

APP.mods.reg.init();
