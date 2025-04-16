import React from 'react';
import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { GeneralInfoForm } from '../view/form/GeneralInfoForm';

class UIHandler extends StateHandler {
    constructor (sandbox) {
        super();
        this.setState({
            name: null,
            domain: null,
            language: null
        });
    }

    init (data) {
        const { name, domain, language = Oskari.getLang() } = data?.metadata || {};
        this.updateState({ name, domain, language });
    }

    getPanelContent () {
        return <GeneralInfoForm {...this.getState()} controller={this.getController()}/>;
    }

    getValues () {
        return {
            metadata: {
                ...this.getState()
            }
        };
    }

    onChange (key, value) {
        this.updateState({ [key]: value });
    }

    validate () {
        const { name, domain } = this.getState();
        return [...this.validateName(name), ...this.validateDomain(domain)];
    }

    validateName (value) {
        if (!value || !value.trim().length) {
            return [{
                field: 'name',
                error: 'BasicView.error.name'
            }];
        }
        const sanitizedValue = Oskari.util.sanitize(value);
        if (sanitizedValue !== value) {
            return [{
                field: 'name',
                error: 'BasicView.error.nameIllegalCharacters'
            }];
        }
        return [];
    }

    validateDomain (value) {
        if (value && value.indexOf('://') !== -1) {
            return [{
                field: 'domain',
                error: 'BasicView.error.domainStart'
            }];
        }
        return [];
    }
}

const wrapped = controllerMixin(UIHandler, [
    'onChange'
]);

export { wrapped as PanelGeneralInfoHandler };
