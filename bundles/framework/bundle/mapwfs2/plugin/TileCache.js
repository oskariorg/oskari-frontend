Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs2.plugin.TileCache",
function() {
    this.data = {};
    this.ts = {};
},{
    mget: function(layerId, bbox, style) {
        var dataByLayerId = this.data[layerId];
        if(!dataByLayerId) 
            return;
        var dataByBbox = dataByLayerId[bbox];
        if(!dataByBbox)
            return;
        return dataByBbox[style];
    },

    mput: function(layerId, bbox, style, data) {
        var dataByLayerId = this.data[layerId];
        if(!dataByLayerId) { 
            dataByLayerId = {}; 
            this.data[layerId] = dataByLayerId; 
        }
        var dataByBbox = dataByLayerId[bbox];
        if(!dataByBbox) { 
            dataByBbox = {}; 
            dataByLayerId[bbox] = dataByBbox; 
        }
        dataByBbox[style] = data;

        var tsByLayerId = this.ts[layerId];
        if(!tsByLayerId) { 
            tsByLayerId = {}; 
            this.ts[layerId] = tsByLayerId; 
        }
        var tsByBbox = tsByLayerId[bbox];
        if(!tsByBbox) { 
            tsByBbox = {}; 
            tsByLayerId[bbox] = tsByBbox; 
        }
        tsByBbox[style] = new Date().getTime();
    },

    mdel: function(layerId, bbox, style) {
      var dataByLayerId = this.data[layerId];
      if(!dataByLayerId)
          return;
      var dataByBbox = dataByLayerId[bbox];
      if(!dataByBbox)
          return;
      var dataByStyle = dataByBbox[style];
      if(!dataByStyle)
          return;
      dataByStyle = undefined;
      delete dataByBbox[style];
    },

    purgeOffset: function(offset){
        var ref = new Date().getTime() - offset;
        for(var layerId in this.data) {
            for (var bbox in this.data[layerId]) { 
                for (var style in this.data[layerId][bbox]) { 
                    if(this.ts[layerId][bbox][style] < ref) {
                        delete this.data[layerId][bbox][style];
                        delete this.ts[layerId][bbox][style];
                    }
                }
            }
        }
    }
     
});