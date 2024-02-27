import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { getContainerOptions, createSeriesControlPlugin, createTogglePlugin } from '../helper/ViewHelper';
import { showTableFlyout } from '../view/Table/TableFlyout';
import { showSearchFlyout } from '../view/search/SearchFlyout';
import { showDiagramFlyout } from '../view/Diagram/DiagramFlyout';
import { showIndicatorForm } from '../view/Form/IndicatorForm';
import { showClipboardPopup } from '../view/Form/ClipboardPopup';
import { showClassificationContainer } from '../components/classification/Classification';
import { showHistogramPopup } from '../components/manualClassification/HistogramForm';

export const FLYOUTS = ['search', 'grid', 'diagram']; // to toggle tile

const classificationDefaults = {
    editEnabled: true,
    transparent: false
};
const embeddedTools = [...FLYOUTS, 'classification'];

class UIHandler extends StateHandler {
    constructor (instance, stateHandler, searchHandler) {
        super();
        this.instance = instance;
        this.tile = instance.getTile();
        this.stateHandler = stateHandler;
        this.searchHandler = searchHandler;
        this.formHandler = null;

        this.setState({
            layer: {
                opacity: 100, // store layer opacity to trigger update
                visible: true,
                onMap: false
            },
            mapButtons: [], // publisher tools & thematic controls
            activeMapButtons: [], // store active tools to state to trigger update
            classification: { ...classificationDefaults }
        });
        this.log = Oskari.log('Oskari.statistics.statsgrid.ViewHandler');
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.controls = {};
        this.seriesControlPlugin = null; // doesn't use React movable container yet
        this.togglePlugin = null;

        this.tile.setupTools(this);
        this.addStateListener(state => this.onViewChange(state));
        this.stateHandler.addStateListener(state => this.onStateChange(state));
        this.searchHandler.addStateListener(state => this.onSearchChange(state));
    };

    getName () {
        return 'ViewHandler';
    }

    setEmbeddedTools (conf) {
        const mapButtons = embeddedTools.filter(tool => conf[tool]);
        const activeMapButtons = embeddedTools.filter(id => this.controls[id]);
        this.updateState({ mapButtons, activeMapButtons });
    }

    setIndicatorFormHandler (formHandler) {
        formHandler.addStateListener(state => {
            const { indicatorForm, clipboard } = this.controls;
            if (indicatorForm) {
                indicatorForm.update(state);
            }
            if (clipboard) {
                clipboard.update(state);
            }
        });
        this.formHandler = formHandler;
    }

    onViewChange (viewState) {
        const state = this.stateHandler.getState();
        const { classification, series } = this.controls;

        const hasIndicators = state.indicators.length > 0;
        const { onMap, visible } = viewState.layer;
        const isActive = onMap && visible && hasIndicators;

        // automaticly shown/closed views
        if (isActive) {
            if (classification) {
                classification.update(state, viewState);
            } else {
                this.show('classification');
            }
            if (state.isSeriesActive) {
                if (series) {
                    series.update(state);
                } else {
                    this.show('series');
                }
            }
        } else {
            this.close('classification');
            this.close('series');
        }
        // create toggle plugin only when needed
        if (viewState.mapButtons.length > 0 && !this.togglePlugin) {
            const sandbox = this.instance.getSandbox();
            this.togglePlugin = createTogglePlugin(sandbox, this);
        }
        if (this.togglePlugin) {
            this.togglePlugin.refresh(viewState);
        }
    }

    onStateChange (state) {
        const skip = ['indicatorForm', 'clipboard', 'metadata'];
        Object.keys(this.controls).forEach(id => {
            const control = this.controls[id];
            if (!control || skip.includes(id)) {
                return;
            }
            if (id === 'search') {
                const searchState = this.searchHandler.getState();
                control.update(searchState, state.indicators);
            } else if (id === 'classification' || id === 'histogram') {
                const viewState = this.getState();
                control.update(state, viewState);
            } else {
                control.update(state);
            }
        });
        if (state.isSeriesActive && !this.controls.series) {
            this.show('series');
        }
    }

    onSearchChange (state) {
        const control = this.controls.search;
        if (control) {
            control.update(state, this.stateHandler.getState().indicators);
        }
    }

    addMapButton (id) {
        const mapButtons = [...this.getState().mapButtons, id];
        this.updateState({ mapButtons });
    }

