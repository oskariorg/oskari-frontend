import { UserStylesFlyout } from '../UserStylesFlyout';
/**
 * @class Oskari.mapframework.bundle.mapwfs2.request.ShowOwnStyleRequestHandler
 *
 * Handles map selection popup functionality.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapwfs2.request.ShowOwnStyleRequestHandler',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin} plugin
     */

    function (plugin) {
        this.plugin = plugin;
        this.localization = Oskari.getMsg.bind(null, 'MapWfs2');
        /* templates */
        this.template = {};
        var p;
        for (p in this.__templates) {
            if (this.__templates.hasOwnProperty(p)) {
                this.template[p] = jQuery(this.__templates[p]);
            }
        }
        this.service = Oskari.getSandbox().getService(
            'Oskari.mapframework.bundle.mapwfs2.service.UserStyleService');
    }, {
        __templates: {
            'wrapper': '<div></div>',
            'toolsButton': '<div style= "display: inline-block; border: 1px solid;"></div>',
            'link': '<div class="link"><a href="javascript:void(0);"></a></div></div>'
        },

        /**
         * @method handleRequest
         * Shows WFS feature data with requested properties
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.bundle.mapwfs2.request.ShowOwnStyleRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            const layerId = request.getId();
            const styleId = request.getStyleId();
            const createNew = request.isCreateNew();
            const userStylesForLayer = this.plugin.getUserStylesForLayer(layerId);
            if (userStylesForLayer && userStylesForLayer.length > 0 && !styleId && !createNew) {
                this._showUserStylesList(layerId);
            } else {
                this._showVisualizationForm(layerId, styleId);
            }
        },
        _showVisualizationForm (layerId, styleId, createNew) {
            // init popup
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var title = this.localization('popup.title');
            var content = this.template.wrapper.clone();
            const layer = this.plugin.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
            var customStyle;

            if (styleId) {
                customStyle = this.service.getUserStyle(layerId, styleId);
            } else {
                customStyle = null;
            }
            // add form
            content.append(this.plugin.getCustomStyleEditorForm(customStyle));

            // buttons
            var self = this;
            var saveOwnStyleBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveOwnStyleBtn.setTitle(this.localization('popup.button.save'));
            saveOwnStyleBtn.addClass('primary saveOwnStyle');
            saveOwnStyleBtn.setHandler(function () {
                if (!styleId) {
                    styleId = Date.now();
                }
                self.plugin.applyEditorStyle(layer, styleId);
                self.plugin.saveUserStyle(layerId, styleId);
                var event = Oskari.eventBuilder('MapLayerEvent')(layerId, 'update');
                self.plugin.getSandbox().notifyAll(event);
                dialog.close();
            });

            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(this.localization('popup.button.cancel'));
            cancelBtn.setHandler(function () {
                dialog.close();
            });

            // show popup
            dialog.addClass('wfs_own_style');
            dialog.show(title, content, [cancelBtn, saveOwnStyleBtn]);
        },
        _showUserStylesList (layerId) {
            const flyout = this._getFlyout();
            flyout.setLayerId(layerId);
            flyout.show();
        },
        /**
         * @private @method _getFlyout
         * Ensure flyout exists and return it
         * @return {LayerEditorFlyout}
         */
        _getFlyout () {
            if (!this.flyout) {
                const xPosition = jQuery('#mapdiv').position().left;
                const offset = 150;

                this.flyout = new UserStylesFlyout(this.localization('own-styles-flyout-title'));
                this.flyout.move(xPosition + offset, 15, true);
                this.flyout.makeDraggable({
                    handle: '.oskari-flyouttoolbar',
                    scroll: false
                });
            }
            return this.flyout;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.core.RequestHandler']
    });
