import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { populateIndicatorOptions } from './SearchIndicatorOptionsHelper';

class IndicatorsHandler extends StateHandler {
    constructor (instance, formHandler, userDsId) {
        super();
        this.instance = instance;
        this.userDsId = userDsId;
        this.formHandler = formHandler;
        this.sandbox = instance.getSandbox();
        this.service = instance.getStatisticsService();
        this.setState({
            data: [],
            loading: false
        });
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.log = Oskari.log('Oskari.statistics.statsgrid.MyIndicatorsTab');
        this.refreshIndicatorsList();
    };

    getName () {
        return 'MyIndicatorsHandler';
    }

    async refreshIndicatorsList () {
        this.updateState({
            loading: true
        });
        try {
            populateIndicatorOptions(this.userDsId,
                response => {
                    const { indicators = [], complete = false } = response;
                    this.updateState({
                        loading: !complete,
                        data: indicators
                    });
                },
                error => Messaging.error(this.loc(error)));
        } catch (error) {
            Messaging.error(this.loc('errors.indicatorListError'));
            this.updateState({
                data: [],
                loading: false
            });
        }
    }

    getIndicatorById (id) {
        const indicator = this.getState().data.find(ind => ind.id === id);
        if (!indicator) {
            // couldn't find indicator -> show an error
            Messaging.error(this.loc('tab.error.notfound'));
        }
        return indicator;
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

    editIndicator (id) {
        this.formHandler.getController().showIndicatorPopup(this.userDsId, id);
    }
    // TODO:
    openIndicator (item) {
        const flyoutManager = this.instance.getFlyoutManager();
        flyoutManager.open('search');
        const searchFlyout = flyoutManager.getFlyout('search');
        const indicatorSelector = searchFlyout.getIndicatorSelectionComponent();
        indicatorSelector.setIndicatorData(this.userDsId, item.id);
    }
}

const wrapped = controllerMixin(IndicatorsHandler, [
    'addNewIndicator',
    'editIndicator',
    'deleteIndicator',
    'openIndicator'
]);

export { wrapped as MyIndicatorsHandler };
