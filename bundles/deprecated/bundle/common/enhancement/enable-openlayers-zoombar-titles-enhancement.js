/**
 * @class Oskari.mapframework.enhancement.common.EnableOpenLayersZoombarTitlesEnhancement
 * Disables debug logging and enables usage logging based on environment
 *
 * TODO: refactor jQuery manipulation
 */
Oskari.clazz.define('Oskari.mapframework.enhancement.common.EnableOpenLayersZoombarTitlesEnhancement', 

/**
 * @method create called automatically on construction
 * @static
 * @param {String}
 *            renderAfterDiv marker div id used to detect html insertion placement 
 */ 
function(renderAfterDiv) {
    this._renderAfterDiv = renderAfterDiv;
}, {
    /**
     * @method enhance
     *
     * Interface method for the enhancement protocol
     *
     * @param {Object} core
     * 			reference to application core
     */
    enhance : function(core) {
        core.printDebug("Enhancing application enabling zoombar titles.");

        var sandbox = Oskari.$().sandbox;

        var zbLabels = '<div id="zoomLevelTitleId">' + 
        		'<div id="zoomLevelTitle1">' + 
        		'<div id="zoomLevel_arrow"></div>' + 
        		'<div id="zoomLevel_title"><div id="zoomLevel_label">' + 
        		sandbox.getText('mapcontrolsservice_zoomlevel_street_title') + 
        		'</div></div>' + 
        		'<div id="zoomLevel_rigth"></div>' + 
        		'</div>' + 
        		'<div id="zoomLevelTitle2">' + 
        		'<div id="zoomLevel_arrow"></div>' + 
        		'<div id="zoomLevel_title"><div id="zoomLevel_label">' + 
        		sandbox.getText('mapcontrolsservice_zoomlevel_part_of_a_town_title') + 
        		'</div></div>' + 
        		'<div id="zoomLevel_rigth"></div>' + '</div>' + '<div id="zoomLevelTitle3">' + '<div id="zoomLevel_arrow"></div>' + '<div id="zoomLevel_title"><div id="zoomLevel_label">' + sandbox.getText('mapcontrolsservice_zoomlevel_town_title') + '</div></div>' + '<div id="zoomLevel_rigth"></div>' + '</div>' + '<div id="zoomLevelTitle4">' + '<div id="zoomLevel_arrow"></div>' + '<div id="zoomLevel_title"><div id="zoomLevel_label">' + sandbox.getText('mapcontrolsservice_zoomlevel_province_title') + '</div></div>' + '<div id="zoomLevel_rigth"></div>' + '</div>' + '<div id="zoomLevelTitle5">' + '<div id="zoomLevel_arrow"></div>' + '<div id="zoomLevel_title"><div id="zoomLevel_label">' + sandbox.getText('mapcontrolsservice_zoomlevel_country_title') + '</div></div>' + '<div id="zoomLevel_rigth"></div>' + '</div>' + '</div>';

        jQuery(this._renderAfterDiv).after(zbLabels);

        jQuery("#panzoombar").mouseover(function() {
            jQuery("#zoomLevelTitleId").show();
        });

        jQuery("#panzoombar").mouseout(function() {
            jQuery("#zoomLevelTitleId").hide();
        });
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
});

/* Inheritance */