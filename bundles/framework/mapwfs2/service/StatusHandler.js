/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.ErrorHandler
 *
 * Handles Connection's IO
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.service.StatusHandler',
    /**
     * @static @method create called automatically on construction
     *
     * @param {Object} config
     * @param {Object} plugin
     *
     */
    function (sandbox) {
    	this.sandbox = sandbox;
    	var status = {};
    	this.status = status;
    }, {
    	__log : function() {
            //console.log.apply(console, arguments);
    	},
    	getMapLayer : function(layerId) {
            var service = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            return service.findMapLayer(layerId);
    	},
    	getLayerStatus : function(layerId) {
    		layerId = '' + layerId;
    		if(!this.status[layerId]) {
    			this.status[layerId] = {
    				inProgress : [],
    				error : []
    			};
    		}
    		return this.status[layerId];
    	},
    	handleChannelRequest : function(layerId, type, reqId) {
    		var status = this.getLayerStatus(layerId);
            this.__log('Request data for layer: ' + layerId + ' (req:' + reqId + ')');
    		status.inProgress.push({
    			type: type,
    			reqId : reqId
    		});
    	},
    	__handleCompleted : function(data) {

            var status = this.getLayerStatus(data.layerId);
            status.inProgress = _.filter(status.inProgress, function(progress) {
			  return progress.reqId !== data.reqId;
			});
			if(data.success) {
            	this.__log('Back to normal for layer:', data.layerId, status.error);
				status.error = [];
			}
			else {
				status.error.push('error');
			}
    	},
    	handleChannelStatus : function(data) {
    		// {"layerId":"5","message":"started","reqId":9}
    		// {"layerId":"15","success":true,"message":"completed","reqId":3}
    		if(data.message === 'started') {
    			this.__log('Processing started for layer ' + data.layerId + ' (req: ' + data.reqId + ')');
    			return;
    		}
    		else if(data.message === 'completed') {
    			if(data.success) {
    				this.__log('Processing finished for layer ' + data.layerId + ' (req: ' + data.reqId + ')');
    			}
    			else {
    				this.__log('Processing error for layer ' + data.layerId + ' (req: ' + data.reqId + ')');
    			}
    			this.__handleCompleted(data);
    		}
    	},
    	handleError : function(error) {
            this.__log('Error on layer ' +  error.layerId + ':' + error.message);
            /*
            var status = this.getLayerStatus(error.layerId);
            status.error.push(error.message);

			var event = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.event.WFSStatusChanged', 'mylayer_1');
			event.setStatus(event.status.loading);
			event.setRequestType(event.type.image);
			*/
       	}

	});
