/**
 * @class Oskari.framework.bundle.oskariui.DomManager
 *
 
 */
Oskari.clazz.define('Oskari.framework.bundle.oskariui.DomManager',
/**
 * @method create called automatically on construction
 * @static
 * @param {jQuery} jquery impl
 */
function(dollar, partsMap) {
	this.$ = dollar;
	this.partsMap = partsMap||{};
	this.style = null;
}, {
	getEl : function(selector) {
		return this.$(selector);
	},
	getElForPart : function(part) {
		return this.$(this.partsMap[part]);
	},
	setElForPart : function(part,el) {
		this.partsMap[part] = this.$(el);
	},
	setElParts : function(partsMap) {
		this.partsMap = partsMap;
	},
	getElParts : function() {
		return this.partsMap;
	},
	setLayout : function(s) {
		throw "N/A";
	},
	getLayout : function() {
		throw "N/A";
	}
}, {
	/**
	 * @property {String[]} protocol array of superclasses as {String}
	 * @static
	 */
	'protocol' : ['Oskari.dom.DomManager']
});
