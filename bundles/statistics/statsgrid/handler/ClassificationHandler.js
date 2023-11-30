import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showHistogramPopup } from '../components/manualClassification/HistogramForm';
import { validateClassification, getClassification, getEditOptions } from '../helper/ClassificationHelper';
import { showClassificationContainer } from '../components/classification/Classification';

class ClassificationController extends StateHandler {
    constructor (stateHandler, service, sandbox) {
        super();
        this.stateHandler = stateHandler;
        this.service = service;
        this.sandbox = sandbox;
        this.setState({
            ...this.stateHandler.getState(),
            pluginState: {
                editEnabled: true,
                transparent: false
            },
            loading: false,
            classificationContainer: null,
            histogramPopup: null,
            classifiedDataset: {},
            editOptions: {},
            indicatorData: {},
            seriesStats: {}
        });
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.addStateListener(() => {
            this.updateClassificationContainer();
            this.updateHistogramPopup();
        });
    };

    getName () {
        return 'ClassificationHandler';
    }

    async showClassificationContainer (onClose, containerOpts) {
        const { activeIndicator, indicators } = this.stateHandler.getState();
        const indicator = this.service.getIndicator(activeIndicator);
        await this.updateData();

        if (!activeIndicator || !indicators || !this.state.indicatorData) {
            return;
        }
        if (this.state.classificationContainer) {
            this.updateClassificationContainer();
        } else {
            this.updateState({
                classificationContainer: showClassificationContainer(indicators, indicator, this.getState(), this.getController(), onClose, containerOpts)
            });
        }
    }

    updateClassificationContainer () {
        if (this.state.classificationContainer) {
            const { activeIndicator, indicators } = this.stateHandler.getState();
            const indicator = this.service.getIndicator(activeIndicator);
            this.state.classificationContainer.update(indicators, indicator, this.getState());
        }
    }

    closeClassificationContainer () {
        if (this.state.classificationContainer) {
            this.state.classificationContainer.close();
            this.updateState({
                classificationContainer: null
            });
        }
    }

    showHistogramPopup () {
        if (!this.state.histogramPopup) {
            this.service.getSeriesService().setAnimating(false);
            const { activeIndicator } = this.stateHandler.getState();
            const indicator = this.service.getIndicator(activeIndicator);
            this.updateState({
                histogramPopup: showHistogramPopup({ ...this.state, activeIndicator: indicator, controller: this.getController() }, this.state.classifiedDataset, this.state.indicatorData?.data, this.state.editOptions, () => this.closeHistogramPopup())
            });
        }
    }

    closeHistogramPopup () {
        if (this.state.histogramPopup) {
            this.state.histogramPopup.close();
            this.updateState({
                histogramPopup: null
            });
        }
    }

    updateHistogramPopup () {
        if (this.state.histogramPopup) {
            const { activeIndicator } = this.stateHandler.getState();
            const indicator = this.service.getIndicator(activeIndicator);
            this.state.histogramPopup.update({ ...this.state, activeIndicator: indicator, controller: this.getController() }, this.state.classifiedDataset, this.state.indicatorData?.data, this.state.editOptions);
        }
    }

    async updateData () {
        const { activeIndicator, activeRegionset } = this.stateHandler.getState();
        const indicator = this.service.getIndicator(activeIndicator);
        const seriesStats = this.service.getSeriesService().getSeriesStats(activeIndicator);
        const indicatorData = await this.getIndicatorData(indicator, activeRegionset);
        const { data, uniqueCount, minMax } = indicatorData;
        const classifiedDataset = getClassification(data, indicator.classification, seriesStats, uniqueCount);
        const editOptions = getEditOptions(indicator, uniqueCount, minMax);
        this.updateState({
            classifiedDataset,
            editOptions,
            indicatorData,
            seriesStats
        });
    }

    async getIndicatorData (activeIndicator, activeRegionset) {
        try {
            const isSerie = !!activeIndicator.series;
            const serieSelection = isSerie ? this.service.getSeriesService().getValue() : null;

            const indicatorData = {
                hash: activeIndicator.hash,
                regionset: activeRegionset,
                data: {},
                uniqueCount: 0,
                serieSelection
            };
            const data = await this.service.getIndicatorData(activeIndicator.datasource, activeIndicator.indicator, activeIndicator.selections, activeIndicator.series, activeRegionset);
            if (data) {
                const validData = Object.fromEntries(Object.entries(data).filter(([key, val]) => val !== null && val !== undefined));
                const uniqueValues = [...new Set(Object.values(validData))].sort((a, b) => a - b);
                indicatorData.uniqueCount = uniqueValues.length;
                indicatorData.data = data;
                indicatorData.minMax = { min: uniqueValues[0], max: uniqueValues[uniqueValues.length - 1] };
            }
            return indicatorData;
        } catch (error) {
            this.log.warn('Error getting indicator data', activeIndicator, activeRegionset);
        }
    }

    initPluginState (conf, isEmbedded) {
        const state = {};
        if (isEmbedded) {
            if (conf.hasOwnProperty('transparent')) {
                state.transparent = conf.transparent;
            }
            if (conf.hasOwnProperty('allowClassification')) {
                state.editEnabled = conf.allowClassification;
            }
        }
        this.updateState({
            pluginState: {
                ...this.state.pluginState,
                ...state
            }
        });
    }

    resetPluginState (key) {
        const defaults = {
            editEnabled: true,
            transparent: false
        };
        if (defaults.hasOwnProperty(key)) {
            this.updateClassificationPluginState(key, defaults[key]);
            this.updateState({
                pluginState: {
                    ...this.state.pluginState,
                    [key]: defaults[key]
                }
            });
        }
        const eventBuilder = Oskari.eventBuilder('StatsGrid.ClassificationPluginChanged');
        this.sandbox.notifyAll(eventBuilder());
    }

    setActiveIndicator (hash) {
        this.stateHandler.getController().setActiveIndicator(hash);
    }

    updateClassification (key, value) {
        const indicator = this.service.getIndicator(this.stateHandler.getState().activeIndicator);
        const { classification } = indicator || {};
        if (classification) {
            classification[key] = value;
            validateClassification(classification);
            indicator.classification = classification;
            this.stateHandler.updateIndicator(indicator);
            const eventBuilder = Oskari.eventBuilder('StatsGrid.ClassificationChangedEvent');
            if (eventBuilder) {
                this.sandbox.notifyAll(eventBuilder(classification, { [key]: value }));
            }
        }
    }

    updateClassificationObj (obj) {
        const indicator = this.service.getIndicator(this.stateHandler.getState().activeIndicator);
        const { classification } = indicator || {};
        if (classification) {
            Object.keys(obj).forEach(key => {
                classification[key] = obj[key];
            });
            validateClassification(classification);
            indicator.classification = classification;
            this.stateHandler.updateIndicator(indicator);
            const eventBuilder = Oskari.eventBuilder('StatsGrid.ClassificationChangedEvent');
            if (eventBuilder) {
                this.sandbox.notifyAll(eventBuilder(classification, obj));
            }
        }
    }
}

const wrapped = controllerMixin(ClassificationController, [
    'showClassificationContainer',
    'closeClassificationContainer',
    'updateClassificationContainer',
    'showHistogramPopup',
    'closeHistogramPopup',
    'updateHistogramPopup',
    'setActiveIndicator',
    'updateClassification',
    'updateClassificationObj'
]);

export { wrapped as ClassificationHandler };
