
(function (o) {
    if (!o) {
        // can't add functions if no Oskari ref
        return;
    }
    var defaultName = 'sandbox';
    var getName = function (name) {
        return name || defaultName;
    };

    var sandboxStore = o.createStore({
        defaultValue: function (sandboxName) {
            // Notice that these are not part of the core.
            var sb = o.clazz.create('Oskari.Sandbox', getName(sandboxName));
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
