import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showTableFlyout } from '../view/Table/TableFlyout';

class TableController extends StateHandler {
    constructor (stateHandler, service, sandbox) {
        super();
        this.stateHandler = stateHandler;
        this.service = service;
        this.sandbox = sandbox;
        this.setState({
            ...this.stateHandler.getState(),
            selectedRegionset: null,
            indicatorData: {},
            regionsetOptions: [],
            regions: [],
            tableFlyout: null,
            loading: false
        });
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.addStateListener(() => this.updateFlyout());
        this.eventHandlers = this.createEventHandlers();
    };

    getName () {
        return 'TableHandler';
    }

    toggleTableFlyout (show, extraOnClose) {
        if (show) {
            if (!this.state.tableFlyout) {
                this.showTableFlyout(extraOnClose);
            }
        } else {
            this.closeTableFlyout();
        }
    }

    showTableFlyout (extraOnClose) {
        this.fetchTableRegionsets();
        const currentRegionset = this.service.getRegionsets(this.service.getStateService().getRegionset());
        this.updateState({
            tableFlyout: showTableFlyout(this.getState(), this.getController(), () => {
                this.closeTableFlyout();
                if (extraOnClose) extraOnClose();
            }),
            selectedRegionset: currentRegionset
        });
        this.fetchIndicatorData();
    }

    closeTableFlyout () {
        if (this.state.tableFlyout) {
            this.state.tableFlyout.close();
            this.updateState({
                selectedRegionset: null,
                tableFlyout: null
            });
        }
    }

    updateFlyout () {
        if (this.state.tableFlyout) {
            this.state.tableFlyout.update(this.getState());
        }
    }

    setSelectedRegionset (value) {
        this.updateState({
            selectedRegionset: this.service.getRegionsets(value)
        });
        this.fetchIndicatorData();
    }

    fetchTableRegionsets () {
        this.updateState({
            regionsetOptions: this.service.getRegionsets(this.service.getSelectedIndicatorsRegions())
        });
    }

    fetchIndicatorData () {
        this.updateState({
            loading: true
        });
        const updateIndicatorData = (regions) => {
            let data = {};
            regions.forEach(reg => {
                data[reg.id] = {};
            });
            const promise = new Promise((resolve, reject) => {
                this.state.indicators?.forEach((ind, index) => {
                    this.service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, ind.series, this.state.selectedRegionset?.id, (err, indicatorData) => {
                        if (err) {
                            Messaging.error(this.loc('errors.regionsDataError'));
                            this.updateState({
                                loading: false,
                                indicatorData: {},
                                regions: []
                            });
                            return;
                        }
                        for (const key in indicatorData) {
                            const region = data[key];
                            if (!region) {
                                continue;
                            }
                            region[ind.hash] = indicatorData[key];
                            data[key] = {
                                ...data[key],
                                ...region
                            };
                        }
                    });
                    if (index === this.state.indicators.length - 1) resolve();
                });
            });
            promise.then(() => {
                this.updateState({
                    loading: false,
                    indicatorData: data
                });
            });
        };
        this.service.getRegions(this.state.selectedRegionset?.id, (err, regions) => {
            if (err) {
                // notify error!!
                Messaging.error(this.loc('errors.regionsDataError'));
                this.updateState({
                    loading: false,
                    indicatorData: {},
                    regions: []
                });
                return;
            }

            if (regions.length === 0) {
                Messaging.error(this.loc('errors.regionsDataIsEmpty'));
            }

            updateIndicatorData(regions);
            this.updateState({
                regions: regions
            });
        });
    }

    removeIndicator (indicator) {
        this.stateHandler.getController().removeIndicator(indicator);
    }

    setActiveIndicator (hash) {
        this.stateHandler.getController().setActiveIndicator(hash);
    }

    createEventHandlers () {
        const handlers = {
            'StatsGrid.ParameterChangedEvent': (event) => {
                if (this.state.tableFlyout) {
                    this.fetchIndicatorData();
                }
            },
            'StatsGrid.ClassificationChangedEvent': (event) => {
                if (event.getChanged().hasOwnProperty('fractionDigits')) {
                    if (this.state.tableFlyout) {
                        this.fetchIndicatorData();
                    }
                }
            }
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

const wrapped = controllerMixin(TableController, [
    'toggleTableFlyout',
    'closeTableFlyout',
    'setSelectedRegionset',
    'removeIndicator',
    'setActiveIndicator'
]);

export { wrapped as TableHandler };
