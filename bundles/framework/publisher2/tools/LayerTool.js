/**
* @class Oskari.mapframework.publisher.tool.LayerTool
* This clazz documentates publisher2 layer tool definations. When a new layer tool has been implemented it must define these functions and properties.
* Protocol/interface declaration for Publisher2 layer tool.
* Provides an interface for bundles to add layer tool to publisher2.
*/

Oskari.clazz.define('Oskari.mapframework.publisher.tool.LayerTool',
    function (sandbox, mapmodule, localization) {
        this._log = Oskari.log('publisher.LayerTool');
        // sandbox
        this.__sandbox = sandbox;
        // mapmodule
        this.__mapmodule = mapmodule;
        // localization
        this.__loc = localization;
        // plugin
        this.__plugin = null;
    }, {
        group: 'layers',
        /**
        * Initialize tool
        * Override
        * @method init
        * @param pdata Publisher data. Includes tools' getValues return values
        * @public
        */
        init: function (pdata) {
            this._log.error('Override init function for Tool ' + this.getTool().id);
        },
        /**
        * Get tool object.
        * @method getComponent
        * @private
        *
        * @returns {Object}
        */
        getComponent: function () {
            this._log.error('Override getComponent function for Tool ' + this.getTool().id);
        },
        /**
        * Get name.
        * @method getName
        * @public
        *
        * @returns {String} tool name
        */
        getName: function () {

        },
        /**
        * Is displayed.
        * @method isDisplayed
        * @public
        *
        * @returns {Boolean} is tool displayed
        */
        isDisplayed: function () {
            return true;
        },
        /**
        * Get values.
        * @method getValues
        * @public
        *
        * @returns {Object} tool value object
        */
        getValues: function () {
            return null;
        }
    }, {
        'protocol': ['Oskari.mapframework.publisher.LayerTool']
    });
