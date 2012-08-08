/**
 * @class Oskari.poc.yuilibrary.layerselector.Flyout
 */
Oskari.clazz.define('Oskari.poc.yuilibrary.layerselector.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.template = null;
	this.state = null;
	this.yuilibrary = null;
}, {
	setYUILibrary : function(yuilibrary) {
		this.yuilibrary = yuilibrary;
	},
	getName : function() {
		return 'Oskari.poc.yuilibrary.layerselector.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = el[0];
		// ?
	},
	startPlugin : function() {

	},
	stopPlugin : function() {

	},
	getTitle : function() {
		return "Valitut karttatasot";
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		this.state = state;
		console.log("Flyout.setState", this, state);
	},
	refresh : function() {
		var me = this;
		var Y = me.yuilibrary;

		var tpl = me.template;

		if(!tpl) {
			tpl = Y.Node.create('<div class="layerselector"></div>');
			me.template = tpl;
		}

		var cel = Y.one(this.container);
		var tpl = this.template;

		var sandbox = me.instance.getSandbox();
		var opacityRequestBuilder = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');

		var layers = sandbox.findAllSelectedMapLayers();

		cel.empty();

		var gridDiv = tpl.cloneNode(true);

		var tabview = new Y.TabView({
			children : [{
				label : 'foo',
				content : '<div><p>foo content</p></div><div><p>foo content</p></div><div><p>foo content</p></div>'
			}, {
				label : 'bar',
				content : '<div><p>bar content</p></div><div><p>bar content</p></div><div><p>bar content</p></div>'
			}, {
				label : 'baz',
				content : '<div><p>baz content</p></div><div><p>baz content</p></div><div><p>baz content</p></div>'
			}]
		});

		tabview.render(gridDiv);

		cel.appendChild(gridDiv);
	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
