
(function(o){
    if(!o) {
        // can't add functions if no Oskari ref
        return;
    }
    var defaultName = 'sandbox';
    var getName = function(name) {
        return name || defaultName;
    }

    var wannabeCore = null;
    var sandboxStore = o.createStore({
        defaultValue : function(sandboxName) {
            // Notice that these are not part of the core.
            // FIXME: move wannabe-core and sandbox files from being loaded mapfull with to be part of the core
            var newCore = false;
            if(!wannabeCore) {
                wannabeCore = o.clazz.create('Oskari.mapframework.core.Core');
                newCore = true;
            }
            var sb = o.clazz.create('Oskari.mapframework.sandbox.Sandbox', wannabeCore, getName(sandboxName));
            wannabeCore._sandbox = sb;
            if(newCore) {
                wannabeCore.init();
            }
            return sb;
        }
    });

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
}(Oskari));