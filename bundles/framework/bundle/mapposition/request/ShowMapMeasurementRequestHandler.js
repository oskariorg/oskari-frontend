Oskari.clazz.define('Oskari.mapframework.mapposition.request.ShowMapMeasurementRequestHandler', 
    function(sandbox, callBack) {

    this.sandbox = sandbox;
    this._callBack = callBack;
}, {
    handleRequest : function(core, request) {
    	// ShowMapMeasurementRequest
    	var value = request.getValue(); 
        this.sandbox.printDebug("[ShowMapMeasurementRequestHandler] got measurement: " + value);
        if(this._callBack) {
        	this._callBack(value);
        }
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