    removeMapButton (id) {
        const mapButtons = this.getState().mapButtons.filter(btn => btn !== id);
        this.updateState({ mapButtons });
    }

    updateLayer (key, value) {
        this.updateState({ layer: {
            ...this.getState().layer,
            [key]: value
        } });
    }

    // if value isn't given => reset to default
    updateClassificationState (key, value = classificationDefaults[key]) {
        const classification = { ...this.getState().classification };
        classification[key] = value;
        this.updateState({ classification });
    }

    toggle (id) {
        if (this.controls[id]) {
            this.close(id);
        } else {
            this.show(id);
        }
    }

    show (id) {
        if (!id || this.controls[id]) {
            // already shown, do nothing
            return;
        }
        const onClose = () => this.close(id);
        const state = this.stateHandler.getState();
        const controller = this.stateHandler.getController();

        let controls = null;
        if (id === 'search') {
            const searchState = this.searchHandler.getState();
            const searchController = this.searchHandler.getController();
            controls = showSearchFlyout(searchState, state.indicators, searchController, controller, onClose);
        } else if (id === 'grid') { // stored state u
            controls = showTableFlyout(state, controller, onClose);
        } else if (id === 'diagram') {
            controls = showDiagramFlyout(state, controller, onClose);
        } else if (id === 'classification') {
            const opts = getContainerOptions(this.togglePlugin);
            const showHistogram = () => this.show('histogram');
            controls = showClassificationContainer(state, this.getState(), controller, opts, showHistogram, onClose);
        } else if (id === 'histogram') {
            controls = showHistogramPopup(state, this.getState(), controller, onClose);
        } else if (id === 'metadata') {
            // For now search handler opens metadata popup
            // const { selectedDatasource, selectedIndicators } = this.searchHandler.getState();
            // const data = await this.prepareMetadataPopupData(selectedDatasource, selectedIndicators);
            // controls = showMedataPopup(data, onClose);
        } else if (id === 'indicatorForm' && this.formHandler) {
            const onCloseWrapper = () => {
                // TODO: reset on open to get rid of wrapper and forma handler's close methods
                this.formHandler.closeIndicatorPopup();
                onClose();
            };
            controls = showIndicatorForm(this.formHandler.getState(), this.formHandler.getController(), onCloseWrapper);
        } else if (id === 'clipboard' && this.formHandler) {
            controls = showClipboardPopup(this.formHandler.getState(), this.formHandler.getController(), onClose);
        } else if (id === 'series') {
            controls = this._createSeriesControls();
        } else {
            this.log.warn(`Tried to show view with id: ${id}`);
            return;
        }
        this.controls[id] = controls;
        this.notifyExtensions(id, true);
    }
    _createSeriesControls () {
        if (!this.seriesControlPlugin) {
            this.seriesControlPlugin = createSeriesControlPlugin(this.instance.getSandbox(), this.stateHandler);
        } else if (!this.seriesControlPlugin.getElement()) {
            this.seriesControlPlugin.redrawUI();
        }
        this.seriesControlPlugin.refresh();

        const close = () => this.seriesControlPlugin.stopPlugin();
        const update = state => {
            if (state.isSeriesActive) {
                this.seriesControlPlugin.refresh(state);
            } else {
                this.close('series');
            }
        };
        return { update, close };
    }

    close (id) {
        if (this.controls[id]) {
            this.controls[id].close();
        }
        this.controls[id] = null;
        this.notifyExtensions(id, false);
    }

    closeAll (skipSearch) {
        Object.keys(this.controls).forEach(id => {
            if (skipSearch && id === 'search') {
                return;
            }
            this.close(id);
        });
    }

    notifyExtensions (viewId, isOpen) {
        if (FLYOUTS.includes(viewId)) {
            this.tile.toggleExtension(viewId, isOpen);
        }
        if (this.togglePlugin && embeddedTools.includes(viewId)) {
            const activeMapButtons = embeddedTools.filter(viewId => this.controls[viewId]);
            this.updateState({ activeMapButtons });
        }
    }
}

const wrapped = controllerMixin(UIHandler, [
    'addMapButton',
    'removeMapButton',
    'toggle',
    'show',
    'close',
    'closeAll',
    'updateClassificationState',
    'updateLayer'
]);

export { wrapped as ViewHandler };
