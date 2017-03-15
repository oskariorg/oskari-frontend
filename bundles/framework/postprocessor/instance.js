/**
 * @class Oskari.mapframework.bundle.postprocessor.PostProcessorBundleInstance
 *
 * Used for highlighting wfs features on pageload etc. Calls other bundles to accomplish stuff
 * after everything has been loaded and started.
 *
 * See Oskari.mapframework.bundle.postprocessor.PostProcessorBundle for bundle definition.
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.postprocessor.PostProcessorBundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'PostProcessor',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        "getName": function () {
            return this.__name;
        },
        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        "start": function () {
            var me = this;
            var conf = this.conf;
            var sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
            var sandbox = Oskari.getSandbox(sandboxName);

            this.sandbox = sandbox;

            sandbox.register(this);
            if (this.state) {
                var hiliteLayerId = this.state.highlightFeatureLayerId;
                this._highlightFeature(hiliteLayerId, this.state.highlightFeatureId);
            }
        },
        /**
         * @method _highlightFeature
         * @private
         * Adds the layer if its not yet selected
         * @param {String} layerId
         * @param {String/String[]} featureId single or array of feature ids to hilight
         */
        _highlightFeature: function (layerId, featureId) {
            if (!featureId || !layerId) {
                return;
            }
            // move map to location
            var points = this.state.featurePoints;
            if (points) {
                this._showPoints(points);
            }
            var sb = this.sandbox;
            // allow the map to settle before asking for highlight. We could also wait after map move events stop coming
            // The whole feature should be rewritten using RPC and pushing the data on the map.
            // Currently it uses Oskari and transport "creatively" and isn't all that stable
            setTimeout(function() {
                // request for highlight image, note that the map must be in correct
                // location BEFORE this or we get a blank image
                var builder = sb.getEventBuilder('WFSFeaturesSelectedEvent');
                var featureIdList = [];
                // check if the param is already an array
                if (Object.prototype.toString.call(featureId) === '[object Array]') {
                    featureIdList = featureId;
                } else {
                    featureIdList.push(featureId);
                }
                // create dummy layer since the real one might not be available and we only need it for id
                var mapLayerService = sb.getService('Oskari.mapframework.service.MapLayerService');
                if (!mapLayerService || featureIdList.length === 0) {
                    // service not found - should never happen
                    // there are no highlighted features, should we tell the user about this?
                    return;
                }
                var dummyLayer = mapLayerService.createLayerTypeInstance('wfslayer');
                if (!dummyLayer) {
                    // layer couldnt be created - wfslayermodelbuilder not registered!
                    return;
                }
                dummyLayer.setId(layerId);
                dummyLayer.setOpacity(100);
                var event = builder(featureIdList, dummyLayer, true);
                sb.notifyAll(event);

            }, 500);
        },
        /**
         * @method _showPoints
         * @private
         * Sends a mapmoverequest to fit the points on the map viewport
         * @param {Object[]} points array of objects containing lon/lat properties
         */
        _showPoints: function (points) {
            var olPoints = {
                _points: [],
                addPoint: function(lon, lat) {
                    this._points.push({lon:parseFloat(lon), lat:parseFloat(lat)});
                },
                getBounds: function() {
                    var top=0,
                        left=0,
                        bottom=0,
                        right=0;

                    // Calculate bbox
                    left = this._points[0].lon;
                    bottom = this._points[0].lat;

                    for(var i=0;i<this._points.length;i++){
                        var point = this._points[i];
                        if(point.lon > right) {
                            right = point.lon;
                        }
                        if(point.lat > top) {
                            top = point.lat;
                        }

                        if(point.lon < left) {
                            left = point.lon;
                        }
                        if(point.lat < bottom) {
                            bottom = point.lat;
                        }
                    }

                    return {
                        left: left,
                        bottom: bottom,
                        right: right,
                        top: top
                    };
                },
                getCentroid: function() {
                    var bbox = this.getBounds();
                    return {
                        x: bbox.left + (bbox.right - bbox.left)/2,
                        y: bbox.bottom + (bbox.top - bbox.bottom)/2
                    };

                }
            },
                count,
                point,
                olPoint;
            for (count = 0; count < points.length; ++count) {
                point = points[count];
                olPoints.addPoint(point.lon, point.lat);
            }
            var bounds = olPoints.getBounds();
            var centroid = olPoints.getCentroid();

            var rb = this.sandbox.getRequestBuilder('MapMoveRequest'),
                req;
            if (rb && count > 0) {
                if (count === 1) {
                    // zoom to level 9 if a single point
                    req = rb(centroid.x, centroid.y, 9);
                    this.sandbox.request(this, req);
                } else {
                    req = rb(centroid.x, centroid.y, bounds);
                    this.sandbox.request(this, req);
                }
            }
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {

            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method MapLayerEvent
             * If start has already campleted hilighting, this won't trigger, if not
             * this calls highlight no the selected target
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             */
            'MapLayerEvent': function (event) {
                // layerId in event is null for initial ajax load
                if ('add' === event.getOperation() && !event.getLayerId()) {
                    this._highlightFeature(this.state.highlightFeatureLayerId, this.state.highlightFeatureId);
                }
            }
        },
        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        "init": function () {
            return null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        "update": function () {

        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        "stop": function () {}
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        "protocol": ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module']
    });