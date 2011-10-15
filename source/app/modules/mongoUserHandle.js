/** 
 * 封装数据操作
 */

var Mgo = require( './mongoModel' ),
	Muser = Mgo.model( 'user' ),
    errorConf = _freenote_cfg.error;

var handle = {

    /**
     * get user
     * @param name
     * @param next( err, user )
     *      err: mongo_error | user_not_exist
     */
	getUser: function( name, next ){

		Muser.findOne( { name: name }, function( err, user ){
			if( err ){
				next({
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                });
			}
			else {
				if( !user ){
					next({
                        type: 'user_not_exist',
                        msg: errorConf.get( 'user_not_exist', { name: name } )
                    });
				}
				else {
					next( null, user );
				}
			}
		});
	},

    /**
     * add user
     * @param name
     * @param password
     * @param next( err, user )
     *      err: mongo_error
     */
	addUser: function( name, password, next ){

        var user = new Muser({
            name: name,
            password: password
        });

        user.save( function( err ){
            if( err ){
                next( {
                    type: 'mongo_error',
                    msg: errorConf.get( 'mongo_error', err )
                });
            }
            else {
                next( null, user );
            }
        });
	}
};
module.exports = handle;

