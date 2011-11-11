/**
 * router for login & register
 */

(function( APP ){

var ROUTERS = APP.routers,
    VIEWS = APP.views;

var router = Backbone.Router.extend({

    routes: {
        "": "loginPage",
        ":type": "handle"
    },

    initialize: function(){


        this.login = new VIEWS[ 'login' ]({
            el: $( '#J_login-panel' )[ 0 ]
        });

        this.register = new VIEWS[ 'register' ]({
            el: $( '#J_register-panel' )[ 0 ]
        });

        Backbone.history.start();
    },

    handle: function( type ){
        
        if( type === 'register' ){

            this.registerPage();
        }
        else {

            this.loginPage();
        }
    },

    loginPage: function(){

        this.register.hide();
        this.login.show();

    },

    registerPage: function(){

        this.login.hide();
        this.register.show();
    }
});

ROUTERS[ 'loginRegister' ] = router;

})( window[ 'freenote' ] );