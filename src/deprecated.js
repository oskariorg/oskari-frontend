(function(o){
	var log = Oskari.log('Oskari.deprecated');
	var warn = function(name) {
		log.warn('Oskari.' + name + '() no longer has any effect and will be removed in future release. Remove calls to it.')
	};

	var mode = 'default';
    /**
     * @public @static @method Oskari.setLoaderMode
     * @param {string} m Loader mode
     */
    o.setLoaderMode =  function (m) {
    	warn('setLoaderMode');
    	mode = m;
    };

    /**
     * @public @method Oskari.getLoaderMode
     * @return {string} Loader mode
     */
    o.getLoaderMode = function () {
    	warn('getLoaderMode');
        return mode;
    };

    /**
     * @public @method Oskari.setPreloaded
     * @deprecated No longer has any effect. Remove calls to it. Will be removed in 1.38 or later.
     */
    o.setPreloaded = function () {
    	warn('setPreloaded');
    };

    o.purge = function () {
    	warn('purge');
    };

    var domMgr;
    o.getDomManager = function () {
    	warn('getDomManager');
        return domMgr;
    };
    o.setDomManager =  function (dm) {
    	warn('setDomManager');
		domMgr = dm;
    };
}(Oskari));