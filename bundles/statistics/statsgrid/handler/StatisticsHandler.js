import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { TableHandler } from './TableHandler';
import { SearchHandler } from './SearchHandler';
import { DiagramHandler } from './DiagramHandler';

class StatisticsController extends StateHandler {
    constructor (instance, sandbox) {
        super();
        this.instance = instance;
        this.sandbox = sandbox;
        this.service = this.sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
        this.searchHandler = new SearchHandler(this, this.service, this.instance, this.sandbox);
        this.tableHandler = new TableHandler(this, this.service, this.sandbox);
        this.diagramHandler = new DiagramHandler(this, this.service, this.sandbox);
        this.setState({
            indicators: [],
            activeIndicator: null
        });
        Oskari.on('app.start', () => {
            this.fetchIndicators();
        });
        this.addStateListener(state => {
            this.searchHandler.updateState({
                ...state
            });
            this.tableHandler.updateState({
                ...state
            });
            this.diagramHandler.updateState({
                ...state
            });
        });
        this.eventHandlers = this.createEventHandlers();
    };

    getName () {
        return 'StatisticsHandler';
    }

    getSearchHandler () {
        return this.searchHandler;
    }

    getTableHandler () {
        return this.tableHandler;
    }

    getDiagramHandler () {
        return this.diagramHandler;
    }

    fetchIndicators () {
        const indicators = [];
        this.service.getStateService().getIndicators().forEach(indicator => {
            this.service.getUILabels(indicator, labels => {
                indicators.push({
                    ...indicator,
                    labels: labels
                });
            });
        });
        this.updateState({
            indicators: indicators,
            activeIndicator: this.service.getStateService().getActiveIndicator()?.hash
        });
    }

    removeIndicator (indicator) {
        this.service.getStateService().removeIndicator(indicator.datasource, indicator.indicator, indicator.selections, indicator.series);
        this.fetchIndicators();
    }

    setActiveIndicator (hash) {
        this.service.getStateService().setActiveIndicator(hash);
        this.updateState({
            activeIndicator: hash
        });
    }

    createEventHandlers () {
        const handlers = {
            'StatsGrid.ActiveIndicatorChangedEvent': (event) => {
                const current = event.getCurrent();
                this.updateState({
                    activeIndicator: current?.hash
                });
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

const wrapped = controllerMixin(StatisticsController, [
    'getSearchHandler',
    'getTableHandler',
    'getDiagramHandler',
    'removeIndicator',
    'fetchIndicators',
    'setActiveIndicator'
]);

export { wrapped as StatisticsHandler };
