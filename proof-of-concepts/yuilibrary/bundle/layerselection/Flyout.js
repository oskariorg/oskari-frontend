/**
 * @class Oskari.poc.yuilibrary.layerselection.Flyout
 */
Oskari.clazz.define('Oskari.poc.yuilibrary.layerselection.Flyout',

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
	setYUILibrary : function(yuilibrary) {
		this.yuilibrary = yuilibrary;
	},
	getName : function() {
		return 'Oskari.poc.yuilibrary.layerselection.Flyout';
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
		var Y = me.yuilibrary;

		var tpl = me.template;

		if(!tpl) {
			tpl = Y.Node.create('<div class="layer selectedLayer">' + '<div class="layer-title"><p></p></div>' + '<div class="slider"></div>' + '</div>');
			me.template = tpl;
		}
		
		var celOriginal = Y.one(this.container);
		celOriginal.empty();
		var cel = Y.Node.create('<div id="selectedLayerList"></div>');
		celOriginal.appendChild(cel);
		
		
	
		
		var tpl = this.template;

		var sandbox = me.instance.getSandbox();
		var opacityRequestBuilder = sandbox.getRequestBuilder('ChangeMapLayerOpacityRequest');

		var layers = sandbox.findAllSelectedMapLayers();

		//cel.empty();
		me.layercontrols = {};

		for(var n = 0, len = layers.length; n < len; n++) {
			var layer = layers[n];
			var layerId = layer.getId();
			var value = layer.getOpacity();

			var layerDiv = tpl.cloneNode(true);

			var title = layerDiv.one('.layer-title p');
			title.setContent(layer.getName());

			var sliderDiv = layerDiv.one('.slider');

			var slider = new Y.Slider({
				min : 0,
				max : 100,
				value : value,
				length : '200px'
			});

			me.layercontrols[layerId] = {
				slider : slider
			};

			layerDiv.setData({
				sandbox : sandbox,
				instance : me.instance,
				layerId : layerId
			});

			slider.after("valueChange", function(e) {
				var data = this.getData();
				var moduleName = data.instance;
				var layerId = data.layerId;
				var sandbox = data.sandbox;
				sandbox.request(moduleName, opacityRequestBuilder(layerId, e.newVal));
			}, layerDiv);

			slider.render(sliderDiv);

			// slider.render(sliderDiv);

			cel.appendChild(layerDiv);

		}
		if(layers.length > 1) {
		    var sortable = new Y.Sortable({
		        container: "#selectedLayerList",
		        nodes: 'div.selectedLayer'
		        ,
		        opacity: '.1'
		    });
		
		    sortable.on('moved', function(e) {
		        console.log('Item Moved! - ' + e.drag.get('node').get('id'));
		    });
			
		}

		/*
		 * console.log("DOJO.LAYERS",domLayersList,this.container);
		 * window.xxx = this.container;
		 *
		 * for( var n = 0; n < domLayersList.length;n++ ) {
		 * domConstruct.place(domLayersList[n],this.container[0],"last"); }
		 */

	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
