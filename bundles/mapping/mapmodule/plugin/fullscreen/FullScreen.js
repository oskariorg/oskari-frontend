import './request/ToggleFullScreenControlRequest';

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin
 * Displays a full screen toggle button on the map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.FullScreenPlugin';
        me._defaultLocation = 'top left';
        me._index = 1;
        me._name = 'FullScreenPlugin';
        me._element = null;
        me.state = {};
        me._sandbox = null;
    },
    {
        /**
         * @method _createControlElement
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            const el = jQuery(
                    '<div class="mapplugin fullscreenDiv">' +
                    '<img class="fullscreenDivImg" src="' + this.getImagePath('hide-navigation.png') + '"></img>' +
                    '</div>'
                );
            el.find('.fullscreenDivImg').on('click', (event) => {
                event.preventDefault();
                this.setState({
                    fullscreen: !this.state.fullscreen
                });
            });
            return el;
        },
        /**
         * @method _startPluginImpl
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        _startPluginImpl: function (sandbox) {
            this.setEnabled(this._enabled);
            return this.setVisible(this._visible);
        },
        /**
         * @method _stopPluginImpl
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        _stopPluginImpl: function (sandbox) {
            this.removeFromPluginContainer(this.getElement());
        },

        /**
         * @private @method  createRequestHandlers
         *
         * @return {Object} Request handler map
         */
        createRequestHandlers: function () {
            return {
                'MapModulePlugin.ToggleFullScreenControlRequest': this
            };
        },
        /**
         * Handler for MapModulePlugin.ToggleFullScreenControlRequest
         *
         * Oskari.getSandbox().postRequestByName('MapModulePlugin.ToggleFullScreenControlRequest', [true/false]);
         *
         * @param {Oskari.mapframework.core.Core} core
         *      Reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapmodule.request.ToggleFullScreenControlRequest} request
         *      Request to handle
         */
        handleRequest: function (core, request) {
            this.setVisible(request.isVisible());
        },
        setState: function (state) {
            this.state = state || {};
            if (this.state.fullscreen) {
                this._hideNavigation();
            } else {
                this._showNavigation();
            }
        },
        getState: function () {
            return this.state;
        },
        _showNavigation: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }
            el.find('.fullscreenDivImg').attr('src', this.getImagePath('hide-navigation.png'));
            Oskari.dom.getMapContainerEl().classList.remove('oskari-map-window-fullscreen')
        },
        _hideNavigation: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }
            el.find('.fullscreenDivImg').attr('src', this.getImagePath('show-navigation.png'));
            Oskari.dom.getMapContainerEl().classList.add('oskari-map-window-fullscreen')
        }
    },
    {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
