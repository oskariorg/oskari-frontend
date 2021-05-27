/**
 * @class Oskari.framework.bundle.admin-layeranalytics.Flyout
 *
 * Renders the layer analytics flyout.
 */
Oskari.clazz.define('Oskari.framework.bundle.admin-layeranalytics.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.framework.bundle.admin-layeranalytics.AdminLayerAnalyticsBundleInstance}
     *        instance reference to component that created the tile
     */
    function (instance) {
        var me = this;
        me.instance = instance;
        me.container = null;
        me.state = null;
        me.template = null;
        me.cleanData = null;
        me.activeRole = null;
        me.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        me._templates = {
            table: jQuery('<table class="layer-rights-table"><thead></thead><tbody></tbody></table>'),
            cellTh: jQuery('<th></th>'),
            cellTd: jQuery('<td></td>'),
            row: jQuery('<tr></tr>'),
            checkboxCtrl: jQuery('<input id="checkboxCtrl" type="checkbox" />'),
            checkBox: jQuery('<input type="checkbox" />'),
            name: jQuery('<span class="layer-name"></span>')
        };
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.framework.bundle.admin-layeranalytics.Flyout';
        },

        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, flyout, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('admin-layeranalytics')) {
                jQuery(this.container).addClass('admin-layeranalytics');
            }
            if (!flyout.hasClass('admin-layeranalytics')) {
                flyout.addClass('admin-layeranalytics');
            }
        },

        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates
         * that will be used to create the UI
         */
        startPlugin: function () {
            this.template = jQuery(
                '<div class="admin-layeranalytics">\n' +
                '</div>\n'
            );
        },

        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {

        },

        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },

        /**
         * @method getDescription
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },

        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },

        /**
         * @method setState
         * @param {Object} state
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @method getState
         * @return {Object} state
         */
        getState: function () {
            if (!this.state) {
                return {};
            }
            return this.state;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
