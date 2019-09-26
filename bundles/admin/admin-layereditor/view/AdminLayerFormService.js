import { stringify } from 'query-string';
export class AdminLayerFormService {
    constructor () {
        this.layer = {};
        this.messages = [];
        this.listeners = [];
        this.mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        this.log = Oskari.log('AdminLayerFormService');
    }

    getMutator () {
        const me = this;
        return {
            setLayerUrl (url) {
                me.layer = { ...me.layer, layerUrl: url };
                me.notify();
            },
            setUsername (username) {
                me.layer = { ...me.layer, username };
                me.notify();
            },
            setPassword (password) {
                me.layer = { ...me.layer, password };
                me.notify();
            },
            setLayerName (layerName) {
                me.layer = { ...me.layer, layerName };
                me.notify();
            },
            // TODO refactor locale handling. Implementation has to support numerous languages.
            //
            setLayerNameInFinnish (name) {
                me.layer = { ...me.layer, name_fi: name };
                me.notify();
            },
            setLayerNameInEnglish (name) {
                me.layer = { ...me.layer, name_en: name };
                me.notify();
            },
            setLayerNameInSwedish (name) {
                me.layer = { ...me.layer, name_sv: name };
                me.notify();
            },
            setDescriptionInFinnish (description) {
                me.layer = { ...me.layer, title_fi: description };
                me.notify();
            },
            setDescriptionInEnglish (description) {
                me.layer = { ...me.layer, title_en: description };
                me.notify();
            },
            setDescriptionInSwedish (description) {
                me.layer = { ...me.layer, title_sv: description };
                me.notify();
            },
            //
            // end refactor
            setDataProvider (dataProvider) {
                me.layer = { ...me.layer, groupId: dataProvider };
                me.notify();
            },
            setMapLayerGroup (checked, group) {
                const layer = { ...me.layer };
                if (checked) {
                    layer.maplayerGroups = [...layer.maplayerGroups, group];
                } else {
                    const found = layer.maplayerGroups.find(cur => cur.id === group.id);
                    if (found) {
                        layer.maplayerGroups = [...layer.maplayerGroups];
                        layer.maplayerGroups.splice(layer.maplayerGroups.indexOf(found), 1);
                    }
                }
                me.layer = layer;
                me.notify();
            },
            setOpacity (opacity) {
                me.layer = { ...me.layer, opacity };
                me.notify();
            },
            setMinAndMaxScale (values) {
                me.layer = {
                    ...me.layer,
                    maxScale: values[0],
                    minScale: values[1]
                };
                me.notify();
            },
            setStyle (style) {
                me.layer = { ...me.layer, style };
                me.notify();
            },
            setStyleJSON (styleJSON) {
                me.layer = { ...me.layer, styleJSON };
                me.notify();
            },
            setHoverJSON (hoverJSON) {
                me.layer = { ...me.layer, hoverJSON };
                me.notify();
            },
            setMetadataIdentifier (metadataIdentifier) {
                me.layer = { ...me.layer, metadataIdentifier };
                me.notify();
            },
            setGfiContent (gfiContent) {
                me.layer = { ...me.layer, gfiContent };
                me.notify();
            },
            setAttributes (attributes) {
                me.layer = { ...me.layer, attributes };
                me.notify();
            },
            setMessage (key, type) {
                me.messages = [{ key: key, type: type }];
                me.notify();
            },
            setMessages (messages) {
                me.messages = messages;
                me.notify();
            }
        };
    }

    initLayerState (layer) {
        var me = this;

        const styles = layer ? layer.getStyles() : [];
        const availableStyles = [];
        for (let i = 0; i < styles.length; i++) {
            availableStyles.push({
                name: styles[i].getName(),
                title: styles[i].getTitle()
            });
        }

        me.layer = {
            version: layer ? layer.getVersion() : '',
            layer_id: layer ? layer.getId() : null,
            layerUrl: layer ? layer.getAdmin().url : '',
            username: layer ? layer.getAdmin().username : '',
            password: layer ? layer.getAdmin().password : '',
            layerName: layer ? layer.getLayerName() : '',
            // TODO refactor locale handling. Implementation has to support numerous languages.
            //
            name_fi: layer ? layer.getName('fi') : '',
            name_en: layer ? layer.getName('en') : '',
            name_sv: layer ? layer.getName('sv') : '',
            title_fi: layer ? layer.getDescription('fi') : '',
            title_en: layer ? layer.getDescription('en') : '',
            title_sv: layer ? layer.getDescription('sv') : '',
            //
            // end refactor
            groupId: layer ? layer.getAdmin().organizationId : null,
            organizationName: layer ? layer.getOrganizationName() : '',
            maplayerGroups: layer ? [...layer.getGroups()] : [],
            opacity: layer ? layer.getOpacity() : 100,
            minScale: layer ? layer.getMinScale() : 1,
            maxScale: layer ? layer.getMaxScale() : 1,
            style: layer ? layer.getCurrentStyle().getName() : '',
            styleTitle: layer ? layer.getCurrentStyle().getTitle() : '',
            styles: availableStyles,
            styleJSON: layer._options.styles ? JSON.stringify(this.getMVTStylesWithoutSrcLayer(layer._options.styles)) : '',
            hoverJSON: layer._options.hover ? JSON.stringify(layer._options.hover) : '',
            metadataIdentifier: layer ? layer.getMetadataIdentifier() : '',
            gfiContent: layer ? layer.getGfiContent() : '',
            attributes: layer ? JSON.stringify(layer.getAttributes()) : '{}',
            isNew: !layer
        };

        this.messages = [];
    }

