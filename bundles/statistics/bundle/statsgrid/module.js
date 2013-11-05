define([
	"src/oskari/oskari",
	"jquery",
	"./instance",
	"./StatsView",
	"./GridModeView",
	"./StatsToolbar",
	"./plugin/ManageClassificationPlugin",
	"./plugin/ManageStatsPlugin",
	"./event/SotkadataChangedEvent",
	"./event/ModeChangedEvent",
	"./event/ClearHilightsEvent",
	"./event/SelectHilightsModeEvent",
	"./request/StatsGridRequest",
	"./request/StatsGridRequestHandler",
	"./request/TooltipContentRequest",
	"./request/TooltipContentRequestHandler",
	"./request/IndicatorsRequest",
	"./request/IndicatorsRequestHandler",
	"./service/StatisticsService",
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
	"./locale/fi",
	"./locale/sv",
	"./locale/en"
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