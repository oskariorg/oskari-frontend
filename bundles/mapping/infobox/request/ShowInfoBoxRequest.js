/**
 * @class Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest
 * Requests a map popup/infobox to be shown
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz
    .define('Oskari.mapframework.bundle.infobox.request.ShowInfoBoxRequest',
        /**
         * @method create called automatically on construction
         * @static
         *
         * @param {String} id
         *        id for popup so we can use additional requests to control it
         * @param {String} title
         *        popup title
         * @param {Object[]} contentData
         *        JSON presentation for the popup data
         * @param {OpenLayers.LonLat|object} position
         *      lonlat coordinates where to show the popup or marker id {marker:'MARKER_ID'}
         * @param {Object} options
         *        Additional options for infobox:
                 * @param {Boolean} hidePrevious
                 *        if true, hides any previous popups when showing this, defaults to false
                 * @param {Object} colourScheme
                 *        the colour scheme object for the popup (optional, uses the default colour scheme if not passed)
                 * @param {String} font
                 *        the id of the font for the popup (optional, uses the default font if not passed)
                 * @param {Object} mobileBreakpoints
                 *        The size of the screen in pixels to start using mobile mode. {width: 'mobileModeWidth', height: 'mobileModeHeight'}
         *
         * contentData format example:
         * [{
         *    html: "",
         *  actions : [
         *      {
         *          name: "My link 1",
         *          type: "link",
         *          action: {
         *              info: "action can be function or object"
         *              info2: "Object is only possibility with RPC. If action is function, the function is called when action element is clicked"
         *          }
         *      },
         *      {
         *          name: "My button 1",
         *          type: "button",
         *          action: myfunction,
         *          group: 1
         *      },
         *      {
         *          name: "My button 2",
         *          type: "button",
         *          action: {
         *              info: "Button 2 was clicked"
         *          },
         *          group: 1
         *      }
         * }]
         */

        function (id, title, contentData, position, options) {
            this._creator = null;
            this._id = id;
            this._title = title;
            this._content = contentData;
            this._position = position;
            this._options = options;
            this._additionalTools = [];
        }, {
            /** @static @property __name request name */
            __name: "InfoBox.ShowInfoBoxRequest",
            /**
             * @method getName
             * @return {String} request name
             */
            getName: function () {
                return this.__name;
            },
            /**
             * @method getId
             * @return {String} popup/infobox id
             */
            getId: function () {
                return this._id;
            },
            /**
             * @method getTitle
             * @return {String} popup/infobox title
             */
            getTitle: function () {
                return this._title;
            },
            /**
             * @method getContent
             * @return {Object[]} popup/infobox title
             * contentData format example:
             * [{
             *  html: "",
             *  actions : {
             *     "Tallenna" : callbackFunction,
             *     "Sulje" : callbackFunction
             * }
             * }]
             */
            getContent: function () {
                return this._content;
            },
            /**
             * @method getPosition
             * @return {OpenLayers.LonLat} coordinates where to show the popup
             */
            getPosition: function () {
                return this._position;
            },
            /**
             * @method getOptions
             * @return {Object} additional options for infobox
             */
            getOptions: function () {
                return this._options;
            },
            addAdditionalTool: function(toolDefs) {
                this._additionalTools.push(toolDefs);
            },
            getAdditionalTools: function(){
                return this._additionalTools;
            }
        }, {
            /**
             * @property {String[]} protocol array of superclasses as {String}
             * @static
             */
            'protocol': ['Oskari.mapframework.request.Request']
        });