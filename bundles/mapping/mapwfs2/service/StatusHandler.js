/**
 * @class Oskari.mapframework.bundle.mapwfs2.service.StatusHandler
 *
 * Keeps track of WFS process statuses
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapwfs2.service.StatusHandler',
    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.Sandbox} sandbox
     *
     */
    function (sandbox) {
    	this.sandbox = sandbox;
    	var status = {};
    	this.status = status;
        // TODO: For debugging, remove when stable
    	Oskari.___getWFSStatus = function() {
    		console.log(status);
    	};
    }, {
    	__log : function() {
            // TODO: For debugging, remove when stable
            if(Oskari.__debugWFS === true) {
                console.log.apply(console, arguments);
            }
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
        clearStatus : function(layerId) {
            delete this.status['' + layerId];

            var sb = this.sandbox;
            var loadEvent = sb.getEventBuilder('WFSStatusChangedEvent')(layerId);
            loadEvent.setRequestType(loadEvent.type.image);
            loadEvent.setStatus(loadEvent.status.complete);
            sb.notifyAll(loadEvent);
        },
    	handleChannelRequest : function(layerId, type, reqId) {
    		var status = this.getLayerStatus(layerId);
            this.__log('Request data for layer: ' + layerId + ' (req:' + reqId + ')');
    		status.inProgress.push({
    			type: type,
    			reqId : reqId
    		});
            var sb = this.sandbox;
            var loadEvent = sb.getEventBuilder('WFSStatusChangedEvent')(layerId);
            loadEvent.setStatus(loadEvent.status.loading);
            loadEvent.setRequestType(loadEvent.type.image);
            sb.notifyAll(loadEvent);
    	},
    	__handleCompleted : function(data) {

            var status = this.getLayerStatus(data.layerId);
            status.inProgress = _.filter(status.inProgress, function(progress) {
            	// TODO: add type check here, so later req of same type removes all previous "pending" requests
			  	return progress.reqId !== data.reqId;
			});
            var sb = this.sandbox;
            var loadEvent = sb.getEventBuilder('WFSStatusChangedEvent')(data.layerId);
            loadEvent.setRequestType(loadEvent.type.image);
			if(data.success) {
            	this.__log('Back to normal for layer:', data.layerId, status.error);
				status.error = [];
                loadEvent.setStatus(loadEvent.status.complete);
				// No operations for wfs layer in case of true, e.g. manual refresh / feature data refresh
				loadEvent.setNop(data.success_nop);
			}
			else {
				status.error.push('error');
                loadEvent.setStatus(loadEvent.status.error);
			}
            sb.notifyAll(loadEvent);
            this.__log('WFS complete', data);
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
            var status = this.getLayerStatus(error.layerId);
            status.error.push(error.message);

            var sb = this.sandbox;
            var loadEvent = sb.getEventBuilder('WFSStatusChangedEvent')(error.layerId);
            loadEvent.setStatus(loadEvent.status.error);
            loadEvent.setRequestType(loadEvent.type.image);
            sb.notifyAll(loadEvent);
       	}

	});
