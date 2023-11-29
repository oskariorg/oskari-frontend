import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showDiagramFlyout } from '../view/Diagram/DiagramFlyout';
import { getClassification } from '../helper/ClassificationHelper';

class DiagramController extends StateHandler {
    constructor (stateHandler, service, sandbox) {
        super();
        this.stateHandler = stateHandler;
        this.service = service;
        this.sandbox = sandbox;
        this.setState({
            sortOrder: 'value-descending',
            flyout: null,
            loading: false
        });
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.addStateListener(() => this.updateFlyout());
        this.eventHandlers = this.createEventHandlers();
    };

    getName () {
        return 'DiagramHandler';
    }

    toggleFlyout (show, extraOnClose) {
        if (show) {
            if (!this.state.flyout) {
                this.updateData();
                this.showDiagramFlyout(extraOnClose);
            }
        } else {
            this.closeDiagramFlyout();
        }
    }

    showDiagramFlyout (extraOnClose) {
        const { indicators, activeIndicator } = this.stateHandler.getState();
        this.updateState({
            flyout: showDiagramFlyout(indicators, activeIndicator, this.getState(), this.getController(), () => {
                this.closeDiagramFlyout();
                if (extraOnClose) extraOnClose();
            }),
            sortOrder: 'value-descending'
        });
    }

    closeDiagramFlyout () {
        if (this.state.flyout) {
            this.state.flyout.close();
            this.updateState({
                flyout: null,
                sortOrder: 'value-descending'
            });
        }
    }

    updateFlyout () {
        if (this.state.flyout) {
            const { indicators, activeIndicator } = this.stateHandler.getState();
            this.state.flyout.update(indicators, activeIndicator, this.getState());
        }
    }

    setSortOrder (order) {
        this.updateState({
            sortOrder: order
        });
    }

    setActiveIndicator (hash) {
        this.stateHandler.getController().setActiveIndicator(hash);
    }

    getColorScale (data) {
        let numericData = {};
        data.forEach((entry) => {
            numericData[entry.id] = entry.value;
        });
        const activeIndicator = this.stateHandler.getState().indicators?.find(indicator => indicator.hash === this.stateHandler.getState().activeIndicator);
        const { groups, bounds, error } = getClassification(numericData, activeIndicator?.classification);
        if (error) {
            return ['#555'];
        }
        return {
            bounds: bounds.slice(1, bounds.length - 1),
            values: groups.map(group => group.color)
        };
    }

    async updateData () {
        const indicator = this.service.getIndicator(this.stateHandler.getState().activeIndicator);
        if (!indicator) return;

        this.updateState({
            loading: true
        });

        const data = await this.getIndicatorData(indicator);
        if (!data || data.every(d => d.value === undefined)) {
            this.updateState({
                loading: false
            });
            return;
        }

        const { fractionDigits } = indicator.classification;
        const digits = typeof fractionDigits === 'number' ? fractionDigits : 1;
        const formatter = Oskari.getNumberFormatter(digits);
        const chartOptions = {
            colors: this.getColorScale(data),
            valueRenderer: function (val) {
                if (typeof val !== 'number') {
                    return null;
                }
                return formatter.format(val);
            },
            margin: {
                top: 0,
                bottom: 20,
                left: 50,
                right: 50,
                maxForLabel: 140
            },
            width: 600
        };
        this.updateState({
            loading: false,
            chartData: {
                data,
                chartOptions
            }
        });
    }

    async getIndicatorData (ind) {
        const setId = this.stateHandler.getState().activeRegionset;
        const { datasource, indicator, selections, series } = ind;
        try {
            const regions = await this.service.getRegions(setId);
            const indicatorData = await this.service.getIndicatorData(datasource, indicator, selections, series, setId);
            const data = regions.map(({ id, name }) => {
                const value = indicatorData[id];
                return { id, name, value };
            });
            return data;
        } catch (error) {
            Messaging.error(this.loc('errors.regionsDataError'));
        }
    }

    createEventHandlers () {
        const handlers = {
            'StatsGrid.ParameterChangedEvent': (event) => {
                if (this.state.flyout) {
                    this.updateData();
                }
            },
            'StatsGrid.ClassificationChangedEvent': (event) => {
                if (event.getChanged().hasOwnProperty('fractionDigits')) {
                    if (this.state.flyout) {
                        this.updateData();
                    }
                }
            },
            'StatsGrid.RegionsetChangedEvent': (event) => {
                if (this.state.flyout) {
                    this.updateData();
                }
            },
            'StatsGrid.ActiveIndicatorChangedEvent': (event) => {
                if (this.state.flyout) {
                    this.updateData();
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

const wrapped = controllerMixin(DiagramController, [
    'toggleFlyout',
    'closeDiagramFlyout',
    'setActiveIndicator',
    'setSortOrder'
]);

export { wrapped as DiagramHandler };
