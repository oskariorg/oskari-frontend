/**
 * @class Oskari.poc.jqueryui.layerselection.Flyout
 */
Oskari.clazz.define('Oskari.poc.jqueryui.layerselection.Flyout',

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
	this.layercontrols = {};
}, {
	getName : function() {
		return 'Oskari.poc.jqueryui.layerselection.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = $(el);
	},
	startPlugin : function() {
		this.template = $('<div class="layer"><p></p><div class="slider"></div></div>');
		this.refresh();
	},
	stopPlugin : function() {
		this.container.empty();
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
	updateLayer : function(layer) {

		/*this.layercontrols[layerid]*/
		var lc = this.layercontrols[layer.getId()];
		if(!lc)
			return;

		var slider = lc.slider;

		var opacity = layer.getOpacity();

		slider.slider('value', opacity);

	},
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();
		var opacityRequestBuilder = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');
		var layers = sandbox.findAllSelectedMapLayers();

		cel.empty();
		me.layercontrols = {};

		$(layers).each(function(index) {
			var el = $(tpl).clone();
			var layer = this;
			var layerId = layer.getId();
			var value = layer.getOpacity();
			var sliderEl = $(el).children('.slider');

			me.layercontrols[layerId] = {
				slider : sliderEl
			};

			$(el).children('p').append(layer.getName());
			$(el).appendTo(cel);
			sliderEl.slider({
				min : 0,
				max : 100,
				value : value,
				slide : function(event, ui) {
					var newValue = ui.value;
					sandbox.request(instance, opacityRequestBuilder(layerId, newValue));
				}
			});

		});
	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
