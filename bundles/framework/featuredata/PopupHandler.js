import { FEATUREDATA_BUNDLE_ID } from './view/FeatureDataContainer';
import { showSelectToolPopup } from './view/SelectToolPopup';
/**
 * @class Oskari.mapframework.bundle.featuredata.PopupHandler
 *
 * Handles map selection popup functionality.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata.PopupHandler',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance} instance
     */

    function (instance) {
        this.instance = instance;
        this.selectionPopup = null;
        this.selectedTool = null;
        const me = this;
        const sandbox = me.instance.getSandbox();
        const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        me.selectionPlugin = sandbox.findRegisteredModuleInstance('MainMapModuleMapSelectionPlugin');

        if (!me.selectionPlugin) {
            const config = {
                id: 'FeatureData',
                instance: this
            };
            me.selectionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.featuredata.plugin.MapSelectionPlugin', config, sandbox);
            mapModule.registerPlugin(me.selectionPlugin);
            mapModule.startPlugin(me.selectionPlugin);
        }

        this.buttons = {
            point: {
                iconCls: 'selection-point',
                name: 'point',
                tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.point.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler('point', start)
            },
            line: {
                iconCls: 'selection-line',
                name: 'line',
                tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.line.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler('line', start)
            },
            polygon: {
                iconCls: 'selection-area',
                name: 'start',
                tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.polygon.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler('polygon', start)
            },
            square: {
                iconCls: 'selection-square',
                name: 'square',
                tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.square.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler('square', start)
            },
            circle: {
                iconCls: 'selection-circle',
                name: 'circle',
                tooltip: Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectionTools.tools.circle.tooltip'),
                sticky: false,
                callback: start => this.selectToolHandler('circle', start)
            }
        };
    }, {
        selectToolHandler: function (drawMode, startDrawing) {
            if (startDrawing) {
                this.selectedTool = drawMode;
                this.selectionPlugin.startDrawing({ drawMode });
            } else {
                this.selectedTool = null;
                this.selectionPlugin.stopDrawing();
            }
            if (this.selectionPopup) {
                this.selectionPopup.update(this.selectedTool, this.selectionPlugin.isSelectFromAllLayers());
            }
        },
        clearSelectionPopup: function (resetTool = true) {
            if (this.selectionPopup) {
                this.selectionPopup.close();
            }
            if (resetTool) {
                const toolbarRequest = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
                if (toolbarRequest) {
                    Oskari.getSandbox().request(this.instance, toolbarRequest());
                }
            }
            this.selectionPlugin.stopDrawing();
            this.selectionPopup = null;
        },
        setSelectFromAllLayers: function (selectFromAll) {
            this.selectionPlugin.setSelectFromAllLayers(selectFromAll);
            this.selectionPopup.update(this.selectedTool, this.selectionPlugin.isSelectFromAllLayers());
        },
        /**
         * @method showSelectionTools
         * Handles tool button click -> opens selection tool dialog
         */
        showSelectionTools: function () {
            if (this.selectionPopup) return;
            this.selectionPopup = showSelectToolPopup(
                this.selectedTool,
                this.selectionPlugin.isSelectFromAllLayers(),
                this.buttons,
                () => this.instance.removeAllFeatureSelections(),
                (selectFromAll) => this.setSelectFromAllLayers(selectFromAll),
                () => this.clearSelectionPopup()
            );

            // Set default draw mode active
            this.buttons[Object.keys(this.buttons)[0]].callback(true);
        }
    });
