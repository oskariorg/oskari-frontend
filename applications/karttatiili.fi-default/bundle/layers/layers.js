/**
 * @class Oskari.mapframework.complexbundle.NlsFiLayerConfig
 *
 * Map configuration
 */
Oskari.clazz.define('Oskari.karttatiili.bundle.layers.KarttatiiliFiLayerConfig', function(popts) {

	var conf = popts || {};

	conf.userInterfaceLanguage = conf.userInterfaceLanguage || "fi";

	this.conf = conf;

}, {

	/**
	 * @method create
	 *
	 * some nls.fi layers
	 */
	create : function() {

		var startup = this.conf;

		startup.layers = this.sampleLayers;

		// predefined set of layers
		startup.preSelectedLayers = {
			preSelectedLayers : [/*{
				id : "base_35"
			}*/]
		};

		// app config
		startup.userInterfaceLanguage = "fi";

		startup.globalMapAjaxUrl = "ajax.js?";
		startup.globalPortletNameSpace = "";

		startup.imageLocation = "../../resources";
		startup.indexMapUrl = '../resource/images/suomi25m_tm35fin.png';
		startup.instructionsText = "Ohjeet";
		startup.instructionsUrl = "http://www.google.fi";
		startup.printUrl = "../print/print.html";
		startup.printWindowHeight = 21 * 32;
		startup.printWindowWidth = 20 * 32;

		startup.mapConfigurations = {
			footer : true,
			scale : 3,
			index_map : true,
			height : 600,
			width : 1000,
			plane_list : true,
			map_function : true,
			zoom_bar : true,
			north : "7204000",
			east : "552000",
			scala_bar : true,
			pan : true
		};

		return startup;
	},
	sampleLayers : {
		layers : [ ]
	},

	/**
	 * @getMapConfiguration
	 *
	 */
	getMapConfiguration : function() {
		return this.conf;
	}
});
