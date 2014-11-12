/**
 * @class Oskari.mapframework.bundle.printout.plugin.LegendPlugin
 * Common methods to create geojson legend and plot lengend to OL map
 *
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.printout.plugin.LegendPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (instance, conf, locale) {
        var me = this;

        me._clazz =
            'Oskari.mapframework.bundle.printout.plugin.LegendPlugin';
        me._conf = conf;
        if (!me.conf) {
            me.conf = {};
        }
        me.instance = instance;
        me.locale = locale;
        me._name = 'LegendPlugin';

        me.headerLayer = null;
        me.printAreaLayer = null;
        me.boxesLayer = null;
    }, {

        getQName: function () {
            return this._clazz;
        },

        /**
         * @private @method _initImpl
         * Initializes the service
         */
        _initImpl: function () {
            // Default style for print area layer
            var smPrintArea = new OpenLayers.StyleMap({
                'default': this.getConfig().printAreaDefault
            });

            this.printAreaLayer = new OpenLayers.Layer.Vector(
                'PrintArea', {
                    styleMap: smPrintArea
                }
            );

            // Default style for legend box and legend title layer
            var smHeader = new OpenLayers.StyleMap({
                'default': this.getConfig().legendBoxDefault
            });

            this.headerLayer = new OpenLayers.Layer.Vector(
                'LegendHeader', {
                    styleMap: smHeader
                }
            );
            // Default style for legend boxes layer
            var smBoxes = new OpenLayers.StyleMap({
                'default': this.getConfig().colorBoxDefault
            });

            this.boxesLayer = new OpenLayers.Layer.Vector(
                'LegendBoxes', {
                    styleMap: smBoxes
                }
            );
        },

        /**
         * @method plotLegend
         * Plot legend features
         * @param {String} title  Legend title
         * @param {Object[]} ranges legend boxes data (box color and ranges)
         * @param {Object} printInfo print map params
         * @param {String} legend_pos  Legend position (LL,LU,RU,RL) (left lower, left upper, right upper, right lower)
         * @return {Object} legendgjs  legend in geojson featurecollection
         *
         */
        plotLegend: function (title, ranges, printInfo, legend_pos) {
            // Keep layers on top
            var map = this.getMapModule().getMap();

            if (map.getLayerIndex(this.printAreaLayer) === -1) {
                map.addLayer(this.printAreaLayer);
                map.setLayerIndex(this.printAreaLayer, 10004);
            } else {
                map.raiseLayer(this.printAreaLayer, 101);
            }

            if (map.getLayerIndex(this.headerLayer) === -1) {
                map.addLayer(this.headerLayer);
                map.setLayerIndex(this.headerLayer, 10005);
            } else {
                map.raiseLayer(this.headerLayer, 102);
            }

            if (map.getLayerIndex(this.boxesLayer === -1)) {
                map.addLayer(this.boxesLayer);
                map.setLayerIndex(this.boxesLayer, 10006);
            } else {
                map.raiseLayer(this.boxesLayer, 103);
            }

            // remove old, if any
            this.clearLegendLayers();
            // Legend box coordinates
            var legend_geom = this._getLegendGeom(
                title,
                ranges,
                printInfo,
                legend_pos
            );

            this._plotLegendHeader(title, ranges, legend_geom);

            this._plotLegendBoxes(title, ranges, legend_geom);

            // Create geojson graphics for print
            return this._createPrintGeoJSON();

        },

        /**
         * @method _maxLayerIndex
         *
         *
         * @private
         * @return{boolean} true; statslayers exists
         *
         */
        _maxLayerIndex: function () {
            var i,
                layers = this.instance.getSandbox().findAllSelectedMapLayers(),
                map = this.getMapModule().getMap(),
                top = 0;

            // request updates for map tiles
            for (i = 0; i < layers.length; i += 1) {
                if (map.getLayerIndex(layers[i]) > top) {
                    top = map.getLayerIndex(layers[i]);
                }
            }
            return top;
        },

        /**
         * @method _getLegendGeom
         * Get geometry for lenegd box
         * @param {String} title  Legend title
         * @param {Object[]} ranges legend boxes data (box color and ranges)
         * @param {Object} printInfo print map params
         * @param {String} legend_pos  Legend position (LL,LU,RU,RL) (left lower, left upper, right upper, right lower)
         * @return {Object} legend geometry box
         *
         */
        _getLegendGeom: function (title, ranges, printInfo, legend_pos) {
            // Print area in pixels
            var properties = printInfo.features[0].properties,
                pixel_width = properties.targetWidth,
                pixel_height = properties.targetHeight;

            // Legend box coordinates
            var coords = printInfo.features[0].geometry.coordinates[0],
                width = Number(coords[1][0]) - Number(coords[0][0]),
                height = Number(coords[2][1]) - Number(coords[1][1]);

            // Split long title row - max lenght is this.getConfig().general.charsInrow
            var titles = [],
                i;

            if (title.length > this.getConfig().general.charsInrow) {
                var titlesplit = title.split(' '),
                    titletemp = '';

                for (i = 0; i < titlesplit.length; i += 1) {
                    if ((titletemp.length + titlesplit[i].length + 1) < this.getConfig().general.charsInrow) {
                        titletemp = titletemp + titlesplit[i] + ' ';
                    } else {
                        titles.push(titletemp);
                        titletemp = titlesplit[i];
                    }

                }
                if (titletemp.length > 0) {
                    titles.push(titletemp);
                }
            } else {
                titles.push(title);
            }

            // Use longer side
            var lside = Math.max(width, height);

            // legend height in meters based on # of color box rows and map area size
            var l_height = this.getConfig().general.legendRowHeight * lside * (ranges.length + titles.length + 1);
            // Legend width in meters
            var l_width = this.getConfig().general.legendWidth * lside,
                box_size = l_height / (ranges.length + titles.length + 1),
                lcoord = [];

            // Legend LL
            if (legend_pos === 'LL') {
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[0][0],
                    coords[0][1] + l_height
                ));
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[0][0] + l_width,
                    coords[0][1] + l_height
                ));
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[0][0] + l_width,
                    coords[0][1]
                ));
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[0][0],
                    coords[0][1]
                ));
            } else if (legend_pos === 'LU') {
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[0][0],
                    coords[3][1]
                ));
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[0][0] + l_width,
                    coords[3][1]
                ));
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[0][0] + l_width,
                    coords[3][1] - l_height
                ));
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[0][0],
                    coords[3][1] - l_height
                ));
            } else if (legend_pos === 'RU') {
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[2][0] - l_width,
                    coords[2][1]
                ));
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[2][0],
                    coords[2][1]
                ));
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[2][0],
                    coords[2][1] - l_height
                ));
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[2][0] - l_width,
                    coords[2][1] - l_height
                ));
            } else if (legend_pos === 'RL') {
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[1][0] - l_width,
                    coords[1][1] + l_height
                ));
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[1][0],
                    coords[1][1] + l_height
                ));
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[1][0],
                    coords[1][1]
                ));
                lcoord.push(new OpenLayers.Geometry.Point(
                    coords[1][0] - l_width,
                    coords[1][1]
                ));
            }

            // Print area
            var acoord = [],
                coordp;
            i = 0;
            while (coordp = coords[i += 1]) {
                acoord.push(
                    new OpenLayers.Geometry.Point(coordp[0], coordp[1])
                );
            }

            var legend_box = {
                'print_area': acoord,
                'bbox': lcoord,
                'rangebox_size': box_size,
                'properties': properties,
                'titles': titles
            };

            return legend_box;
        },

        /**
         * @method clearLegendLayers
         * Clear  temp layers of Legend
         *
         */
        clearLegendLayers: function () {
            if (this.headerLayer) {
                this.headerLayer.removeAllFeatures();
            }
            if (this.boxesLayer) {
                this.boxesLayer.removeAllFeatures();
            }
            if (this.printAreaLayer) {
                this.printAreaLayer.removeAllFeatures();
            }

        },

        /**
         * @method _plotLegendHeader
         * Create and plot Legend title and legend box to OL temp layer.
         * @param {String} title  Legend title
         * @param {Object[]} ranges legend boxes data (box color and ranges)
         * @param {Object} legend_geom legend box for to fill with details
         */
        _plotLegendHeader: function (title, ranges, legend_geom) {
            var me = this,
                coords = legend_geom.bbox,
                points = coords,
                ring = new OpenLayers.Geometry.LinearRing(points),
                polygon = new OpenLayers.Geometry.Polygon([ring]);

            // property value for empty label - not in IE
            var myempty = '\0';

            // create some attributes for the feature
            var attributes = {
                'color': '#FFFFFF', // white fill color
                'name': myempty

            };
            // Print area  - excluded in print geojson
            var line = new OpenLayers.Geometry.LineString(legend_geom.print_area),
                fea_print_area = new OpenLayers.Feature.Vector(line, null);
            me.printAreaLayer.addFeatures([fea_print_area]);
            me.printAreaLayer.redraw();

            // Legend box
            var feature_bbox = new OpenLayers.Feature.Vector(polygon, attributes);
            me.headerLayer.addFeatures([feature_bbox]);

            //Title - add title rows
            var titles = legend_geom.titles,
                i;

            for (i = 0; i < titles.length; i += 1) {
                var point = coords[0].clone(),
                    label_point = new OpenLayers.Geometry.Point(
                        point.x + (0.2 * legend_geom.rangebox_size),
                        point.y - ((i * legend_geom.rangebox_size) + (legend_geom.rangebox_size / 2.0))
                    );

                // create some attributes for the feature
                var pattributes = {
                    name: titles[i]
                };

                var feature_label = new OpenLayers.Feature.Vector(label_point, pattributes);
                me.headerLayer.addFeatures([feature_label]);
            }
            me.headerLayer.redraw();
        },

        /**
         * @method _plotLegendBoxes
         * Plot legend range boxes
         * @param {String} title  Legend title
         * @param {Object[]} legend boxes data (box color and ranges)
         * @param {Object} legend_geom legend box for to fill with details
         */
        _plotLegendBoxes: function (title, ranges, legend_geom) {
            var me = this;
            // property value for empty label - doesn't work in IE
            var myempty = '\0',
                coords = legend_geom.bbox,
                titles = legend_geom.titles,
                box_size = legend_geom.rangebox_size,
                box_insize = 0.8 * legend_geom.rangebox_size,
                point = coords[0].clone();

            // Loop ranges
            var x_LU = point.x + (0.2 * box_size),
                y_LU = point.y - (box_size * titles.length),
                i;
            // this is for header label space

            for (i = 0; i < ranges.length; i += 1) {
                var range = ranges[i],
                    mycolor = '#FFFFFF';
                if (range.boxcolor.split(':').length > 1) {
                    mycolor = range.boxcolor.split(':')[1].replace(/^\s+|\s+$/g, '');
                }

                var x = x_LU,
                    y = y_LU,
                    points = [
                        new OpenLayers.Geometry.Point(x, y),
                        new OpenLayers.Geometry.Point(x + box_insize, y),
                        new OpenLayers.Geometry.Point(x + box_insize, y - box_insize),
                        new OpenLayers.Geometry.Point(x, y - box_insize)
                    ],
                    ring = new OpenLayers.Geometry.LinearRing(points),
                    polygon = new OpenLayers.Geometry.Polygon([ring]);

                // create some attributes for the feature
                var attributes = {
                    color: mycolor,
                    name: myempty

                };

                var feature_bbox = new OpenLayers.Feature.Vector(
                    polygon,
                    attributes
                );

                me.boxesLayer.addFeatures([feature_bbox]);

                //Title
                point = new OpenLayers.Geometry.Point(
                    x + box_size,
                    y - box_insize
                );

                // create some attributes for the feature
                var pattributes = {
                    name: range.range
                };

                var feature_label = new OpenLayers.Feature.Vector(
                    point,
                    pattributes
                );

                me.boxesLayer.addFeatures([feature_label]);

                y_LU = y_LU - box_size;
            }
            me.boxesLayer.redraw();

        },

        _createPrintGeoJSON: function () {
            var geojson_format = new OpenLayers.Format.GeoJSON();
            // GeoJson collection
            var geojsCollection = [];
            // Legend header graphics
            var header = JSON.parse(geojson_format.write(this.headerLayer.features));
            var geojs = {
                type: 'geojson',
                name: this.headerLayer.name,
                id: this.headerLayer.name,
                data: {
                    type: 'FeatureCollection',
                    features: header.features
                },
                styles: []
            };

            geojs.styles.push(this._getDefaultStyle(this.headerLayer.styleMap));
            geojsCollection.push(geojs);

            // Legend range box graphics
            var boxes = JSON.parse(geojson_format.write(this.boxesLayer.features));
            geojs = {
                type: 'geojson',
                name: this.boxesLayer.name,
                id: this.boxesLayer.name,
                data: {
                    type: 'FeatureCollection',
                    features: boxes.features
                },
                styles: []
            };

            geojs.styles.push(this._getDefaultStyle(this.boxesLayer.styleMap));
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
            var style = styleMap.styles['default'].defaultStyle,
                id = styleMap.styles['default'].id,
                printStyle = {
                    title: 'Standard',
                    name: id,
                    styleMap: {
                        'default': {}
                    }
                };
            printStyle.styleMap['default'] = this._cleanStyle(
                style, ['labelXOffset', 'labelYOffset']
            );
            return printStyle;
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
            var style = jQuery.extend(true, {}, stylein),
                i,
                key;

            for (i = 0; i < attrs_to_remove.length; i += 1) {
                key = attrs_to_remove[i];
                if (style[key]) {
                    if (style[key].toString().indexOf('${delta') > -1) {
                        delete style[key];
                    }
                }

            }

            return style;
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
