import { UserStylesFlyout } from '../UserStylesFlyout';
/**
 * @class Oskari.mapframework.userstyle.request.ShowUserStylesRequestHandler
 *
 * Handles user style functionality.
 */
Oskari.clazz.define('Oskari.mapframework.userstyle.request.ShowUserStylesRequestHandler',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin} plugin
     */

    function (instance) {
        this.instance = instance;
        this.localization = Oskari.getMsg.bind(null, 'userstyle');
        /* templates */
        this.template = {};
        var p;
        for (p in this.__templates) {
            if (this.__templates.hasOwnProperty(p)) {
                this.template[p] = jQuery(this.__templates[p]);
            }
        }
    }, {
        __templates: {
            wrapper: '<div></div>',
            toolsButton: '<div style= "display: inline-block; border: 1px solid;"></div>',
            link: '<div class="link"><a href="javascript:void(0);"></a></div></div>'
        },

        /**
         * @method handleRequest
         * @param {Oskari.mapframework.core.Core} core
         *      reference to the application core (reference sandbox core.getSandbox())
         * @param {Oskari.mapframework.userstyle.request.ShowUserStylesRequest} request
         *      request to handle
         */
        handleRequest: function (core, request) {
            const layerId = request.getLayerId();
            const styleName = request.getStyleName();
            const createNew = request.isCreateNew();
            const userStylesForLayer = this.instance.getService().getUserStylesForLayer(layerId);
            if (userStylesForLayer.length > 0 && !styleName && !createNew) {
                this._showUserStylesList(layerId);
            } else {
                this._showVisualizationForm(layerId, styleName);
            }
        },
        _showVisualizationForm (layerId, styleName, createNew) {
            const service = this.instance.getService();
            const sb = this.instance.sandbox;
            // init popup
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var title = this.localization('popup.title');
            var content = this.template.wrapper.clone();
            const layer = sb.findMapLayerFromSelectedMapLayers(layerId);
            var style;
            if (styleName) {
                style = service.getUserStyle(layerId, styleName);
            }
            // add form
            content.append(service.getCustomStyleEditorForm(style));

            // buttons
            var saveOwnStyleBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveOwnStyleBtn.setTitle(this.localization('popup.button.save'));
            saveOwnStyleBtn.addClass('primary saveOwnStyle');
            saveOwnStyleBtn.setHandler(() => {
                if (!styleName) {
                    // styles are stored only for runtime, use time to get unique name
                    styleName = Date.now().toString();
                }
                service.applyEditorStyle(layer, styleName);
                service.saveUserStyle(layer, styleName);
                var event = Oskari.eventBuilder('MapLayerEvent')(layerId, 'update');
                sb.notifyAll(event);
                dialog.close();
            });

            var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(this.localization('popup.button.cancel'));
            cancelBtn.setHandler(function () {
                dialog.close();
            });

            // show popup
            dialog.addClass('user_style');
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
                const options = {
                    width: 500
                };
                this.flyout = new UserStylesFlyout(this.localization('title'), options);
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