    /**
     * @method getMVTStylesWithoutSrcLayer
     * Styles in MVT layer options contain data source layer names as filtering keys.
     * This function returns styles without the layer child.
     * Useful when there is only one known data source layer for the styles.
     * @return {Object} styles object without layer name filters for easier JSON editing.
     */
    getMVTStylesWithoutSrcLayer (styles) {
        if (!styles) {
            return;
        }
        // deep clone styles
        var stylesCopy = JSON.parse(JSON.stringify(styles));
        // remove mvt src layer key
        Object.keys(stylesCopy).forEach(function (styleKey) {
            var style = stylesCopy[styleKey];
            Object.keys(style).forEach(function (layerKey) {
                var layer = style[layerKey];
                Object.keys(layer).forEach(function (styleDefKey) {
                    var styleDef = layer[styleDefKey];
                    style[styleDefKey] = styleDef;
                    delete style[layerKey];
                    stylesCopy[styleKey] = style;
                });
            });
        });
        return stylesCopy;
    }

    /**
     * @method getMVTStylesWithSrcLayer
     * Styles in MVT layer options contain data source layer names as filtering keys.
     * This function set styles with the layer child.
     * @return {Object} styles object with layer name filters for easier JSON editing.
     */
    getMVTStylesWithSrcLayer (styles, layerName) {
        if (!styles) {
            return;
        }
        const styleJson = JSON.parse(styles);
        Object.keys(styleJson).forEach(function (styleKey) {
            var mvtSrcLayerStyleDef = {};
            mvtSrcLayerStyleDef[layerName] = styleJson[styleKey];
            styleJson[styleKey] = mvtSrcLayerStyleDef;
        });
        return styleJson;
    }

    saveLayer () {
        const me = this;

        // Modify layer for backend
        const layer = { ...this.getLayer() };
        const maplayerGroupsCopy = { ...layer.maplayerGroups };
        layer.maplayerGroups = layer.maplayerGroups.map(cur => cur.id).join(',');

        const validationErrorMessages = this.validateUserInputValues(layer);

        if (validationErrorMessages.length > 0) {
            this.getMutator().setMessages(validationErrorMessages);
            return;
        }
        this.setLayerOptions(layer);
        // TODO Reconsider using fetch directly here.
        // Maybe create common ajax request handling for Oskari?
        fetch(Oskari.urls.getRoute('SaveLayer'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: stringify(layer)
        }).then(response => {
            if (response.ok) {
                me.getMutator().setMessage('messages.saveSuccess', 'success');
                return response.json();
            } else {
                me.getMutator().setMessage('messages.saveFailed', 'error');
                return Promise.reject(Error('Save failed'));
            }
        }).then(data => {
            if (layer.layer_id) {
                me.updateLayer(layer.layer_id, data, maplayerGroupsCopy);
            } else {
                me.createlayer(data);
            }
        }).catch(error => me.log.error(error));
    }

    updateLayer (layerId, layerData, maplayerGroups) {
        layerData.groups = Object.values(maplayerGroups);
        this.mapLayerService.updateLayer(layerId, layerData);
    }

    createlayer (layerData) {
        // TODO: Test this method when layer creation in tested with new wizard
        const mapLayer = this.mapLayerService.createMapLayer(layerData);

        if (layerData.baseLayerId) {
            // If this is a sublayer, add it to its parent's sublayer array
            this.mapLayerService.addSubLayer(layerData.baseLayerId, mapLayer);
        } else {
            // Otherwise just add it to the map layer service.
            if (this.mapLayerService._reservedLayerIds[mapLayer.getId()] !== true) {
                this.mapLayerService.addLayer(mapLayer);
            } else {
                this.getMutator().setMessage('messages.errorInsertAllreadyExists', 'error');
                // should we update if layer already exists??? mapLayerService.updateLayer(e.layerData.id, e.layerData);
            }
        }
    }

    validateUserInputValues (layer) {
        const validationErrors = [];
        this.validateJsonValue(layer.styleJSON, 'messages.invalidStyleJson', validationErrors);
        this.validateJsonValue(layer.hoverJSON, 'messages.invalidHoverJson', validationErrors);
        return validationErrors;
    }

    validateJsonValue (value, msgKey, validationErrors) {
        if (value === '' || typeof value === 'undefined') {
            return;
        }
        try {
            JSON.parse(value);
        } catch (error) {
            validationErrors.push({ key: msgKey, type: 'error' });
        }
    }
    setLayerOptions (layer) {
        if (layer.styleJSON !== '') {
            const stylesWithSrcLayer = this.getMVTStylesWithSrcLayer(layer.styleJSON, layer.layerName);
            layer.options = { ...layer.options, ...{ styles: stylesWithSrcLayer } };
        }

        if (layer.hoverJSON !== '') {
            layer.options = { ...layer.options, ...{ hover: JSON.parse(layer.hoverJSON) } };
        }

        if (layer.options) {
            layer.options = JSON.stringify(layer.options);
        }
    }

    deleteLayer () {
        const layer = this.getLayer();
        const me = this;
        fetch(Oskari.urls.getRoute('DeleteLayer'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: stringify(layer)
        }).then(function (response) {
            if (response.ok) {
                // TODO handle this, just close the flyout?
            } else {
                me.getMutator().setMessage('messages.errorRemoveLayer', 'error');
            }
            return response;
        });
    }

    setListener (consumer) {
        this.listeners = [consumer];
    }

    getLayer () {
        return this.layer;
    }

    getMessages () {
        return this.messages;
    }

    clearMessages () {
        this.messages = [];
    }

    notify () {
        this.listeners.forEach(consumer => consumer());
    }
}
