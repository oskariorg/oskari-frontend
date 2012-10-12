/**
 * @class Oskari.mapframework.bundle.maplegend.Flyout
 *
 * Renders the "all layers" flyout.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.maplegend.Flyout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.maplegend.LayerSelectorBundleInstance} instance
 *    reference to component that created the flyout
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.templateLayer = null;
	this.templateLayerFooterTools =null;
	this.state = null;

}, {
	templates: {
		layer: '<div class="maplegend-layer"><img /></div>',
		tools: '<div class="maplegend-tools"><div class="layer-description"><div class="icon-info"></div></div></div>'
	},
	/**
	 * @method getName
	 * @return {String} the name for the component
	 */
	getName : function() {
		return 'Oskari.mapframework.bundle.maplegend.Flyout';
	},
	/**
	 * @method setEl
	 * @param {Object} el
	 * 		reference to the container in browser
	 * @param {Number} width
	 * 		container size(?) - not used
	 * @param {Number} height
	 * 		container size(?) - not used
	 *
	 * Interface method implementation
	 */
	setEl : function(el, width, height) {
		this.container = el[0];
		if(!jQuery(this.container).hasClass('maplegend')) {
			jQuery(this.container).addClass('maplegend');
		}
	},
	/**
	 * @method startPlugin
	 *
	 * Interface method implementation, assigns the HTML templates that will be used to create the UI
	 */
	startPlugin : function() {

		var me = this;
		me.templateLayer = 
			jQuery(this.templates.layer);
		me.templateLayerFooterTools = 
			jQuery(this.templates.tools);
		
	},
	/**
	 * @method stopPlugin
	 *
	 * Interface method implementation, does nothing atm
	 */
	stopPlugin : function() {

	},
	/**
	 * @method getTitle
	 * @return {String} localized text for the title of the flyout
	 */
	getTitle : function() {
		return this.instance.getLocalization('title');
	},
	/**
	 * @method getDescription
	 * @return {String} localized text for the description of the flyout
	 */
	getDescription : function() {
		return this.instance.getLocalization('desc');
	},
	/**
	 * @method getOptions
	 * Interface method implementation, does nothing atm
	 */
	getOptions : function() {

	},
	/**
	 * @method setState
	 * @param {String} state
	 * 		close/minimize/maximize etc
	 * Interface method implementation, does nothing atm
	 */
	setState : function(state) {
		this.state = state;
	},
	setContentState : function(state) {

	},
	getContentState : function() {

		return {

		};
	},
	createUi : function() {
		this.refresh();
	},
	refresh : function() {
		this._populateLayerList();
	},
	/**
	 * @method _populateLayerList
	 * @private
	 * @param {Object} layerListContainer reference to jQuery object representing the layerlist placeholder
	 * Renders layer information as list to the given container object.
	 * Layers are sorted by grouping & name
	 */
	_populateLayerList : function() {
		var me = this;
		var cel = jQuery(this.container);
		cel.empty();
		
		var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
		accordion.insertTo(cel);
		
		var sandbox = this.instance.getSandbox();
		
		// populate selected layer list
		var layers = sandbox.findAllSelectedMapLayers().slice(0);

		for(var n = 0; n < layers.length; ++n) {
			var layer = layers[n];
			var groupAttr = layer.getName();
			var layerContainer = this._createLayerContainer(layer);
			
			var accordionPanel = 
				Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
			accordionPanel.open();
			accordionPanel.setTitle(layer.getName());
			accordionPanel.getContainer().append(me._createLayerContainer(layer));
			accordion.addPanel(accordionPanel);
		}

	},

	/**
	 * @method _createLayerContainer
	 * @private
	 * Creates the layer containers
	 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer to render
	 */
	_createLayerContainer : function(layer) {
		var me = this;
		var sandbox = me.instance.getSandbox();
		var layerDiv = this.templateLayer.clone();

		var imgDiv = layerDiv.find('img');
		
		/*var legendUrl = 
			'http://kartta.liikennevirasto.fi/maaliikenne/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=liikennemaarat&style=KAVLras';*/
		var legendUrl = layer.getLegendImage();
		if( legendUrl ) {
			var img = new Image();
			img.onload = function() {
				imgDiv.attr('src',legendUrl);
				img.onload = null;
			}		
			img.src = legendUrl;
		}
		var uuid = layer.getMetadataIdentifier();
		var tools = this.templateLayerFooterTools.clone();
		if (!uuid) {
            // no functionality -> hide
            tools.find('div.layer-description').hide();
        } else {
            tools.find('div.icon-info').bind('click', function() {
                var rn = 'catalogue.ShowMetadataRequest';
                
                sandbox.postRequestByName(rn, [{
                    uuid : uuid
                }]);
            });
        }
        layerDiv.append(tools);;


		return layerDiv;
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static
	 */
	'protocol' : ['Oskari.userinterface.Flyout']
});
