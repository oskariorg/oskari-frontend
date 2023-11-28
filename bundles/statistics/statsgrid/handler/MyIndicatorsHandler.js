import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

class IndicatorsHandler extends StateHandler {
    constructor (sandbox, instance, formHandler) {
        super();
        this.instance = instance;
        this.sandbox = sandbox;
        this.formHandler = formHandler;
        this.setState({
            data: [],
            loading: false
        });
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

    async refreshIndicatorsList () {
        this.updateState({
            loading: true
        });
        try {
            const response = await this.service.getIndicatorList(this.userDsId);
            this.updateState({
                loading: false,
                data: response.indicators
            });
        } catch (error) {
            this.log.warn('Could not list own indicators in personal data tab');
            this.updateState({
                loading: false
            });
        }
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

    async deleteIndicator (indicator) {
        if (this.getIndicatorById(indicator.id)) {
            this.updateState({
                loading: true
            });
            try {
                await this.service.deleteIndicator(this.userDsId, indicator.id, null, null);
                Messaging.success(this.loc('tab.popup.deleteSuccess'));
                this.refreshIndicatorsList();
            } catch (error) {
                Messaging.error(this.loc('tab.error.notdeleted'));
                this.updateState({
                    loading: false
                });
            }
        }
    }

    addNewIndicator () {
        this.formHandler.getController().showIndicatorPopup(this.userDsId);
    }

    editIndicator (data) {
        this.formHandler.getController().showIndicatorPopup(this.userDsId, data.id);
    }

    openIndicator (item) {
        const flyoutManager = this.instance.getFlyoutManager();
        flyoutManager.open('search');
        const searchFlyout = flyoutManager.getFlyout('search');
        const indicatorSelector = searchFlyout.getIndicatorSelectionComponent();
        indicatorSelector.setIndicatorData(this.userDsId, item.id);
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
}

const wrapped = controllerMixin(IndicatorsHandler, [
    'addNewIndicator',
    'editIndicator',
    'deleteIndicator',
    'openIndicator'
]);

export { wrapped as MyIndicatorsHandler };
