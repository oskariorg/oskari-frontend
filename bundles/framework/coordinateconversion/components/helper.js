Oskari.clazz.define('Oskari.framework.bundle.coordinateconversion.helper', function(instance, locale) {
    this.loc = locale;
    this.instance = instance;
    this.sb = instance.sandbox;
    this.sb.register(this);
    for (var p in this.eventHandlers) {
    this.sb.registerForEventByName(this, p);
    this.clickCoordinates = null;
    this.moveReq = this.sb.getRequestBuilder('MapMoveRequest');
}
}, {
    getName: function() {
        return 'Oskari.framework.bundle.coordinateconversion.helper';
    },
    init : function() {},
    /****** PUBLIC METHODS ******/
    /**
     * @method  @public getPanelContent get content panel
     */
    eventHandlers: {
        'MapClickedEvent': function (event) {
            this.clickCoordinates = event._lonlat;        
        }
    },
    getCoordinatesFromMap: function() {
        return this.clickCoordinates;
    },
    moveToCoords: function (coords) {
    var reqBuilder = this.sb.getRequestBuilder('MapModulePlugin.AddMarkerRequest');
        if (reqBuilder) {
                var data = {
                    x: Number(coords.lon),
                    y: Number(coords.lat),
                    iconUrl: '/Oskari/resources/icons/marker-pin2.png'
                };
            var request = reqBuilder(data);
            this.sb.request('MainMapModule', request);
        }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
    	var handler = this.eventHandlers[event.getName()];

        if(!handler)
        	return;

        return handler.apply(this, [event]);
    }

});