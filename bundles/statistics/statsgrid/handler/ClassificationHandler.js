import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showMovableContainer } from 'oskari-ui/components/window';
import { showHistogramPopup } from '../components/manualClassification/HistogramForm';
import { validateClassification } from '../helper/ClassificationHelper';

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
            histogramPopup: null
        });
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
    };

    getName () {
        return 'ClassificationHandler';
    }

    showClassificationContainer (ui, onClose, containerOpts) {
        if (this.state.classificationContainer) {
            this.updateClassificationContainer(ui);
        } else {
            this.updateState({
                classificationContainer: showMovableContainer(ui, onClose, containerOpts)
            });
        }
    }

    updateClassificationContainer (ui) {
        if (this.state.classificationContainer) {
            this.state.classificationContainer.update(ui);
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

    showHistogramPopup (state, classifiedDataset, data, editOptions) {
        if (!this.state.histogramPopup) {
            this.service.getSeriesService().setAnimating(false);
            this.updateState({
                histogramPopup: showHistogramPopup(state, classifiedDataset, data, editOptions, () => this.closeHistogramPopup())
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

    updateHistogramPopup (state, classifiedDataset, data, editOptions) {
        if (this.state.histogramPopup) {
            this.state.histogramPopup.update(state, classifiedDataset, data, editOptions);
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
        const { classification } = this.service.getIndicator(this.stateHandler.getState().activeIndicator) || {};
        if (classification) {
            classification[key] = value;
            validateClassification(classification);
            const eventBuilder = Oskari.eventBuilder('StatsGrid.ClassificationChangedEvent');
            if (eventBuilder) {
                this.sandbox.notifyAll(eventBuilder(classification, { [key]: value }));
            }
        }
    }

    updateClassificationObj (obj) {
        const { classification } = this.service.getIndicator(this.stateHandler.getState().activeIndicator) || {};
        if (classification) {
            Object.keys(obj).forEach(key => {
                classification[key] = obj[key];
            });
            validateClassification(classification);
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
