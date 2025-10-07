import './plugin/LayerSwipePlugin';
import './publisher/SwipeTool';
import { SwipeHandler } from './handler/SwipeHandler';

Oskari.clazz.define(
    'Oskari.mapframework.bundle.layerswipe.LayerSwipeBundleInstance',

    function () {
        this.mapModule = null;
        this.sandbox = null;
        this.plugin = null;
        this.loc = Oskari.getMsg.bind(null, this.getName());
    }, {
        __name: 'LayerSwipe',

        _startImpl: function (sandbox) {
            this.sandbox = sandbox;
            this.mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            this.handler = new SwipeHandler(this);

            sandbox.registerAsStateful(this.mediator.bundleId, this);
            if (Oskari.dom.isEmbedded()) {
                this.plugin = Oskari.clazz.create('Oskari.mapframework.bundle.layerswipe.plugin.LayerSwipePlugin', this.conf);
                this.plugin.setHandler(this.handler);
                this.mapModule.registerPlugin(this.plugin);
                this.mapModule.startPlugin(this.plugin);
            } else {
                const addToolButtonBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
                const buttonConf = {
                    iconCls: 'tool-layer-swipe',
                    tooltip: this.loc('toolLayerSwipe'),
                    sticky: true,
                    callback: () => this.setToolActive(!this.getState().active)
                };
                sandbox.request(this, addToolButtonBuilder('LayerSwipe', 'basictools', buttonConf));
            }
            if (this.state?.active) {
                if (!this.plugin) {
                    // AddToolButtonRequest prefixes group and have to use prefixed group on select tool
                    // It's little confusing that tool can't be selected using group which was used on add
                    this.getSandbox().postRequestByName('Toolbar.SelectToolButtonRequest', ['LayerSwipe', 'default-basictools']);
                }
                Oskari.on('app.start', () => this.handler.setActive(true));
            }
        },
        setToolActive: function (active) {
            if (!this.plugin) {
                if (!active) {
                    this.getSandbox().postRequestByName('Toolbar.SelectToolButtonRequest', []);
                    return;
                } else if (Oskari.util.isMobile()) {
                    Oskari.dom.showNavigation(false);
                }
            }
            this.handler?.setActive(active);
        },
        getSandbox: function () {
            return this.sandbox;
        },
        getMapModule: function () {
            return this.mapModule;
        },
        getHandler: function () {
            return this.handler;
        },
        getState: function () {
            return this.handler?.getState() || {};
        },
        getStateParameters: function () {
            const { active } = this.getState();
            if (active) {
                return 'swipe=true';
            }
            return '';
        },
        eventHandlers: {
            'Toolbar.ToolSelectedEvent': function (event) {
                if (event.getToolId() !== 'LayerSwipe' && event.getToolId() !== 'link' && event.getToolId() !== 'save_view') {
                    // This bundle generates state for both link and saving views, but only if it's active.
                    // If we deactivate when link or save view tools are clicked the state is not stored as expected.
                    // So we need to keep the swipe tool active when these tools are clicked.
                    this.handler?.setActive(false);
                }
            },
            'AfterMapLayerAddEvent': function () {
                this.handler?.onMapLayerEvent();
            },
            'AfterMapLayerRemoveEvent': function () {
                this.handler?.onMapLayerEvent();
            },
            'AfterRearrangeSelectedMapLayerEvent': function () {
                this.handler?.onMapLayerEvent();
            },
            'MapLayerVisibilityChangedEvent': function (event) {
                this.handler?.onMapLayerEvent();
            },
            'MapSizeChangedEvent': function () {
                this.handler?.onMapSizeChange();
            }
        }
    },
    {
        extend: ['Oskari.BasicBundle'],
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    }
);
