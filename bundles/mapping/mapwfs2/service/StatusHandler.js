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
    this._errorLayer = null;
    this._errorLayers = [];
    this.timer;
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
      var me = this;
      var status = this.getLayerStatus(data.layerId);

      this._errorLayers.forEach( function( key ) {
        if( key.errorlayer.layerId === data.layerId && data.success) {
          delete me._errorLayers[key];
        }
      });
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
        if(typeof this.timer === 'undefined'){
          this.timer = setTimeout(function(){
            this.__log('Processing layer ' + data.layerId + ' takes longer than excpected');
          }, 4000);
        }
        return;
      }
      else if(data.message === 'completed') {
        clearTimeout(this.timer);
        if(data.success) {
          this.__log('Processing finished for layer ' + data.layerId + ' (req: ' + data.reqId + ')');
        }
        else {
          this.__log('Processing error for layer ' + data.layerId + ' (req: ' + data.reqId + ')');
        }
        this.__handleCompleted(data);
      }
    },
    handleError : function(error, plugin) {
      this.__log('Error on layer ' +  error.layerId + ':' + error.message);
      var status = this.getLayerStatus(error.layerId);
      status.error.push(error.message);
      var requestBuilder = Oskari.requestBuilder('ShowMessageRequest');
      var layer = this.getMapLayer(error.layerId);

      if( this._errorLayer === null ) {
        this._errorLayer = error;
      } else {
        for(var i = 0; i < this._errorLayers.length; i++) {
          //same layer don't do anythin
          if( this._errorLayers[i].errorlayer.layerId === error.layerId) {
            return;
          }
        }
      }
      if( error.type === 'normal' && !error.success) {
        if(requestBuilder){
          var request = requestBuilder(layer._name+": could not load layer", 'error');
          Oskari.getSandbox().request('system-message', request);
        } else {
          Oskari.log(this.getName(), "no system-message started");
        }
        this._errorLayer = error;
        this._errorLayers.push({errorlayer:this._errorLayer});
      }
      if( error.level === 'warning' ) {
        if(requestBuilder){
          var request = requestBuilder(layer._name+" "+error.message, 'warning');
          Oskari.getSandbox().request('system-message', request);
        } else {
          Oskari.log(this.getName(), "no system-message started");
        }
        this._errorLayer = error;
        this._errorLayers.push({errorlayer:this._errorLayer});
      }
      if(error.key === 'layer_scale_out_of_range'){
        this.updateScale(layer, error.minscale, error.maxscale, plugin);
      }

      var sb = this.sandbox;
      var loadEvent = sb.getEventBuilder('WFSStatusChangedEvent')(error.layerId);
      loadEvent.setStatus(loadEvent.status.error);
      loadEvent.setRequestType(loadEvent.type.image);
      sb.notifyAll(loadEvent);
    },
    updateScale: function(layer, minscale, maxscale, plugin){
      var me = this;
      layer.setMinScale(minscale);
      layer.setMaxScale(maxscale);
      var olLayer = plugin.getOLMapLayers(layer)
      olLayer[0].minScale = minscale;
      olLayer[0].maxScale = maxscale;

      this._dialog = Oskari.clazz.create(
        'Oskari.userinterface.component.Popup'
      );
      var btn = this._dialog.createCloseButton('OK');

      btn.setHandler(function() {
          me._dialog.close();
      });
      this._dialog.show("Scale updated", "Layer not available on current zoom", [btn]);
    }

  });
