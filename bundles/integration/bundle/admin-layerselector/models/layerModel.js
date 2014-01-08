(function() {
    define(function() {
        return Backbone.Model.extend({

            // Ensure that each todo created has `title`.
            initialize : function(model) {
                // exted given object (layer) with this one
                jQuery.extend(this, model);
                this.supportedLanguages = Oskari.getSupportedLanguages();
            },

            /**
             * Returns XSLT if defined or null if not
             * @return {String} xslt
             */
            getGfiXslt : function() {
            	if(this.admin) {
            		return this.admin.xslt;
            	}
            	return null;
        	},
            /**
             * Returns version if defined or null if not
             * @return {String} version as string (f.ex. '1.1.1' or '1.3.0')
             */
            getVersion : function() {
            	if(this.admin) {
            		return this.admin.version;
            	}
            	return null;
        	},
            /**
             * Returns language codes for defined names
             * @return {String[]} language codes
             */
            getNameLanguages : function() {
            	// TODO: maybe cache result?
            	return this._getLanguages(this._name);
        	},
            /**
             * Returns language codes for defined names
             * @return {String[]} language codes
             */
            getDescLanguages : function() {
            	// TODO: maybe cache result?
            	return this._getLanguages(this._description);
        	},
            /**
             * Returns defined language codes or default language if not set
             * @method  _getLanguages
             * @param {String/Object} attribute to use for calculation
             * @return {String[]} [description]
             * @private
             */
        	_getLanguages : function(attr) {
            	var langList = [];
            	// add languages from possible object value
            	if (attr && typeof attr === 'object') {
            		for(var key in attr) {
    					langList.push(key);
            		}
            	}

            	// add any missing languages
            	_.each(this.supportedLanguages, function(lang) {
            		if(jQuery.inArray(lang, langList) == -1) {
            			langList.push(lang);
            		}
            	});
        		return langList;
        	}
        });
    });
}).call(this);
