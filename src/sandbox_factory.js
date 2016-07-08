
(function(o){
    if(!o) {
        // can't add functions if no Oskari ref
        return;
    }
    var defaultName = 'sandbox';
    var wannabeCore = null;
    var sandboxStore = o.createStore({
    	defaultValue : function(sandboxName) {
    		var newCore = false;
    		if(!wannabeCore) {
    			wannabeCore = o.clazz.create('Oskari.mapframework.core.Core');
    			newCore = true;
    		}
    		var sb = o.clazz.create('Oskari.mapframework.sandbox.Sandbox', wannabeCore);
    		wannabeCore._sandbox = sb;
    		if(newCore) {
            	wannabeCore.init();
    		}
    		return sb;
    	}
    });

    var getName = function(name) {
    	return name || defaultName;
    }
    /**
     * @public @static @method Oskari.getSandbox
     *
     * @param  {string=} sandboxName Sandbox name
     *
     * @return {Object}              Sandbox
     */
     o.getSandbox = function (name) {
        return sandboxStore.data(getName(name));
    };

    /**
     * @public @static @method Oskari.setSandbox
     *
     * @param  {string=} sandboxName Sandbox name
     * @param  {Object}  sandbox     Sandbox
     *
     * @return
     */
    o.setSandbox = function (name, sandbox) {
        return sandboxStore.data(getName(name), sandbox);
    };
}(Oskari));