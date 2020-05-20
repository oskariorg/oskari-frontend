/**
 * @class Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces3.model.MyPlacesCategory',

    /**
 * @method create called automatically on construction
 * @static
 */
    function () {
        this.id = undefined;
        this.name = undefined;
        this._isDefault = false;
        this._isPublic = false;
        this.uuid = undefined;
        this.isPlacesLoaded = false;
        this.options = {};
    }, {
        /**
         * @method setId
         * @param {Number} value
         */
        setId: function (value) {
            this.id = value;
        },
        /**
         * @method getId
         * @return {Number}
         */
        getId: function () {
            return this.id;
        },
        /**
         * @method setName
         * @param {String} value. Default category may not have name, set localized default name
         */
        setName: function (value) {
            this.name = value || Oskari.getMsg('MyPlaces3', 'category.defaultName');
        },
        /**
         * @method getName
         * @return {String}
         */
        getName: function () {
            return this.name;
        },
        /**
         * @method setDefault
         * @param {Boolean} value
         */
        setDefault: function (value) {
            this._isDefault = !!value;
        },
        /**
         * @method isDefault
         * @return {Boolean}
         */
        isDefault: function () {
            return !!this._isDefault;
        },
        /**
         * @method setPublic
         * @param {Boolean} value
         */
        setPublic: function (value) {
            this._isPublic = !!value;
        },
        /**
         * @method isPublic
         * @return {Boolean}
         */
        isPublic: function () {
            return !!this._isPublic;
        },
        setPlacesLoaded: function (value) {
            this._isPlacesLoaded = !!value;
        },
        isPlacesLoaded: function () {
            return !!this._isPlacesLoaded;
        },
        setOptions: function (options) {
            this.options = options;
        },
        getOptions: function () {
            return this.options;
        },
        getDefaultFeatureStyle: function () {
            const options = this.getOptions();
            if (Oskari.util.keyExists(options, 'styles.default.featureStyle')) {
                return options.styles.default.featureStyle;
            }
            return {};
        },
        setDefaultFeatureStyle: function (style) {
            const options = this.getOptions();
            if (!options.styles) {
                options.styles = {};
            }
            if (!options.styles.default) {
                options.styles.default = {};
            }
            options.styles.default.featureStyle = style;
        },
        /**
         * @method setUuid
         * @param {String} value
         */
        setUuid: function (value) {
            this.uuid = value;
        },
        /**
         * @method getUuid
         * @return {String}
         */
        getUuid: function () {
            return this.uuid;
        }
    });
