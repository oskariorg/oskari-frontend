export const getLayerHelper = () => {
    /**
     * Returns an object for admin functionality where data has been collected from server response
     * @param {Object} layer from server response
     * @param {Object} options
     */
    const fromServer = (layer, options = {}) => {
        const transformed = {
            ...layer,
            attributes: layer.attributes || {},
            options: layer.options || {},
            dataProviderId: `${layer.dataprovider_id}`,
            groups: layer.groups || [],
            gfiContent: layer.gfi_content,
            gfiType: layer.gfi_type,
            gfiXslt: layer.gfi_xslt,
            legendImage: layer.legend_image,
            capabilitiesUpdateRate: layer.capabilities_update_rate_sec
        };
        setupTemporaryFields(transformed);
        let removeKeys = [
            'dataprovider_id', 'organization', 'capabilities', 'gfi_content', 'gfi_type', 'gfi_xslt', 'legend_image', 'capabilities_update_rate_sec'
        ];
        if (Array.isArray(options.preserve)) {
            removeKeys = removeKeys.filter(key => !options.preserve.includes(key));
        }
        removeKeys.forEach(key => delete transformed[key]);
        return transformed;
    };

    const toServer = layer => {
        // Remove role 'all' from permissions as this was only used for UI state handling purposes
        const payload = {
            ...layer,
            attributes: toJson(layer.attributes),
            options: toJson(layer.options)
        };
        removeTemporaryFields(payload);
        return payload;
    };

    const setupTemporaryFields = layer => {
        if (!layer.role_permissions) {
            layer.role_permissions = {};
        };
        // Add 'role' all to permissions for UI state handling purposes
        layer.role_permissions.all = [];
        // Add temp json fields to keep the state on invalid json syntax
        layer.tempAttributesJSON = toJson(layer.attributes);
        layer.tempAttributionsJSON = toJson(layer.options.attributions);
        layer.tempExternalStylesJSON = toJson(layer.options.externalStyles);
        layer.tempHoverJSON = toJson(layer.options.hover);
        layer.tempStylesJSON = toJson(layer.options.styles);
        layer.tempTileGridJSON = toJson(layer.options.tileGrid);
        layer.isNew = !layer.id;
    };

    const removeTemporaryFields = layer => {
        delete layer.role_permissions.all;
        delete layer.tempAttributesJSON;
        delete layer.tempAttributionsJSON;
        delete layer.tempExternalStylesJSON;
        delete layer.tempHoverJSON;
        delete layer.tempStylesJSON;
        delete layer.tempTileGridJSON;
        delete layer.isNew;
    };

    /**
     * @method getMVTStylesWithoutSrcLayer
     * Styles in MVT layer options contain data source layer names as filtering keys.
     * This function returns styles without the layer child.
     * Useful when there is only one known data source layer for the styles.
     * @return {Object} styles object without layer name filters for easier JSON editing.
     */
    // This is MVT layer specific function, MVT support is not implemented yet.
    // eslint-disable-next-line no-unused-vars
    const getMVTStylesWithoutSrcLayer = (styles) => {
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
    };

    /**
     * @method getMVTStylesWithSrcLayer
     * Styles in MVT layer options contain data source layer names as filtering keys.
     * This function set styles with the layer child.
     * @return {Object} styles object with layer name filters for easier JSON editing.
     */
    // This is MVT layer specific function, MVT support is not implemented yet.
    // eslint-disable-next-line no-unused-vars
    const getMVTStylesWithSrcLayer = (styles, layerName) => {
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
    };

    /**
     * Helper to stringify object
     */
    const toJson = obj => obj ? JSON.stringify(obj, null, 2) : '';

    const createEmpty = () => {
        const layer = {
            opacity: 100,
            groups: [],
            options: {},
            attributes: {}
        };
        setupTemporaryFields(layer);
        return layer;
    };

    return {
        fromServer,
        toServer,
        createEmpty,
        toJson
    };
};
