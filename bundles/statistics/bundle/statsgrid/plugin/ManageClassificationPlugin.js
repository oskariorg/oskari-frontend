/**
 * @class Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin
 *
 * This is a plugin to classify thematic column data.
 * This provides UI of classification params, geostats classifying and html output of classification
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModuleManageClassificationPlugin
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin',
    /**
     * @method create called automatically on construction
     * @params config reserved for future
     * @params locale localization strings
     *
     *
     * @static
     */

    function (config, locale) {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this.element = undefined;
        this.conf = config;
        this._state = null;
        this._locale = locale || Oskari.getLocalization("StatsGrid");
        this.initialSetup = true;
        this.colorsets_div = null;
        this.colorsets_seq = null;
        this.colorsets_qual = null;
        this.content = null;
        this.dialog = null;
        this.colorsetIndex = 0;
        this.currentColorSet = "seq";
        this.curCol = null;
        this._layer = null;
        this._params = null;
        this.minClassNum = 2;
        this.maxClassNum = 9;
        this.numberOfClasses = 5;
        this.isSelectHilightedMode = false;

        this.templates = {
            'block': '<div class="block"></div>',
            'classificationGuide': '<p class="classification-guide"></p>'
        };

    }, {
        /** @static @property __name module name */
        __name: 'ManageClassificationPlugin',

        /**
         * @method getName
         * @return {String} module name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * Returns reference to map module this plugin is registered to
         * @return {Oskari.mapframework.ui.module.common.MapModule}
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * This plugin has an UI so always returns true
         * @return {Boolean}
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method getMap
         * @return {OpenLayers.Map} reference to map implementation
         */
        getMap: function () {
            return this._map;
        },
        /**
         * @method register
         * Interface method for the module protocol
         */
        register: function () {},
        /**
         * @method unregister
         * Interface method for the module protocol
         */
        unregister: function () {},
        /**
         * @method init
         * Interface method for the module protocol. Initializes the request
         * handlers/templates.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            // Classify html template
            this.classify_temp = jQuery("<div class='mapplugin manageClassificationPlugin'>" + '<div class="classheader"><div class="header-icon icon-arrow-white-right"></div></div>' + '<div class="content"></div>' + "</div>");
            this.templateContent = jQuery('<div></div>');
            this.templateInstructions2 = jQuery("<div class='instructions2' style= 'padding: 20px 0px 0px 0px;'></div>");

            // Setup Colors
            this.setColors();
        },
        /**
         * @method startPlugin
         *
         * Interface method for the plugin protocol. Registers requesthandlers and
         * eventlisteners. Creates the plugin UI.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            me._sandbox = sandbox || me.getMapModule().getSandbox();
            me._map = me.getMapModule().getMap();
            me._sandbox.register(me);
            this._state = (this.conf.state || {});
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }
            me.statsService = me._sandbox.getService('Oskari.statistics.bundle.statsgrid.StatisticsService');

            me._initState();
            me._createUI();
        },
        /**
         * @method _initState
         * @private
         * initializes state params since it might be possible
         * that there is not all the data included
         */
        _initState: function () {
            if (this._state.methodId === null || this._state.methodId === undefined || this._state.methodId < 1) {
                this._state.methodId = '1';
            }
            var cmode = this._state.classificationMode;
            if (cmode === null || cmode === undefined) {
                cmode = '';
            }
            if (this._state.numberOfClasses === null || this._state.numberOfClasses === undefined) {
                this._state.numberOfClasses = 5;
            }
            if (this._state.numberOfClasses < 3) {
                this._state.numberOfClasses = 2;
            }
            if ((this._state.filterMethod === null) || (typeof this._state.filterMethod === "undefined") ) {
                this._state.filterMethod = "";
            }
            if ((this._state.filterInput === null) || (typeof this._state.filterInput === "undefined") ) {
                this._state.filterInput = [];
            }
            if ((this._state.filterRegion === null) || (typeof this._state.filterRegion === "undefined") ) {
                this._state.filterRegion = [];
            }
            if ((this._state.municipalities === null) || (typeof this._state.municipalities === "undefined") ) {
                this._state.municipalities = [];
            }
        },
        /**
         * @method stopPlugin
         *
         * Interface method for the plugin protocol. Unregisters requesthandlers and
         * eventlisteners. Removes the plugin UI.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                p;
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me._sandbox.unregisterFromEventByName(me, p);
                }
            }

            me._sandbox.unregister(me);

            // remove ui
            if (me.element) {
                me.element.remove();
                me.element = undefined;
                delete me.element;
            }
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             * Adds the layer to selection
             */
            'MapLayerEvent': function (event) {
                // Is stats map layer selected
                var layers = this._sandbox.findAllSelectedMapLayers(),
                    n,
                    layer;

                for (n = layers.length - 1; n >= 0; --n) {
                    layer = layers[n];
                    if (layer._layerType === "STATS" && !layer.isBaseLayer()) {
                        if (layer.isVisible()) {
                            this._visibilityOn();
                        } else {
                            this._visibilityOff();
                        }
                        break;
                    }
                }

            },
            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             *
             * Removes the layer from selection
             */
            'AfterMapLayerRemoveEvent': function (event) {
                // Reset the UI and hide the dialog
                if (event.getMapLayer()._layerType === "STATS") {
                    this.resetUI();
                }
            },
            /**
             * @method AfterMapLayerAddEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
             *
             * Adds the layer to selection
             */
            'AfterMapLayerAddEvent': function (event) {

                // Show Classify dialog
                if (event.getMapLayer()._layerType === "STATS") {
                    this._visibilityOn();
                }
            },

            /**
             * @method MapModulePlugin_MapLayerVisibilityRequest
             * refreshes checkbox state based on visibility
             */
            'MapLayerVisibilityChangedEvent': function (event) {
                // Hide Classify dialog
                if (event.getMapLayer()._layerType === "STATS") {

                    var blnVisible = event.getMapLayer().isVisible();
                    if (blnVisible) {
                        this._visibilityOn();
                    } else {
                        this._visibilityOff();
                    }
                }

            },

            /**
             * @method AfterMapMoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapMoveEvent} event
             *
             * Adds the layer to selection
             */
            'AfterMapMoveEvent': function (event) {
                // setup initial state here since we are using selected layers to create ui
                // and plugin is started before any layers have been added

            },
            'StatsGrid.SelectHilightsModeEvent': function (event) {
                this.isSelectHilightedMode = true;
            },
            'StatsGrid.ClearHilightsEvent': function (event) {
                this.isSelectHilightedMode = false;
            },
            /**
             * @method SotkadataChangedEvent
             * @param {MapStats.SotkadataChangedEvent} event
             *
             * Creates classification of stats column data and shows it on geostats legend html
             */
            'StatsGrid.SotkadataChangedEvent': function (event) {
                // Create a new classification for thematic data, if selected
                // thematic data column is changed in (ManageStatsOut)-grid
                // stats Oskari layer, which send the event
                this._layer = event.getLayer();
                //params eg. CUL_COL:"indicator..." , VIS_NAME: "ows:kunnat2013", VIS_ATTR: "kuntakoodi", VIS_CODES: munArray, COL_VALUES: statArray
                this._params = event.getParams();
                // Classify data
                if (this._params && this._params.COL_VALUES && this._params.COL_VALUES.length === 0) {
                    // If the values are empty, just send the empty values to visualization
                    this.sendEmptyValues(event);
                } else {
                    // Else classify data
                    this.classifyData(event);
                }
            }
        },

        /**
         * @method setState
         * @param state Statsgrid state object
         * Set the state object of statsgrid to this plugin too.
         */
        setState: function (state) {
            this._state = state;
            this._initState();
        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        /**
         * @method classifyData
         * Classify Sotka indicator column data
         * Parses the data from the grid for geostats and backend so that it can be shown on the map.
         * @param event  Data sent by 'MapStats.SotkadataChangedEvent' (eg. in  ManageStatsOut.js)
         */
        classifyData: function (event) {
            // return, if no old data
            var me = this;
            if (!me._layer) {
                return;
            }
            this._initState();

            // Current Oskari layer
            var layer = this._layer;
            //params eg. CUL_COL:"indicator..." , VIS_NAME: "ows:kunnat2013", VIS_ATTR: "kuntakoodi", VIS_CODES: munArray, COL_VALUES: statArray
            var params = this._params;
            // Current selected stats grid column
            var sortcol = params.CUR_COL,
                strings = [],
                check = false,
                limits = [],
                isNonNumeric = false,
                valid = true,
                method,
                i,
                k,
                block,
                classify;

            //Check selected column - only data columns are handled
            if (!sortcol || (sortcol && sortcol.field.indexOf('indicator') < 0)) {
                return;
            }

            // var classificationCount = me._checkClassCount(params.COL_VALUES.length);
            // if slider is disabled don't show classification but help / guide
            // that you should select more municipalities
            if (params.COL_VALUES.length < 2) {
                // if (classificationCount.max <= classificationCount.min) {
                classify = me.element.find('.classifications');
                classify.find('.block').remove();
                block = jQuery(me.templates.block);
                block.append(jQuery(me.templates.classificationGuide).text(this._locale.select4Municipalities));
                classify.append(block);
                // Show legend in content
                this.element.find('div.content').show();
            }

            // Get classification method
            method = me._state.methodId;

            if (me._hasNonNumericValues(params.COL_VALUES)) {
                isNonNumeric = true;
                this._hideClassificationOptions(this.element);
            } else {
                isNonNumeric = false;
                this._showClassificationOptions(this.element);
            }

            // Get class count
            if (me._state.numberOfClasses > params.COL_VALUES.length - 1) {
                var newValue = Math.max(2, params.COL_VALUES.length - 1);
                this.rangeSlider.slider('option', 'value', newValue);
                jQuery('input#amount_class').val(newValue);
                me._state.numberOfClasses = newValue;
            }
            var classes = me._state.numberOfClasses,
                gcol_data = params.COL_VALUES;
            gcol_data = gcol_data.slice(0);
            var codes = params.VIS_CODES;
            // Limits
            var gstats = new geostats(gcol_data),
                col_data = params.COL_VALUES;

            if (isNonNumeric) {
                limits = gstats.getUniqueValues();
                classes = limits.length;
                _.times(classes, function () {
                    strings.push([]);
                });
                for (k = 0, dataLen = col_data.length; k < dataLen; k++) {
                    for (i = 0; i < classes; i++) {
                        if (limits[i] === col_data[k]) {
                            strings[i].push(codes[k]);
                        }
                    }
                }
            } else if (method === '1') {
                limits = gstats.getJenks(classes);
            } else if (method === '2') {
                limits = gstats.getQuantile(classes);
                // Check for errors
                for (i = 0; i < limits.length; i++) {
                    if (typeof limits[i] === "undefined") {
                        valid = false;
                        break;
                    }
                }
            } else if (method === '3') {
                limits = gstats.getEqInterval(classes);
            } else if (method === '4') {
                limits = this.setManualBreaks(gstats);
                if (!limits) {
                    return;
                }
                classes = limits.length - 1;
            }

            // Preliminary error handling
            if (!valid) {
                classify = me.element.find('.classifications');
                classify.find('.block').remove();
                block = jQuery(me.templates.block);
                block.append("");
                classify.append(block);
                // Show legend in content
                this.element.find('div.content').show();
                return;
            }

            if (!isNonNumeric) {
                // Put municipality codes  in range limits
                for (i = 0; i < classes; i++) {
                    strings[i] = [];
                }
                for (k = 0; k < col_data.length; k++) {

                    for (i = 0; i < strings.length; i++) {
                        if (parseFloat(col_data[k]) >= limits[i] && parseFloat(col_data[k]) <= limits[i + 1]) {
                            strings[i].push(codes[k]);
                            check = true;
                            break;
                        }
                        // FIXME don't do exact comparison with floats, use an epsilon value
                        // a special case for when there's only one child in the last class (the low limit and up limit are the same)
                        if (parseFloat(col_data[k]) == limits[i] && parseFloat(col_data[k]) == limits[i + 1]) {
                            strings[i].push(codes[k]);
                            check = true;
                            break;
                        }

                    }
                    if (check) {
                        check = false;
                        continue;
                    }
                    strings[strings.length - 1].push(codes[k]);
                }
            }

            var classString = _.map(strings, function (stringArr) {
                return stringArr.join(',');
            }).join('|'),
                colors = me._getColors(this.currentColorSet, me.colorsetIndex, classes - 2);
            // If true, reverses the color "array"
            if (me.colorsFlipped) {
                colors = colors.split(',').reverse().join(',');
            }
            var colorArr = colors.split(",");

            for (i = 0; i < colorArr.length; i++) {
                colorArr[i] = '#' + colorArr[i];
            }
            gstats.setColors(colorArr);

            me._state.manualBreaksInput = (me._state.manualBreaksInput !== null && me._state.manualBreaksInput !== undefined) ? me._state.manualBreaksInput.toString() : "";
            colors = colors.replace(/,/g, '|');
            var classificationMode = me._state.classificationMode;

            var returnObject = {
                //instance.js - state handling: method
                methodId: method,
                //instance.js - state handling: number of classes
                numberOfClasses: classes,
                //instance.js - state handling: input string of manual classification method
                manualBreaksInput: me._state.manualBreaksInput,
                //instance.js - state handling: input object for colors
                colors: {
                    set: me.currentColorSet,
                    index: me.colorsetIndex,
                    flipped: me.colorsFlipped
                },
                classificationMode: classificationMode,
                VIS_ID: -1,
                VIS_NAME: params.VIS_NAME,
                VIS_ATTR: params.VIS_ATTR,
                VIS_CLASSES: classString,
                VIS_COLORS: "choro:" + colors
            };
            // Send the data out for visualization.
            this.statsService.sendVisualizationData(layer, returnObject);

            if (params.COL_VALUES.length >= 2) {
                var legendRounder = function (i) {
                    var ret;
                    if (isNaN(i) || (i % 1 === 0)) {
                        ret = i;
                    } else {
                        ret = (Math.round(i * 10) / 10);
                    }
                    return ret;
                };

                var colortab = gstats.getHtmlLegend(null, sortcol.name, true, legendRounder, classificationMode);
                classify = me.element.find('.classifications');
                classify.find('.block').remove();
                block = jQuery(me.templates.block).clone();

                block.append(colortab);
                classify.append(block);

                // Show legend in content
                this.element.find('div.content').show();
            }

            this._visibilityOn();
        },

        /**
         * Sends empty values for visualization. Used because #classifyData
         * does a whole lot of other things besides just sending the values.
         *
         * @method sendEmptyValues
         * @param  {Object} event The event with layer and params
         * @return {undefined}
         */
        sendEmptyValues: function (event) {
            var layer = event.getLayer(),
                params = event.getParams();

            this.statsService.sendVisualizationData(layer, {
                VIS_ID: -1,
                VIS_NAME: params.VIS_NAME,
                VIS_ATTR: params.VIS_ATTR,
                VIS_CLASSES: "",
                VIS_COLORS: "choro:"
            });
            this.resetUI();
        },
        _hasNonNumericValues: function (values) {
            for (var i = 0, valLen = values.length; i < valLen; ++i) {
                var val = values[i];
                if (val !== undefined) {
                    if (isNaN(val)) return true;
                }
            }
            return false;
        },
        _hideClassificationOptions: function (element) {
            element.find('div.classificationMethod').hide();
            element.find('div.classCount').hide();
            element.find('div.classificationMode').hide();
        },
        _showClassificationOptions: function (element) {
            element.find('div.classificationMethod').show();
            element.find('div.classCount').show();
            element.find('div.classificationMode').show();
        },
        /**
         * Creates UI again from scratch
         *
         * @method resetUI
         * @return {undefined}
         */
        resetUI: function () {
            this.element = null;
            this._createUI();
        },
        /**
         * @method  _createUI
         * Creates classification UI (method select, class count, colors)
         
         * @private
         */
        _createUI: function () {
            var me = this;

            // destroy the old plugin from the map
            jQuery('div.manageClassificationPlugin').remove();
            this.element = this.classify_temp.clone();
            // Classify html header
            var header = this.element.find('div.classheader');
            header.append(this._locale.classify.classify);

            // Content HTML / Method select HTML
            var content = me.element.find('div.content'),
                classify = jQuery(
                    '<div class="classifications">' +
                    '<div class="classificationOptions">' +
                    '<div class="classificationMethod"></div>' +
                    '<div class="classCount">' +
                    '<div class="countSlider"></div>' +
                    '<div class="manualBreaks"></div>' +
                    '</div>' +
                    '<div class="classificationMode"></div>' +
                    '<div class="classificationColors"></div>' +
                    '</div>' +
                    '</div>'
                ),
                classifyOptions = classify.find('.classificationOptions'),
                methods = [this._locale.classify.jenks, this._locale.classify.quantile, this._locale.classify.eqinterval, this._locale.classify.manual],
                i,
                opt;

            // do not show classification option if it is not allowed - published map
            if (me._state.allowClassification !== false) {
                classifyOptions
                    .find('div.classificationMethod')
                    .append(this._locale.classify.classifymethod + '<br><select class="method"></select><br>');
                var sel = classifyOptions.find('select.method');
                for (i = 0; i < methods.length; i++) {
                    opt = jQuery('<option value="' + (i + 1) + '">' + methods[i] + '</option>');
                    sel.append(opt);
                }

                sel.change(function (e) {
                    me._state.methodId = jQuery(this).val();
                    if (me._state.methodId === '4') {
                        jQuery('.countSlider').hide();
                        jQuery('.manualBreaks').show();
                    } else {
                        jQuery('.manualBreaks').hide();
                        jQuery('.countSlider').show();
                        // Classify current columns, if any
                        me.classifyData();
                    }
                });
                // Content HTML / class count input HTML
                var classcnt = classifyOptions.find('div.classCount div.countSlider');
                classcnt
                    .append(this._locale.classify.classes)
                    .append('<input type="text" id="amount_class" readonly="readonly" value="5" /><div id="slider-range-max"></div>');
                //var classcnt = jQuery('<div class="classCount">' + this._locale.classify.classes + ' <input type="text" id="amount_class" readonly="readonly" value="5" /><div id="slider-range-max"></div>');

                var slider = classcnt.find('#slider-range-max').slider({
                    range: "min",
                    min: me.minClassNum,
                    max: me.maxClassNum,
                    value: me._state.numberOfClasses,
                    slide: function (event, ui) {
                        var newValue = ui.value;
                        if (newValue > me._params.COL_VALUES.length - 1) {
                            newValue = Math.max(2, me._params.COL_VALUES.length - 1);
                        }
                        me._state.numberOfClasses = newValue;
                        jQuery('input#amount_class').val(newValue);
                        // Classify again
                        me.classifyData(event);
                    },
                    stop: function (event, ui) {
                        jQuery(this).slider('option', 'value', me._state.numberOfClasses);
                    }
                });
                this.rangeSlider = slider;

                // HTML for the manual classification method.
                var manualcls = classifyOptions.find('div.manualBreaks');
                /*var manualcls = jQuery(
                    '<div class="manualBreaks">' +
                    '<input type="text" name="breaksInput" placeholder="' + this._locale.classify.manualPlaceholder + '"></input>' +
                    '<div class="icon-info"></div>' +
                    '</div>'
                );*/
                manualcls
                    .append('<input type="text" name="breaksInput" placeholder="' + this._locale.classify.manualPlaceholder + '"></input>')
                    .append('<div class="icon-info"></div>');
                manualcls.find('input[type=button]').click(function (event) {
                    me._createColorDialog();
                });
                manualcls.find('input[name=breaksInput]').keypress(function (evt) {
                    // FIXME use ===
                    if (evt.which == 13) {
                        me._state.manualBreaksInput = me.element.find('.manualBreaks').find('input[name=breaksInput]').val();
                        me.classifyData();
                    }
                }).focus(function () {
                    me._sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
                }).blur(function () {
                    me._sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
                });
                manualcls.find('.icon-info').click(function (event) {
                    // open helpityhelp...
                    var desc = '<p>' + me._locale.classify.info + '</p>';
                    me.showMessage(me._locale.classify.infoTitle, desc);
                });
                manualcls.hide();

                // Classification mode selector

                var modeSelector = jQuery(
                    '<div>' +
                    this._locale.classify.mode + '<br />' +
                    '<select class="classification-mode"></select><br />' +
                    '</div>'
                );
                var modes = ['distinct', 'discontinuous'];
                jQuery.each(modes, function (i, val) {
                    modeSelector.find('select.classification-mode').append(
                        '<option value="' + val + '">' +
                        me._locale.classify.modes[val] +
                        '</option>'
                    );
                });
                modeSelector.find('select.classification-mode').change(function (e) {
                    me._state.classificationMode = jQuery(e.target).val();
                    me.classifyData();
                });

                // Colours selectors

                var colorsButton = jQuery('<input type="button" value="' + me._locale.colorset.button + '" />');
                colorsButton.click(function (event) {
                    me._createColorDialog();
                });

                var flipColorsButton = jQuery('<input type="button" value="' + me._locale.colorset.flipButton + '" />');
                flipColorsButton.click(function (e) {
                    me._flipCurrentColors();
                });

                //classifyOptions.append(classcnt);
                //classifyOptions.find('div.classCount').append(manualcls);
                classifyOptions.find('div.classificationMode').append(modeSelector);
                classifyOptions.find('div.classificationColors').append(colorsButton);
                classifyOptions.find('div.classificationColors').append(flipColorsButton);
            }
            content.append(classify);

            me._loadStateVariables();

            // Toggle content HTML
            header.click(function () {
                content.animate({
                    height: 'toggle'
                }, 500);

            });

            // get div where the map is rendered from openlayers
            var parentContainer = jQuery(this._map.div);

            // add always as first plugin
            var existingPlugins = parentContainer.find('div');
            if (!existingPlugins || existingPlugins.length === 0) {
                // no existing plugins -> just put it there
                parentContainer.append(this.element);
            } else {
                // put in front of existing plugins
                existingPlugins.first().before(this.element);
            }

            // Hide content
            content.hide();
            // Hide Classify dialog
            this._visibilityOff();

        },

        /**
         * @method showMessage
         * Shows user a message with ok button
         * @param {String} title popup title
         * @param {String} message popup message
         */
        showMessage: function (title, message) {
            var me = this;
            // Oskari components aren't available in a published map.
            if (!this._published) {
                if (me.messageDialog) {
                    me.messageDialog.close(true);
                    me.messageDialog = null;
                } else {
                    var loc = this._locale,
                        dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                        okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                    okBtn.setTitle(loc.buttons.ok);
                    okBtn.addClass('primary');
                    okBtn.setHandler(function () {
                        dialog.close(true);
                        me.messageDialog = null;
                    });
                    dialog.show(title, message, [okBtn]);
                    me.messageDialog = dialog;
                }
            }
        },

        /**
         * @method setManualBreaks
         * Gets the user fed list of numbers and does some range and value checking to them
         * before setting the bounds for geostats.
         * @param {Object} gstats the geostats object
         * @return {Array[Number]} returns a limits array for setting the data.
         */
        setManualBreaks: function (gstats) {
            var me = this,
                limits = [],
                manBreaks = this._state.manualBreaksInput.split(','), //element.find('.classificationMethod').find('.manualBreaks').find('input[name=breaksInput]').val().split(','),
                dialog,
                msg;

            // Verify that the number of given values is within range and display an error dialog if not.
            if (manBreaks.length - 1 < this.minClassNum || manBreaks.length - 1 > this.maxClassNum) {
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                msg = this._locale.classify.manualRangeError.replace(/\{min\}/, this.minClassNum + 1).replace(/\{max\}/, this.maxClassNum + 1);
                dialog.show(null, msg);
                dialog.fadeout();
                return null;
            }

            // Convert the given values to numbers
            // and set the geostats ranges to use them.
            jQuery.each(manBreaks, function (i, elem) {
                var rangeVal = Number(elem);

                // Display an error dialog if a value is not a number.
                if (isNaN(rangeVal)) {
                    dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    msg = me._locale.classify.nanError;
                    dialog.show(null, msg);
                    dialog.fadeout();
                    return null;
                }

                limits.push(rangeVal);
            });

            // Set bounds and ranges for geostats so it can draw the html legend.
            gstats.bounds = limits;
            gstats.setRanges();

            return limits;
        },

        /**
         * @method  _setColors
         * Set color themes for coloring maps
         * (3 color classification qualitative, quantitative and divergent)
         */
        setColors: function () {
            //  var colorsjson = [["ffeda0,f03b20","ffeda0,feb24c,f03b20", "ffffb2,fecc5c,fd8d3c,e31a1c", "ffffb2,fecc5c,fd8d3c,f03b20,bd0026", "ffffb2,fed976,feb24c,fd8d3c,f03b20,bd0026", "ffffb2,fed976,feb24c,fd8d3c,fc4e2a,e31a1c,b10026", "ffffcc,ffeda0,fed976,feb24c,fd8d3c,fc4e2a,e31a1c,b10026", "ffffcc,ffeda0,fed976,feb24c,fd8d3c,fc4e2a,e31a1c,bd0026,800026"], ["deebf7,9ecae1,3182bd", "eff3ff,bdd7e7,6baed6,2171b5", "eff3ff,bdd7e7,6baed6,3182bd,08519c", "eff3ff,c6dbef,9ecae1,6baed6,3182bd,08519c", "eff3ff,c6dbef,9ecae1,6baed6,4292c6,2171b5,084594", "f7fbff,deebf7,c6dbef,9ecae1,6baed6,4292c6,2171b5,084594", "f7fbff,deebf7,c6dbef,9ecae1,6baed6,4292c6,2171b5,08519c,08306b"], ["e5f5f9,99d8c9,2ca25f", "edf8fb,b2e2e2,66c2a4,238b45", "edf8fb,b2e2e2,66c2a4,2ca25f,006d2c", "edf8fb,ccece6,99d8c9,66c2a4,2ca25f,006d2c", "edf8fb,ccece6,99d8c9,66c2a4,41ae76,238b45,005824", "f7fcfd,e5f5f9,ccece6,99d8c9,66c2a4,41ae76,238b45,005824", "f7fcfd,e5f5f9,ccece6,99d8c9,66c2a4,41ae76,238b45,006d2c,00441b"], ["e0ecf4,9ebcda,8856a7", "edf8fb,b3cde3,8c96c6,88419d", "edf8fb,b3cde3,8c96c6,8856a7,810f7c", "edf8fb,bfd3e6,9ebcda,8c96c6,8856a7,810f7c", "edf8fb,bfd3e6,9ebcda,8c96c6,8c6bb1,88419d,6e016b", "f7fcfd,e0ecf4,bfd3e6,9ebcda,8c96c6,8c6bb1,88419d,6e016b", "f7fcfd,e0ecf4,bfd3e6,9ebcda,8c96c6,8c6bb1,88419d,810f7c,4d004b"], ["e0f3db,a8ddb5,43a2ca", "f0f9e8,bae4bc,7bccc4,2b8cbe", "f0f9e8,bae4bc,7bccc4,43a2ca,0868ac", "f0f9e8,ccebc5,a8ddb5,7bccc4,43a2ca,0868ac", "f0f9e8,ccebc5,a8ddb5,7bccc4,4eb3d3,2b8cbe,08589e", "f7fcf0,e0f3db,ccebc5,a8ddb5,7bccc4,4eb3d3,2b8cbe,08589e", "f7fcf0,e0f3db,ccebc5,a8ddb5,7bccc4,4eb3d3,2b8cbe,0868ac,084081"], ["e5f5e0,a1d99b,31a354", "edf8e9,bae4b3,74c476,238b45", "edf8e9,bae4b3,74c476,31a354,006d2c", "edf8e9,c7e9c0,a1d99b,74c476,31a354,006d2c", "edf8e9,c7e9c0,a1d99b,74c476,41ab5d,238b45,005a32", "f7fcf5,e5f5e0,c7e9c0,a1d99b,74c476,41ab5d,238b45,005a32", "f7fcf5,e5f5e0,c7e9c0,a1d99b,74c476,41ab5d,238b45,006d2c,00441b"], ["f0f0f0,bdbdbd,636363", "f7f7f7,cccccc,969696,525252", "f7f7f7,cccccc,969696,636363,252525", "f7f7f7,d9d9d9,bdbdbd,969696,636363,252525", "f7f7f7,d9d9d9,bdbdbd,969696,737373,525252,252525", "ffffff,f0f0f0,d9d9d9,bdbdbd,969696,737373,525252,252525", "ffffff,f0f0f0,d9d9d9,bdbdbd,969696,737373,525252,252525,000000"], ["fee6ce,fdae6b,e6550d", "feedde,fdbe85,fd8d3c,d94701", "feedde,fdbe85,fd8d3c,e6550d,a63603", "feedde,fdd0a2,fdae6b,fd8d3c,e6550d,a63603", "feedde,fdd0a2,fdae6b,fd8d3c,f16913,d94801,8c2d04", "fff5eb,fee6ce,fdd0a2,fdae6b,fd8d3c,f16913,d94801,8c2d04", "fff5eb,fee6ce,fdd0a2,fdae6b,fd8d3c,f16913,d94801,a63603,7f2704"], ["fee8c8,fdbb84,e34a33", "fef0d9,fdcc8a,fc8d59,d7301f", "fef0d9,fdcc8a,fc8d59,e34a33,b30000", "fef0d9,fdd49e,fdbb84,fc8d59,e34a33,b30000", "fef0d9,fdd49e,fdbb84,fc8d59,ef6548,d7301f,990000", "fff7ec,fee8c8,fdd49e,fdbb84,fc8d59,ef6548,d7301f,990000", "fff7ec,fee8c8,fdd49e,fdbb84,fc8d59,ef6548,d7301f,b30000,7f0000"], ["ece7f2,a6bddb,2b8cbe", "f1eef6,bdc9e1,74a9cf,0570b0", "f1eef6,bdc9e1,74a9cf,2b8cbe,045a8d", "f1eef6,d0d1e6,a6bddb,74a9cf,2b8cbe,045a8d", "f1eef6,d0d1e6,a6bddb,74a9cf,3690c0,0570b0,034e7b", "fff7fb,ece7f2,d0d1e6,a6bddb,74a9cf,3690c0,0570b0,034e7b", "fff7fb,ece7f2,d0d1e6,a6bddb,74a9cf,3690c0,0570b0,045a8d,023858"], ["ece2f0,a6bddb,1c9099", "f6eff7,bdc9e1,67a9cf,02818a", "f6eff7,bdc9e1,67a9cf,1c9099,016c59", "f6eff7,d0d1e6,a6bddb,67a9cf,1c9099,016c59", "f6eff7,d0d1e6,a6bddb,67a9cf,3690c0,02818a,016450", "fff7fb,ece2f0,d0d1e6,a6bddb,67a9cf,3690c0,02818a,016450", "fff7fb,ece2f0,d0d1e6,a6bddb,67a9cf,3690c0,02818a,016c59,014636"], ["e7e1ef,c994c7,dd1c77", "f1eef6,d7b5d8,df65b0,ce1256", "f1eef6,d7b5d8,df65b0,dd1c77,980043", "f1eef6,d4b9da,c994c7,df65b0,dd1c77,980043", "f1eef6,d4b9da,c994c7,df65b0,e7298a,ce1256,91003f", "f7f4f9,e7e1ef,d4b9da,c994c7,df65b0,e7298a,ce1256,91003f", "f7f4f9,e7e1ef,d4b9da,c994c7,df65b0,e7298a,ce1256,980043,67001f"], ["efedf5,bcbddc,756bb1", "f2f0f7,cbc9e2,9e9ac8,6a51a3", "f2f0f7,cbc9e2,9e9ac8,756bb1,54278f", "f2f0f7,dadaeb,bcbddc,9e9ac8,756bb1,54278f", "f2f0f7,dadaeb,bcbddc,9e9ac8,807dba,6a51a3,4a1486", "fcfbfd,efedf5,dadaeb,bcbddc,9e9ac8,807dba,6a51a3,4a1486", "fcfbfd,efedf5,dadaeb,bcbddc,9e9ac8,807dba,6a51a3,54278f,3f007d"], ["fde0dd,fa9fb5,c51b8a", "feebe2,fbb4b9,f768a1,ae017e", "feebe2,fbb4b9,f768a1,c51b8a,7a0177", "feebe2,fcc5c0,fa9fb5,f768a1,c51b8a,7a0177", "feebe2,fcc5c0,fa9fb5,f768a1,dd3497,ae017e,7a0177", "fff7f3,fde0dd,fcc5c0,fa9fb5,f768a1,dd3497,ae017e,7a0177", "fff7f3,fde0dd,fcc5c0,fa9fb5,f768a1,dd3497,ae017e,7a0177,49006a"], ["fee0d2,fc9272,de2d26", "fee5d9,fcae91,fb6a4a,cb181d", "fee5d9,fcae91,fb6a4a,de2d26,a50f15", "fee5d9,fcbba1,fc9272,fb6a4a,de2d26,a50f15", "fee5d9,fcbba1,fc9272,fb6a4a,ef3b2c,cb181d,99000d", "fff5f0,fee0d2,fcbba1,fc9272,fb6a4a,ef3b2c,cb181d,99000d", "fff5f0,fee0d2,fcbba1,fc9272,fb6a4a,ef3b2c,cb181d,a50f15,67000d"], ["f7fcb9,addd8e,31a354", "ffffcc,c2e699,78c679,238443", "ffffcc,c2e699,78c679,31a354,006837", "ffffcc,d9f0a3,addd8e,78c679,31a354,006837", "ffffcc,d9f0a3,addd8e,78c679,41ab5d,238443,005a32", "ffffe5,f7fcb9,d9f0a3,addd8e,78c679,41ab5d,238443,005a32", "ffffe5,f7fcb9,d9f0a3,addd8e,78c679,41ab5d,238443,006837,004529"], ["edf8b1,7fcdbb,2c7fb8", "ffffcc,a1dab4,41b6c4,225ea8", "ffffcc,a1dab4,41b6c4,2c7fb8,253494", "ffffcc,c7e9b4,7fcdbb,41b6c4,2c7fb8,253494", "ffffcc,c7e9b4,7fcdbb,41b6c4,1d91c0,225ea8,0c2c84", "ffffd9,edf8b1,c7e9b4,7fcdbb,41b6c4,1d91c0,225ea8,0c2c84", "ffffd9,edf8b1,c7e9b4,7fcdbb,41b6c4,1d91c0,225ea8,253494,081d58"], ["fff7bc,fec44f,d95f0e", "ffffd4,fed98e,fe9929,cc4c02", "ffffd4,fed98e,fe9929,d95f0e,993404", "ffffd4,fee391,fec44f,fe9929,d95f0e,993404", "ffffd4,fee391,fec44f,fe9929,ec7014,cc4c02,8c2d04", "ffffe5,fff7bc,fee391,fec44f,fe9929,ec7014,cc4c02,8c2d04", "ffffe5,fff7bc,fee391,fec44f,fe9929,ec7014,cc4c02,993404,662506"]];
            this.colorsets_div = [{
                "colorname": "BrBG",
                "type": "div",
                "colors": ["d8b365,5ab4ac", "d8b365,f5f5f5,5ab4ac", "a6611a,dfc27d,80cdc1,018571", "a6611a,dfc27d,f5f5f5,80cdc1,018571", "8c510a,d8b365,f6e8c3,c7eae5,5ab4ac,01665e", "8c510a,d8b365,f6e8c3,f5f5f5,c7eae5,5ab4ac,01665e", "8c510a,bf812d,dfc27d,f6e8c3,c7eae5,80cdc1,35978f,01665e", "8c510a,bf812d,dfc27d,f6e8c3,f5f5f5,c7eae5,80cdc1,35978f,01665e", "543005,8c510a,bf812d,dfc27d,f6e8c3,c7eae5,80cdc1,35978f,01665e,003c30", "543005,8c510a,bf812d,dfc27d,f6e8c3,f5f5f5,c7eae5,80cdc1,35978f,01665e,003c30"]
            }, {
                "colorname": "PiYG",
                "type": "div",
                "colors": ["e9a3c9,a1d76a", "e9a3c9,f7f7f7,a1d76a", "d01c8b,f1b6da,b8e186,4dac26", "d01c8b,f1b6da,f7f7f7,b8e186,4dac26", "c51b7d,e9a3c9,fde0ef,e6f5d0,a1d76a,4d9221", "c51b7d,e9a3c9,fde0ef,f7f7f7,e6f5d0,a1d76a,4d9221", "c51b7d,de77ae,f1b6da,fde0ef,e6f5d0,b8e186,7fbc41,4d9221", "c51b7d,de77ae,f1b6da,fde0ef,f7f7f7,e6f5d0,b8e186,7fbc41,4d9221", "8e0152,c51b7d,de77ae,f1b6da,fde0ef,e6f5d0,b8e186,7fbc41,4d9221,276419", "8e0152,c51b7d,de77ae,f1b6da,fde0ef,f7f7f7,e6f5d0,b8e186,7fbc41,4d9221,276419"]
            }, {
                "colorname": "PRGn",
                "type": "div",
                "colors": ["af8dc3,7fbf7b", "af8dc3,f7f7f7,7fbf7b", "7b3294,c2a5cf,a6dba0,008837", "7b3294,c2a5cf,f7f7f7,a6dba0,008837", "762a83,af8dc3,e7d4e8,d9f0d3,7fbf7b,1b7837", "762a83,af8dc3,e7d4e8,f7f7f7,d9f0d3,7fbf7b,1b7837", "762a83,9970ab,c2a5cf,e7d4e8,d9f0d3,a6dba0,5aae61,1b7837", "762a83,9970ab,c2a5cf,e7d4e8,f7f7f7,d9f0d3,a6dba0,5aae61,1b7837", "40004b,762a83,9970ab,c2a5cf,e7d4e8,d9f0d3,a6dba0,5aae61,1b7837,00441b", "40004b,762a83,9970ab,c2a5cf,e7d4e8,f7f7f7,d9f0d3,a6dba0,5aae61,1b7837,00441b"]
            }, {
                "colorname": "PuOr",
                "type": "div",
                "colors": ["f1a340,998ec3", "f1a340,f7f7f7,998ec3", "e66101,fdb863,b2abd2,5e3c99", "e66101,fdb863,f7f7f7,b2abd2,5e3c99", "b35806,f1a340,fee0b6,d8daeb,998ec3,542788", "b35806,f1a340,fee0b6,f7f7f7,d8daeb,998ec3,542788", "b35806,e08214,fdb863,fee0b6,d8daeb,b2abd2,8073ac,542788", "b35806,e08214,fdb863,fee0b6,f7f7f7,d8daeb,b2abd2,8073ac,542788", "7f3b08,b35806,e08214,fdb863,fee0b6,d8daeb,b2abd2,8073ac,542788,2d004b", "7f3b08,b35806,e08214,fdb863,fee0b6,f7f7f7,d8daeb,b2abd2,8073ac,542788,2d004b"]
            }, {
                "colorname": "RdBu",
                "type": "div",
                "colors": ["ef8a62,67a9cf", "ef8a62,f7f7f7,67a9cf", "ca0020,f4a582,92c5de,0571b0", "ca0020,f4a582,f7f7f7,92c5de,0571b0", "b2182b,ef8a62,fddbc7,d1e5f0,67a9cf,2166ac", "b2182b,ef8a62,fddbc7,f7f7f7,d1e5f0,67a9cf,2166ac", "b2182b,d6604d,f4a582,fddbc7,d1e5f0,92c5de,4393c3,2166ac", "b2182b,d6604d,f4a582,fddbc7,f7f7f7,d1e5f0,92c5de,4393c3,2166ac", "67001f,b2182b,d6604d,f4a582,fddbc7,d1e5f0,92c5de,4393c3,2166ac,053061", "67001f,b2182b,d6604d,f4a582,fddbc7,f7f7f7,d1e5f0,92c5de,4393c3,2166ac,053061"]
            }, {
                "colorname": "RdGy",
                "type": "div",
                "colors": ["ef8a62,999999", "ef8a62,ffffff,999999", "ca0020,f4a582,bababa,404040", "ca0020,f4a582,ffffff,bababa,404040", "b2182b,ef8a62,fddbc7,e0e0e0,999999,4d4d4d", "b2182b,ef8a62,fddbc7,ffffff,e0e0e0,999999,4d4d4d", "b2182b,d6604d,f4a582,fddbc7,e0e0e0,bababa,878787,4d4d4d", "b2182b,d6604d,f4a582,fddbc7,ffffff,e0e0e0,bababa,878787,4d4d4d", "67001f,b2182b,d6604d,f4a582,fddbc7,e0e0e0,bababa,878787,4d4d4d,1a1a1a", "67001f,b2182b,d6604d,f4a582,fddbc7,ffffff,e0e0e0,bababa,878787,4d4d4d,1a1a1a"]
            }, {
                "colorname": "RdYlBu",
                "type": "div",
                "colors": ["fc8d59,91bfdb", "fc8d59,ffffbf,91bfdb", "d7191c,fdae61,abd9e9,2c7bb6", "d7191c,fdae61,ffffbf,abd9e9,2c7bb6", "d73027,fc8d59,fee090,e0f3f8,91bfdb,4575b4", "d73027,fc8d59,fee090,ffffbf,e0f3f8,91bfdb,4575b4", "d73027,f46d43,fdae61,fee090,e0f3f8,abd9e9,74add1,4575b4", "d73027,f46d43,fdae61,fee090,ffffbf,e0f3f8,abd9e9,74add1,4575b4", "a50026,d73027,f46d43,fdae61,fee090,e0f3f8,abd9e9,74add1,4575b4,313695", "a50026,d73027,f46d43,fdae61,fee090,ffffbf,e0f3f8,abd9e9,74add1,4575b4,313695"]
            }, {
                "colorname": "RdYlGn",
                "type": "div",
                "colors": ["fc8d59,91cf60", "fc8d59,ffffbf,91cf60", "d7191c,fdae61,a6d96a,1a9641", "d7191c,fdae61,ffffbf,a6d96a,1a9641", "d73027,fc8d59,fee08b,d9ef8b,91cf60,1a9850", "d73027,fc8d59,fee08b,ffffbf,d9ef8b,91cf60,1a9850", "d73027,f46d43,fdae61,fee08b,d9ef8b,a6d96a,66bd63,1a9850", "d73027,f46d43,fdae61,fee08b,ffffbf,d9ef8b,a6d96a,66bd63,1a9850", "a50026,d73027,f46d43,fdae61,fee08b,d9ef8b,a6d96a,66bd63,1a9850,006837", "a50026,d73027,f46d43,fdae61,fee08b,ffffbf,d9ef8b,a6d96a,66bd63,1a9850,006837"]
            }, {
                "colorname": "Spectral",
                "type": "div",
                "colors": ["fc8d59,99d594", "fc8d59,ffffbf,99d594", "d7191c,fdae61,abdda4,2b83ba", "d7191c,fdae61,ffffbf,abdda4,2b83ba", "d53e4f,fc8d59,fee08b,e6f598,99d594,3288bd", "d53e4f,fc8d59,fee08b,ffffbf,e6f598,99d594,3288bd", "d53e4f,f46d43,fdae61,fee08b,e6f598,abdda4,66c2a5,3288bd", "d53e4f,f46d43,fdae61,fee08b,ffffbf,e6f598,abdda4,66c2a5,3288bd", "9e0142,d53e4f,f46d43,fdae61,fee08b,e6f598,abdda4,66c2a5,3288bd,5e4fa2", "9e0142,d53e4f,f46d43,fdae61,fee08b,ffffbf,e6f598,abdda4,66c2a5,3288bd,5e4fa2"]
            }];
            this.colorsets_seq = [{
                "colorname": "Blues",
                "type": "seq",
                "colors": ["deebf7,3182bd", "deebf7,9ecae1,3182bd", "eff3ff,bdd7e7,6baed6,2171b5", "eff3ff,bdd7e7,6baed6,3182bd,08519c", "eff3ff,c6dbef,9ecae1,6baed6,3182bd,08519c", "eff3ff,c6dbef,9ecae1,6baed6,4292c6,2171b5,084594", "f7fbff,deebf7,c6dbef,9ecae1,6baed6,4292c6,2171b5,084594", "f7fbff,deebf7,c6dbef,9ecae1,6baed6,4292c6,2171b5,08519c,08306b"]
            }, {
                "colorname": "BuGn",
                "type": "seq",
                "colors": ["e5f5f9,2ca25f", "e5f5f9,99d8c9,2ca25f", "edf8fb,b2e2e2,66c2a4,238b45", "edf8fb,b2e2e2,66c2a4,2ca25f,006d2c", "edf8fb,ccece6,99d8c9,66c2a4,2ca25f,006d2c", "edf8fb,ccece6,99d8c9,66c2a4,41ae76,238b45,005824", "f7fcfd,e5f5f9,ccece6,99d8c9,66c2a4,41ae76,238b45,005824", "f7fcfd,e5f5f9,ccece6,99d8c9,66c2a4,41ae76,238b45,006d2c,00441b"]
            }, {
                "colorname": "BuPu",
                "type": "seq",
                "colors": ["e0ecf4,8856a7", "e0ecf4,9ebcda,8856a7", "edf8fb,b3cde3,8c96c6,88419d", "edf8fb,b3cde3,8c96c6,8856a7,810f7c", "edf8fb,bfd3e6,9ebcda,8c96c6,8856a7,810f7c", "edf8fb,bfd3e6,9ebcda,8c96c6,8c6bb1,88419d,6e016b", "f7fcfd,e0ecf4,bfd3e6,9ebcda,8c96c6,8c6bb1,88419d,6e016b", "f7fcfd,e0ecf4,bfd3e6,9ebcda,8c96c6,8c6bb1,88419d,810f7c,4d004b"]
            }, {
                "colorname": "GnBu",
                "type": "seq",
                "colors": ["e0f3db,43a2ca", "e0f3db,a8ddb5,43a2ca", "f0f9e8,bae4bc,7bccc4,2b8cbe", "f0f9e8,bae4bc,7bccc4,43a2ca,0868ac", "f0f9e8,ccebc5,a8ddb5,7bccc4,43a2ca,0868ac", "f0f9e8,ccebc5,a8ddb5,7bccc4,4eb3d3,2b8cbe,08589e", "f7fcf0,e0f3db,ccebc5,a8ddb5,7bccc4,4eb3d3,2b8cbe,08589e", "f7fcf0,e0f3db,ccebc5,a8ddb5,7bccc4,4eb3d3,2b8cbe,0868ac,084081"]
            }, {
                "colorname": "Greens",
                "type": "seq",
                "colors": ["e5f5e0,31a354", "e5f5e0,a1d99b,31a354", "edf8e9,bae4b3,74c476,238b45", "edf8e9,bae4b3,74c476,31a354,006d2c", "edf8e9,c7e9c0,a1d99b,74c476,31a354,006d2c", "edf8e9,c7e9c0,a1d99b,74c476,41ab5d,238b45,005a32", "f7fcf5,e5f5e0,c7e9c0,a1d99b,74c476,41ab5d,238b45,005a32", "f7fcf5,e5f5e0,c7e9c0,a1d99b,74c476,41ab5d,238b45,006d2c,00441b"]
            }, {
                "colorname": "Greys",
                "type": "seq",
                "colors": ["f0f0f0,636363", "f0f0f0,bdbdbd,636363", "f7f7f7,cccccc,969696,525252", "f7f7f7,cccccc,969696,636363,252525", "f7f7f7,d9d9d9,bdbdbd,969696,636363,252525", "f7f7f7,d9d9d9,bdbdbd,969696,737373,525252,252525", "ffffff,f0f0f0,d9d9d9,bdbdbd,969696,737373,525252,252525", "ffffff,f0f0f0,d9d9d9,bdbdbd,969696,737373,525252,252525,000000"]
            }, {
                "colorname": "Oranges",
                "type": "seq",
                "colors": ["fee6ce,e6550d", "fee6ce,fdae6b,e6550d", "feedde,fdbe85,fd8d3c,d94701", "feedde,fdbe85,fd8d3c,e6550d,a63603", "feedde,fdd0a2,fdae6b,fd8d3c,e6550d,a63603", "feedde,fdd0a2,fdae6b,fd8d3c,f16913,d94801,8c2d04", "fff5eb,fee6ce,fdd0a2,fdae6b,fd8d3c,f16913,d94801,8c2d04", "fff5eb,fee6ce,fdd0a2,fdae6b,fd8d3c,f16913,d94801,a63603,7f2704"]
            }, {
                "colorname": "OrRd",
                "type": "seq",
                "colors": ["fee8c8,e34a33", "fee8c8,fdbb84,e34a33", "fef0d9,fdcc8a,fc8d59,d7301f", "fef0d9,fdcc8a,fc8d59,e34a33,b30000", "fef0d9,fdd49e,fdbb84,fc8d59,e34a33,b30000", "fef0d9,fdd49e,fdbb84,fc8d59,ef6548,d7301f,990000", "fff7ec,fee8c8,fdd49e,fdbb84,fc8d59,ef6548,d7301f,990000", "fff7ec,fee8c8,fdd49e,fdbb84,fc8d59,ef6548,d7301f,b30000,7f0000"]
            }, {
                "colorname": "PuBu",
                "type": "seq",
                "colors": ["ece7f2,2b8cbe", "ece7f2,a6bddb,2b8cbe", "f1eef6,bdc9e1,74a9cf,0570b0", "f1eef6,bdc9e1,74a9cf,2b8cbe,045a8d", "f1eef6,d0d1e6,a6bddb,74a9cf,2b8cbe,045a8d", "f1eef6,d0d1e6,a6bddb,74a9cf,3690c0,0570b0,034e7b", "fff7fb,ece7f2,d0d1e6,a6bddb,74a9cf,3690c0,0570b0,034e7b", "fff7fb,ece7f2,d0d1e6,a6bddb,74a9cf,3690c0,0570b0,045a8d,023858"]
            }, {
                "colorname": "PuBuGn",
                "type": "seq",
                "colors": ["ece2f0,1c9099", "ece2f0,a6bddb,1c9099", "f6eff7,bdc9e1,67a9cf,02818a", "f6eff7,bdc9e1,67a9cf,1c9099,016c59", "f6eff7,d0d1e6,a6bddb,67a9cf,1c9099,016c59", "f6eff7,d0d1e6,a6bddb,67a9cf,3690c0,02818a,016450", "fff7fb,ece2f0,d0d1e6,a6bddb,67a9cf,3690c0,02818a,016450", "fff7fb,ece2f0,d0d1e6,a6bddb,67a9cf,3690c0,02818a,016c59,014636"]
            }, {
                "colorname": "PuRd",
                "type": "seq",
                "colors": ["e7e1ef,dd1c77", "e7e1ef,c994c7,dd1c77", "f1eef6,d7b5d8,df65b0,ce1256", "f1eef6,d7b5d8,df65b0,dd1c77,980043", "f1eef6,d4b9da,c994c7,df65b0,dd1c77,980043", "f1eef6,d4b9da,c994c7,df65b0,e7298a,ce1256,91003f", "f7f4f9,e7e1ef,d4b9da,c994c7,df65b0,e7298a,ce1256,91003f", "f7f4f9,e7e1ef,d4b9da,c994c7,df65b0,e7298a,ce1256,980043,67001f"]
            }, {
                "colorname": "Purples",
                "type": "seq",
                "colors": ["efedf5,756bb1", "efedf5,bcbddc,756bb1", "f2f0f7,cbc9e2,9e9ac8,6a51a3", "f2f0f7,cbc9e2,9e9ac8,756bb1,54278f", "f2f0f7,dadaeb,bcbddc,9e9ac8,756bb1,54278f", "f2f0f7,dadaeb,bcbddc,9e9ac8,807dba,6a51a3,4a1486", "fcfbfd,efedf5,dadaeb,bcbddc,9e9ac8,807dba,6a51a3,4a1486", "fcfbfd,efedf5,dadaeb,bcbddc,9e9ac8,807dba,6a51a3,54278f,3f007d"]
            }, {
                "colorname": "RdPu",
                "type": "seq",
                "colors": ["fde0dd,c51b8a", "fde0dd,fa9fb5,c51b8a", "feebe2,fbb4b9,f768a1,ae017e", "feebe2,fbb4b9,f768a1,c51b8a,7a0177", "feebe2,fcc5c0,fa9fb5,f768a1,c51b8a,7a0177", "feebe2,fcc5c0,fa9fb5,f768a1,dd3497,ae017e,7a0177", "fff7f3,fde0dd,fcc5c0,fa9fb5,f768a1,dd3497,ae017e,7a0177", "fff7f3,fde0dd,fcc5c0,fa9fb5,f768a1,dd3497,ae017e,7a0177,49006a"]
            }, {
                "colorname": "Reds",
                "type": "seq",
                "colors": ["fee0d2,de2d26", "fee0d2,fc9272,de2d26", "fee5d9,fcae91,fb6a4a,cb181d", "fee5d9,fcae91,fb6a4a,de2d26,a50f15", "fee5d9,fcbba1,fc9272,fb6a4a,de2d26,a50f15", "fee5d9,fcbba1,fc9272,fb6a4a,ef3b2c,cb181d,99000d", "fff5f0,fee0d2,fcbba1,fc9272,fb6a4a,ef3b2c,cb181d,99000d", "fff5f0,fee0d2,fcbba1,fc9272,fb6a4a,ef3b2c,cb181d,a50f15,67000d"]
            }, {
                "colorname": "YlGn",
                "type": "seq",
                "colors": ["f7fcb9,31a354", "f7fcb9,addd8e,31a354", "ffffcc,c2e699,78c679,238443", "ffffcc,c2e699,78c679,31a354,006837", "ffffcc,d9f0a3,addd8e,78c679,31a354,006837", "ffffcc,d9f0a3,addd8e,78c679,41ab5d,238443,005a32", "ffffe5,f7fcb9,d9f0a3,addd8e,78c679,41ab5d,238443,005a32", "ffffe5,f7fcb9,d9f0a3,addd8e,78c679,41ab5d,238443,006837,004529"]
            }, {
                "colorname": "YlGnBu",
                "type": "seq",
                "colors": ["edf8b1,2c7fb8", "edf8b1,7fcdbb,2c7fb8", "ffffcc,a1dab4,41b6c4,225ea8", "ffffcc,a1dab4,41b6c4,2c7fb8,253494", "ffffcc,c7e9b4,7fcdbb,41b6c4,2c7fb8,253494", "ffffcc,c7e9b4,7fcdbb,41b6c4,1d91c0,225ea8,0c2c84", "ffffd9,edf8b1,c7e9b4,7fcdbb,41b6c4,1d91c0,225ea8,0c2c84", "ffffd9,edf8b1,c7e9b4,7fcdbb,41b6c4,1d91c0,225ea8,253494,081d58"]
            }, {
                "colorname": "YlOrBr",
                "type": "seq",
                "colors": ["fff7bc,d95f0e", "fff7bc,fec44f,d95f0e", "ffffd4,fed98e,fe9929,cc4c02", "ffffd4,fed98e,fe9929,d95f0e,993404", "ffffd4,fee391,fec44f,fe9929,d95f0e,993404", "ffffd4,fee391,fec44f,fe9929,ec7014,cc4c02,8c2d04", "ffffe5,fff7bc,fee391,fec44f,fe9929,ec7014,cc4c02,8c2d04", "ffffe5,fff7bc,fee391,fec44f,fe9929,ec7014,cc4c02,993404,662506"]
            }, {
                "colorname": "YlOrRd",
                "type": "seq",
                "colors": ["ffeda0,f03b20", "ffeda0,feb24c,f03b20", "ffffb2,fecc5c,fd8d3c,e31a1c", "ffffb2,fecc5c,fd8d3c,f03b20,bd0026", "ffffb2,fed976,feb24c,fd8d3c,f03b20,bd0026", "ffffb2,fed976,feb24c,fd8d3c,fc4e2a,e31a1c,b10026", "ffffcc,ffeda0,fed976,feb24c,fd8d3c,fc4e2a,e31a1c,b10026", "ffffcc,ffeda0,fed976,feb24c,fd8d3c,fc4e2a,e31a1c,bd0026,800026"]
            }];

            this.colorsets_qual = [{
                "colorname": "Accent",
                "type": "qual",
                "colors": ["7fc97f,fdc086", "7fc97f,beaed4,fdc086", "7fc97f,beaed4,fdc086,ffff99", "7fc97f,beaed4,fdc086,ffff99,386cb0", "7fc97f,beaed4,fdc086,ffff99,386cb0,f0027f", "7fc97f,beaed4,fdc086,ffff99,386cb0,f0027f,bf5b17", "7fc97f,beaed4,fdc086,ffff99,386cb0,f0027f,bf5b17,666666"]
            }, {
                "colorname": "Dark2",
                "type": "qual",
                "colors": ["1b9e77,7570b3", "1b9e77,d95f02,7570b3", "1b9e77,d95f02,7570b3,e7298a", "1b9e77,d95f02,7570b3,e7298a,66a61e", "1b9e77,d95f02,7570b3,e7298a,66a61e,e6ab02", "1b9e77,d95f02,7570b3,e7298a,66a61e,e6ab02,a6761d", "1b9e77,d95f02,7570b3,e7298a,66a61e,e6ab02,a6761d,666666"]
            }, {
                "colorname": "Paired",
                "type": "qual",
                "colors": ["a6cee3,b2df8a", "a6cee3,1f78b4,b2df8a", "a6cee3,1f78b4,b2df8a,33a02c", "a6cee3,1f78b4,b2df8a,33a02c,fb9a99", "a6cee3,1f78b4,b2df8a,33a02c,fb9a99,e31a1c", "a6cee3,1f78b4,b2df8a,33a02c,fb9a99,e31a1c,fdbf6f", "a6cee3,1f78b4,b2df8a,33a02c,fb9a99,e31a1c,fdbf6f,ff7f00", "a6cee3,1f78b4,b2df8a,33a02c,fb9a99,e31a1c,fdbf6f,ff7f00,cab2d6", "a6cee3,1f78b4,b2df8a,33a02c,fb9a99,e31a1c,fdbf6f,ff7f00,cab2d6,6a3d9a", "a6cee3,1f78b4,b2df8a,33a02c,fb9a99,e31a1c,fdbf6f,ff7f00,cab2d6,6a3d9a,ffff99", "a6cee3,1f78b4,b2df8a,33a02c,fb9a99,e31a1c,fdbf6f,ff7f00,cab2d6,6a3d9a,ffff99,b15928"]
            }, {
                "colorname": "Pastel1",
                "type": "qual",
                "colors": ["bb4ae,ccebc5", "bb4ae,b3cde3,ccebc5", "fbb4ae,b3cde3,ccebc5,decbe4", "fbb4ae,b3cde3,ccebc5,decbe4,fed9a6", "fbb4ae,b3cde3,ccebc5,decbe4,fed9a6,ffffcc", "fbb4ae,b3cde3,ccebc5,decbe4,fed9a6,ffffcc,e5d8bd", "fbb4ae,b3cde3,ccebc5,decbe4,fed9a6,ffffcc,e5d8bd,fddaec", "fbb4ae,b3cde3,ccebc5,decbe4,fed9a6,ffffcc,e5d8bd,fddaec,f2f2f2"]
            }, {
                "colorname": "Pastel2",
                "type": "qual",
                "colors": ["b3e2cd,cbd5e8", "b3e2cd,fdcdac,cbd5e8", "b3e2cd,fdcdac,cbd5e8,f4cae4", "b3e2cd,fdcdac,cbd5e8,f4cae4,e6f5c9", "b3e2cd,fdcdac,cbd5e8,f4cae4,e6f5c9,fff2ae", "b3e2cd,fdcdac,cbd5e8,f4cae4,e6f5c9,fff2ae,f1e2cc", "b3e2cd,fdcdac,cbd5e8,f4cae4,e6f5c9,fff2ae,f1e2cc,cccccc"]
            }, {
                "colorname": "Set1",
                "type": "qual",
                "colors": ["e41a1c,4daf4a", "e41a1c,377eb8,4daf4a", "e41a1c,377eb8,4daf4a,984ea3", "e41a1c,377eb8,4daf4a,984ea3,ff7f00", "e41a1c,377eb8,4daf4a,984ea3,ff7f00,ffff33", "e41a1c,377eb8,4daf4a,984ea3,ff7f00,ffff33,a65628", "e41a1c,377eb8,4daf4a,984ea3,ff7f00,ffff33,a65628,f781bf", "e41a1c,377eb8,4daf4a,984ea3,ff7f00,ffff33,a65628,f781bf,999999"]
            }, {
                "colorname": "Set2",
                "type": "qual",
                "colors": ["66c2a5,8da0cb", "66c2a5,fc8d62,8da0cb", "66c2a5,fc8d62,8da0cb,e78ac3", "66c2a5,fc8d62,8da0cb,e78ac3,a6d854", "66c2a5,fc8d62,8da0cb,e78ac3,a6d854,ffd92f", "66c2a5,fc8d62,8da0cb,e78ac3,a6d854,ffd92f,e5c494", "66c2a5,fc8d62,8da0cb,e78ac3,a6d854,ffd92f,e5c494,b3b3b3"]
            }, {
                "colorname": "Set3",
                "type": "qual",
                "colors": ["8dd3c7,bebada", "8dd3c7,ffffb3,bebada", "8dd3c7,ffffb3,bebada,fb8072", "8dd3c7,ffffb3,bebada,fb8072,80b1d3", "8dd3c7,ffffb3,bebada,fb8072,80b1d3,fdb462", "8dd3c7,ffffb3,bebada,fb8072,80b1d3,fdb462,b3de69", "8dd3c7,ffffb3,bebada,fb8072,80b1d3,fdb462,b3de69,fccde5", "8dd3c7,ffffb3,bebada,fb8072,80b1d3,fdb462,b3de69,fccde5,d9d9d9", "8dd3c7,ffffb3,bebada,fb8072,80b1d3,fdb462,b3de69,fccde5,d9d9d9,bc80bd", "8dd3c7,ffffb3,bebada,fb8072,80b1d3,fdb462,b3de69,fccde5,d9d9d9,bc80bd,ccebc5", "8dd3c7,ffffb3,bebada,fb8072,80b1d3,fdb462,b3de69,fccde5,d9d9d9,bc80bd,ccebc5,ffed6f"]
            }];

        },
        /**
         * @method  _getColors
         * Get current color theme class
         * @param {String}  selected theme (qual, seq, or div)
         * @param {Integer} colorindex is index to the color set
         * @param {Integer} classind is class# in color set
         * @private
         */
        _getColors: function (colorset, colorindex, classind) {
            var colors = null;
            if (colorset === 'div') {
                colors = this.colorsets_div[colorindex].colors[classind];
            } else if (colorset === 'qual') {
                colors = this.colorsets_qual[colorindex].colors[classind];
            } else {
                colors = this.colorsets_seq[colorindex].colors[classind];
            }
            return colors;
        },

        /**
         * @method  visibilyOn
         * Classify dialog visibility on
         
         * @private
         */
        _visibilityOn: function () {
            this.element.show();
        },
        /**
         * @method  visibilyOff
         * Classify dialog off
         
         * @private
         */
        _visibilityOff: function () {
            this.element.hide();
        },
        /**
         * @method  _createColorDialog
         * Creates color theme and color set select dialog
         * @private
         */
        _createColorDialog: function () {
            //Main dialog
            var me = this;
            if (me.dialog) {
                me.dialog.close(true);
                me.dialog = null;
                return;
            }
            me.dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

            me.content = me.templateContent.clone();

            // Content HTML / Color set select HTML

            var colorset_sotka = jQuery('<div class="colorset_sotka"><br>' + this._locale.colorset.setselection + '<br><select id="colo_set"></select><br></div>');
            me.content.append(colorset_sotka);
            var sel = colorset_sotka.find('select'),
                opt = jQuery('<option value="' + "seq" + '">' + this._locale.colorset.sequential + '</option>');
            sel.append(opt);
            opt = jQuery('<option value="' + "qual" + '">' + this._locale.colorset.qualitative + '</option>');
            sel.append(opt);
            opt = jQuery('<option value="' + "div" + '">' + this._locale.colorset.divergent + '</option>');
            sel.append(opt);
            sel.change(function (e) {
                // Change color table
                me._colorTableChanged();
            });
            sel.attr('value', me.currentColorSet);
            me.content.append(sel);
            var instructions2 = me.templateInstructions2.clone();
            instructions2.append(this._locale.colorset.info2);
            me.content.append(instructions2);

            // Add color table

            me.content.append(me._createColorTable());

            // Set background color for current selected colors
            me._hiliSelectedColors();

            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(this._locale.colorset.cancel);
            cancelBtn.addClass('primary');
            cancelBtn.setHandler(function () {
                me.dialog.close(true);
                me.dialog = null;
            });

            me.dialog.addClass('tools_selection');
            me.dialog.show(this._locale.colorset.themeselection, me.content, [cancelBtn]);
            //dialog.moveTo('#toolbar div.toolrow[tbgroup=default-selectiontools]', 'top');
        },
        /**
         * @method  _createColorTable
         * Creates a color table for color selection
         * @private
         */
        _createColorTable: function () {
            var me = this,
                table = jQuery('<table class="colo_table1"></table>'),
                rows = 5,
                curcolset = null,
                colorindex = 3;
            // Use 4th color value set in the grid
            if (me.currentColorSet === 'div') {
                rows = this.colorsets_div.length;
                curcolset = me.colorsets_div;
            } else if (me.currentColorSet === 'qual') {
                rows = me.colorsets_qual.length;
                curcolset = this.colorsets_qual;
            } else {
                rows = me.colorsets_seq.length;
                curcolset = me.colorsets_seq;
            }

            var columns = 5,
                colorCount = 0,
                tableBody = jQuery('<tbody></tbody>'),
                i,
                row,
                curcolors,
                colorArr,
                tableCellTemplate,
                j,
                tableCell,
                rowClick = function (event) {
                    var colorIndex = jQuery(this).attr('data-colorIdx');
                    me._selectedColors(colorIndex);
                },
                rowMouseOut = function (event) {
                    jQuery(this).removeClass("hover");

                },
                rowMouseOver = function (event) {
                    if (!jQuery(this).hasClass("selected")) {
                        jQuery(this).addClass("hover");
                    }
                };

            for (i = 0; i < rows; i++) {
                row = jQuery('<td></td>');
                row.attr('data-colorIdx', i);
                curcolors = curcolset[i].colors[colorindex];
                colorArr = curcolors.split(",");
                tableCellTemplate = jQuery('<div></div>');
                //var tableCellTemplate = jQuery('<div style="display: inline-block;">  </div>');
                for (j = 0; j < columns; j++) {
                    tableCell = tableCellTemplate.clone();
                    tableCell.css('background-color', '#' + colorArr[j]);
                    row.append(tableCell);

                }

                // Mouse events
                row.mouseover(rowMouseOver);
                row.mouseout(rowMouseOut);

                // For selected colors
                row.click(rowClick);

                // Zoom color table section in Hover
                // me._hoverZoomColorTable(row);

                tableBody.append(row);

            }

            table.append(tableBody);

            return table;
        },
        /**
         * @method  _selectedColors
         * Changes the setup of current color range in current color theme
         * @param {Object} event  (jq click event)
         * @private
         */
        _selectedColors: function (colorsetIndex) {
            var me = this;
            //var inds = event.currentTarget.id.split('_');

            me.colorsetIndex = colorsetIndex;
            //me.dialog.close(false);
            me._hiliSelectedColors();

            // Selected colorset
            me.currentColorSet = me.content.find('select#colo_set').val();
            me.classifyData();
        },
        /**
         * @method  _hiliSelectedColors
         * Put background color for current color range in the color dialog
         * @private
         */
        _hiliSelectedColors: function () {
            var me = this;
            // Set background color for selected colors
            if (me.content) {
                // clean old ones
                var rows = 0;
                if (me.currentColorSet === 'div') {
                    rows = me.colorsets_div.length;

                } else if (me.currentColorSet === 'qual') {
                    rows = me.colorsets_qual.length;

                } else {
                    rows = me.colorsets_seq.length;

                }

                me.content.find('td').removeClass("selected");
                me.content.find('td[data-colorIdx=' + me.colorsetIndex.toString() + ']').addClass("selected");
            }
        },
        /**
         * @method  _hoverZoomColorTable
         * Zoom in  the color table section in hover
         * @param {object} row color table section to zoom in
         * @private
         */
        _hoverZoomColorTable: function (row) {

            var pic = row.clone();
            // zoom in color table
            pic.find('div').width("18px");
            var tabletemp = jQuery('<table class="table_temp"></table>'),
                bodytemp = jQuery('<tbody></tbody>');
            bodytemp.append(pic);
            tabletemp.append(bodytemp);
            var popu = jQuery('<div id="pop-up_06052013">  </div>');
            popu.append(tabletemp);
            row.append(popu);
            popu.hide();

            row.hover(function () {

                jQuery(this).find('div#pop-up_06052013').fadeIn('slow');

            }, function () {

                jQuery(this).find('div#pop-up_06052013').fadeOut('slow');

            });

        },

        /**
         * @method  _colorTableChanged
         * Change the color theme class in color dialog
         * Check new limits for class count slider
         * Creates a new color table for current color theme
         * @private
         */
        _colorTableChanged: function () {
            var me = this;
            if (!me.content) {
                return;
            }

            me.currentColorSet = me.content.find('select#colo_set').val();

            // Remove old
            me.content.find('.colo_table1').remove();

            // Add new color table

            var table = me._createColorTable();

            // Slider limit fix according to color theme color range nums
            var rows = 5,
                cl_min = 2,
                cl_max = 9;
            // Use 4th color value set in the grid
            if (me.currentColorSet === 'div') {
                rows = this.colorsets_div.length;
                cl_max = 11;
            } else if (me.currentColorSet === 'qual') {
                rows = me.colorsets_qual.length;
                cl_max = 8;
            } else {
                rows = me.colorsets_seq.length;

            }

            // Colors sets are no equal size - check overflow
            if (me.colorsetIndex > rows) {
                me.colorsetIndex = rows - 1;
            }

            // Set Slider
            var curcla = Number(me.element.find('.classificationMethod').find('.classCount').find('#amount_class').val());
            if (curcla > cl_max) {
                curcla = cl_max;
                me.element.find('.classificationMethod').find('.classCount').find('#amount_class').attr("value", cl_max);
            }
            var classcnt = me.element.find('.classificationMethod').find('.classCount');
            classcnt.find('#slider-range-max').remove();
            var newslider = jQuery('<div id="slider-range-max"></div>');
            classcnt.append(newslider);
            var slider = classcnt.find('#slider-range-max').slider({
                range: "min",
                min: cl_min,
                max: cl_max,
                value: curcla,
                slide: function (event, ui) {
                    jQuery('input#amount_class').val(ui.value);
                    jQuery(this).slider('option', 'value', ui.value);
                    // Classify again
                    me.classifyData();
                }
            });

            me.content.find('.instructions2').append(table);

            // Set background color for selected colors
            me._hiliSelectedColors();

        },

        /**
         * Classifies data with colors flipped.
         *
         * @method _flipCurrentColors
         * @private
         */
        _flipCurrentColors: function () {
            this.colorsFlipped = this.colorsFlipped ? false : true;
            this.classifyData();
        },

        /**
         * Classification slider should only work if some rules apply
         *
         * @method _adjustClassificationSlider
         * @private
         * @param checkedItemsCount tells if there are enough items selected
         */
        _adjustClassificationSlider: function (checkedItemsCount) {

            // classifyPlugin can't slide more than there are municipalities
            var slider = jQuery('#slider-range-max'),
                selectedVal = slider.slider('option', 'value'),
                sliderSettings = this._checkClassCount(checkedItemsCount),
                max = sliderSettings.max;
            selectedVal = sliderSettings.val;

            slider.slider('option', 'min', 2);
            slider.slider('option', 'max', max);
            slider.slider('option', 'value', selectedVal);

            //
            if (max < 3) {
                slider.slider("option", "disabled", true);
            } else {
                slider.slider("option", "disabled", false);
            }
            jQuery('input#amount_class').val(selectedVal);
            return slider;
        },

        /**
         * @method _checkClassCount
         * @private
         *
         * Check class count and limits.
         */
        _checkClassCount: function (checkedItemsCount) {
            var max = checkedItemsCount < this.maxClassNum ? checkedItemsCount > 2 ? checkedItemsCount : 3 : this.maxClassNum;
            max--;
            var selectedVal = max > selectedVal ? selectedVal > 2 ? selectedVal : 2 : max;
            return {
                'min': 2,
                'max': max,
                'value': selectedVal
            };
        },

        /**
         * @method _loadStateVariables
         * @private
         *
         * Set state of classification options to correct one.
         */
        _loadStateVariables: function () {
            var me = this,
                state = this._state;
            if (state.colors) {
                me.currentColorSet = state.colors.set;
                me.colorsetIndex = state.colors.index;
                me.colorsFlipped = state.colors.flipped;
            }
            // if user is not able to set different classification options
            // there is no need to set them to state
            if (me._state.allowClassification !== false) {
                // distinct, discontinuous etc.
                if (state.classificationMode) {
                    var modeSelect = me.element.find('.classification-mode');
                    modeSelect.val(state.classificationMode);
                }
                // jenks, quantiles, eq interval, manual breaks
                if (state.methodId !== null && state.methodId !== undefined && state.methodId > 0) {
                    var select = me.element.find('.classificationMethod').find('.method');
                    select.val(state.methodId);
                    // The manual breaks method:
                    if (state.methodId == 4 && state.manualBreaksInput) {
                        var manualInput = me.element.find('.manualBreaks').find('input[name=breaksInput]');
                        manualInput.val(state.manualBreaksInput);
                        me.element.find('.countSlider').hide();
                        me.element.find('.manualBreaks').show();
                    }
                }
                // how many different groups there will be
                if (state.numberOfClasses !== null && state.numberOfClasses !== undefined &&
                    state.numberOfClasses > 0) {

                    var slider = me.rangeSlider;
                    if (slider !== null && slider !== undefined) {
                        slider.slider("value", state.numberOfClasses);
                        slider.parent().find('input#amount_class').val(state.numberOfClasses);
                    }
                }
            }
        },

        /**
         * @method showClassificationOptions
         *
         * Show classification options if allowed.
         * i.e. draw UI and send request to geostat
         */
        showClassificationOptions: function (isAllowed) {
            this._state.allowClassification = isAllowed;
            this.resetUI();
            this.classifyData();
            this._visibilityOn();
        }

    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });
