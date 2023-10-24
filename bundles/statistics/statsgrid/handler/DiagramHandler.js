import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showDiagramFlyout } from '../view/Diagram/DiagramFlyout';

class DiagramController extends StateHandler {
    constructor (stateHandler, service, sandbox) {
        super();
        this.stateHandler = stateHandler;
        this.service = service;
        this.sandbox = sandbox;
        this.setState({
            ...this.stateHandler.getState(),
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
        this.updateState({
            flyout: showDiagramFlyout(this.getState(), this.getController(), () => {
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
            this.state.flyout.update(this.getState());
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
        // Format data for Oskari.statistics.statsgrid.ClassificationService.getClassification
        let numericData = {};
        data.forEach((entry) => {
            numericData[entry.id] = entry.value;
        });
        const activeIndicator = this.state.indicators?.find(indicator => indicator.hash === this.state.activeIndicator);
        const { groups, bounds, error } = this.service.getClassificationService().getClassification(numericData, activeIndicator?.classification);
        if (error) {
            return ['#555'];
        }
        return {
            bounds: bounds.slice(1, bounds.length - 1),
            values: groups.map(group => group.color)
        };
    }

    updateData () {
        const indicator = this.service.getStateService().getActiveIndicator();
        if (!indicator) return;

        this.updateState({
            loading: true
        });

        this.getIndicatorData(indicator, (data) => {
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
                chartData: {
                    data,
                    chartOptions
                }
            });
        });
        this.updateState({
            loading: false
        });
    }

    getIndicatorData (ind, callback) {
        const setId = this.service.getStateService().getRegionset();
        const { datasource, indicator, selections, series } = ind;
        this.service.getRegions(setId, (err, regions) => {
            if (err) {
                callback();
                return;
            }
            this.service.getIndicatorData(datasource, indicator, selections, series, setId, (err, data) => {
                if (err) {
                    callback();
                    return;
                }
                const response = regions.map(({ id, name }) => {
                    const value = data[id];
                    return { id, name, value };
                });
                callback(response);
            });
        });
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
