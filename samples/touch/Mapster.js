/**
 * Wraps a Google Map in an Ext.Component.
 * 
 * http://code.google.com/apis/maps/documentation/v3/introduction.html
 * 
 * To use this component you must include an additional JavaScript file from
 * Google:
 * 
 * <script type="text/javascript"
 * src="http://maps.google.com/maps/api/js?sensor=true">&lt/script>
 * 
 * {@img ../guildes/map/screenshot.png}
 * 
 * var panel = new Ext.Panel({ fullscreen: true, items: [{ xtype: 'map',
 * useCurrentLocation: true }] });
 * 
 */
Ext
		.define(
				'Ext.Mapster',
				{
					extend : 'Ext.Component',
					xtype : 'mapster',
					require : [ 'Ext.util.GeoLocation' ],

					config : {
						/**
						 * @event maprender
						 * @param {Ext.Map}
						 *            this
						 * @param {google.maps.Map}
						 *            map The rendered google.map.Map instance
						 */

						/**
						 * @event centerchange
						 * @param {Ext.Map}
						 *            this
						 * @param {google.maps.Map}
						 *            map The rendered google.map.Map instance
						 * @param {google.maps.LatLng}
						 *            center The current LatLng center of the
						 *            map
						 */

						/**
						 * @event typechange
						 * @param {Ext.Map}
						 *            this
						 * @param {google.maps.Map}
						 *            map The rendered google.map.Map instance
						 * @param {Number}
						 *            mapType The current display type of the
						 *            map
						 */

						/**
						 * @event zoomchange
						 * @param {Ext.Map}
						 *            this
						 * @param {google.maps.Map}
						 *            map The rendered google.map.Map instance
						 * @param {Number}
						 *            zoomLevel The current zoom level of the
						 *            map
						 */

						/**
						 * @cfg {String} baseCls The base CSS class to apply to
						 *      the Maps's element
						 * @accessor
						 */
						baseCls : Ext.baseCSSPrefix + 'map',

						/**
						 * @cfg {Boolean} useCurrentLocation Pass in true to
						 *      center the map based on the geolocation
						 *      coordinates.
						 * @accessor
						 */
						useCurrentLocation : false,

						/**
						 * @cfg {google.maps.Map} map The wrapped map.
						 * @accessor
						 */
						map : null,

						/**
						 * @cfg {Ext.util.GeoLocation} geo
						 * @accessor
						 */
						geo : null,

						/**
						 * @cfg {Boolean} maskMap Masks the map (Defaults to
						 *      false)
						 * @accessor
						 */
						maskMap : false,

						/**
						 * @cfg {String} maskMapCls CSS class to add to the map
						 *      when maskMap is set to true.
						 * @accessor
						 */
						maskMapCls : Ext.baseCSSPrefix + 'mask-map',

						/**
						 * @cfg {Object} mapOptions MapOptions as specified by
						 *      the Google Documentation:
						 *      http://code.google.com/apis/maps/documentation/v3/reference.html
						 * @accessor
						 */
						mapOptions : {}
					},

					constructor : function() {
						this.callParent(arguments);
						this.element.setVisibilityMode(Ext.Element.OFFSETS);

						if (!(window.OpenLayers)) {
							this.setHtml('OpenLayers Maps API is required');
						} else if (this.useCurrentLocation) {
							this.geo = this.geo
									|| Ext.create('Ext.util.GeoLocation', {
										autoLoad : false
									});
							this.geo.on( {
								locationupdate : this.onGeoUpdate,
								locationerror : this.onGeoError,
								scope : this
							});
						}

						if (this.geo) {
							this.on( {
								painted : this.onUpdate,
								scope : this,
								single : true
							});
							this.geo.updateLocation();
						}

						if (this.getMaskMap()) {
							this.element.mask(null, this.getMaskMapCls());
						}

					},

					// @private
					renderMap : function() {
						var me = this, renderElement = me.renderElement, mapOptions = me
								.getMapOptions(), event;

						Ext.merge(mapOptions, {});

						if (me.maskMap && !me.mask) {
							renderElement.mask(null, this.maskMapCls);
							me.mask = true;
						}

						if (renderElement && renderElement.dom
								&& renderElement.dom.firstChild) {
							Ext.fly(renderElement.dom.firstChild).remove();
						}

						me.map.render(renderElement.dom);

						me.fireEvent('maprender', me, me.map);

					},

					// @private
					onGeoUpdate : function(coords) {
						var center;
						if (coords) {
							// center = this.getMapOptions().center = new
							// google.maps.LatLng(coords.latitude,
							// coords.longitude);
						}

						this.update(center);
					},

					// @private
					onGeoError : Ext.emptyFn,

					// @private
					onUpdate : function(map, e, options) {
						this.update((options || {}).data);
					},

					/**
					 * Moves the map center to the designated coordinates hash
					 * of the form: { latitude: 37.381592, longitude:
					 * -122.135672 }
					 * 
					 * or a google.maps.LatLng object representing to the target
					 * location.
					 * 
					 * @param {Object/google.maps.LatLng}
					 *            coordinates Object representing the desired
					 *            Latitude and longitude upon which to center
					 *            the map.
					 */
					update : function(coordinates) {
						var me = this;

						if (!me.getHidden()) {
							if (!me.map) {
								me.renderMap();
							}
							/*
							 * if (me.map && coordinates instanceof gm.LatLng) {
							 * me.map.panTo(coordinates); }
							 */
						} else {
							// me.on('painted', me.onUpdate, me, {single:
					// true});
				}
			},

			// @private
					onDestroy : function() {
						Ext.destroy(this.geo);
						if (this.maskMap && this.mask) {
							this.el.unmask();
						}
						/*
						 * if (this.map && (window.google || {}).maps) {
						 * google.maps.event.clearInstanceListeners(this.map); }
						 */
						this.callParent();
					}
				},
				function() {
					/**
					 * @deprecated 2.0.0 Returns the state of the Map. This has
					 *             been deprecated. Please use
					 *             {@link #getMapOptions} instead/
					 * @return {Object} mapOptions
					 */
				});
