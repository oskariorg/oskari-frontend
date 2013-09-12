define(["oskari","jquery","./event/FinishedDrawingEvent","./event/SaveDrawingEvent","./event/ParcelSelectedEvent","./event/ParcelInfoLayerRegisterEvent","./event/ParcelInfoLayerUnregisterEvent","./plugin/DrawPlugin","./request/SaveDrawingRequest","./request/StopDrawingRequest","./request/CancelDrawingRequest","./request/StartDrawingRequest","./request/SaveDrawingRequestHandler","./request/StopDrawingRequestHandler","./request/CancelDrawingRequestHandler","./request/StartDrawingRequestHandler","./service/ParcelService","./service/ParcelWfst","./service/ParcelPlot","./split/ParcelSplit","./view/MainView","./view/PlaceForm","./handler/ButtonHandler","./handler/ParcelSelectorHandler","./instance","css!_resources_/framework/bundle/parcel/css/style.css","./locale/fi"], function(Oskari,jQuery) {
    return Oskari.bundleCls("parcel").category({create: function () {
		var me = this;
		var inst = Oskari.clazz.create("Oskari.mapframework.bundle.parcel.DrawingToolInstance");
		return inst;

	},update: function (manager, bundle, bi, info) {
        manager.alert("RECEIVED update notification " + info);
	}})
});