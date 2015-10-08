/**
 * @class Oskari.mapframework.bundle.coordinatetool.CoordinateToolBundleInstance
 *
 * Registers and starts the
 * Oskari.mapframework.bundle.coordinatetool.plugin.CoordinatesPlugin plugin for main map.
 */
Oskari.clazz.define("Oskari.hsy.bundle.linkPanel.BundleInstance",

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = null;
        this.started = false;
        this._localization = null;
        this._templates = {
            background: jQuery('<div class="linkpanel_bg"></div>'),
            linkpanel: jQuery('<div class="linkpanel_wrapper"></div>'),
            linkpanel_link: jQuery('<div class="linkpanel_link"></div>')
        };
    }, {
        __name: 'link-panel',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method setSandbox
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sbx) {
            this.sandbox = sbx;
        },
        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {
            var me = this;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for
         * current language.
         * If key-parameter is not given, returns the whole localization
         * data.
         *
         * @param {String} key (optional) if given, returns the value for
         *         key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        start: function () {
            var me = this;
            if (me.started) {
                return;
            }
            me.started = true;

            var conf = me.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
            me.setSandbox(sandbox);

            //Ui loader
            me.createUi();
        },
        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function () {
            var me = this,
            container = me._templates.linkpanel.clone();
            linkpanel_link = me._templates.linkpanel_link.clone();
            background = me._templates.background.clone();

            $('<a>',{
                text: me.getLocalization('use-rights'),
                title: me.getLocalization('use-rights'),
                target: '_blank',
                href: me.getLocalization('use-rights-url')
            }).appendTo(linkpanel_link);

            $('<a>',{
                text: me.getLocalization('open-data'),
                title: me.getLocalization('open-data'),
                target: '_blank',
                href: me.getLocalization('open-data-url')
            }).appendTo(linkpanel_link);

            container.append(linkpanel_link);

            jQuery('div.mapplugins.bottom.center').append(background);
            jQuery('.olControlScaleLineTop').parents('.mappluginsContainer').append(container);
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        stop: function () {
            this.sandbox = null;
            this.started = false;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance']
    });