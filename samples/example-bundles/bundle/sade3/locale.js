Oskari.clazz.define('Oskari.poc.sade3.SadeLocale', function(lang) {
	this.lang = lang;
}, {
	'def' : {},

	/*
	 * 
	 * 
	 * 
	 */

	'getLang' : function() {
		return this.lang;
	},

	'get' : function(context, id) {

		return (this[context][id] || this.def)[this.lang]

		|| (this.context + "_" + id + " " + this.lang + "???");

	},

	'app' : {
		'map' : {

			fi : {
				title : 'Kartta'
			}
		}
	}
});
