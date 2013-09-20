/**
 * @class Oskari.analysis.bundle.analyse.AnalyseService
 * Methods for sending out analysis data to backend
 */
Oskari.clazz.define('Oskari.analysis.bundle.analyse.service.AnalyseService',

/**
 * @method create called automatically on construction
 * @static
 *
 */
function(instance) {
    this.instance = instance;
    this.sandbox = instance.sandbox;
    this.loc = instance.getLocalization('AnalyseView');
}, {
    __name : "Analyse.AnalyseService",
    __qname : "Oskari.analysis.bundle.analyse.service.AnalyseService",

    getQName : function() {
        return this.__qname;
    },

    getName : function() {
        return this.__name;
    },

    /**
     * @method init
     * Initializes the service
     */
    init : function() {

    },

    /**
     * Sends the data to backend for analysis.
     *
     * @method sendAnalyseData
     * @param {Object} data the data to send
     * @param {Function} success the success callback
     * @param {Function} failure the failure callback
     */
    sendAnalyseData : function(data, success, failure) {
        var url = this.sandbox.getAjaxUrl() + 'action_route=CreateAnalysisLayer';
        jQuery.ajax({
            type : 'POST',
            dataType : 'json',
            url : url,
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            data : data,
            success : success,
            error : failure
        });
    },

    /**
     * Get analysis layers.
     *
     * @method getAnalyseLayers
     * @param {Function} success2 the success callback
     * @param {Function} failure the failure callback
     */
    _getAnalysisLayers : function(success2, failure) {
        var url = this.sandbox.getAjaxUrl() + 'action_route=GetAnalysisLayers';
        jQuery.ajax({
            type : 'GET',
            dataType : 'json',
            url : url,
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : success2,
            error : failure
        });
    },
    /**
     * @method _loadAnalyseLayers
     * @private
     * Load analysis layers in start.
     *
     */
    loadAnalyseLayers : function() {
        var me = this,
            sandbox = me.instance.getSandbox(),
            url = sandbox.getAjaxUrl(),
            loc = Oskari.getLocalization(me.instance.getName());

        // Request analyis layers via the backend
        me._getAnalysisLayers(
        // Success callback
        function(response) {
            if (response) {
                me._handleAnalysisLayersResponse(response);
            }
        },
        // Error callback
        function(jqXHR, textStatus, errorThrown) {
            me.instance.showMessage(me.loc.error.title, me.loc.error.loadLayersFailed);
        });

    },
    /**
     * Put analysislayers to map and subsequently to be used in further analysis.
     *
     * @method handleAnalysisLayersResponse
     * @private
     * @param {JSON} analyseJson analysislayers JSON returned by server.
     */
    _handleAnalysisLayersResponse : function(analysislayersJson) {
        // TODO: some error checking perhaps?
        var mapLayerService, mapLayer, requestBuilder, request;
        var layerarr = analysislayersJson.analysislayers; 
        for (var i in layerarr) {
             var analyseJson = layerarr[i];
            // TODO: Handle WPS results when no FeatureCollection eg. aggregate
            if (analyseJson.wpsLayerId == "-1") {
                // no analyse layer case  eg. aggregate wps function
                this.instance.showMessage("Tulokset", analyseJson.result);
            } else {
                mapLayerService = this.instance.mapLayerService;
                mapLayer = mapLayerService.createMapLayer(analyseJson);
                mapLayer.setWpsUrl(analyseJson.wpsUrl);
                mapLayer.setWpsName(analyseJson.wpsName);
                // Add the layer to the map layer service
                mapLayerService.addLayer(mapLayer);

            } 
        }
    },
}, {
    'protocol' : ['Oskari.mapframework.service.Service']
}); 