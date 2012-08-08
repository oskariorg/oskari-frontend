Oskari.clazz
		.define(
				'Oskari.mapframework.service.UsageSnifferService',
				function UsageSnifferService(sendInterval, snifferEndpoint) {

					/** how often data is sent */
					this._sendInterval = sendInterval;

					/** where to send data */
					this._snifferEndpoint = snifferEndpoint;

					/** array of current map layer movement urls */
					this._currentStatistics = [];

				},
				{
					__qname: "Oskari.mapframework.service.UsageSnifferService",
					getQName: function() {
						return this.__qname;
					},

					__name : "UsageSnifferService",
					getName : function() {
						return this.__name;
					},

					/** Starts sniffing */
					startSniffing : function() {
						/*
						 * This is not a good way to find service, but
						 * setInterval reguires a string and not a actual
						 * object... :(
						 */
						var me = this;
						setInterval(function() {
							me.sendData();
						}, this._sendInterval * 1000);

						/* clear stats that have been gathered so far */
						delete this._currentStatistics;
						this._currentStatistics = new Array();
					},

					/** Gathers data and sends it to server */
					sendData : function() {
						var stats = this._currentStatistics; 
						// FIXME: why on earth would we want to get reference to self this way?
						//Oskari.$().mapframework.runtime.findComponent("UsageSnifferService")._currentStatistics;
						for ( var i = 0; i < stats.length; i++) {
							jQuery.get(stats[i], function(data, textStatus,
									XMLHttpRequest) {
								/* no need to do anything */
							});
						}
						/* clear stats */
						// delete this._currentStatistics;
						this._currentStatistics = []; // new Array();
					},

					/**
					 * Registers map movement for given layers and position
					 * 
					 * @param {Object}
					 *            visibleLayers
					 * @param {Object}
					 *            lon
					 * @param {Object}
					 *            lat
					 * @param {Object}
					 *            zoom
					 * @param {mapId}
					 *            mapId
					 */
					registerMapMovement : function(visibleLayers, lon, lat,
							zoom, bbox, mapId) {

						for ( var i = 0; i < visibleLayers.length; i++) {
							var layer = visibleLayers[i];
							var finalUrl = layer.getId();

							/* construct final */
							finalUrl += "?lon=" + lon + "&lat=" + lat
									+ "&zoom=" + zoom + "&bbox=" + bbox;

							/* Add mapId if not null */
							if (mapId != null && mapId != "") {
								finalUrl += "&mapId=" + mapId;
							}

							this._currentStatistics.push(this._snifferEndpoint
									+ finalUrl);
						}
					}
				},
				{
					'protocol' : ['Oskari.mapframework.service.Service']
				});

/* Inheritance */
