import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showTableFlyout } from '../view/Table/TableFlyout';

class TableController extends StateHandler {
    constructor (stateHandler, service, sandbox) {
        super();
        this.stateHandler = stateHandler;
        this.service = service;
        this.sandbox = sandbox;
        this.setState({
            indicatorData: [],
            regionsetOptions: [],
            flyout: null,
            loading: false
        });
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.addStateListener(() => this.updateFlyout());
    };

    getName () {
        return 'TableHandler';
    }

    toggleFlyout (show, extraOnClose) {
        if (show) {
            if (!this.getState().flyout) {
                this.showTableFlyout(extraOnClose);
            }
        } else {
            this.closeTableFlyout();
        }
    }

    showTableFlyout (extraOnClose) {
        this.fetchTableRegionsets();
        const { indicators, activeIndicator, activeRegionset } = this.stateHandler.getState();
        const currentRegionset = this.service.getRegionsets(activeRegionset);
        this.updateState({
            flyout: showTableFlyout(indicators, activeIndicator, currentRegionset, this.getState(), this.getController(), () => {
                this.closeTableFlyout();
                if (extraOnClose) extraOnClose();
            })
        });
        this.fetchIndicatorData();
    }

    closeTableFlyout () {
        const { flyout } = this.getState();
        if (flyout) {
            flyout.close();
            this.updateState({
                flyout: null
            });
        }
    }

    updateFlyout () {
        const state = this.getState();
        if (state.flyout) {
            const { indicators, activeIndicator, activeRegionset } = this.stateHandler.getState();
            const currentRegionset = this.service.getRegionsets(activeRegionset);
            state.flyout.update(indicators, activeIndicator, currentRegionset, state);
        }
    }

    async setSelectedRegionset (value) {
        this.updateState({
            loading: true
        });
        await this.stateHandler.setActiveRegionset(value);
        this.fetchIndicatorData();
    }

    async fetchTableRegionsets () {
        this.updateState({
            regionsetOptions: this.service.getRegionsets(await this.service.getSelectedIndicatorsRegions())
        });
    }

    fetchIndicatorData () {
        const { indicators, regions } = this.stateHandler.getState();
        if (!indicators || indicators.length < 1) return;
        this.updateState({
            loading: true
        });
        try {
            const data = {};
            if (!regions || regions.length === 0) {
                Messaging.error(this.loc('errors.regionsDataIsEmpty'));
                this.updateState({
                    loading: false,
                    indicatorData: []
                });
                return;
            }
            for (const reg of regions) {
                data[reg.id] = {};
            }

            for (const indicator of indicators) {
                const { indicatorData } = this.stateHandler.getState();
                const regionsetData = indicatorData[indicator.indicator];
                for (const key in regionsetData) {
                    const region = data[key];
                    if (!region) {
                        continue;
                    }
                    region[indicator.hash] = regionsetData[key];
                    data[key] = {
                        ...data[key],
                        ...region
                    };
                }
            }

            this.updateState({
                loading: false,
                indicatorData: regions.map(region => ({
                    key: region.id,
                    regionName: region.name,
                    data: data[region.id]
                }))
            });
        } catch (error) {
            Messaging.error(this.loc('errors.regionsDataError'));
            this.updateState({
                loading: false,
                indicatorData: []
            });
        }
    }

    removeIndicator (indicator) {
        this.stateHandler.getController().removeIndicator(indicator);
    }

    setActiveIndicator (hash) {
        this.stateHandler.getController().setActiveIndicator(hash);
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
