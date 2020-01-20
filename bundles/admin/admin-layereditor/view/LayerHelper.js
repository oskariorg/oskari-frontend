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
            groupId: `${layer.organization_id}`,
            maplayerGroups: layer.groups || [], // TODO: check this
            gfiContent: layer.gfi_content,
            gfiType: layer.gfi_type,
            gfiXslt: layer.gfi_xslt,
            legendImage: layer.legend_image
        };
        setupTemporaryFields(transformed);
        let removeKeys = [
            'organization_id', 'organization', 'groups', 'capabilities', 'gfi_content', 'gfi_type', 'gfi_xslt', 'legend_image'
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
        layer.tempAttributesJSON = layer.attributes ? toJson(layer.attributes) : '';
        layer.tempStyleJSON = layer.options.styles ? toJson(layer.options.styles) : '';
        layer.tempHoverJSON = layer.options.hover ? toJson(layer.options.hover) : '';
        layer.isNew = !layer.id;
    };

    const removeTemporaryFields = layer => {
        delete layer.role_permissions.all;
        delete layer.tempAttributesJSON;
        delete layer.tempStyleJSON;
        delete layer.tempHoverJSON;
        delete layer.isNew;
    };

    /**
     * @method getMVTStylesWithoutSrcLayer
     * Styles in MVT layer options contain data source layer names as filtering keys.
     * This function returns styles without the layer child.
     * Useful when there is only one known data source layer for the styles.
     * @return {Object} styles object without layer name filters for easier JSON editing.
     */
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
        return {
            opacity: 100,
            role_permissions: {},
            maplayerGroups: [],
            isNew: true
        };
    };

    return {
        fromServer,
        toServer,
        createEmpty,
        toJson
    };
};
