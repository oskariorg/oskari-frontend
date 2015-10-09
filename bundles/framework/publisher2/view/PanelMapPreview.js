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
    function (sandbox, mapmodule, localization, instance) {
        var me = this;
        me.loc = localization;
        me.instance = instance;
        me.sandbox = sandbox;
        me.mapmodule = mapmodule;
        me.sizeOptions = [{
            id: 'mobile',
            width: 580,
            height: 387
        }, {
            id: 'desktop',
            width: '',
            height: '',
            selected: true
        }];

        me.selected =  me.sizeOptions.filter(function (option) {
            return option.selected;
        })[0];

        me.panel = null;
        me.modeChangedCB = null;
        this.templates = {
            help: jQuery('<div class="help icon-info"></div>')
        };
    }, {
        /**
         * @public @method updateMapSize
         * Adjusts the map size according to publisher selection
         *
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
         * @private @method _calculateGridWidth
         * Calculates a sensible width for statsgrid (but doesn't set it...)
         */
        _calculateGridWidth: function () {
            var sandbox = Oskari.getSandbox('sandbox'),
                columns,
                width = 160;
            // TODO: do not reference statsgrid directly...
            // perhaps save indicators to a service that can be referenced or something
            // get state of statsgrid
            var statsGrid = sandbox.getStatefulComponents().statsgrid;

            if (statsGrid &&
                statsGrid.state &&
                statsGrid.state.indicators !== null &&
                statsGrid.state.indicators !== undefined) {

                //indicators + municipality (name & code)
                columns = statsGrid.state.indicators.length + 2;
                //slickgrid column width is 80 by default
                width = columns * 80;
            }
            // Width + scroll bar width, but 400 at most.
            return Math.min((width + 20), 400);
        },

        /**
         * @private @method _adjustDataContainer
         * This horrific thing is what sets the statsgrid, container and map size.
         */
        _adjustDataContainer: function () {
            var me = this,
                selectedSize = me._getSelectedMapSize(),
                size = selectedSize.valid ? selectedSize : me._getActiveMapSize(),
                content = jQuery('#contentMap'),
                container = content.find('.row-fluid'),
                dataContainer = container.find('.oskariui-left'),
                gridWidth = me._calculateGridWidth(),
                gridHeight = 0,
                mapContainer = container.find('.oskariui-center'),
                mapDiv = me.mapmodule.getMapEl(),
                mapWidth,
                mapHeight,
                totalWidth = size.width,
                totalHeight = size.height,
                statsContainer = jQuery('.publishedgrid');

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

            dataContainer.toggleClass('oskari-closed', !me.isDataVisible);

            if (statsContainer.length>0) {
                dataContainer.removeClass('oskari-closed');
                gridHeight = totalHeight;
            } else {
                dataContainer.addClass('oskari-closed');
                gridWidth = 0;
            }

            mapWidth = (totalWidth - gridWidth) + 'px';
            mapHeight = totalHeight + 'px';
            gridWidth = gridWidth + 'px';
            gridHeight = gridHeight + 'px';

            dataContainer.css({
                'width': gridWidth,
                'height': gridHeight,
                'float': 'left'
            }).addClass('published-grid-left');

            mapContainer.css({
                'width': mapWidth,
                'height': mapHeight,
                'float': 'left'
            }).addClass('published-grid-center');

            mapDiv.width(mapWidth);
            mapDiv.height(mapHeight);

            if (statsContainer.length>0) {
                statsContainer.height(mapHeight);
            }

            // TODO grid plugin?
            if (me.gridPlugin) {
                me.gridPlugin.setGridHeight();
            }
            // notify map module that size has changed
            me._updateMapModuleSize();
        },

        /**
        * @private @method _updateMapModuleSize
        * Update map size
        */
        _updateMapModuleSize: function () {
            var me = this,
                reqBuilder = me.sandbox.getRequestBuilder(
                    'MapFull.MapSizeUpdateRequest'
                );
            if (reqBuilder) {
                me.sandbox.request(me.instance, reqBuilder());
            }

            me._updateMapMode();
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
                tooltipCont = me.templates.help.clone(),
                customSizes = document.createElement('fieldset'),
                firstCustomSizeAdded = false;

            me.modeChangedCB = modeChangedCB;

            //initial mode selection if modify.
            if (pData && pData.metadata && pData.metadata.preview) {
                me.selected =  me.sizeOptions.filter(function (option) {
                    return (option.id === pData.metadata.preview);
                })[0];
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
            customSizes.className = 'customsize';

            for (fkey in this.fields) {
                if (this.fields.hasOwnProperty(fkey)) {
                    data = this.fields[fkey];
                    if(fkey !== 'size') {
                        if(firstCustomSizeAdded === true){
                            customSizes.appendChild(
                                document.createTextNode(me.loc.sizes.separator)
                            );
                        } else {
                            firstCustomSizeAdded = true;
                        }
                        data.field.insertTo(customSizes);
                    } else {
                        data.field.insertTo(contentPanel);
                    }
                }
            }
            contentPanel.append(customSizes);
            me.panel = panel;
            me.updateMapSize();
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
                selected = me._getSelectedMapSize();

            values = {
                metadata: {
                    preview: selected.option.id
                }
            };

            return values;
        },

        /**
        * Stop panel.
        * @method stop
        * @public
        **/
        stop: function(){
            var me = this,
                mapModule = me.sandbox.findRegisteredModuleInstance('MainMapModule'),
                mapElement = jQuery(mapModule.getMap().div),
                reqBuilder = me.sandbox.getRequestBuilder(
                    'MapFull.MapSizeUpdateRequest'
                );

            mapElement.width('');
            mapElement.height(jQuery(window).height());

            // FIXME: timing issue?
            window.setTimeout(function(){
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