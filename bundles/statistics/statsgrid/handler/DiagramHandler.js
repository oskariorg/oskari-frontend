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
            if (!this.getState().flyout) {
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
        if (this.getState().flyout) {
            this.getState().flyout.close();
            this.updateState({
                flyout: null,
                sortOrder: 'value-descending'
            });
        }
    }

    updateFlyout () {
        if (this.getState().flyout) {
            const { indicators, activeIndicator } = this.stateHandler.getState();
            this.getState().flyout.update(indicators, activeIndicator, this.getState());
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

        const data = await this.getDiagramData(indicator);
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

    async getDiagramData (ind) {
        const setId = this.stateHandler.getState().activeRegionset;
        const { hash } = ind;
        try {
            const regions = await this.service.getRegions(setId);
            const { indicatorData } = this.stateHandler.getState();
            const data = indicatorData[hash];
            const diagramData = regions.map(({ id, name }) => {
                const value = data[id];
                return { id, name, value };
            });
            return diagramData;
        } catch (error) {
            Messaging.error(this.loc('errors.regionsDataError'));
        }
    }

    createEventHandlers () {
        const handlers = {
            'StatsGrid.StateChangedEvent': () => {
                this.updateData();
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
