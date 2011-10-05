/**
 * 实现backbone的本地存储
 */
(function(){

var syncBak = Backbone.sync || function(){},
	UUID = 0;
Backbone.sync = function( method, model, options, error ){
	syncBak.apply( this, arguments );
	localStorage.setItem( 'localStorage-test-' + UUID, 'sync called' );
	UUID++;
};

})();
