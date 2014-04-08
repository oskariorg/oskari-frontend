/**
 * @class Oskari.mapframework.bundle.publishedmyplaces.CategoryHandler
 *
 * Just for validation since MainView uses this and it's linked from under myplaces2
 */
Oskari.clazz.define("Oskari.mapframework.bundle.publishedmyplaces.CategoryHandler",

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance) {
        this.instance = instance;
        this.validateTool = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
    }, {
        __name: 'MyPlacesCategoryHandler',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method init
         * implements Module protocol init method
         */
        init: function () {},
        /**
         * @method start
         * implements Module protocol start methdod
         */
        start: function () {
        },

        /**
         * @method stop
         * implements Module protocol stop method
         */
        stop: function () {},
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
        },

        _getMapLayerId: function (categoryId) {
            if (!categoryId) {
                // default to default category id(?)
                var defCat = this.myPlacesService.getDefaultCategory();
                if (defCat) {

                    categoryId = defCat.getId();
                } else {
                    categoryId = '-99';
                }
            }
            return this.instance.idPrefix + '_' + categoryId;
        },
        /**
         * @method hasIllegalChars
         * Checks value for problematic characters
         * @return {Boolean} true if value has illegal characters
         */
        hasIllegalChars: function (value) {
            this.validateTool.setValue(value);
            return !this.validateTool.checkValue();
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
