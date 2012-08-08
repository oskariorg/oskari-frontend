Oskari.clazz.define('Oskari.poc.extjs.flyoutadapter.Extension', function(instance, props, def) {
	this.instance = instance;
	this.props = props;
	this.plugins = {};
	this.def = def;

}, {

	getName : function() {
		return this.props.name;
	},
	setSandbox : function(sandbox) {
		this.sandbox = sandbox;
	},
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.poc.extjs.flyoutadapter.Flyout', this, this.props, this.def);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.poc.extjs.flyoutadapter.Tile', this, this.props, this.def);
	},
	stopExtension : function() {
		
		this.def.bundleInstance.stop();
		
		this.def = null;
	},
	getTitle : function() {
		return this.props.title;
	},
	getDescription : function() {
		return this.props.description;
	},
	getPlugins : function() {
		return this.plugins;
	}
});
