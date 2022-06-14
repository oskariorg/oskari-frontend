import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

class IndicatorsHandler extends StateHandler {
    constructor (sandbox, instance) {
        super();
        this.instance = instance;
        this.sandbox = sandbox;
        this.setState({
            data: [],
            loading: false
        });
        this.updater = null;
        this.popupControls = null;
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.log = Oskari.log('Oskari.statistics.statsgrid.MyIndicatorsTab');
        this.service = this.sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
        const dataSource = this.service.getUserDatasource();
        this.userDsId = dataSource ? dataSource.id : null;
        this.eventHandlers = this.createEventHandlers();
        this.refreshIndicatorsList();
    };

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    getName () {
        return 'MyIndicatorsHandler';
    }

    refreshIndicatorsList () {
        this.updateState({
            loading: true
        });
        this.service.getIndicatorList(this.userDsId, (err, response) => {
            if (err) {
                this.log.warn('Could not list own indicators in personal data tab');
                this.updateState({
                    loading: false
                });
            } else if (response && response.complete) {
                this.updateState({
                    data: response.indicators,
                    loading: false
                });
            }
        });
    }

    getIndicatorById (id) {
        const matches = this.state.data.filter((indicator) => {
            return indicator.id === id;
        });
        if (matches.length > 0) {
            return matches[0];
        }
        // couldn't find indicator -> show an error
        Messaging.error(this.loc('tab.error.notfound'));
    }

    deleteIndicator (indicator) {
        if (this.getIndicatorById(indicator.id)) {
            this.updateState({
                loading: true
            });
            this.service.deleteIndicator(this.userDsId, indicator.id, null, null, (err, response) => {
                if (err) {
                    Messaging.error(this.loc('tab.error.notdeleted'));
                    this.updateState({
                        loading: false
                    });
                } else {
                    Messaging.success(this.loc('tab.popup.deletetitle'), this.loc('tab.popup.deleteSuccess'));
                    this.refreshIndicatorsList();
                    // Delete fires StatsGrid.DatasourceEvent -> indicator list will be refreshed if delete is successful.
                }
            });
        }
    }

    addNewIndicator () {
        const formFlyout = this.instance.getFlyoutManager().getFlyout('indicatorForm');
        formFlyout.showForm(this.userDsId);
    }

    editIndicator (data) {
        const formFlyout = this.instance.getFlyoutManager().getFlyout('indicatorForm');
        formFlyout.showForm(this.userDsId, data.id);
    }

    createEventHandlers () {
        const handlers = {
            'StatsGrid.DatasourceEvent': (event) => {
                if (event.getDatasource() === this.userDsId) {
                    this.refreshIndicatorsList();
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

    setUpdateFunc (update) {
        this.updater = update;
    }
}

const wrapped = controllerMixin(IndicatorsHandler, [
    'addNewIndicator',
    'editIndicator',
    'deleteIndicator'
]);

export { wrapped as MyIndicatorsHandler };
