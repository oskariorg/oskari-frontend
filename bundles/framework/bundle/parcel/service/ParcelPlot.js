/**
 * @class Oskari.mapframework.bundle.parcel.service.ParcelPlot
 *
 * Plot extra graphics for parcel map (area, Id, new and old boundary monuments).
 * Prepares extra OL-layers data into geojson object for printout (_map.geoJSON)
 * This is part of parcel application
 *

 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.service.ParcelPlot',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance
     */

    function (instance) {
        this.instance = instance;
        this.parcelLayer = null;
        this.boundaryLayer = null;
        this.pointLayer = null;
        this.oldPointLayer = null;
        this._map = null;
        this.geoJson = null;

        // Default style for new parcel polygons in parcel application (parcel view)
        var smPolygon = new OpenLayers.StyleMap({
            'default': {
                strokeColor: "#00FF00",
                strokeOpacity: 1,
                strokeWidth: 0,
                fillColor: "#FF0000",
                fillOpacity: 0.2,
                labelAlign: "bm",
                label: "${nimi}\n n. ${area} ha",
                fontColor: "#000000",
                fontSize: "22px",
                fontFamily: "SansSerif",
                fontWeight: "bold"
            }
        });

        this.parcelLayer = new OpenLayers.Layer.Vector("NewParcel", {
            styleMap: smPolygon
        });

        // Default style for new boundaries in parcel application (parcel view)
        var smLine = new OpenLayers.StyleMap({
            'default': {
                strokeColor: "#FF0000",
                strokeOpacity: 1,
                strokeWidth: 2,
                strokeDashstyle: "dash",
                fillColor: "#FF0000",
                fillOpacity: 1.0,
                label: "n. ${length} m",
                labelAlign: "cm",
                labelXOffset: "${deltax}",
                labelYOffset: "${deltay}"
            }
        });

        this.boundaryLayer = new OpenLayers.Layer.Vector("NewBoundary", {
            styleMap: smLine
        });

        // Default style for new boundary points in parcel application (parcel view)
        var smPoint = new OpenLayers.StyleMap({
            'default': {
                strokeColor: "#FF0000",
                strokeOpacity: 1,
                strokeWidth: 1,
                fillColor: "#FF0000",
                fillOpacity: 0.5,
                pointRadius: 6,
                label: "${pnro}",
                graphicName: "triangle",
                labelXOffset: 10,
                labelYOffset: 10,
                fontFamily: "Arial",
                fontSize: "12px"
            }
        });
        this.pointLayer = new OpenLayers.Layer.Vector("NewPoints", {
            styleMap: smPoint
        });
        // Default style for new boundary points in parcel application (parcel view)
        var smOldPoint = new OpenLayers.StyleMap({
            'default': {
                strokeColor: "#00FF00",
                strokeOpacity: 1,
                strokeWidth: 1,
                fillColor: "#00FF00",
                fillOpacity: 0.5,
                pointRadius: 6,
                label: "${numero}",
                graphicName: "triangle",
                labelXOffset: 10,
                labelYOffset: 10,
                fontFamily: "Arial",
                fontSize: "12px"
            }
        });
        this.oldPointLayer = new OpenLayers.Layer.Vector("OldPoints", {
            styleMap: smOldPoint
        });

    }, {
        /**
         * @method plotParcel
         * Plot feature to temp layer and send plot data to printout service
         * @param {OpenLayers.Feature.Vector} feature (new boundaries, which are added in parcel application)
         * @param {} values  print legend and margin properties
         * @param {Function} cb Requires information about the success as boolean parameter.
         */
        plotParcel: function (feature, values, cb) {
            var me = this,
                loc = this.instance.getLocalization('page');

            me._plotNewParcel(feature, loc.title_childparcel, values.place.title, cb);
            me._plotNewBoundary(feature, cb);

            cb(true);

            // Create geojson graphics for print
            var geojsCollection = me._createGeoJSON();


            // Center map to feature
            me._centerMap2Parcel(feature, values);

            var printParams = me._getPrintParams(values.place);
            // Trigger plot dialog
            // me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [undefined, 'attach', 'Printout'])
            // $('.tool-print').trigger('click');

            // Print pdf without preview UI
            // var eventBuilder = me.instance.sandbox.getEventBuilder('Printout.PrintWithoutUIEvent');

            //Add extra table rows for printout
            var tables = me._appendTableRows(values);

            // Print pdf with preview UI and with parcel preconfig
            var eventBuilder = me.instance.sandbox.getEventBuilder('Printout.PrintWithParcelUIEvent');

            if (eventBuilder) {
                // Send print params and GeoJSON for printing
                var event = eventBuilder(me.instance.getName(), printParams, geojsCollection, tables);
                me.instance.sandbox.notifyAll(event);
            }
        },

        /**
         * @method plotParcel
         * Plot feature to temp layer
         * @param {OpenLayers.Feature.Vector} feature (new boundaries, which are added in parcel application)
         * @param {String} placeName Name of the place.
         * @param {String} placeDescription Description of the place.
         * @param {Function} cb Requires information about the success as boolean parameter.
         */
        plotParcelWithoutPrint: function (feature, values, cb) {
            var me = this,
                loc = this.instance.getLocalization('page');

            me._plotNewParcel(feature, loc.title_childparcel, values.title, cb);
            me._plotNewBoundary(feature, cb);

            cb(true);
            // Create geojson graphics for print
            var geojsCollection = me._createGeoJSON();

            // Center map to feature
            me._centerMap2Parcel(feature, values);
        },

        /**
         * @method clearParcelMap
         * Clear  temp layers of Parcel Map
         *
         */
        clearParcelMap: function () {
            if (this.parcelLayer) {
                this.parcelLayer.removeAllFeatures();
            }
            if (this.boundaryLayer) {
                this.boundaryLayer.removeAllFeatures();
            }
            if (this.pointLayer) {
                this.pointLayer.removeAllFeatures();
            }
            if (this.oldPointLayer) {
                this.oldPointLayer.removeAllFeatures();
            }
        },
        /**
         * @method _plotNewParcel
         * Plot features to OL temp layer.
         * @param {OpenLayers.Feature.Vector} feature to be plotted as  new Parcel.
         * @param {String} placeName Name of the place.
         * @param {String} placeDescription Description of the place.
         * @param {Function} cb Requires information about the success as boolean parameter.
         */
        _plotNewParcel: function (featurein, placeName, placeDescription, cb) {
            var me = this;

            // Component collection for IE8 compatibility
            var linearRings = [];
            for (var i = 0; i < featurein.geometry.components.length; i++) {
                linearRings.push(featurein.geometry.components[i]);
            }
            var polygon = new OpenLayers.Geometry.Polygon(linearRings),
                feature = new OpenLayers.Feature.Vector(polygon);

            // Set the place and description for the feature if they are given.
            // If they are not given, then do not set them.
            if (feature.attributes) {
                if (placeName) {
                    // Here we suppose that server uses "nimi" property for the place name.
                    feature.attributes.nimi = placeName;
                }
                if (placeDescription || typeof placeDescription === "string") {
                    // Set the place description also if an empty string is given.
                    // Here we suppose that server uses "kuvaus" property for the place description.
                    feature.attributes.kuvaus = placeDescription;
                }
            }
            if (feature) {
                // Plot extra graphics for Parcel map
                var drawplug = this.instance.getDrawPlugin();
                if (drawplug.getMap().getLayerIndex(this.parcelLayer) == -1) {
                    drawplug.getMap().addLayer(this.parcelLayer);
                    drawplug.getMap().setLayerIndex(this.parcelLayer, 1001);
                }

                // remove possible old drawing
                this.parcelLayer.removeAllFeatures();

                // Add area to feature properties
                var harea = feature.geometry.getArea() / 10000.0;
                // ha unit
                feature.attributes.area = harea.toFixed(2);
                // add parcel feature to plot
                // Assign style - use default style
                feature.style = this.parcelLayer.style;

                var features = [feature];
                this.parcelLayer.addFeatures(features);
                // Remove orig graphics
                // drawplug.drawLayer.removeAllFeatures();
                drawplug.drawLayer.setVisibility(false);
                this.parcelLayer.redraw();

            }

        },
        /**
         * @method _plotNewBoundary
         * Plot features to OL temp layer.
         * @param {OpenLayers.Feature.Vector} feature to be plotted as  new Parcel.
         * @param {Function} cb Requires information about the success as boolean parameter.
         */
        _plotNewBoundary: function (feature, cb) {
            var me = this,
                features = [],
                pointfeatures = [];
            // Get new boundaries
            var drawplug = this.instance.getDrawPlugin();
            if (drawplug.getMap().getLayerIndex(this.boundaryLayer) == -1) {
                drawplug.getMap().addLayer(this.boundaryLayer);
                drawplug.getMap().setLayerIndex(this.boundaryLayer, 1002);
            }
            if (drawplug.getMap().getLayerIndex(this.pointLayer == -1)) {
                drawplug.getMap().addLayer(this.pointLayer);
                drawplug.getMap().setLayerIndex(this.pointLayer, 1003);
            }

            // remove possible old drawing
            this.boundaryLayer.removeAllFeatures();
            this.pointLayer.removeAllFeatures();

            //running pno for new boundary points
            var pno = 1;

            //for ( i = 0; i < drawplug.drawLayer.features.length; i++) {
            var f = drawplug.editLayer.features[0];
            if (f !== null && f !== undefined) {

                // Loop components
                for (var k = 0; k < f.geometry.components.length; k++) {
                    // loop segments
                    var geometry = f.geometry.components[k],
                        nodes = geometry.getVertices(),
                        lon,
                        lat,
                        lon2,
                        lat2,
                        center_lonlat1,
                        center_lonlat2,
                        center_px1,
                        center_px2,
                        deltax,
                        deltay,
                        points,
                        line,
                        lineFeature;

                    for (var j = 0; j < nodes.length - 1; j++) {
                        lon = nodes[j].x;
                        lat = nodes[j].y;
                        lon2 = nodes[j + 1].x;
                        lat2 = nodes[j + 1].y;
                        center_lonlat1 = new OpenLayers.LonLat(lon, lat);
                        center_px1 = drawplug._map.getPixelFromLonLat(center_lonlat1);
                        center_lonlat2 = new OpenLayers.LonLat(lon2, lat2);
                        center_px2 = drawplug._map.getPixelFromLonLat(center_lonlat2);
                        deltax = (center_px2.x + center_px1.x) / 2.0 - center_px1.x;
                        deltay = (center_px2.y + center_px1.y) / 2.0 - center_px1.y;
                        points = [new OpenLayers.Geometry.Point(lon, lat), new OpenLayers.Geometry.Point(lon2, lat2)];
                        line = new OpenLayers.Geometry.LineString(points);
                        //line.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
                        lineFeature = new OpenLayers.Feature.Vector(line, null, this.boundaryLayer.style);
                        lineFeature.attributes.length = lineFeature.geometry.getLength().toFixed(0);  // unit m, no decimals
                        lineFeature.attributes.deltax = deltax;
                        lineFeature.attributes.deltay = -deltay;
                        features.push(lineFeature);
                        // Point features
                        var pointFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lon, lat), null, this.pointLayer.style);
                        pointFeature.attributes.pnro = pno++;
                        pointfeatures.push(pointFeature);
                        if (j === nodes.length - 2) {
                            pointFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lon2, lat2), null, this.pointLayer.style);
                            pointFeature.attributes.pnro = pno++;
                            pointfeatures.push(pointFeature);
                        }
                    }
                    // if polygon --> make 1st and last point segemnt
                    if (geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon" || geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
                        lon = nodes[nodes.length - 1].x;
                        lat = nodes[nodes.length - 1].y;
                        lon2 = nodes[0].x;
                        lat2 = nodes[0].y;
                        center_lonlat1 = new OpenLayers.LonLat(lon, lat);
                        center_px1 = drawplug._map.getPixelFromLonLat(center_lonlat1);
                        center_lonlat2 = new OpenLayers.LonLat(lon2, lat2);
                        center_px2 = drawplug._map.getPixelFromLonLat(center_lonlat2);
                        deltax = (center_px2.x + center_px1.x) / 2.0 - center_px1.x;
                        deltay = (center_px2.y + center_px1.y) / 2.0 - center_px1.y;
                        points = [new OpenLayers.Geometry.Point(lon, lat), new OpenLayers.Geometry.Point(lon2, lat2)];
                        line = new OpenLayers.Geometry.LineString(points);
                        lineFeature = new OpenLayers.Feature.Vector(line, null, this.boundaryLayer.style);
                        lineFeature.attributes.length = lineFeature.geometry.getLength().toFixed(2);
                        lineFeature.attributes.deltax = deltax;
                        lineFeature.attributes.deltay = -deltay;
                        features.push(lineFeature);
                    }
                }

                //}
                if (pointfeatures.length > 0) {
                    // Plot extra graphics for Parcel map

                    this.pointLayer.addFeatures(pointfeatures);
                    this.pointLayer.redraw();

                }
                if (features.length > 0) {
                    // Plot extra graphics for Parcel map
                    this.boundaryLayer.addFeatures(features);
                    this.boundaryLayer.redraw();

                }
            }
            // Remove orig graphics
            //drawplug.getEditLayer().removeAllFeatures();
            //drawplug.getMarkerLayer().clearMarkers();
            drawplug.getEditLayer().setVisibility(false);
            drawplug.getMarkerLayer().setVisibility(false);
        },
        /**
         * Clear plot extra graphics and set parcel edit layers on
         */
        cancelPlotParcel: function () {
            this.clearParcelMap();
            this._setEditsVisible();

        },
        /**
         * @method _plotOldParcel points
         * Plot old parcel point features to OL temp layer (boundary monuments).
         * @param [{OpenLayers.Feature.Vector}] features to be plotted as an old Parcel points.
         *
         */
         plotOldParcelPoints: function (pointfeatures) {
            var me = this,
                drawplug = this.instance.getDrawPlugin();

            if (drawplug.getMap().getLayerIndex(this.oldPointLayer == -1)) {
                drawplug.getMap().addLayer(this.oldPointLayer);
                drawplug.getMap().setLayerIndex(this.oldPointLayer, 1004);
            }
            // remove possible old drawing
            this.oldPointLayer.removeAllFeatures();

            // Filter off unnumbered points
            var filterpf = [];
            for (var key in pointfeatures) {
               if(pointfeatures[key].attributes["numero"]) filterpf.push(pointfeatures[key]);
            }

                if (filterpf.length > 0) {
                    // Plot extra graphics for Parcel map
                    // Filter off unnumber points


                    this.oldPointLayer.addFeatures(filterpf);
                    this.oldPointLayer.redraw();

                }

        },
        /**
         /**
         * @method _createGeoJSON
         * Create GeoJSON graphics + styles for backend print task
         *
         * Sample json for geojson=... param in GetPreview action route
         * {
     "type" : "geojson",
     "name" : "Määräalat",
     "id" : "NewParcel",
     "data" : {
     "type" : "FeatureCollection",
     "features" : []
     },
     "styles" : [{
     "title" : "Standard",
     "name" : "style-id-200",
     "styleMap" : {
     "default" : {
     "strokeColor" : "#00FF00",
     "strokeOpacity" : 1,
     ...
     }
     },
     "styledLayerDescriptor" : "<valinnainen-XML-SLD-KUVAILU>"
     }]
     }, {
     "type" : "geojson",
     "name" : "Määräalat",
     "id" : "NewBoundary",
     "data" : {
     */
        _createGeoJSON: function () {

            var geojson_format = new OpenLayers.Format.GeoJSON();
            // GeoJson collection
            var geojsCollection = [];
            // New Parcel graphics
            var parcel = JSON.parse(geojson_format.write(this.parcelLayer.features));
            var geojs = {
                "type": "geojson",
                "name": this.parcelLayer.name,
                "id": this.parcelLayer.name,
                "data": {
                    "type": "FeatureCollection",
                    "features": parcel.features
                },
                "styles": []
            };

            geojs.styles.push(this._getDefaultStyle(this.parcelLayer.styleMap));
            geojsCollection.push(geojs);

            // New boundary graphics
            var boundary = JSON.parse(geojson_format.write(this.boundaryLayer.features));
            geojs = {
                "type": "geojson",
                "name": this.boundaryLayer.name,
                "id": this.boundaryLayer.name,
                "data": {
                    "type": "FeatureCollection",
                    "features": boundary.features
                },
                "styles": []
            };

            geojs.styles.push(this._getDefaultStyle(this.boundaryLayer.styleMap));
            geojsCollection.push(geojs);

            // New boundary points graphics
            var point = JSON.parse(geojson_format.write(this.pointLayer.features));
            geojs = {
                "type": "geojson",
                "name": this.pointLayer.name,
                "id": this.pointLayer.name,
                "data": {
                    "type": "FeatureCollection",
                    "features": point.features
                },
                "styles": []
            };
            geojs.styles.push(this._getDefaultStyle(this.pointLayer.styleMap));
            geojsCollection.push(geojs);

            // Old boundary points graphics
            var opoint = JSON.parse(geojson_format.write(this.oldPointLayer.features));
            geojs = {
                "type": "geojson",
                "name": this.oldPointLayer.name,
                "id": this.oldPointLayer.name,
                "data": {
                    "type": "FeatureCollection",
                    "features": opoint.features
                },
                "styles": []
            };
            geojs.styles.push(this._getDefaultStyle(this.oldPointLayer.styleMap));
            geojsCollection.push(geojs);


            return geojsCollection;
        },
        /**
         * @method _getDefaultStyle
         * Oskari openlayers style to basic printout format
         * @param {OpenLayers.Feature.Vector.styleMap} feature to be plotted as  new Parcel.
         * @return {object}  print style
         */
        _getDefaultStyle: function (styleMap) {
            var style = styleMap.styles["default"].defaultStyle,
                id = styleMap.styles["default"].id,
                printStyle = {
                    "title": "Standard",
                    "name": id,
                    "styleMap": {
                        "default": {}
                    }

                };
            printStyle.styleMap["default"] = this._cleanStyle(style, ['labelXOffset', 'labelYOffset']);
            return printStyle;
        },
        /**
         * TODO: define plot layout params in bundle config
         *  Get / define plot attributes
         * @param values new part parcel and plot attributes
         * @private
         */
        _getPrintParams: function (values) {
            var sandbox = this.instance.getSandbox(),
                maplinkArgs = sandbox.generateMapLinkParameters(),
                loc = this.instance.getLocalization('page'),
            //TODO: configure values based on paper size and orientation
                selections = {
                    pageTitle: loc.title,
                    pageSize: values.size,
                    maplinkArgs: maplinkArgs,
                    format: "application/pdf",
                    pageDate: true,
                    pageLogo: true,
                    pageScale: true,
                    saveFile: values.name,
                    pageTemplate: this.instance.base_pdf_template,
                    pageMapRect: this.instance.pageMapRect,  // Map area on A4 paper
                    tableTemplate: "LayoutTemplatePointTable"  // .json file name for plot layout (backend)
                };
    debugger;
            return selections;

        },
        /**
         *  Add table rows to parcel printout
         *  - table2 for extra information
         *  - table3 for bottom foot note
         * @param values new part parcel and plot attributes
         * @private
         */
        _appendTableRows: function (values) {

            var rows = [],
                footrows = [],
                loc = this.instance.getLocalization('page'),
                row1 = {},
                row2 = {},
                row3 = {},
                rowFoot = {};

            row1.col1 = loc.parentparcel;
            row1.col2 = values.place.parent_property_id;
            rows.push(row1);
            row2.col1 = loc.parcel_desc;
            row2.col2 = values.place.title;
            rows.push(row2);
            row3.col1 = loc.parcel_user;
            row3.col2 = values.place.reporter;
            rows.push(row3);
            values.tables.table2 = rows;

            rowFoot.col1 = loc.footnote;
            footrows.push(rowFoot);
            values.tables.table3 = footrows;

            return values.tables;


        },
        _setEditsVisible: function () {
            var drawplug = this.instance.getDrawPlugin();
            drawplug.drawLayer.setVisibility(true);
            drawplug.getEditLayer().setVisibility(true);
            drawplug.getMarkerLayer().setVisibility(true);

        },
        /**
         *  Center map middle point to parcel bbox middle point and set page orientation
         * @param feature Parcel feature
         * @param values new part parcel and plot attributes
         * @private
         */
        _centerMap2Parcel: function (feature, values) {
            var size = "A4";
            if (feature && feature.geometry && feature.geometry.bounds) {
                var mapModule = this.instance.getSandbox().findRegisteredModuleInstance('MainMapModule'),
                    mywidth = feature.geometry.bounds.right - feature.geometry.bounds.left,
                    myheight = feature.geometry.bounds.top - feature.geometry.bounds.bottom,
                    mycx = (feature.geometry.bounds.right + feature.geometry.bounds.left) / 2.0,
                    mycy = (feature.geometry.bounds.top + feature.geometry.bounds.bottom) / 2.0,
                    myCenter = new OpenLayers.LonLat(mycx, mycy);
                mapModule.centerMap(myCenter, mapModule.getMap().getZoom());
                if (mywidth > myheight) size = "A4_Landscape";
            }
            values.size = size;
        },
        /**
         * @method _cleanStyle
         * remove given parameters out of style
         * certain attributes are not supported in backend geotools printing
         * @param {Object} JSON style attributes
         * @param {Array} style attributes for to remove.
         * @return {object}  cleaned  style
         */
        _cleanStyle: function (stylein, attrs_to_remove) {
            // Loop style attributes
            var style = jQuery.extend(true, {}, stylein);
            for (var i = 0; i < attrs_to_remove.length; i++) {
                var key = attrs_to_remove[i];
                if (style[key]) {
                    if (style[key].toString().indexOf("${delta") > -1) {
                        delete style[key];
                    }
                }

            }

            return style;
        }
    });
