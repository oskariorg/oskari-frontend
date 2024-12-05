import React from 'react';
import { GeneralInfoForm } from './form/GeneralInfoForm';
import { ThemeProvider } from 'oskari-ui/util';
import { PropTypes } from 'prop-types';

export const PANEL_GENERAL_INFO_ID = 'panelGeneralInfo';
export class PanelGeneralInfo extends React.Component {
    constructor (props) {
        super(props);
        const { localization, data } = props;
        this.localization = localization;
        this.data = props.data;
        this.fields = {
            name: {
                label: this.localization.name.label,
                placeholder: this.localization.name.placeholder,
                helptags: 'portti,help,publisher,name',
                tooltip: this.localization.name.tooltip,
                validator: (key, value) => this.validateName(key, value),
                value: data?.metadata?.name ? data?.metadata?.name : null
            },
            domain: {
                label: this.localization.domain.label,
                placeholder: this.localization.domain.placeholder,
                helptags: 'portti,help,publisher,domain',
                tooltip: this.localization.domain.tooltip,
                validator: (key, value) => this.validateDomain(key, value),
                value: data?.metadata?.domain ? data?.metadata?.domain : null
            },
            language: {
                value: data?.metadata?.language ? data?.metadata?.language : Oskari.getLang()
            }
        };
    };

    render () {
        return <ThemeProvider>
            <div className={'t_generalInfo'}>
                <GeneralInfoForm onChange={(key, value) => this.onChange(key, value)} data={this.fields} />
            </div>
        </ThemeProvider>;
    }

    onChange (key, value) {
        this.fields[key].value = value;
    }

    getValues () {
        const values = {
            metadata: {}
        };

        for (const key in this.fields) {
            values.metadata[key] = this.fields[key].value;
        }
        return values;
    };

    validate () {
        let errors = [];

        for (const key in this.fields) {
            const field = this.fields[key];
            if (field.validator) {
                errors = errors.concat(field.validator(key, field.value));
            }
        }
        return errors;
    }

    validateName (name, value) {
        const errors = [];
        const sanitizedValue = Oskari.util.sanitize(value);
        if (!value || !value.trim().length) {
            errors.push({
                field: name,
                error: this.localization.error.name
            });
            return errors;
        }
        if (sanitizedValue !== value) {
            errors.push({
                field: name,
                error: this.localization.error.nameIllegalCharacters
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
                error: this.localization.error.domainStart
            });
            return errors;
        }
        return errors;
    }
}

PanelGeneralInfo.propTypes = {
    data: PropTypes.object,
    localization: PropTypes.object
};
