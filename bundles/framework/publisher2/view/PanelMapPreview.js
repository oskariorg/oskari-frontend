import React from 'react';
import ReactDOM from 'react-dom';
import { CUSTOM_MAP_SIZE_ID, MapPreviewForm } from './form/MapPreviewForm';
import { ThemeProvider } from 'oskari-ui/util';

const MAP_SIZE_FILL_ID = 'fill';
const MAP_SIZES = [{
    id: MAP_SIZE_FILL_ID,
    width: '',
    height: '',
    selected: true, // default option
    valid: true,
}, {
    id: 'small',
    width: 580,
    height: 387,
    valid: true
}, {
    id: 'medium',
    width: 700,
    height: 600,
    valid: true
}, {
    id: 'large',
    width: 1240,
    height: 700,
    valid: true
}, {
    id: CUSTOM_MAP_SIZE_ID,
    valid: true
}];

export const CUSTOM_MAP_SIZE_LIMITS = {
    minWidth: 30,
    minHeight: 20,
    maxWidth: 4000,
    maxHeight: 2000
};

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
        this.sandbox = sandbox;
        this.mapmodule = mapmodule;
        this.loc = localization;
        this.instance = instance;
        this.tools = tools;
        this.selectedMapSize = null;
        this.sizeLimits = CUSTOM_MAP_SIZE_LIMITS;
    }, {
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            const handler = this.eventHandlers[event.getName()];
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
            MapSizeChangedEvent: function () {
                // update map / container size but prevent a new mapsizechanged request from being sent
                this.updateMapSize();
            }
        },
        getName: function () {
            return 'Oskari.mapframework.bundle.publisher2.view.PanelMapPreview';
        },
        /**
         * @public @method updateMapSize
         * Adjusts the map size according to publisher selection
         *
         */
        updateMapSize: function () {
            if (!this.panel) {
                return;
            }
            this._adjustDataContainer();
            /*
            const customsize = this.panel.getContainer().find('.customsize');
            const widthInput = customsize.find('input[name=width]');
            const heightInput = customsize.find('input[name=height]');

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
            */
        },

        /**
         * @private @method _getActiveMapSize
         * Returns an object containing the active map size.
         * This will differ from selected size if selected size is invalid.
         *
         * @return {Object} size
         */
        _getActiveMapSize: function () {
            const mapDiv = this.mapmodule.getMapEl();
            return {
                width: mapDiv.width(),
                height: mapDiv.height()
            };
        },
        /**
         * @private @method _adjustDataContainer
         * This horrific thing is what sets the left panel components, container and map size.
         */
        _adjustDataContainer: function () {
            const selectedSize = this._getSelectedMapSize();
            const size = selectedSize.valid ? selectedSize : this._getActiveMapSize();
            const mapDiv = this.mapmodule.getMapEl();
            mapDiv.width(size.width || '100%');
            mapDiv.height(size.height || '100%');
        },

        /**
         * @private @method _getSelectedMapSize
         * Returns an object containing the user seleted/set map size and the corresponding size option
         *
         * @return {Object} size
         */
        _getSelectedMapSize: function () {
            return this.selectedMapSize;
            /*
            return {
                valid: true,
                width: this.selectedMapSize.width,
                height: this.selectedMapSize.height,
                option: this.selectedMapSize
            };
*/
            /*
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
                validWidth = Oskari.util.isNumber(widthInput.val()) && Oskari.util.isNumberBetween(width, this.sizeLimits.minWidth, this.sizeLimits.maxWidth);
                validHeight = Oskari.util.isNumber(heightInput.val()) && Oskari.util.isNumberBetween(height, this.sizeLimits.minHeight, this.sizeLimits.maxHeight);
            }

            return {
                valid: validWidth && validHeight,
                width: width,
                validWidth: validWidth,
                height: height,
                validHeight: validHeight,
                option: option
            };
            */
        },
        /**
         * Creates the set of Oskari.userinterface.component.FormInput to be shown on the panel and
         * sets up validation etc. Prepopulates the form fields if pData parameter is given.
         *
         * @method init
         * @param {Object} pData initial data
         */
        init: function (pData) {
            this.populatePanel(pData);
            this._registerEventHandlers();
//            this._registerEventHandlers();
/*
            var me = this,
                fkey,
                data,
                field,
                panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel'),
                contentPanel = panel.getContainer(),
                tooltipCont = me.templates.help.clone();

            // initial mode selection if modify.
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

            // initialise fields only after it's certain which option is selected (new / modify)
            me.fields = {
                size: {
                    clazz: 'Oskari.userinterface.component.RadioButtonGroup',
                    handler: function (value) {
                        me.sizeOptions.forEach(function (option) {
                            option.selected = option.id === value;
                        });
                        me.updateMapSize();
                    },
                    options: me.sizeOptions.map(function (option) {
                        var title = me.loc.sizes[option.id];
                        if (option.id !== 'custom' && option.id !== 'fill') {
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
                    if (data.options) {
                        field.setOptions(data.options);
                    }
                    if (data.handler) {
                        field.setHandler(data.handler);
                    }
                    if (data.placeholder && typeof field.setPlaceHolder === 'function') {
                        field.setPlaceHolder(data.placeholder);
                    }
                    if (data.value) {
                        field.setValue(data.value);
                    }
                    data.field = field;
                }
            }
            panel.setTitle(me.loc.size.label);
            tooltipCont.attr('title', Oskari.getMsg('Publisher2', 'BasicView.size.tooltip', this.sizeLimits));
            panel.getHeader().append(tooltipCont);

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
            */
        },
        _registerEventHandlers: function () {
            var me = this;
            for (var p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    me.sandbox.registerForEventByName(me, p);
                }
            }
        },
        _unregisterEventHandlers: function () {
            for (const p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    this.sandbox.unregisterFromEventByName(this, p);
                }
            }
        },
        /**
         * Returns the UI panel and populates it with the data that we want to show the user.
         *
         * @method getPanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        getPanel: function () {
            if (!this.panel) {
                this.populatePanel();
            }

            return this.panel;
        },

        /**
         * Populate the actual panel content.
         *
         * @param data  When modifying an existing map get initial size selection from this.
         * @method populatePanel
         * @return {Oskari.userinterface.component.AccordionPanel}
         */
        populatePanel: function (data) {
            const panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            const contentPanel = panel.getContainer();
            const initialSelection = data && data.metadata
                ? { id: data.metadata.preview, width: data.metadata.size?.width || null, height: data.metadata.size?.height || null }
                : null;
            ReactDOM.render(
                <ThemeProvider>
                    <MapPreviewForm
                        onChange={(value) => { this.mapSizeSelectionChanged(value); }}
                        mapSizeOptions={MAP_SIZES}
                        initialSelection={initialSelection}/>
                </ThemeProvider>,
                contentPanel[0]
            );

            panel.setTitle(this.loc.size.label);
            this.panel = panel;
            return panel;
        },

        mapSizeSelectionChanged: function (mapSize) {
            this.selectedMapSize = mapSize;
            if (this.selectedMapSize.valid) {
                this.updateMapSize();
            }
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
            const selected = this._getSelectedMapSize();
            const values = {
                metadata: {
                    preview: selected.id
                }
            };

            if (!isNaN(parseInt(selected.width)) && !isNaN(parseInt(selected.height))) {
                values.metadata.size = {
                    width: selected.width,
                    height: selected.height
                };
            }
            return values;
        },
        validate: function () {
            const errors = [];
            if (!this._getSelectedMapSize().valid) {
                errors.push({
                    field: 'size',
                    error: Oskari.getMsg('Publisher2', 'BasicView.error.size', this.sizeLimits)
                });
            }
            return errors;
        },

        /**
        * Stop panel.
        * @method stop
        * @public
        **/
        stop: function () {
            // restore "fill" as default size setting
            this.mapSizeSelectionChanged(MAP_SIZES.find(size => size.id === MAP_SIZE_FILL_ID));
            this._unregisterEventHandlers();

            window.setTimeout(() => {
                // calculate new sizes AFTER the publisher panel has been removed from page
                // otherwise the publisher panel that we have while stopping is taking up space
                // from the map and the map size is calculated wrong
                this._adjustDataContainer(true);
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
