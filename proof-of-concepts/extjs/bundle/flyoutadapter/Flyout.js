/**
 * @class Oskari.poc.jqueryui.layerselection.Flyout
 */
Oskari.clazz.define('Oskari.poc.extjs.flyoutadapter.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance, props, def) {
	this.instance = instance;
	this.container = null;
	this.el = null;
	this.template = null;
	this.state = null;
	this.props = props;
	this.def = def;
}, {
	getName : function() {
		return this.props.name;
	},
	setEl : function(el, width, height) {
		this.container = el[0];

	},
	startPlugin : function() {

		var items = this.def.component ? [this.def.component] : [];

		this.el = Ext.create('Ext.panel.Panel', {
			renderTo : this.container,
			bodyBorder : false,
			bodyCls : 'oskari',
			bodyStyle : {
				border : '1pt dashed #c0c0c0',
				padding : '16px',
				margin : '16px'
			},
			layout : 'fit',
			width : 636,
			height : 420,
			items : items
		});
	},
	stopPlugin : function() {
		this.container.empty();
	},
	getTitle : function() {
		return this.props.title;
	},
	getDescription : function() {
		return this.props.description;
	},
	getOptions : function() {

	},
	setState : function(state) {

	},
	refresh : function() {

	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
