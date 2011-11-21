/**
 * login view
 */

(function( APP ){

    var VIEWS = APP.views,
        MODS = APP.mods,
        formValid = MODS[ 'formValid' ];

    var VRegister = Backbone.View.extend({

        initialize: function(){

            var that = this;

            //this.el = $( '#J_login-panel' )[ 0 ];
            this.username = this.$( '.J_username' );
            this.password = this.$( '.J_password' );
            this.psConfirm = this.$( 'J_psword-confirm' );
            this.btnRegister = this.$( '#J_register' );
            this.formValid = new formValid( 'J_register-form', function(){

                that.checkHandle.apply( that, arguments );
            });


            this.btnRegister.bind( 'click', function(){

                // 若表单无误
                if( that.formValid.check() ){

                    that.trigger( 'checkSuccess', that.getFormData() );
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

    VIEWS[ 'register' ] = VRegister;

})( window[ 'freenote' ] );