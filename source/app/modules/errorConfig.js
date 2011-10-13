/**
 * Created by JetBrains WebStorm.
 * User: neekey
 * Date: 11-10-12
 * Time: 下午2:35
 *
 * error tip configuration
 */

var freenote_error = {

    // mongo error
    mongo_error: 'database query error: <%= err %>',

    // user
    user_not_exist: 'username: <%= name %> not exist',

    // sessions

    session_not_found: 'session can not be found from user <%= name %>',

    serial_not_found: 'serial: <%= serial %> can not be found from user <%= name %>'
};

var handle = {

    get: function( type, data ){
        var msgStr = freenote_error[ type ] || '';
        return _.template( msgStr, data );
    },

    /**
     * 想客户端返回错误信息
     * @param req
     * @param res
     * @param type 错误类型
     * @param data 返回给客户端额外的数据
     */
    response: function( req, res, type, msg, data ){
        res.send( 200, {
            type: type,
            msg: msg,
            data: data
        });
    }
};

module.exports = handle;