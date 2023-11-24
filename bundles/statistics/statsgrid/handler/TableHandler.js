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
            indicatorData: [],
            regionsetOptions: [],
            regions: [],
            flyout: null,
            loading: false
        });
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.addStateListener(() => this.updateFlyout());
        this.eventHandlers = this.createEventHandlers();
    };

    getName () {
        return 'TableHandler';
    }

    toggleFlyout (show, extraOnClose) {
        if (show) {
            if (!this.state.flyout) {
                this.showTableFlyout(extraOnClose);
            }
        } else {
            this.closeTableFlyout();
        }
    }

    showTableFlyout (extraOnClose) {
        this.fetchTableRegionsets();
        const currentRegionset = this.service.getRegionsets(this.stateHandler.getState().activeRegionset);
        this.updateState({
            flyout: showTableFlyout(this.getState(), this.getController(), () => {
                this.closeTableFlyout();
                if (extraOnClose) extraOnClose();
            }),
            selectedRegionset: currentRegionset
        });
        this.fetchIndicatorData();
    }

    closeTableFlyout () {
        if (this.state.flyout) {
            this.state.flyout.close();
            this.updateState({
                selectedRegionset: null,
                flyout: null
            });
        }
    }

    updateFlyout () {
        if (this.state.flyout) {
            this.state.flyout.update(this.getState());
        }
    }

    setSelectedRegionset (value) {
        this.stateHandler.getController().setActiveRegionset(value);
        this.updateState({
            selectedRegionset: this.service.getRegionsets(value)
        });
        this.fetchIndicatorData();
    }

    async fetchTableRegionsets () {
        this.updateState({
            regionsetOptions: this.service.getRegionsets(await this.service.getSelectedIndicatorsRegions())
        });
    }

    async fetchIndicatorData () {
        if (!this.state.indicators || this.state.indicators.length < 1) return;
        this.updateState({
            loading: true
        });
        try {
            let data = {};
            const regions = await this.service.getRegions(this.state.selectedRegionset?.id);
            if (regions.length === 0) {
                Messaging.error(this.loc('errors.regionsDataIsEmpty'));
                this.updateState({
                    loading: false,
                    indicatorData: [],
                    regions: []
                });
                return;
            }
            for (const reg of regions) {
                data[reg.id] = {};
            }

            const promises = this.state.indicators.map(async indicator => {
                const indicatorData = await this.service.getIndicatorData(indicator.datasource, indicator.indicator, indicator.selections, indicator.series, this.state.selectedRegionset?.id);
                for (const key in indicatorData) {
                    const region = data[key];
                    if (!region) {
                        continue;
                    }
                    region[indicator.hash] = indicatorData[key];
                    data[key] = {
                        ...data[key],
                        ...region
                    };
                }
            });

            Promise.all(promises).then(() => {
                this.updateState({
                    loading: false,
                    regions: regions,
                    indicatorData: regions.map(region => ({
                        key: region.id,
                        regionName: region.name,
                        data: data[region.id]
                    }))
                });
            });
        } catch (error) {
            Messaging.error(this.loc('errors.regionsDataError'));
            this.updateState({
                loading: false,
                indicatorData: [],
                regions: []
            });
        }
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
                if (this.state.flyout) {
                    this.fetchIndicatorData();
                }
            },
            'StatsGrid.ClassificationChangedEvent': (event) => {
                if (event.getChanged().hasOwnProperty('fractionDigits')) {
                    if (this.state.flyout) {
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
    'toggleFlyout',
    'closeTableFlyout',
    'setSelectedRegionset',
    'removeIndicator',
    'setActiveIndicator'
]);

export { wrapped as TableHandler };
