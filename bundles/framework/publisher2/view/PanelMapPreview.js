/**
 * @class Oskari.mapframework.bundle.publisher2.view.PanelMapPreview
 *
 * Represents the basic info (name, domain, language) view for the publisher
 * as an Oskari.userinterface.component.AccordionPanel
 */
Oskari.clazz.define('Oskari.mapframework.bundle.publisher2.view.PanelMapPreview',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} sandbox
     * @param {Object} mapmodule
     * @param {Object} localization
     *       publisher localization data
     * @param {Oskari.mapframework.bundle.publisher2.insatnce} instance the instance
     */
    function (sandbox, mapmodule, localization, instance, tools) {
        var me = this;
        me.loc = localization;
        me.instance = instance;
        me.sandbox = sandbox;
        me.mapmodule = mapmodule;
        me.sizeOptions = [{
            id: 'fill',
            width: '',
            height: '',
            selected: true
        }, {
            id: 'small',
            width: 580,
            height: 387
        }, {
            id: 'medium',
            width: 700,
            height: 600,
            // default option
            selected: true
        }, {
            id: 'large',
            width: 1240,
            height: 700
        }, {
            id: 'custom',
            minWidth: 30,
            minHeight: 20,
            maxWidth: 4000,
            maxHeight: 2000
        }];

        me.selected =  me.sizeOptions.filter(function (option) {
            return option.selected;
        })[0];

        this.tools = tools;

        me.panel = null;
        me.modeChangedCB = null;
        this.templates = {
            help: jQuery('<div class="help icon-info"></div>')
        };
    }, {
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
            MapSizeChangedEvent: function(){
                //update map / container size but prevent a new mapsizechanged request from being sent
                this.updateMapSize();
            }
        },
        getName: function() {
            return "Oskari.mapframework.bundle.publisher2.view.PanelMapPreview";
        },
        /**
         * @public @method updateMapSize
         * Adjusts the map size according to publisher selection
         *
         */
        updateMapSize: function () {
            if(!this.panel) {
                return;
            }
            var me = this,
                size = me._getSelectedMapSize(),
                customsize = me.panel.getContainer().find('.customsize'),
                widthInput = customsize.find('input[name=width]'),
                heightInput = customsize.find('input[name=height]');

            if (size.option.id === 'custom') {
                customsize.prop('disabled', false);
                widthInput.prop('disabled', false);
                heightInput.prop('disabled', false);
                // Only custom option can have invalid values
                widthInput.toggleClass('error', !size.validWidth);
                heightInput.toggleClass('error', !size.validHeight);
            } else {
                customsize.prop('disabled', true);
                widthInput.prop('disabled', true);
                heightInput.prop('disabled', true);
                // Update selected size to custom size fields, it's a decent
                // starting point and it avoids error states...
                if (!isNaN(size.width) && typeof size.width === 'number') {
                    widthInput.val(size.width);
                    widthInput.removeClass('error');
                }
                if (!isNaN(size.height) && typeof size.height === 'number') {
                    heightInput.val(size.height);
                    heightInput.removeClass('error');
                }
            }

            if (size.valid) {
                // Adjust map sizes
                me._adjustDataContainer();
            }
        },

        /**
         * @private @method _getActiveMapSize
         * Returns an object containing the active map size.
         * This will differ from selected size if selected size is invalid.
         *
         * @return {Object} size
         */
        _getActiveMapSize: function () {
            var mapDiv = this.mapmodule.getMapEl(),
                width = mapDiv.width(),
                height = mapDiv.height();

            return {
                width: width,
                height: height
            };
        },

        /**
         * @private @method _calculateLeftComponentsWidth
         * Calculates a sensible width for components on the left panel (but doesn't set it...)
         */
        _calculateLeftComponentsWidth: function () {
            var toolsWidth = 0;
            this.tools.forEach(function(tool) {
                toolsWidth = toolsWidth + (tool.getAdditionalSize().width || 0);
            });
            // Width, but 400 at most.
            return Math.min(toolsWidth, 400);
        },

        /**
         * @private @method _adjustDataContainer
         * This horrific thing is what sets the left panel components, container and map size.
         */
        _adjustDataContainer: function () {
            var me = this,
                selectedSize = me._getSelectedMapSize(),
                size = selectedSize.valid ? selectedSize : me._getActiveMapSize(),
                content = jQuery('#contentMap'),
                container = content.find('.row-fluid'),
                dataContainer = container.find('.oskariui-left'),
                mapContainer = container.find('.oskariui-center'),
                mapDiv = me.mapmodule.getMapEl(),
                mapWidth,
                mapHeight,
                totalWidth = size.width,
                totalHeight = size.height,
                leftPanelWidth = me._calculateLeftComponentsWidth(),
                hasLeftComps = leftPanelWidth > 0;

            if (totalWidth === null || totalWidth === undefined || totalWidth === '') {
                if(!container.length) {
                    // check if we actually have .row-fluid structure, fallback to mapmodule as container
                    container = me.mapmodule.getMapEl();
                }
                // Ugly hack, container has a nasty habit of overflowing the viewport...
                totalWidth = jQuery(window).width() - container.offset().left;
            }
            if (totalHeight === null || totalHeight === undefined || totalHeight === '') {
                totalHeight = jQuery(window).height();
            }

            if (hasLeftComps) {
                dataContainer.removeClass('oskari-closed');
            } else {
                dataContainer.addClass('oskari-closed');
            }

            mapWidth = (totalWidth - leftPanelWidth) + 'px';
            mapHeight = totalHeight + 'px';
            leftPanelWidth = leftPanelWidth + 'px';
            dataContainer.css({
                'width': leftPanelWidth,
                'height': totalHeight
            });
            if (hasLeftComps) {
                // this is usually statsgrid
                dataContainer.children().height(mapHeight);
            }
            mapContainer.css({
                'width': mapWidth,
                'height': mapHeight
            });

            mapDiv.width(mapWidth);
            mapDiv.height(mapHeight);

            // notify map module that size has changed
            me._updateMapModuleSize();
        },

        /**
        * @private @method _updateMapModuleSize
        * Update map size
        */
        _updateMapModuleSize: function () {

            //turn off event handlers in order to avoid consecutive calls to mapsizechanged
            this._unregisterEventHandlers();
            var me = this;
            if (me.sandbox.hasHandler('MapFull.MapSizeUpdateRequest')) {
                me.sandbox.request(me.instance, Oskari.requestBuilder('MapFull.MapSizeUpdateRequest')());
            }

            me._updateMapMode();

            //turn event handlers back on.
            this._registerEventHandlers();
        },

        /**
        * @private @method _updateMapMode
        * Update map mode
        */
        _updateMapMode: function () {
            var me = this,
                size = me._getSelectedMapSize();

            if (me.modeChangedCB) {
                me.modeChangedCB(size.option.id);
            }
        },
        /**
         * @private @method _getSelectedMapSize
         * Returns an object containing the user seleted/set map size and the corresponding size option
         *
         * @return {Object} size
         */
        _getSelectedMapSize: function () {
            var me = this,
                option = me.sizeOptions.filter(function (el) {
                    return el.selected;
                })[0],
                width = option.width,
                height = option.height,
                validWidth = true,
                validHeight = true;

            if (option.id === 'custom') {
                var customsize = me.panel.getContainer().find('.customsize'),
                    widthInput = customsize.find('input[name=width]'),
                    heightInput = customsize.find('input[name=height]');

                width = parseInt(widthInput.val(), 10);
                height = parseInt(heightInput.val(), 10);
                validWidth = Oskari.util.isNumber(widthInput.val()) && me._validateNumberRange(width, option.minWidth, option.maxWidth);
                validHeight = Oskari.util.isNumber(heightInput.val()) && me._validateNumberRange(height, option.minHeight, option.maxHeight);
            }

            return {
                valid: validWidth && validHeight,
                width: width,
                validWidth: validWidth,
                height: height,
                validHeight: validHeight,
                option: option
            };
        },
        /**
         * @private @method _validateNumberRange
         * Validates number in range
         *
         * @param {Object} value number to validate
         * @param {Number} min min value
         * @param {Number} max max value
         *
         * @return {Boolean} Number validity
         */
        _validateNumberRange: function (value, min, max) {
            var ret = true;
            // FIXME : use Oskari.util.???
            if (isNaN(parseInt(value, 10))) {
                ret = false;
            } else if (!isFinite(value)) {
                ret = false;
            } else if (value < min || value > max) {
                ret = false;
            }
            return ret;
        },

        /**
         * Creates the set of Oskari.userinterface.component.FormInput to be shown on the panel and
         * sets up validation etc. Prepopulates the form fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data
         * @param {Object} modeChangedCB mode changed callback
         */
        init: function (pData, modeChangedCB) {
            var me = this,
                fkey,
                data,
                field,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
                contentPanel = panel.getContainer(),
                tooltipCont = me.templates.help.clone();

            me.modeChangedCB = modeChangedCB;

            //initial mode selection if modify.
            if (pData && pData.metadata && pData.metadata.preview) {

                var selectedOptions = me.sizeOptions.filter(function (option) {
                    return (option.id === pData.metadata.preview);
                });
                if (selectedOptions && selectedOptions.length) {
                    me.selected = selectedOptions[0];
                    if (me.selected.id === 'custom' && pData.metadata.size) {
                        me.selected.width = pData.metadata.size.width;
                        me.selected.height = pData.metadata.size.height;
                    }
                }
            }

            //initialise fields only after it's certain which option is selected (new / modify)
            me.fields = {
                size: {
                    clazz: 'Oskari.userinterface.component.RadioButtonGroup',
                    handler: function(value){
                        me.sizeOptions.forEach(function (option) {
                            option.selected = option.id === value;
                        });
                        me.updateMapSize();
                    },
                    options: me.sizeOptions.map(function (option) {
                        var title = me.loc.sizes[option.id];
                        if ('custom' !== option.id && 'fill' !== option.id) {
                            title = me._getSizeLabel(title, option);
                        }

                        return {
                            title: title,
                            value: option.id
                        };
                    }),
                    value: me.selected.id
                }
            };



            for (fkey in me.fields) {
                if (me.fields.hasOwnProperty(fkey)) {
                    data = me.fields[fkey];
                    field = Oskari.clazz.create(data.clazz);
                    field.setName(fkey);
                    if(data.options) {
                        field.setOptions(data.options);
                    }
                    if(data.handler) {
                        field.setHandler(data.handler);
                    }
                    if(data.placeholder && typeof field.setPlaceHolder === 'function'){
                        field.setPlaceHolder(data.placeholder);
                    }
                    if(data.value){
                        field.setValue(data.value);
                    }
                    data.field = field;
                }
            }
            panel.setTitle(me.loc.size.label);
            tooltipCont.attr('title', me.loc.size.tooltip);
            contentPanel.append(tooltipCont);

            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    data.field.insertTo(contentPanel);
                }
            }

            me._createCustomSizes(contentPanel);


            me.panel = panel;
            me.updateMapSize();

            me._registerEventHandlers();
        },
        _registerEventHandlers: function() {
            var me = this;
            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.registerForEventByName(me, p);
                }
            }
        },
        _unregisterEventHandlers: function() {
            var me = this;
            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.unregisterFromEventByName(me, p);
                }
            }
        },
        _createCustomSizes: function(contentPanel) {
            var me = this,
                customSizes = document.createElement('fieldset'),
                widthInput = Oskari.clazz.create(
                    'Oskari.userinterface.component.TextInput'
                ),
                heightInput = Oskari.clazz.create(
                    'Oskari.userinterface.component.TextInput'
                ),
                selectedOption = me.sizeOptions.filter(function (option) {
                    return option.selected;
                })[0];

            widthInput.setName('width');
            widthInput.setPlaceholder(me.loc.sizes.width);
            widthInput.setValue(selectedOption.width);
            widthInput.setHandler(function () {
                me.updateMapSize();
            });
            widthInput.insertTo(customSizes);
            customSizes.appendChild(
                document.createTextNode(me.loc.sizes.separator)
            );

            heightInput.setName('height');
            heightInput.setPlaceholder(me.loc.sizes.height);
            heightInput.setValue(selectedOption.height);
            heightInput.setHandler(function () {
                me.updateMapSize();
            });
            heightInput.insertTo(customSizes);

            customSizes.className = 'customsize';
            contentPanel.append(customSizes);

        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            var me = this;
            return me.panel;
        },

        /**
         * Returns the selections the user has done with the form inputs.
         * {
         *     domain : <domain field value>,
         *     name : <name field value>,
         *     language : <language user selected>
         * }
         *
         * @method getValues
         * @return {Object}
         */
        getValues: function () {
            var me = this,
                values = {},
                selected = me._getSelectedMapSize(),
                size = isNaN(parseInt(selected.width)) || isNaN(parseInt(selected.height)) ? undefined : {
                    width: selected.width,
                    height: selected.height
                };

            values = {
                metadata: {
                    preview: selected.option.id,
                    size: size

                }
            };

            return values;
        },
        validate: function() {
            var errors = [];
            if (!this._getSelectedMapSize().valid) {
                errors.push({
                    field: 'size',
                    error: this.loc.error.size
                });
            }
            return errors;
        },

        /**
        * Stop panel.
        * @method stop
        * @public
        **/
        stop: function() {
            var me = this;
            var mapElement = me.mapmodule.getMapEl();
            // reset size as it's always set on init
            mapElement.width('');
            mapElement.height(jQuery(window).height());

            me._unregisterEventHandlers();

            // FIXME: timing issue?
            window.setTimeout(function() {
                var reqBuilder = Oskari.requestBuilder('MapFull.MapSizeUpdateRequest');
                // notify openlayers that size has changed
                if (reqBuilder) {
                    me.sandbox.request(me.instance, reqBuilder());
                }
            }, 200);
        },
        /**
         * Gets the label text for a size option. It changes based on grid visibility.
         *
         * @method _getSizeLabel
         * @private
         */
        _getSizeLabel: function (label, option) {
            return (label + ' (' + option.width + ' x ' + option.height + 'px)');
        }
    });