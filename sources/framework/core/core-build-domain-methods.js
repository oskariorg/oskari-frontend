/*
 * @to-do
 * 
 * Oskari.clazz.category('Oskari.mapframework.core.Core','build-domain-methods',{
 * 		createMapLayerDomain: function(){
 * 		},
 *      createMapLayers: function() {
 *      }
 * 		...
 * });
 * 
 */

Oskari.clazz.category(
//			
		'Oskari.mapframework.core.Core', 'build-domain-methods',
		//
		{

			/**
			 * Creates map domain objects from given JSON
			 * 
			 * @param {Object}
			 *            allLayers
			 */
			createMapLayerDomain : function(allLayersJson) {
				if(!allLayersJson || !allLayersJson.layers) {
					return;
				}

                var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
			    var allLayers = allLayersJson.layers;
                for(var i = 0; i < allLayers.length; i++) {
					var mapLayer = mapLayerService.createMapLayer(allLayers[i]);
                    mapLayerService.addLayer(mapLayer, true);
				}
		    },

			/**
			 * Creates a new map domain object
			 */
			createMapDomain : function() {
			    alert('deprecated: core.createMapDomain()');
				this._map = Oskari.clazz
						.create('Oskari.mapframework.domain.Map');
				
				return this._map;
			}
		});
