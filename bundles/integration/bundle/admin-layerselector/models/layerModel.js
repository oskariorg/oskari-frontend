(function() {
    define(function() {
        return Backbone.Model.extend({

            // Ensure that each todo created has `title`.
            initialize : function(model) {
                // exted given object (layer) with this one
                jQuery.extend(this, model);
                this.supportedLanguages = Oskari.getSupportedLanguages();
                // setup backbone id so collections work
                this.id = model.getId();

                this.on('all', function() {
                    console.log(arguments);
                })
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
             * Returns organization or inspire id based on type
             * @param  {String} type ['organization' | 'inspire']
             * @return {Number} group id
             */
            getGroupId : function(type) {
                return this.admin[type + 'Id'];
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
            	/*
            	// TODO: do we need to sort by language?
                langList.sort(function (a, b) {
                    if (a < b) {
                        return -1;
                    }
                    if (a > b) {
                        return 1;
                    }
                    return 0;
                });*/
        		return langList;
        	}
        });
    });
}).call(this);
