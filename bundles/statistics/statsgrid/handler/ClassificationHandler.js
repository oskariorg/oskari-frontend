import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showMovableContainer } from 'oskari-ui/components/window';
import { showHistogramPopup } from '../components/manualClassification/HistogramForm';

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
        this.eventHandlers = this.createEventHandlers();
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

    createEventHandlers () {
        const handlers = {
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(ClassificationController, [
    'showClassificationContainer',
    'closeClassificationContainer',
    'updateClassificationContainer',
    'showHistogramPopup',
    'closeHistogramPopup',
    'updateHistogramPopup'
]);

export { wrapped as ClassificationHandler };
