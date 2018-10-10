/**
 * @class Oskari.mapframework.bundle.layerselector2.view.Layer
 *
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.layerselector2.view.Layer',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (layer, sandbox, localization) {
        this.sandbox = sandbox;
        this.localization = localization;
        this.layer = layer;
        this.backendStatus = 'UNKNOWN'; // see also 'backendstatus-ok'
        this.ui = this._createLayerContainer(layer);
    }, {
        __template: '<div class="layer"><input type="checkbox" /> ' +
                    '<div class="layer-tools">' +
                    '   <div class="layer-not-supported icon-warning-light" title="" ></div>' +
                    '   <div class="layer-backendstatus-icon backendstatus-unknown" title=""></div>' +
                    '   <div class="layer-icon-secondary"></div>' +
                    '   <div class="layer-icon"></div>' +
                    '   <div class="layer-info"></div>' +
                    '</div>' +
                    '<div class="layer-title"></div>' +
        '</div>',
        /**
         * @method getId
         * @return {String} layer id
         */
        getId: function () {
            return this.layer.getId();
        },
        setVisible: function (bln) {
            // TODO assúme boolean and clean up everyhting that passes somehting else
            // checking since we dont assume param is boolean
            if (bln) {
                this.ui.show();
            } else {
                this.ui.hide();
            }
        },
        setSelected: function (isSelected) {
            // TODO assúme boolean and clean up everyhting that passes somehting else
            // checking since we dont assume param is boolean
            this.ui.find('input').prop('checked', !!isSelected);
        },

        /**
         * @method updateLayerContent
         */
        updateLayerContent: function (layer) {
            /* set title */
            var newName = layer.getName(),
                /* set/clear alert if required */
                prevBackendStatus = this.backendStatus,
                currBackendStatus = layer.getBackendStatus(),
                loc = this.localization.backendStatus,
                locForPrevBackendStatus = prevBackendStatus ? loc[prevBackendStatus] : null,
                locForCurrBackendStatus = currBackendStatus ? loc[currBackendStatus] : null,
                clsForPrevBackendStatus = locForPrevBackendStatus ? locForPrevBackendStatus.iconClass : null,
                clsForCurrBackendStatus = locForCurrBackendStatus ? locForCurrBackendStatus.iconClass : null,
                tipForPrevBackendStatus = locForPrevBackendStatus ? locForPrevBackendStatus.tooltip : null,
                tipForCurrBackendStatus = locForCurrBackendStatus ? locForCurrBackendStatus.tooltip : null,
                elBackendStatus = this.ui.find('.layer-backendstatus-icon');
            this.ui.find('.layer-title').html(newName);

            /* set sticky */
            if (layer.isSticky()) {
                this.ui.find('input').prop('disabled', true);
            }

            if (clsForPrevBackendStatus) {
                /* update or clear */
                if (clsForPrevBackendStatus !== clsForCurrBackendStatus) {
                    elBackendStatus.removeClass(clsForPrevBackendStatus);
                }
            }
            if (clsForCurrBackendStatus) {
                /* update or set */
                if (clsForPrevBackendStatus !== clsForCurrBackendStatus) {
                    elBackendStatus.addClass(clsForCurrBackendStatus);
                }
            }
            if (tipForCurrBackendStatus) {
                if (tipForPrevBackendStatus !== tipForCurrBackendStatus) {
                    elBackendStatus.attr('title', tipForCurrBackendStatus);
                }
            } else if (tipForPrevBackendStatus) {
                elBackendStatus.attr('title', '');
            }
            this.backendStatus = currBackendStatus;
        },
        getContainer: function () {
            return this.ui;
        },
        /**
         * @method _createLayerContainer
         * @private
         * Creates the layer containers
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer to render
         */
        _createLayerContainer: function (layer) {
            var me = this,
                sandbox = me.sandbox,
                // create from layer template
                // (was clone-from-template but template was only used once so there was some overhead)
                layerDiv = jQuery(this.__template),
                tooltips = this.localization.tooltip,
                tools = jQuery(layerDiv).find('div.layer-tools'),
                icon = tools.find('div.layer-icon'),
                rn,
                uuid,
                additionalUuids,
                additionalUuidsCheck,
                subLayers,
                s,
                subUuid,
                checkbox,
                elBackendStatus,
                mapLayerId,
                layerInfo,
                subLmeta;

            var secondaryIcon = tools.find('div.layer-icon-secondary');

            icon.addClass(layer.getIconClassname());

            if (layer.isBaseLayer()) {
                icon.attr('title', tooltips['type-base']);
            } else if (layer.isLayerOfType('WMS')) {
                icon.attr('title', tooltips['type-wms']);
            } else if (layer.isLayerOfType('WMTS')) {
                // FIXME: WMTS is an addition done by an outside bundle so this shouldn't be here
                // but since it would require some refactoring to make this general
                // I'll just leave this like it was on old implementation
                icon.attr('title', tooltips['type-wms']);
            } else if (layer.isLayerOfType('WFS')) {
                if (layer.isManualRefresh()) {
                    icon.attr('title', tooltips['type-wfs-manual']);
                } else {
                    icon.attr('title', tooltips['type-wfs']);
                }
            } else if (layer.isLayerOfType('VECTOR')) {
                icon.attr('title', tooltips['type-wms']);
            }
            if (layer.hasTimeseries()) {
                secondaryIcon.addClass('layer-timeseries-disabled');
                secondaryIcon.attr('title', tooltips['type-timeseries']);
            }

            if (!layer.getMetadataIdentifier()) {
                subLayers = layer.getSubLayers();
                subLmeta = false;
                if (subLayers && subLayers.length > 0) {
                    subLmeta = true;
                    for (s = 0; s < subLayers.length; s += 1) {
                        subUuid = subLayers[s].getMetadataIdentifier();
                        if (!subUuid || subUuid === '') {
                            subLmeta = false;
                            break;
                        }
                    }
                }
            }
            if (layer.getMetadataIdentifier() || subLmeta) {
                layerInfo = tools.find('div.layer-info');
                layerInfo.addClass('icon-info');
                layerInfo.on('click', function () {
                    rn = 'catalogue.ShowMetadataRequest';
                    uuid = layer.getMetadataIdentifier();
                    additionalUuids = [];
                    additionalUuidsCheck = {};
                    additionalUuidsCheck[uuid] = true;
                    subLayers = layer.getSubLayers();
                    if (subLayers && subLayers.length > 0) {
                        for (s = 0; s < subLayers.length; s += 1) {
                            subUuid = subLayers[s].getMetadataIdentifier();
                            if (subUuid && subUuid !== '' && !additionalUuidsCheck[subUuid]) {
                                additionalUuidsCheck[subUuid] = true;
                                additionalUuids.push({
                                    uuid: subUuid
                                });
                            }
                        }
                    }

                    sandbox.postRequestByName(rn, [{
                        uuid: uuid
                    },
                    additionalUuids
                    ]);
                });
            }

            // setup id
            layerDiv.attr('layer_id', layer.getId());
            layerDiv.find('input').attr('id', 'oskari_layerselector2_layerlist_checkbox_layerid_' + layer.getId());
            layerDiv.find('.layer-title')
                .append(layer.getName())
                .on('click', function () {
                    layerDiv.find('input').prop('checked', !layerDiv.find('input').prop('checked')).trigger('change');
                })
                .toggleClass('not-supported', !layer.isSupported(sandbox.getMap().getSrsName()));

            layerDiv.find('input').on('change', function () {
                checkbox = jQuery(this);
                if (checkbox.is(':checked')) {
                    sandbox.postRequestByName('AddMapLayerRequest', [layer.getId()]);
                } else {
                    sandbox.postRequestByName('RemoveMapLayerRequest', [layer.getId()]);
                }
            });

            /* set sticky */
            if (layer.isSticky()) {
                layerDiv.find('input').prop('disabled', true);
            }

            /*
             * backend status
             */
            elBackendStatus = tools.find('.layer-backendstatus-icon');

            var backendStatus = layer.getBackendStatus();
            if (backendStatus) {
                var iconClass = me.localization.backendStatus[backendStatus] ? me.localization.backendStatus[backendStatus].iconClass : null;
                var tooltip = me.localization.backendStatus[backendStatus] ? me.localization.backendStatus[backendStatus].tooltip : null;
                if (iconClass) {
                    elBackendStatus.removeClass('backendstatus-unknown');
                    elBackendStatus.addClass(iconClass);
                    elBackendStatus.attr('title', tooltip);
                }
            }
            elBackendStatus.on('click', function () {
                mapLayerId = layer.getId();
                sandbox.postRequestByName('ShowMapLayerInfoRequest', [
                    mapLayerId
                ]);
            });

            /**
             * Supported projection
             */
            tools.find('.layer-not-supported')
                .css('display', !layer.isSupported(sandbox.getMap().getSrsName()) ? null : 'none')
                .attr('title', this.localization.tooltip['unsupported-srs']);

            return layerDiv;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
