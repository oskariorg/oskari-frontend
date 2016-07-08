(function(o){
	var log = Oskari.log('Oskari.deprecated');
	var warn = function(name) {
		log.warn('Oskari.' + name + '() no longer has any effect and will be removed in future release. Remove calls to it.')
	};

	var mode = 'default';
    var domMgr;
    var dollarStore = o.createStore();
	var funcs = {

	    /**
	     * @public @static @method Oskari.setLoaderMode
	     * @param {string} m Loader mode
	     */
	    setLoaderMode :  function (m) {
	    	mode = m;
	    },

	    /**
	     * @public @method Oskari.getLoaderMode
	     * @return {string} Loader mode
	     */
	    getLoaderMode : function () {
	        return mode;
	    },

	    /**
	     * @public @method Oskari.setPreloaded
	     * @deprecated No longer has any effect. Remove calls to it. Will be removed in 1.38 or later.
	     */
	    setPreloaded : function () {},

	    purge : function () {},

	    getDomManager : function () {
	        return domMgr;
	    },
	    setDomManager :  function (dm) {
			domMgr = dm;
	    },

	    /**
	     * @public @method Oskari.$
	     * @return {}
	     */
	    $ : function (name, value) {
	        return dollarStore.data(name, value);
	    }
	};
	var attachWarning = function(name) {
		return function() {
			warn(name);
			return funcs[name].apply(o, arguments);
		};
	}
	// attach to Oskari with a warning message wrapping
	for(var key in funcs) {
		o[key] = attachWarning(key);
	}
}(Oskari));