/**
 * login view
 */

(function( APP ){

    var VIEWS = APP.views,
        MODS = APP.mods,
        formValid = MODS[ 'formValid' ];

    var Vlogin = Backbone.View.extend({

        initialize: function(){

            var that = this;

            _.extend( this, Backbone.Events );

            this.username = this.$( '.J_username' );
            this.password = this.$( '.J_password' );
            this.btnLogin = this.$( '#J_login' );
            this.formValid = new formValid( 'J_login-form', function(){

                that.checkHandle.apply( that, arguments );
            });

            this.btnLogin.tap( function(){

                // 若表单无误
                if( that.formValid.check() ){

                    that.trigger( 'loginCheck', that.getFormData() );
                }
            });

            this.hide();
        },

        show: function(){

            $( this.el ).show();
        },

        hide: function(){

            $( this.el ).hide();
        },

        checkHandle: function( result, elem, rule, msg ){

            var tip = $( elem ).siblings( 'span' );

            if( result ){

                tip.hide();
            }
            else {

                tip.show();
            }
        },

        getFormData: function(){

            return {
                username: this.username.val(),
                password: this.password.val()
            };
        },

        setTip: function( field, content ){

            var tip;

            if( this[ field ] ){

                tip = this[ field ].siblings( 'span' );
            }

            tip.html( content );
        },

        showTip: function( field ){

            var tip;

            if( this[ field ] ){

                tip = this[ field ].siblings( 'span' );
            }

            tip.show();
        },

        hideTip: function( field ){

            var tip;

            if( this[ field ] ){

                tip = this[ field ].siblings( 'span' );
            }

            tip.hide();
        }
    });

    VIEWS[ 'login' ] = Vlogin;

})( window[ 'freenote' ] );