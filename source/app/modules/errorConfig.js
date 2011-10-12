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
    mongo_error: 'database query error: <%= err %>',

    // user
    user_not_exist: 'username: <%= name %> not exist',

    // note
};

var handle = {

    get: function( type, data ){
        var msgStr = freenote_error[ type ] || '';
        return _.template( msgStr, data );
    },

    /**
     * ��ͻ��˷��ش�����Ϣ
     * @param req
     * @param res
     * @param type ��������
     * @param data ���ظ��ͻ��˶��������
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