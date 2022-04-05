import { StateHandler, controllerMixin } from 'oskari-ui/util';

class IndicatorsHandler extends StateHandler {
    constructor (consumer, instance) {
        super();
        this.instance = instance;
        this.sandbox = this.instance.getSandbox();
        this.setState({
            data: []
        });
        this.updater = null;
        this.popupControls = null;
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.log = Oskari.log('Oskari.statistics.statsgrid.MyIndicatorsTab');
        this.service = Oskari.clazz.create('Oskari.statistics.statsgrid.StatisticsService', this.sandbox, this.loc);
        this.userDsId = this.service.getUserDatasource() ? this.service.getUserDatasource().id : null;
        this.addStateListener(consumer);
    };

    popupCleanup () {
        if (this.popupControls) this.popupControls.close();
        this.popupControls = null;
    }

    getName () {
        return 'MyIndicatorsHandler';
    }

    refreshIndicatorsList () {
        this.service.getIndicatorList(this.userDsId, (err, response) => {
            if (err) {
                this.log.warn('Could not list own indicators in personal data tab');
            } else if (response && response.complete) {
                this.updateState({
                    data: response.indicators
                });
            }
        });
    }

    _getIndicatorById (id) {
        const matches = this.state.data.filter((indicator) => {
            return indicator.id === id;
        });
        if (matches.length > 0) {
            return matches[0];
        }
        // couldn't find indicator -> show an error
        this.showErrorMessage(this.loc('tab.error.notfound'));
    }

    deleteIndicator (indicator) {
        if (this.getIndicatorById(indicator.id)) {
            this.service.deleteIndicator(this.userDsId, indicator.id, null, null, (err, response) => {
                if (err) {
                    this.showErrorMessage(this.loc('tab.error.notdeleted'));
                } else {
                    const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                    dialog.show(this.loc('tab.popup.deletetitle'), this.loc('tab.popup.deleteSuccess'));
                    dialog.fadeout();
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

    showErrorMessage (title, message, buttonText) {
        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        const button = dialog.createCloseButton(buttonText);
        button.addClass('primary');
        dialog.show(title, message, [button]);
    }
}

const wrapped = controllerMixin(IndicatorsHandler, [
    'addNewIndicator',
    'editIndicator',
    'deleteIndicator'
]);

export { wrapped as MyIndicatorsHandler };
