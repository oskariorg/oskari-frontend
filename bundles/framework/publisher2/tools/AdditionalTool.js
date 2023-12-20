/**
* @class Oskari.mapframework.publisher.tool.AdditionalTool
* This clazz documentates publisher2 react tool definations.
* Protocol/interface declaration for Publisher2 react tool.
* Provides an interface for bundles to add react tools to publisher2.
*/

Oskari.clazz.define('Oskari.mapframework.publisher.tool.AdditionalTool',
    function (sandbox, mapmodule, localization) {
        this._log = Oskari.log('publisher.AdditionalTool');
        // sandbox
        this.__sandbox = sandbox;
        // mapmodule
        this.__mapmodule = mapmodule;
        // localization
        this.__loc = localization;
        // plugin
        this.__plugin = null;
    }, {
        group: 'additional',
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
        'protocol': ['Oskari.mapframework.publisher.AdditionalTool']
    });
