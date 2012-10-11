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
	this.template = null;
	this.templateLayer = null;
	this.templateLayerGroup = null;
	this.templateGroupingTool = null;
	this.state = null;

}, {
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
		this.template = jQuery('<div class="layerList volatile"></div></div>');

		this.templateLayer = jQuery('<div class="layer"><img /> ' + '<div class="layer-tools"><div class="layer-icon"></div><div class="layer-info"></div></div>' + '<div class="layer-title"></div>' + '<div class="layer-keywords"></div>' + '</div>');
		this.templateLayerGroup = jQuery('<div class="layerGroup"><div class="header"><div class="groupIcon"></div><div class="groupHeader"><span class="groupName"></span><span class="layerCount"></span></div></div></div>');
		this.templateGroupingTool = jQuery('<li><a href="JavaScript:void(0);"></a></li>');
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
		var me = this;
		var sandbox = me.instance.getSandbox();

		// clear container
		var cel = jQuery(this.container);
		cel.empty();

		// clone content container from template
		var content = this.template.clone();
		// add content container to flyout
		cel.append(content);

		this.refresh();
	},
	refresh : function() {
		var cel = jQuery(this.container);
		var layerListContainer = cel.find('div.layerList');
		this._populateLayerList(layerListContainer);
	},
	/**
	 * @method _populateLayerList
	 * @private
	 * @param {Object} layerListContainer reference to jQuery object representing the layerlist placeholder
	 * Renders layer information as list to the given container object.
	 * Layers are sorted by grouping & name
	 */
	_populateLayerList : function(layerListContainer) {
		var me = this;
		var sandbox = this.instance.getSandbox();
		// clear list
		layerListContainer.empty();

		// populate selected layer list
		var layers = sandbox.findAllSelectedMapLayers().slice(0);

		var layerGroupContainer = null;
		var layerGroup = null;
		var layerCount = 0;
		var isOddLayer = true;
		for(var n = 0; n < layers.length; ++n) {
			var layer = layers[n];
			var groupAttr = layer.getName();
			var layerContainer = this._createLayerContainer(layer);
			var layerGroupContainer = this._createLayerGroupContainer(groupAttr);
			layerListContainer.append(layerGroupContainer);
			layerGroupContainer.append(layerContainer);
			layerCount++;

		}

	},
	/**
	 * @method _createLayerGroupContainer
	 * @private
	 * Creates the layer group containers
	 * @param {String} groupName title for the group
	 */
	_createLayerGroupContainer : function(groupName) {
		var me = this;
		var sandbox = me.instance.getSandbox();

		// clone from layer group template
		var layerGroupDiv = this.templateLayerGroup.clone();
		// let's start opened
		layerGroupDiv.addClass('open');
		layerGroupDiv.find('div.groupIcon').removeClass('icon-arrow-right');
		layerGroupDiv.find('div.groupIcon').addClass('icon-arrow-down');

		var groupHeader = jQuery(layerGroupDiv).find('div.header');
		groupHeader.find('span.groupName').append(groupName);
		groupHeader.click(function() {
			var groupDiv = jQuery(this).parent();
			var isOpen = groupDiv.hasClass('open');
			// layer is open -> close it
			if(isOpen) {
				groupDiv.removeClass('open');
				groupDiv.find('div.groupIcon').removeClass('icon-arrow-down');
				groupDiv.find('div.groupIcon').addClass('icon-arrow-right');
				groupDiv.find('div.layer').hide();
			}
			// layer is closed -> open it
			else {
				groupDiv.addClass('open');
				groupDiv.find('div.groupIcon').removeClass('icon-arrow-right');
				groupDiv.find('div.groupIcon').addClass('icon-arrow-down');

				var visibleLayers = groupDiv.find('div.layer');
				visibleLayers.show();
			}
		});
		return layerGroupDiv;
	},
	/**
	 * @method _createLayerContainer
	 * @private
	 * Creates the layer containers
	 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer to render
	 */
	_createLayerContainer : function(layer) {

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

		return layerDiv;
	}
}, {
	/**
	 * @property {String[]} protocol
	 * @static
	 */
	'protocol' : ['Oskari.userinterface.Flyout']
});
