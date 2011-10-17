/**
 * Created by JetBrains WebStorm.
 * User: neekey
 * Date: 11-10-12
 * Time: ����2:35
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

    password_incorrect: 'you password is not correct',

    // note

    note_not_exist: 'note id: <%=  id %> not exist in user: <%= name %>',

    // sync

    syncs_not_found: 'sync data is not found from user: <%= name %>',

    sync_not_found: 'sync: <%= serial %> not found from user: <%= name %>',

    sync_already_exist: 'sync: <%= serial %> already exist from user: <%= name %>'
};

var handle = {

    get: function( type, data ){
        data = data || {};
        var msgStr = freenote_error[ type ] || '';
        return _.template( msgStr, data );
    },

    /**
     * ��ͻ��˷��ش�����Ϣ
     * @param req
     * @param res
     * @param type ��������
     * @param data ���ظ�ͻ��˶�������
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