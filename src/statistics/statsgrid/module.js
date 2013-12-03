define([
	"src/oskari/oskari",
	"jquery",
	"bundles/statistics/bundle/statsgrid/instance",
	"bundles/statistics/bundle/statsgrid/StatsView",
	"bundles/statistics/bundle/statsgrid/GridModeView",
	"bundles/statistics/bundle/statsgrid/StatsToolbar",
	"bundles/statistics/bundle/statsgrid/UserIndicatorsTab",
	"./plugin/ManageClassificationPlugin",
	"bundles/statistics/bundle/statsgrid/plugin/ManageStatsPlugin",
	"bundles/statistics/bundle/statsgrid/event/SotkadataChangedEvent",
	"bundles/statistics/bundle/statsgrid/event/ModeChangedEvent",
	"bundles/statistics/bundle/statsgrid/event/ClearHilightsEvent",
	"bundles/statistics/bundle/statsgrid/event/SelectHilightsModeEvent",
	"bundles/statistics/bundle/statsgrid/request/StatsGridRequest",
	"bundles/statistics/bundle/statsgrid/request/StatsGridRequestHandler",
	"bundles/statistics/bundle/statsgrid/request/TooltipContentRequest",
	"bundles/statistics/bundle/statsgrid/request/TooltipContentRequestHandler",
	"bundles/statistics/bundle/statsgrid/request/IndicatorsRequest",
	"bundles/statistics/bundle/statsgrid/request/IndicatorsRequestHandler",
	"bundles/statistics/bundle/statsgrid/service/StatisticsService",
	"bundles/statistics/bundle/statsgrid/service/UserIndicatorsService",
	"css!resources/statistics/bundle/statsgrid/css/style.css",
	"css!resources/statistics/bundle/statsgrid/css/classifyplugin.css",
	"css!libraries/slickgrid/css/slick.grid.css",
	"css!libraries/slickgrid/css/municipality.css",
	"css!libraries/slickgrid/css/slick-default-theme.css",
	"libraries/jquery/jquery.event.drag-2.0.min",
	"libraries/slickgrid/slick.core",
	"libraries/slickgrid/slick.formatters",
	"libraries/slickgrid/slick.editors",
	"libraries/slickgrid/plugins/slick.cellrangedecorator",
	"libraries/slickgrid/plugins/slick.cellrangeselector",
	"libraries/slickgrid/plugins/slick.cellselectionmodel",
	"libraries/slickgrid/plugins/slick.headermenu2",
	"css!libraries/slickgrid/plugins/slick.headermenu2.css",
	"libraries/slickgrid/plugins/slick.rowselectionmodel",
	"libraries/slickgrid/plugins/slick.checkboxselectcolumn2",
	"libraries/slickgrid/slick.grid",
	"libraries/slickgrid/slick.groupitemmetadataprovider",
	"libraries/slickgrid/slick.dataview",
	"libraries/slickgrid/controls/slick.pager",
	"libraries/slickgrid/controls/slick.columnpicker",
	"libraries/chosen/chosen.jquery",
	"css!libraries/chosen/chosen.css",
	"bundles/statistics/bundle/statsgrid//locale/fi",
	"bundles/statistics/bundle/statsgrid//locale/sv",
	"bundles/statistics/bundle/statsgrid//locale/en"
], function(Oskari, jQuery) {
	return Oskari.bundleCls("statsgrid").category({
		create: function() {
			return Oskari.clazz.create("Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance",
				'statsgrid');
		},
		update: function(manager, bundle, bi, info) {

		}
	})
});