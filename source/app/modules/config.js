/**
 * �����ļ�
 */

require( './global_module' );
/* mongodb config */
require( './mongoConf.js');

var config = {
    error: require( './errorConfig' ),
    cookie: {
        username: '_freenote_name',
        serial: '_freenote_serial',
        token: '_freenote_token'
    }
};

/* set config to global */
_freenote_cfg = config;