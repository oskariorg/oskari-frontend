// polyfill for bind - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind -> polyfill
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
// actual model - uses bind to make Oskari layer object functions call BackBone model.attributes
(function() {
    define(function() {
        return Backbone.Model.extend({

            // Ensure that each todo created has `title`.
            initialize : function(model) {
                // exted given object (layer) with this one
                if(model) {
                    for(var key in model) {
                        var prop = model[key];
                        if(typeof prop === 'function') {
                            this[key] = prop.bind(this.attributes);
                        }
                    }
                }
                //jQuery.extend(this, model);
                this.supportedLanguages = Oskari.getSupportedLanguages();
                // setup backbone id so collections work
                this.id = model.getId();
            },

            /**
             * Returns XSLT if defined or null if not
             * @return {String} xslt
             */
            getGfiXslt : function() {
                var adminBlock = this.get('admin');
            	if(adminBlock) {
            		return adminBlock.xslt;
            	}
            	return null;
        	},
            /**
             * Returns organization or inspire id based on type
             * @param  {String} type ['organization' | 'inspire']
             * @return {Number} group id
             */
            getGroupId : function(type) {
                var adminBlock = this.get('admin');
                if(adminBlock) {
                    return adminBlock[type + 'Id'];
                }
                return null;
            },
            /**
             * Returns language codes for defined names
             * @return {String[]} language codes
             */
            getNameLanguages : function() {
            	// TODO: maybe cache result?
            	return this._getLanguages(this.get('_name'));
        	},
            /**
             * Returns language codes for defined names
             * @return {String[]} language codes
             */
            getDescLanguages : function() {
            	// TODO: maybe cache result?
            	return this._getLanguages(this.get('_description'));
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
