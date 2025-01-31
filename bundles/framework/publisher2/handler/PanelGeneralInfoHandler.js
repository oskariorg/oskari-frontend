import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { PUBLISHER_BUNDLE_ID } from '../view/PublisherSideBarHandler';

class UIHandler extends StateHandler {
    constructor () {
        super();
        this.state = {
            name: null,
            domain: null,
            language: null
        };
    }

    init (data) {
        const { name, domain, language } = data?.metadata || {};
        this.updateState({
            name: name || null,
            domain: domain || null,
            language: language || Oskari.getLang()
        });
    }

    getValues () {
        return {
            metadata: {
                ...this.getState()
            }
        };
    };

    onChange (key, value) {
        const { oldState } = this.getState();
        const newState = {
            ...oldState
        };
        newState[key] = value;
        this.updateState({
            ...newState
        });
    }

    validate () {
        let errors = [];
        const { name, domain } = this.state;
        errors = errors.concat(this.validateName(name));
        errors = errors.concat(this.validateDomain(domain));
        return errors;
    }

    validateName (value) {
        const errors = [];
        const sanitizedValue = Oskari.util.sanitize(value);
        if (!value || !value.trim().length) {
            errors.push({
                field: name,
                error: Oskari.getMsg(PUBLISHER_BUNDLE_ID, 'BasicView.error.name')
            });
            return errors;
        }
        if (sanitizedValue !== value) {
            errors.push({
                field: name,
                error: Oskari.getMsg(PUBLISHER_BUNDLE_ID, 'BasicView.error.nameIllegalCharacters')
            });
            return errors;
        }
        return errors;
    }

    validateDomain (name, value) {
        const errors = [];
        if (value && value.indexOf('://') !== -1) {
            errors.push({
                field: name,
                error: Oskari.getMsg(PUBLISHER_BUNDLE_ID, 'BasicView.error.domainStart')
            });
            return errors;
        }
        return errors;
    }
}

const wrapped = controllerMixin(UIHandler, [
    'validate',
    'getValues',
    'onChange'
]);

export { wrapped as PanelGeneralInfoHandler };
