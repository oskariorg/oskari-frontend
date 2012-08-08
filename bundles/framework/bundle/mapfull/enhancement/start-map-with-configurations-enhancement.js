/**
 * This enchancement adds all preselected layers on map and moves to start
 * position
 * 
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.enhancement.mapfull.StartMapWithConfigurationsEnhancement',
				function(preSelectedJson, mapConfigurations) {

					this._preSelectedJson = preSelectedJson;

					this._mapConfigurations = mapConfigurations;
				},
				{

					enhance : function(core) {
						var coord = core.getRequestParameter('coord');
						var zoomLevel = core.getRequestParameter('zoomLevel');
						var mapLayers = core.getRequestParameter('mapLayers');

						/*
						 * Check if map is started with link. In this case, we
						 * will honor map layers in request and forget
						 * preselected.
						 */
						if (coord != null && zoomLevel != null && mapLayers != null) {
							core.printDebug("Ahem, we found 'mapLayers, coord and zoomLevel' parameters from url. This is probably a link startup. Skipping preselection.");
							return;
						}

						/* ok, we can proceed */
						core.printDebug("Enhancing application by setting position.");
						
						var x = this._mapConfigurations.east;
						var y = this._mapConfigurations.north;
						var zoom = this._mapConfigurations.scale;
						var marker = false;

						core.getMap().moveTo(x, y, zoom);

						core.printDebug("Enhancing application by preselecting layers.");
						if(!this._preSelectedJson || !this._preSelectedJson.preSelectedLayers) {
							return;
						}
						for ( var i = 0; i < this._preSelectedJson.preSelectedLayers.length; i++) {
							var item = this._preSelectedJson.preSelectedLayers[i];
							core.processRequest(
								core.getRequestBuilder('AddMapLayerRequest')(item.id, false));
						}

					}
				},
				{
					'protocol' : ['Oskari.mapframework.enhancement.Enhancement']
				});

/* Inheritance */
