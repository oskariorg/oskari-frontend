import { PLACEMENTS } from 'oskari-ui/components/window';
import { getPopupOptions } from '../../../mapping/mapmodule/plugin/pluginPopupHelper';
import '../../statsgrid2016/resources/scss/classificationplugin.scss';

/**
 * @class Oskari.statistics.statsgrid.ClassificationPlugin
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.ClassificationPlugin',

    function (instance, config) {
        const me = this;
        me._instance = instance;
        me._config = config || {};
        me._sandbox = instance.getSandbox();
        this.service = instance.getStatisticsService();
        me._locale = Oskari.getMsg.bind(null, 'StatsGrid');
        me._clazz = 'Oskari.statistics.statsgrid.ClassificationPlugin';
        me._index = 9;
        this._defaultLocation = 'right bottom';
        me._name = 'ClassificationPlugin';

        me.log = Oskari.log('Oskari.statistics.statsgrid.ClassificationPlugin');
        Oskari.makeObservable(this);

        this._overflowedOffset = null;
        this._previousIsEdit = false;
        this._bindToEvents();
        this.stateHandler = this.service.getStateHandler();
        this.classificationHandler = this.stateHandler.getClassificationHandler();
        this.classificationHandler.initPluginState(this._config, this._instance.isEmbedded());
    }, {
        // buildUI() is the starting point
        buildUI: function () {
            this.render();
            this.trigger('show');
        },
        // this is used to stop this/remove from screen
        stopPlugin: function () {
            this.classificationHandler.closeClassificationContainer();
            this.trigger('hide');
        },
        isVisible: function () {
            return !!this.classificationHandler.getState().classificationContainer;
        },
        toggleUI: function () {
            this.classificcationHandler.getState().classificationContainer ? this.stopPlugin() : this.buildUI();
            return !!this.classificcationHandler?.getState().classificationContainer;
        },
        render: async function () {
            if (!this.classificationHandler) {
                return;
            }
            this.classificationHandler.showClassificationContainer(() => this.stopPlugin(), this.__getContainerOpts());
        },
        // Use togglePlugin location when available, otherwise default to bottom right
        __getContainerOpts: function () {
            let opts = {
                placement: PLACEMENTS.BR
            };
            if (this._instance.togglePlugin) {
                opts = getPopupOptions(this._instance.togglePlugin);
            }
            return {
                ...opts,
                id: 'statsgrid_classification'
            };
        },
        _bindToEvents: function () {
            // need to update transparency select
            this.service.on('AfterChangeMapLayerOpacityEvent', () => this.render());
            // need to calculate contents max height and check overflow
            this.service.on('MapSizeChangedEvent', () => this.render());
        }
    }, {
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
