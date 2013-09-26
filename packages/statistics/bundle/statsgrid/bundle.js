/**
 * @class Oskari.statistics.bundle.statsgrid.StatsGridBundle
 *
 * Definitpation for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.statistics.bundle.statsgrid.StatsGridBundle",
/**
 * @method create called automatically on construction
 * @static
 */
function() {

}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance",
			 'statsgrid');
	},
	"update" : function(manager, bundle, bi, info) {

	}
}, {

	"protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {

		"scripts" : [{
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/instance.js"
		}, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/StatsView.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/bundle/statsgrid/GridModeView.js"
        }, {
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/StatsToolbar.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/bundle/statsgrid/plugin/ManageClassificationPlugin.js"
		},{
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/bundle/statsgrid/plugin/ManageStatsPlugin.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/bundle/statsgrid/event/SotkadataChangedEvent.js"
		},{
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/bundle/statsgrid/event/ModeChangedEvent.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/bundle/statsgrid/event/ClearHilightsEvent.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/bundle/statsgrid/event/SelectHilightsModeEvent.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/bundle/statsgrid/request/StatsGridRequest.js"
		}, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/bundle/statsgrid/request/StatsGridRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/bundle/statsgrid/request/TooltipContentRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/bundle/statsgrid/request/TooltipContentRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/statistics/bundle/statsgrid/service/StatisticsService.js"
        }, {
			"type" : "text/css",
			"src" : "../../../../resources/statistics/bundle/statsgrid/css/style.css"
		},{
			"type" : "text/css",
			"src" : "../../../../resources/statistics/bundle/statsgrid/css/classifyplugin.css"
		},{
            "type" : "text/css",
            "src" : "../../../../libraries/slickgrid/css/slick.grid.css"
        },{
			"type" : "text/css",
			"src" : "../../../../libraries/slickgrid/css/municipality.css"
		}, {
            "type" : "text/css",
            "src" : "../../../../libraries/slickgrid/css/slick-default-theme.css"
        },{
            "src" : "../../../../libraries/jquery/jquery.event.drag-2.0.min.js",
            "type" : "text/javascript"
        },{
            "src" : "../../../../libraries/slickgrid/slick.core.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.formatters.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.editors.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.cellrangedecorator.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.cellrangeselector.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.cellselectionmodel.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.headermenu2.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.headermenu2.css",
            "type" : "text/css"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.headerbuttons.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.headerbuttons.css",
            "type" : "text/css"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.rowselectionmodel.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.checkboxselectcolumn2.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.grid.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.groupitemmetadataprovider.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.dataview.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/controls/slick.pager.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/controls/slick.columnpicker.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/chosen/chosen.jquery.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/chosen/chosen.css",
            "type" : "text/css"
        }],
		"locales" : [{
			"lang" : "fi",
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/locale/fi.js"
		}, {
			"lang" : "sv",
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/locale/sv.js"
		}, {
			"lang" : "en",
			"type" : "text/javascript",
			"src" : "../../../../bundles/statistics/bundle/statsgrid/locale/en.js"
		}]
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "statsgrid",
			"Bundle-Name" : "statsgrid",
			"Bundle-Author" : [{
				"Name" : "jjk",
				"Organisatpation" : "nls.fi",
				"Temporal" : {
					"Start" : "2013",
					"End" : "2013"
				},
				"Copyleft" : {
					"License" : {
						"License-Name" : "EUPL",
						"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
					}
				}
			}],
			"Bundle-Verspation" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}

		}
	},

	/**
	 * @static
	 * @property dependencies
	 */
	"dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("statsgrid", "Oskari.statistics.bundle.statsgrid.StatsGridBundle");
