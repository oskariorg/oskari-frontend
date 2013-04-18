Oskari.clazz.define('Oskari.mapframework.mapmodule-plugin.request.MapMoveRequestHandler', function(sandbox, mapModule) {

  this.sandbox = sandbox;
  this.mapModule = mapModule;
}, {
  handleRequest : function(core, request) {
    
    // alert("Got move request to " + 
    // 	  request.getCenterX() + ", " +
    // 	  request.getCenterY());

    var longitude = request.getCenterX();
    var latitude = request.getCenterY();
    var marker = request.getMarker();
    var zoom = request.getZoom();

    var lonlat = new OpenLayers.LonLat(longitude, latitude);
    this.mapModule.moveMapToLanLot(lonlat, zoom, false);
    // if zoom=0 -> if(zoom) is determined as false...
    if(zoom || zoom === 0) {
      if(zoom.CLASS_NAME === 'OpenLayers.Bounds') {
	this.mapModule._map.zoomToExtent(zoom);
      }
      else {
	this.mapModule._map.zoomTo(zoom);
      }
    }
    this.mapModule._updateDomain();
    if(marker) {
      this.mapModule._drawMarker();
    }

    this.mapModule.notifyMoveEnd();

    this.sandbox.printDebug("[MapMoveRequestHandler] map moved");
  }
}, {
  protocol : ['Oskari.mapframework.core.RequestHandler']
});
