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
    mongo_error: 'database query error: <%= message %>',

    // user
    user_not_exist: 'username: <%= name %> not exist',

    user_already_exist: 'username: <%= name %> already exist',

    // sessions

    session_not_found: 'session can not be found from user <%= name %>',

    serial_not_found: 'serial: <%= serial %> can not be found from user <%= name %>',

    // auth

    not_ajax: 'your request is not ajax',

    unsafe_cookie: 'your cookie is unsafe, it will be destroy!',

    logout_fail: 'you have not login!',

    already_login: 'you have login as user: <%= name %>',

    not_login: 'you have not logined in',

    password_incorrect: 'you password is not correct'
};

var handle = {

    get: function( type, data ){
        data = data || {};
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