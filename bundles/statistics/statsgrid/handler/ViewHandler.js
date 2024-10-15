import { AsyncStateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { getContainerOptions, createSeriesControlPlugin, createTogglePlugin, stopTogglePlugin } from '../helper/ViewHelper';
import { showTableFlyout } from '../view/Table/TableFlyout';
import { showSearchFlyout } from '../view/search/SearchFlyout';
import { showDiagramFlyout } from '../view/Diagram/DiagramFlyout';
import { showIndicatorForm } from '../view/Form/IndicatorForm';
import { showClipboardPopup } from '../view/Form/ClipboardPopup';
import { showClassificationContainer } from '../components/classification/Classification';
import { showHistogramPopup } from '../components/manualClassification/HistogramForm';
import { showMedataPopup } from '../components/description/MetadataPopup';

export const FLYOUTS = ['search', 'grid', 'diagram']; // to toggle tile

const CLASSIFICATION = 'classification';
const SERIES = 'series';
const classificationDefaults = {
    editEnabled: true,
    transparent: false
};
const embeddedTools = [...FLYOUTS, CLASSIFICATION, SERIES];

class UIHandler extends AsyncStateHandler {
    constructor (instance, stateHandler, searchHandler) {
        super();
        this.instance = instance;
        this.tile = instance.getTile();
        this.stateHandler = stateHandler;
        this.searchHandler = searchHandler;
        this.formHandler = null;

        this.setState({
            layer: {
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
        const classification = {
            ...this.getState().classification,
            editEnabled: !!conf?.allowClassification,
            transparent: !!conf?.transparent
        };
        this.updateState({ mapButtons, activeMapButtons, classification });
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
        const hasClassificationButton = viewState.mapButtons.includes(CLASSIFICATION);
        const hasSeriesButton = viewState.mapButtons.includes(SERIES);
        if (isActive) {
            if (classification) {
                classification.update(state, viewState);
            } else if (!hasClassificationButton) {
                // classification always visible except when there is a button to show it
                this.show(CLASSIFICATION);
            }

            if (state.isSeriesActive) {
                if (series) {
                    series.update(state);
                } else if (!hasSeriesButton) {
                    // series is always visible except when there is a button to show it
                    this.show(SERIES);
                }
            }
        } else {
            this.close(CLASSIFICATION);
            this.close(SERIES);
        }
        // create toggle plugin only when needed
        if (viewState.mapButtons.length > 0 && !this.togglePlugin) {
            const sandbox = this.instance.getSandbox();
            this.togglePlugin = createTogglePlugin(sandbox, this);
        }
        if (this.togglePlugin) {
            if (viewState.mapButtons.length > 0) {
                this.togglePlugin.refresh(viewState);
            } else {
                const sandbox = this.instance.getSandbox();
                stopTogglePlugin(sandbox, this.togglePlugin);
                this.togglePlugin = null;
            }
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
            } else if (id === CLASSIFICATION || id === 'histogram') {
                const viewState = this.getState();
                control.update(state, viewState);
            } else {
                control.update(state);
            }
        });
        // on active indicator change single => serie  show
        // update closes ui on series => single
        if (state.isSeriesActive && !this.controls.series) {
            const { layer, mapButtons } = this.getState();
            const hasSeriesButton = mapButtons.includes(SERIES);
            const isActive = layer.onMap && layer.visible && state.indicators.length > 0;
            if (isActive && !hasSeriesButton) {
                // series is always visible if active except when there is a button to show it
                this.show(SERIES);
            }
        }
    }

    onSearchChange (state) {
        const { search, metadata} = this.controls;
        if (search) {
            search.update(state, this.stateHandler.getState().indicators);
        }
        if (metadata) {
            const ds = state.selectedDatasource;
            const indicators = state.selectedIndicators.map(id => ({ id, ds }));
            metadata.update(indicators);
        }
    }

    addMapButton (id) {
        const mapButtons = [...this.getState().mapButtons, id];
        /*
        if (id === CLASSIFICATION && this.controls[id]) {
            // classification is by default open while the other windows are not
            // close it if we add the button for classification
            // FIXME: this makes classification duplicate itself when toggled with the other buttons.
            // lets keep it open and recalculate the activeMapButtons so it's activated since its open by default
            this.close(id);
        }
        */
        const activeMapButtons = mapButtons.filter(id => this.controls[id]);
        this.updateState({ mapButtons, activeMapButtons });
    }

    removeMapButton (id) {
        const mapButtons = this.getState().mapButtons.filter(btn => btn !== id);
        const activeMapButtons = mapButtons.filter(id => this.controls[id]);
        this.updateState({ mapButtons, activeMapButtons });
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
            return;
        }
        if (id === SERIES && !this.stateHandler.getState().isSeriesActive) {
            Messaging.warn(this.loc('errors.cannotDisplayAsSeries'));
            return;
        }
        this.show(id);
    }

    openSearchWithSelections (indicator) {
        this.searchHandler.getController().populateForm(indicator);
        this.show('search');
    }

    openMetadataPopup (indicators) {
        const { metadata } = this.controls;
        if (metadata) {
            metadata.update(indicators);
            return;
        }
        this.controls.metadata = showMedataPopup(indicators, () => this.close('metadata'));
    }

    show (id) { // TODO: use optional options/params??
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
        } else if (id === CLASSIFICATION) {
            const opts = getContainerOptions(this.togglePlugin);
            const showHistogram = () => this.show('histogram');
            controls = showClassificationContainer(state, this.getState(), controller, opts, showHistogram, onClose);
        } else if (id === 'histogram') {
            controls = showHistogramPopup(state, this.getState(), controller, onClose);
        } else if (id === 'indicatorForm' && this.formHandler) {
            const onCloseWrapper = () => {
                this.close('clipboard');
                onClose();
            };
            controls = showIndicatorForm(this.formHandler.getState(), this.formHandler.getController(), onCloseWrapper);
        } else if (id === 'clipboard' && this.formHandler) {
            controls = showClipboardPopup(this.formHandler.getController(), onClose);
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
    'updateLayer',
    'openMetadataPopup',
    'openSearchWithSelections'
]);

export { wrapped as ViewHandler };
