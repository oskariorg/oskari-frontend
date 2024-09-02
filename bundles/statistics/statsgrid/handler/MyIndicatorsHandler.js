import { AsyncStateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { populateIndicatorOptions } from './SearchIndicatorOptionsHelper';
import { deleteIndicator } from './IndicatorHelper';

class IndicatorsHandler extends AsyncStateHandler {
    constructor (instance, formHandler, userDsId) {
        super();
        this.instance = instance;
        this.userDsId = userDsId;
        this.formHandler = formHandler;
        this.sandbox = instance.getSandbox();
        this.setState({
            indicators: [],
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
                        indicators
                    });
                },
                error => {
                    this.updateState({ loading: false });
                    Messaging.error(this.loc(error));
                });
        } catch (error) {
            Messaging.error(this.loc('errors.indicatorListError'));
            this.updateState({
                indicators: [],
                loading: false
            });
        }
    }

    getIndicatorById (id) {
        const indicator = this.getState().indicators.find(ind => ind.id === id);
        if (!indicator) {
            // couldn't find indicator -> show an error
            Messaging.error(this.loc('tab.error.notfound'));
        }
        return indicator;
    }

    async deleteIndicator (id) {
        const indicator = this.getIndicatorById(id);
        if (!indicator) {
            Messaging.error(this.loc('tab.error.notdeleted'));
            return;
        }
        this.updateState({ loading: true });
        try {
            // removes all indicator data (no selections or regionset)
            await deleteIndicator({ ...indicator, ds: this.userDsId });
            Messaging.success(this.loc('tab.popup.deleteSuccess'));
            this.refreshIndicatorsList();
        } catch (error) {
            this.updateState({ loading: false });
        }
    }

    addNewIndicator () {
        this.formHandler.getController().showIndicatorPopup(this.userDsId);
    }

    editIndicator (id) {
        this.formHandler.getController().showIndicatorPopup(this.userDsId, id);
    }
    openIndicator (indicator) {
        const viewHandler = this.instance.getViewHandler();
        viewHandler?.openSearchWithSelections({ ds: this.userDsId, ...indicator });
    }
}

const wrapped = controllerMixin(IndicatorsHandler, [
    'addNewIndicator',
    'editIndicator',
    'deleteIndicator',
    'openIndicator'
]);

export { wrapped as MyIndicatorsHandler };
