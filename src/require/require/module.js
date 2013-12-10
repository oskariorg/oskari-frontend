
define(["oskari", "./instance"], function(Oskari, instanceCls) {

    return Oskari.bundleCls('require', "Oskari.sample.bundle.require.RequireBundle").
    	methods({
        	create : function() {
            	var inst = instanceCls.create('require');
            	return inst;
        	}
    	});

});
