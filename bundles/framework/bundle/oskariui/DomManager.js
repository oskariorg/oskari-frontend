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
	this.partsMap = partsMap || {};
	this.layout = null;
	this.layouts = [];
}, {
	getEl : function(selector) {
		return this.$(selector);
	},
	getElForPart : function(part) {
		return this.$(this.partsMap[part]);
	},
	setElForPart : function(part, el) {
		this.partsMap[part] = this.$(el);
	},
	setElParts : function(partsMap) {
		this.partsMap = partsMap;
	},
	getElParts : function() {
		return this.partsMap;
	},
	pushLayout : function(l) {
		
		if( this.layout ) {
			this.layout.removeLayout(this);
		}		
		this.layout = l;
		this.layouts.push(l);
		l.applyLayout(this);
	},
	popLayout : function() {
		var l = this.layouts.pop();
		if( l ) {
			l.removeLayout(this);
		}
		if(this.layouts.length == 0) {
			this.layout = null;
			return;
		}
		var l = this.layouts[this.layouts.length - 1];
		this.layout = l;
		l.applyLayout(this);
	},
	getLayout : function() {
		return this.layout;
	}
}, {
	/**
	 * @property {String[]} protocol array of superclasses as {String}
	 * @static
	 */
	'protocol' : ['Oskari.dom.DomManager']
});
