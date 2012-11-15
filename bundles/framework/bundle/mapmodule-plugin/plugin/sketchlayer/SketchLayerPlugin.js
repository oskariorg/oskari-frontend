/**
 *
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.SketchLayerPlugin', function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
}, {
    getName : function() {
        return this.pluginName;
    },
    __name : "SketchLayerPlugin",

    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    getMapModule : function() {
        return this.mapModule;
    },
    register : function() {
    },
    unregister : function() {
        // alert(this.getName() + '.unregister()');
    },
    init : function(sandbox) {
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        this.createMapSketchLayer();
        this.createMapVectorLayer();

        var defStyle = {
            graphicOpacity : "1",
            fillOpacity : "0.95",
            strokeColor : "#000000",
            fillColor : "#ff00ff",
            strokeOpacity : "1",
            strokeWidth : 1,
            pointRadius : 1,
            cursor : "pointer"
        };
        var sty = OpenLayers.Util.applyDefaults(defStyle, OpenLayers.Feature.Vector.style["default"]);
        this._drawArea = new OpenLayers.Control.DrawFeature(this._polygonLayer, OpenLayers.Handler.RegularPolygon, {
            handlerOptions : {
                sides : 4,
                irregular : true,
                style : sty
            }
        });
        this._drawArea.id = "drawarea";
        // this._map.addControl(this._drawArea);
        this.getMapModule().addMapControl('drawarea', this._drawArea);

        this._vectorSelector = new OpenLayers.Control.SelectFeature(this._vectorLayer, {
            clickout : false,
            toggle : false,
            multiple : false,
            hover : false,
            box : false
        });
        this._vectorSelector.id = "vectorselector";
        this.getMapModule().addMapControl('vectorselector', this._vectorSelector);
        // this._map.addControl(this._vectorSelector);

        sandbox.register(this);

        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
    },
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /* @method start
     * called from sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * called from sandbox
     *
     */
    stop : function(sandbox) {
    },
    // TODO: move event handling here
    eventHandlers : {
        'AfterDrawPolygonEvent' : function(event) {
            this.afterDrawPolygonEvent(event);
        },
        'AfterDrawSelectedPolygonEvent' : function(event) {
            this.afterDrawSelectedPolygonEvent(event);
        },
        'AfterErasePolygonEvent' : function(event) {
            this.afterErasePolygonEvent(event);
        },
        'AfterSelectPolygonEvent' : function(event) {
            this.afterSelectPolygonEvent(event);
        },
        'AfterRemovePolygonEvent' : function(event) {
            this.afterRemovePolygonEvent(event);
        },
        /**
         * @method Toolbar.ToolSelectedEvent
         * @param {Oskari.mapframework.bundle.toolbar.event.ToolSelectedEvent} event
         */
        'Toolbar.ToolSelectedEvent' : function(event) {
            // this._WMSQueryTool = false;
            
            // TODO: get rid of magic strings
            if(event.getToolName() == 'map_control_draw_area_tool') {
                this._drawArea.activate();
            } else {
                this._drawArea.deactivate();
                if(event.getToolName() == 'map_control_select_tool') {
                    /* clear selected area */
                    this.clearBbox();
                }
            }      
        }
    },

    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     *
     */
    createMapVectorLayer : function() {
        //						var sandbox = this._sandbox;
        var moduleName = this.getName();
        var me = this;
        /* Create handler for set selected vector */
        var areaSelectorHandler = new function(moduleName) {
        this.handle = function(evt) {
        me.setSelectMetadata(evt.feature.id,
        evt.feature.attributes.groupId);
        };
        }(moduleName);

        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0.2;
        layer_style.graphicOpacity = 1;
        layer_style.strokeColor = "blue";
        layer_style.fillColor = "blue";

        this._vectorLayer = new OpenLayers.Layer.Vector("Vector Layer", {
            style : layer_style
        });

        this._vectorLayer.events.on({
            'featureselected' : areaSelectorHandler.handle
        });

        this._map.addLayer(this._vectorLayer);

    },
    createMapSketchLayer : function() {
        //                        var sandbox = this._sandbox;
        var moduleName = this.getName();
        //                        var mapModule = this.getMapModule();
        var me = this;

        var pollayer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        pollayer_style.fillOpacity = 0.95;
        pollayer_style.graphicOpacity = 1;

        pollayer_style.strokeColor = "#000000";
        pollayer_style.fillColor = "#ff00ff";
        this._polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer", {
            style : pollayer_style
        });

        /* Create handler for clearing bbox */
        var clearBboxHandler = new function(moduleName) {
        this.handle = function(evt) {
        me.clearBbox();
        };
        }(moduleName);

        /* Create handler for setting bbox */

        var setBboxHandler = new function(moduleName) {
        this.handle = function(evt) {
        me.setBbox();
        };
        }(moduleName);

        this._polygonLayer.events.on({
            'sketchstarted' : clearBboxHandler.handle,
            'featureadded' : setBboxHandler.handle
        });

        this.getMapModule()._map.addLayer(this._polygonLayer);
    },
    /***********************************************************
     * Clear drawed bboxes
     */
    clearBbox : function() {
        var layer = this._map.getLayersByName("Polygon Layer");
        if(layer[0] != null) {
            layer[0].destroyFeatures();
        }
    },
    /***********************************************************
     * Set bbox
     */
    setBbox : function() {
        var layer = this._map.getLayersByName("Polygon Layer");
        var polygon = Oskari.clazz.create('Oskari.mapframework.domain.Polygon');

        if(layer[0] != undefined) {

            polygon.setTop(layer[0].getDataExtent().top);
            polygon.setLeft(layer[0].getDataExtent().left);
            polygon.setBottom(layer[0].getDataExtent().bottom);
            polygon.setRight(layer[0].getDataExtent().right);
            polygon.setDescription('Valittu alue');
            polygon.setColor("#ff00ff");
            polygon.setId(-1);
        } else {
            polygon.setId(-2);
        }
        this._sandbox.request(this, this._sandbox.getRequestBuilder('UpdateHiddenValueRequest')(polygon));
    },
    /***********************************************************
     * Create handler for areaselector bbox
     *
     * @param {Object}
     *            id
     * @param {Object}
     *            groupId
     */
    setSelectMetadata : function(id, groupId) {
        this._sandbox.request(this, this._sandbox.getRequestBuilder('SelectPolygonRequest')(id, groupId));
    },
    /***********************************************************
     * Handle AfterDrawPolygonEvent
     *
     * @param {Object}
     *            event
     */
    afterDrawPolygonEvent : function(event) {
        var pointList = [];

        var polTop = '' + event.getPolygon().getTop() + '';
        polTop = polTop.replace(".", "-");

        var polLeft = '' + event.getPolygon().getLeft() + '';
        polLeft = polLeft.replace(".", "-");

        var polBottom = '' + event.getPolygon().getBottom() + '';
        polBottom = polBottom.replace(".", "-");

        var polRight = '' + event.getPolygon().getRight() + '';
        polRight = polRight.replace(".", "-");

        var bounds = new OpenLayers.Bounds(event.getPolygon().getLeft(), event.getPolygon().getBottom(), event.getPolygon().getRight(), event.getPolygon().getTop());

        var srcProj = new OpenLayers.Projection("EPSG:4326");
        var mapProj = new OpenLayers.Projection("EPSG:3067");
        var boundsMap = bounds.transform(srcProj, mapProj);
        //						var polygon = boundsMap.toGeometry();

        var newPoint = new OpenLayers.Geometry.Point(polLeft, polTop);
        pointList.push(newPoint);
        newPoint = new OpenLayers.Geometry.Point(polLeft, polBottom);
        pointList.push(newPoint);
        newPoint = new OpenLayers.Geometry.Point(polRight, polBottom);
        pointList.push(newPoint);
        newPoint = new OpenLayers.Geometry.Point(polRight, polTop);
        pointList.push(newPoint);

        pointList.push(pointList[0]);
        //						var linearRing = new OpenLayers.Geometry.LinearRing(
        //								pointList);

        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0.2;
        layer_style.graphicOpacity = 1;

        layer_style.display = event.getPolygon().getDisplay();
        layer_style.strokeColor = event.getPolygon().getColor();
        layer_style.fillColor = event.getPolygon().getColor();

        var polygon = boundsMap.toGeometry();

        var polygonFeature = new OpenLayers.Feature.Vector(polygon, {
            id : event.getPolygon().getId(),
            groupId : polTop + "_" + polLeft + "_" + polBottom + "_" + polRight
        });

        polygonFeature.id = event.getPolygon().getId();
        polygonFeature.style = layer_style;

        this._vectorLayer.addFeatures(polygonFeature);
        this._vectorSelector.activate();

        if(event.getPolygon().getZoomToExtent()) {
            this._map.zoomToExtent(boundsMap, true);
        }
    },
    /***********************************************************
     * Handle AfterDrawSelectedPolygonEvent
     *
     * @param {Object}
     *            event
     */
    afterDrawSelectedPolygonEvent : function(event) {
        //						var pointList = [];

        var polTop = '' + event.getPolygon().getTop() + '';
        polTop = polTop.replace(".", "-");

        var polLeft = '' + event.getPolygon().getLeft() + '';
        polLeft = polLeft.replace(".", "-");

        var polBottom = '' + event.getPolygon().getBottom() + '';
        polBottom = polBottom.replace(".", "-");

        var polRight = '' + event.getPolygon().getRight() + '';
        polRight = polRight.replace(".", "-");

        var bounds = new OpenLayers.Bounds(event.getPolygon().getLeft(), event.getPolygon().getBottom(), event.getPolygon().getRight(), event.getPolygon().getTop());

        var srcProj = new OpenLayers.Projection("EPSG:4326");
        var mapProj = new OpenLayers.Projection("EPSG:3067");

        var boundsMap = bounds.transform(srcProj, mapProj);

        //						var polygon = boundsMap.toGeometry();

        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0.95;
        layer_style.graphicOpacity = 1;

        layer_style.display = event.getPolygon().getDisplay();
        layer_style.strokeColor = event.getPolygon().getColor();
        layer_style.fillColor = event.getPolygon().getColor();

        var polygon = boundsMap.toGeometry();

        var polygonFeature = new OpenLayers.Feature.Vector(polygon, {
            id : event.getPolygon().getId(),
            groupId : polTop + "_" + polLeft + "_" + polBottom + "_" + polRight
        });

        polygonFeature.id = event.getPolygon().getId();
        polygonFeature.style = layer_style;
        this._polygonLayer.addFeatures(polygonFeature);
    },
    /***********************************************************
     * Handle AfterErasePolygonEvent
     *
     * @param {Object}
     *            event
     */
    afterErasePolygonEvent : function(event) {
        var tmpLayer = this._vectorLayer.getFeatureById(event.getId());
        this._vectorLayer.removeFeatures(tmpLayer);
        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0.3;
        layer_style.graphicOpacity = 1;
        layer_style.strokeColor = "blue";
        layer_style.fillColor = "blue";

        if(tmpLayer.style.display != 'undefined' && tmpLayer.style.display != "none") {
            layer_style.display = "none";
        } else {
            layer_style.display = "";
        }
        tmpLayer.style = layer_style;
        this._vectorLayer.addFeatures(tmpLayer);
        this._vectorLayer.redraw();
    },
    /***********************************************************
     * Handle AfterSelectPolygonEvent
     *
     * @param {Object}
     *            event
     */
    afterSelectPolygonEvent : function(event) {
        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.strokeColor = "blue";
        layer_style.fillColor = "blue";
        layer_style.fillOpacity = 0.3;
        layer_style.graphicOpacity = 1;

        var layer_style_blue = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style_blue.strokeColor = "#CC2388";
        layer_style_blue.fillColor = "#CC2388";
        layer_style_blue.fillOpacity = 0.2;
        layer_style_blue.graphicOpacity = 1;

        this._vectorLayer.redraw();
        var tmpLayer = this._vectorLayer.getFeatureById(event.getId());

        this._vectorLayer.drawFeature(tmpLayer, layer_style_blue);
    },
    /***********************************************************
     * Handle AfterRemovePolygonEvent
     *
     * @param {Object}
     *            event
     */
    afterRemovePolygonEvent : function(event) {
        var showPol = event.getShowPol();

        if(showPol) {
            var tmpLayer = this._vectorLayer.getFeatureById(event.getId());
            var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
            layer_style.strokeColor = "blue";
            layer_style.fillColor = "blue";
            layer_style.fillOpacity = 0.2;
            layer_style.graphicOpacity = 1;
            this._vectorLayer.redraw();
            this._vectorLayer.drawFeature(tmpLayer, layer_style);
        } else {
            var tmpLayer = this._vectorLayer.getFeatureById(event.getId());
            var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
            this._vectorLayer.removeFeatures(tmpLayer);
            layer_style.fillOpacity = 0.2;
            layer_style.graphicOpacity = 1;
            layer_style.strokeColor = "blue";
            layer_style.fillColor = "blue";
            layer_style.display = "none";
            tmpLayer.style = layer_style;
            this._vectorLayer.addFeatures(tmpLayer);
            this._vectorLayer.redraw();
        }
    }
}, {
    "protocol" : ["Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
