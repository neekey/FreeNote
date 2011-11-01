/**
 * wekitTransform zepto.js simple extension
 */

(function( $ ){

    var transformEx = {
        translateX: /translateX\(([^\)]*)\)/,
        translateY: /translateY\(([^\)]*)\)/,
        translateZ: /translateZ\(([^\)]*)\)/,
        scaleX: /scaleX\(([^\)]*)\)/,
        scaleY: /scaleY\(([^\)]*)\)/,
        scaleZ: /scaleZ\(([^\)]*)\)/,
        rotateX: /rotateX\(([^\)]*)\)/,
        rotateY: /rotateY\(([^\)]*)\)/,
        rotateZ: /rotateZ\(([^\)]*)\)/
    };
    var supportEx = /(translate|rotate|scale)(X|Y|Z)/;

    $.fn[ 'transform' ] = function( type, properties ){

        var webkitTransform = this.css( 'webkitTransform' ),
            transform = transformParse( webkitTransform );

        switch( type ){

            /**
             * 获取属性
             * transform( 'get', 'translate' )
             */
            case 'get':

                return transform[ properties ];

                break;

            /**
             * 设置属性
             * transform( 'set', 'translateX', '12' )
             * transfrom( 'set', 'scale', 2 )
             * transfrom( 'set', { scale: 1.5, rotateX: '45deg', translateX: 12 } )
             */
            case 'set':

                var values = arguments[ 2 ], newStr = '', key;

                if( typeof properties === 'string' ){

                    webkitTransform = transformSet( webkitTransform, properties, values );
                }
                else {

                    for( key in properties ){

                        webkitTransform = transformSet( webkitTransform, key, properties[ key ] );
                    }
                }

                this[ 0 ].style.webkitTransform = webkitTransform;

                break;

            /**
             * 动画
             * 除了第一个参数外，后面参数和$().anim一致
             * 1、可以使用scale和rotate来进行属性设置
             * 2、一次动画不会擦出已经具有的transform属性
             */
            case 'anim':

                var animProperties = properties, key, _key,
                    xyz = [ 'x', 'y', 'z' ];

                // 先解析动画属性，全部转化为 key[X|Y\Z] 形式
                properties = transfromPropersHandle( properties );
                
                for( key in transform ){

                    xyz.forEach( function( v ){

                        _key = key + v.toUpperCase();

                        if( !( _key in animProperties ) ){

                            animProperties[ _key ] = transform[ key ][ v ];
                        }
                    });
                }

                // 处理每个属性的值
                for( key in animProperties ){

                    animProperties[ key ] = transfromValueHandle( key, animProperties[ key ] );
                }

                this.anim.apply( this, [ animProperties ].concat( [].slice.call( arguments, 2 ) ) );
                break;
            default:
                break;
        }

        return this;
    };

    /**
     * 解析webkitTransform，返回数据
     * @param str
     */
    function transformParse( str ){

        var transfrom = {
            translate: {},
            scale: {},
            rotate: {}
        },
        xyz = [ 'x', 'y', 'z' ], key;

        for( key in transfrom ){

            xyz.forEach( function( v ){

                var value = transformEx[ key + v.toUpperCase() ].exec( str );

                if( value && value[ 1 ]){

                    value = parseFloat( value[ 1 ] );
                }
                else {

                    if( key === 'scale' ){
                        value = 1;
                    }
                    else {
                        value = 0;
                    }
                }

                transfrom[ key ][ v ] = value;
            });
        }

        return transfrom;
    }

    /**
     * 用来将动画属性中的 scale: value 转化为 scale[X|Y|Z] 这样的转化
     * @param propers
     */
    function transfromPropersHandle( propers ){

        var newPropers = {}, key,
            xyz = [ 'x', 'y', 'z' ], _key, value;

        for( key in propers ){

            if( supportEx.test( key ) ){

                newPropers[ key ] = propers[ key ];
            }
            else{

                if( key === 'translate' || key === 'scale' || key === 'rotate' ){

                    value = propers[ key ];

                    if( $.isObject( value ) ){

                        xyz.forEach( function( v ){

                            if( v in value ){

                                _key = key + v.toUpperCase();

                                newPropers[ _key ] = value[ v ];
                            }
                        });
                    }
                    else {

                        if( key !== 'translate' ){

                            xyz.forEach( function( v ){

                                _key = key + v.toUpperCase();

                                newPropers[ _key ] = value;
                            });
                        }
                    }
                }
            }
        }

        return newPropers;
    }

    /**
     * 对属性值进行处理 添加px deg等
     * @param key
     * @param value
     */
    function transfromValueHandle( key, value ){

        if( key.indexOf( 'translate' ) >= 0 ){

            value = parseInt( value ) + 'px';
        }
        else if( key.indexOf( 'rotate' ) >= 0 ){

            value = parseFloat( value ) + 'deg';
        }
        else {

            value = parseFloat( value );
        }

        return value;
    }

    /**
     * 为webkitTransform 字符串设置属性 返回改造后的字符串
     * @param str
     * @param key
     * @param value
     */
    function _transformSet( str, key, value ){

        value = transfromValueHandle( key, value );

        // 检查是否存在该key
        if( transformEx[ key ].test( str ) ){

            str = str.replace( transformEx[ key ], key + '(' + value + ')' );
        }
        else {

            str += ' ' + key + '(' + value + ')';
        }
        
        return str;
    }


    function transformSet( str, key, value ){

        str = str || '';
        
        if( supportEx.test( key ) ){

            str = _transformSet( str, key, value );
        }
        else {

            if( key === 'translate' || key === 'scale' || key === 'rotate' ){

                var xyz = [ 'x', 'y', 'z' ], _key;

                if( $.isObject( value ) ){

                    xyz.forEach( function( v ){

                        if( v in value ){

                            _key = key + v.toUpperCase();

                            str = _transformSet( str, _key, value[ v ] );
                        }
                    });
                }
                else {

                    if( key !== 'translate' ){

                        xyz.forEach( function( v ){

                            _key = key + v.toUpperCase();

                            str = _transformSet( str, _key, value );
                        });
                    }
                }
            }
        }

        return str;
    }

})( Zepto );