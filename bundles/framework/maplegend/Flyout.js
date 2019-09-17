/**
 * @class Oskari.mapframework.bundle.maplegend.Flyout
 *
 * Renders any Legend Images (such as returned from WMS GetLegendGraphic)
 * for any selected layers.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.maplegend.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.maplegend.LayerSelectorBundleInstance} instance
     *    reference to component that created the flyout
     */

    function (instance) {
        this.instance = instance;
        this.container = null;
        this.templateLayer = null;
        this.templateLayerLegend = null;
        this.state = null;
        this.templateNoLegend = jQuery('<div class="no-maplegend"></div>');
        this._legendImagesNotLoaded = {};
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.mapframework.bundle.maplegend.Flyout';
        },
        /**
         * @method setEl
         * @param {Object} el reference to the container in browser
         *
         * Interface method implementation
         */
        setEl: function (el) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('maplegend')) {
                jQuery(this.container).addClass('maplegend');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin: function () {
            var me = this;
            me.templateLayer =
                jQuery('<div class="maplegend-layer"><div class="maplegend-tools"><div class="layer-description"><div class="icon-info"></div></div></div></div>');
            me.templateLayerLegend = jQuery('<div class="maplegend-legend"><img /></div>');
        },
        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {

        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },
        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },
        /**
         * @method setState
         * @param {String} state
         *      close/minimize/maximize etc
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        },
        createUi: function () {
            this.refresh();
        },
        refresh: function () {
            this._populateLayerList();
        },
        /**
         * @method _populateLayerList
         * @private
         * @param {Object} layerListContainer reference to jQuery object representing the layerlist placeholder
         * Renders legend images as an accordion for the selected layers.
         */
        _populateLayerList: function () {
            var me = this;
            var cel = jQuery(this.container);
            cel.empty();

            var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
            accordion.insertTo(cel);

            var sandbox = this.instance.getSandbox();

            // populate selected layer list
            var layers = sandbox.findAllSelectedMapLayers().slice(0),
                n,
                layer,
                layerContainer,
                accordionPanel;

            for (n = layers.length - 1; n >= 0; n -= 1) {
                layer = layers[n];
                layerContainer = this._createLayerContainer(layer);

                if (layerContainer !== null) {
                    accordionPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                    accordionPanel.open();
                    accordionPanel.setTitle(layer.getName());
                    accordionPanel.getContainer().append(layerContainer);
                    accordion.addPanel(accordionPanel);
                }
            }

            // If no legend images at all, inform the user
            me._informNoLegendImages();
        },

        /**
         * @method _createLayerContainer
         * @private
         * Creates the layer containers
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer to render
         */
        _createLayerContainer: function (layer) {
            var me = this,
                sandbox = me.instance.getSandbox(),
                layerDiv = this.templateLayer.clone();

            /* let's not show same image multiple times */
            var imagesAdded = {};
            /* main layer div */
            var legendDiv = me._createLegendDiv(layer, imagesAdded);
            if (legendDiv && legendDiv !== null) {
                layerDiv.append(legendDiv);

                /* optional sublayers */
                var sublayers = layer.getSubLayers ? layer.getSubLayers() : null,
                    sl,
                    sublayer,
                    subLayerlegendDiv;

                if (sublayers) {
                    for (sl = 0; sl < sublayers.length; sl += 1) {
                        sublayer = sublayers[sl];
                        subLayerlegendDiv = me._createLegendDiv(sublayer, imagesAdded);
                        if (!subLayerlegendDiv && subLayerlegendDiv !== null) {
                            continue;
                        }
                        layerDiv.append(subLayerlegendDiv);
                    }
                }

                /* metadata link */
                var uuid = layer.getMetadataIdentifier(),
                    tools = layerDiv.find('.maplegend-tools');
                if (!uuid) {
                    // no functionality -> hide
                    tools.find('div.layer-description').hide();
                } else {
                    tools.find('div.icon-info').on('click', function () {
                        var rn = 'catalogue.ShowMetadataRequest';

                        sandbox.postRequestByName(rn, [{
                            uuid: uuid
                        }]);
                    });
                }

                return layerDiv;
            } else {
                return null;
            }
        },

        /**
         * @method _createLegendDiv
         * creates legend image div for layer
         */
        _createLegendDiv: function (layer, imagesAdded) {
            var me = this,
                legendUrl = layer.getLegendImage ? layer.getLegendImage() : null;

            if (imagesAdded[legendUrl]) {
                me._checkNoLegendText();
                return null;
            }

            if (!(legendUrl && legendUrl !== '')) {
                me._checkNoLegendText();
                return null;
            }

            var legendDiv = me.templateLayerLegend.clone(),
                imgDiv = legendDiv.find('img'),
                img = new Image();

            legendDiv.prepend(layer.getCurrentStyle().getTitle() + '<br />');

            if (me._legendImagesNotLoaded[legendUrl]) {
                me._checkNoLegendText();
                // return null;
            }

            imagesAdded[legendUrl] = true;

            img.onload = function () {
                imgDiv.attr('src', legendUrl);
                img.onload = null;
                me._checkNoLegendText();
            };

            img.onerror = function () {
                img.onerror = null;
                // Show legend invalid info for the layer
                me._legendImagesNotLoaded[legendUrl] = true;
                me._checkNoLegendText(legendDiv, layer);
            };

            img.src = legendUrl;

            return legendDiv;
        },
        /**
        * Check if any legends images not founded. If not founded then inform the user.
        * @method _checkNoLegendText
        * @private
        */
        _checkNoLegendText: function (legendDiv, layer) {
            var me = this,
                invalidLegendUrl = this.instance.getLocalization('invalidLegendUrl'),
                noLegendContainer = me.templateNoLegend.clone();

            if (legendDiv && layer) {
                var legendUrl = layer.getLegendImage ? layer.getLegendImage() : null;
                if (legendUrl) {
                    noLegendContainer.html(invalidLegendUrl);
                    Oskari.log(me.instance.getName()).debug(invalidLegendUrl + ': ' + legendUrl);
                }
                legendDiv.append(noLegendContainer);
            }
        },
        _informNoLegendImages: function () {
            var me = this,
                noLegendText = this.instance.getLocalization('noLegendsText'),
                legendDivs = jQuery('.oskari-flyoutcontent.maplegend').find('.accordion_panel'),
                noLegendContainer = me.templateNoLegend.clone();

            if (legendDivs !== null && legendDivs.length === 0) {
                noLegendContainer.html(noLegendText);
                jQuery('.oskari-flyoutcontent.maplegend').append(noLegendContainer);
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
