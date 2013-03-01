define([
    "text!_bundle/templates/layerRowTemplate.html"
    ], 
    function(ViewTemplate) {
    return Backbone.View.extend({
        tagName: 'div',
        className: 'layer',

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize : function() {
            this.instance = this.options.instance;
            this.model = this.options.model;
            this.template = _.template(ViewTemplate);
            this.render();
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            this.$el.html(this.template({model:this.model}));
            this._renderLayerTools();

        },

        _renderLayerTools: function() {
            var sandbox = this.instance.sandbox;
            var layer = this.model;
            var tooltips = this.instance.getLocalization('tooltip');
            var tools = this.$el.find('div.layer-tools');
            var icon = this.$el.find('div.layer-icon');
            if(layer.isBaseLayer()) {
                icon.addClass('layer-base');
                icon.attr('title', tooltips['type-base']);
            }
            else if(layer.isLayerOfType('WMS')) {
                if(layer.isGroupLayer()) {
                    icon.addClass('layer-group');
                }
                else {
                    icon.addClass('layer-wms');
                }
                icon.attr('title', tooltips['type-wms']);
            }
            // FIXME: WMTS is an addition done by an outside bundle so this shouldn't be here
            // but since it would require some refactoring to make this general
            // I'll just leave this like it was on old implementation
            else if(layer.isLayerOfType('WMTS')) {
                icon.addClass('layer-wmts');
                icon.attr('title', tooltips['type-wms']);
            }
            else if(layer.isLayerOfType('WFS')) {
                icon.addClass('layer-wfs');
                icon.attr('title', tooltips['type-wfs']);
            }
            else if(layer.isLayerOfType('VECTOR')) {
                icon.addClass('layer-vector');
                icon.attr('title', tooltips['type-wms']);
            }

            if(layer.getMetadataIdentifier()) {
                tools.find('div.layer-info').addClass('icon-info');
                tools.find('div.layer-info').click(function() {
                      var rn = 'catalogue.ShowMetadataRequest';
                      var uuid = layer.getMetadataIdentifier();
                         var additionalUuids = [];
                    var additionalUuidsCheck = {};
                    additionalUuidsCheck[uuid] = true; 
                    var subLayers = layer.getSubLayers(); 
                    if( subLayers && subLayers.length > 0 ) {
                        for( var s = 0 ; s < subLayers.length;s++) {
                            var subUuid = subLayers[s].getMetadataIdentifier();
                            if( subUuid && subUuid != "" && !additionalUuidsCheck[subUuid] ) { 
                                additionalUuidsCheck[subUuid] = true;
                                additionalUuids.push({
                                    uuid: subUuid
                                });
                                 
                            }
                        }
                    }
                                    
                    sandbox.postRequestByName(rn, [
                        { uuid : uuid }, additionalUuids
                    ]);
                });
            }
        }
    });
});
