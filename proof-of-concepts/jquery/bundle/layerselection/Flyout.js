/**
 * @class Oskari.poc.yuilibrary.layerselection.Flyout
 */
Oskari.clazz.define('Oskari.poc.jquery.layerselection.Flyout',

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
	this.layercontrols = {};
}, {
	getName : function() {
		return 'Oskari.poc.jquery.layerselection.Flyout';
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
		return "Valitut karttatasot JQuery";
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
		var layercontrols = this.layercontrols[layer.getId()];
		if(!layercontrols)
			return;
		var slider = layercontrols.slider;
		if(!slider)
			return;

		var opacity = layer.getOpacity();

		slider.setValue(opacity);
	},
	refresh : function() {
		var me = this;
		var tpl = me.template;

		if(!tpl) {
			tpl = jQuery('<div class="layer selectedLayer">' + '<div class="layer-title"><p></p></div>' + '<div class="slider"></div>' + '</div>');
			me.template = tpl;
		}
		
		var celOriginal = jQuery(this.container);
		celOriginal.empty();
		var cel = jQuery('<div class="selectedLayerList"></div>');
		celOriginal.append(cel);
	
		var sandbox = me.instance.getSandbox();
		var opacityRequestBuilder = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');

		var layers = sandbox.findAllSelectedMapLayers();

		//cel.empty();
		me.layercontrols = {};
		
		for(var n = 0, len = layers.length; n < len; n++) {
			var layer = layers[n];
			var layerId = layer.getId();
			var value = layer.getOpacity();

			var layerDiv = tpl.clone();
			jQuery(layerDiv).find('.layer-title p').html(layer.getName());

			cel.append(layerDiv);

		}
		if(layers.length > 1) {
			  // When the document is ready set up our sortable with it's inherant function(s)
			  jQuery(document).ready(function() {
			    jQuery("#selectedLayerList").sortable({
			      update : function () {
					var order = jQuery('#selectedLayerList').sortable('serialize');
					console.dir(order);
			      }
			    });
			});
		}
	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
