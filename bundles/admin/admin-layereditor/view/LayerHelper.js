export const getLayerHelper = (supportedLanguages) => {
    /**
     * Returns an object with name_[langcode] and title_[langcode] keys for all supported languages
     * @param {*} layer AbstractLayer
     */
    const _getLocalizedLayerInfoFromAbstract = (layer) => {
        const info = {};
        supportedLanguages.forEach(lang => {
            info[lang] = {
                name: layer ? layer.getName(lang) : '',
                subtitle: layer ? layer.getDescription(lang) : ''
            };
        });
        return info;
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
     * Returns an object for admin functionality where data has been collected from an instance of Oskari AbstractLayer "clazz"
     * @param {*} layer AbstractLayer
     */
    const fromAbstractLayer = (layer) => {
        if (!layer) {
            return;
        }

        const styles = layer ? layer.getStyles() : [];
        const availableStyles = [];
        for (let i = 0; i < styles.length; i++) {
            availableStyles.push({
                name: styles[i].getName(),
                title: styles[i].getTitle()
            });
        }

        return {
            type: layer.getLayerType(),
            version: layer.getVersion(),
            id: layer.getId(),
            url: layer.getAdmin().url,
            username: layer.getAdmin().username,
            password: layer.getAdmin().password,
            capabilitiesUpdateRate: layer.getAdmin().capabilitiesUpdateRate,
            name: layer.getLayerName(),
            ..._getLocalizedLayerInfoFromAbstract(layer),
            groupId: layer.getAdmin().organizationId,
            organizationName: layer.getOrganizationName(),
            maplayerGroups: [...layer.getGroups()],
            opacity: layer.getOpacity() || 100,
            minscale: layer.getMinScale() || 1,
            maxscale: layer.getMaxScale() || 1,
            style: layer.getCurrentStyle().getName(),
            styleTitle: layer.getCurrentStyle().getTitle(),
            styles: availableStyles,
            styleJSON: layer._options.styles ? JSON.stringify(getMVTStylesWithoutSrcLayer(layer._options.styles)) : '',
            hoverJSON: layer._options.hover ? JSON.stringify(layer._options.hover) : '',
            metadataid: layer.getMetadataIdentifier() || '',
            gfiContent: layer.getGfiContent() || '',
            attributes: JSON.parse(JSON.stringify(layer.getAttributes())),
            isNew: !layer.getId()
        };
    };
    /**
     * Returns an object for admin functionality where data has been collected from server response
     * @param {Object} layer from server response
     * @param {Object} options
     */
    const fromServer = (layer, options = {}) => {
        /*
         TODO: styles are layer type specific things:
        - for WMS these are in capabilities
        - for WFS these are in options
        */
        const availableStyles = [];

        const transformed = {
            ...layer,
            groupId: layer.organization_id,
            organizationName: layer.organization,
            maplayerGroups: layer.groups || [], // TODO: check this
            styleTitle: layer.style,
            styleJSON: layer.options.styles ? JSON.stringify(this.getMVTStylesWithoutSrcLayer(layer.options.styles)) : '',
            hoverJSON: layer.options.hover ? JSON.stringify(layer.options.hover) : '',
            styles: availableStyles,
            isNew: !layer.id
        };
        // FIXME: do something with these / layer specific stuff
        // server response has role_permissions:
        // role_permissions: {Admin: [], User: [], Guest: [],…}
        let removeKeys = ['organization_id', 'organization', 'groups'];
        // server response has gfiContent that we are NOT handling yet and its not supported by the abstractlayer mapping so remove ->:
        removeKeys.push('gfiContent');

        if (Array.isArray(options.preserve)) {
            removeKeys = removeKeys.filter(key => !options.preserve.includes(key));
        }
        removeKeys.forEach(key => delete transformed[key]);
        return transformed;
    };

    const createEmpty = () => {
        return {
            opacity: 100,
            role_permissions: {},
            maplayerGroups: [],
            isNew: true
        };
    };

    return {
        fromAbstractLayer,
        fromServer,
        createEmpty
    };
};
