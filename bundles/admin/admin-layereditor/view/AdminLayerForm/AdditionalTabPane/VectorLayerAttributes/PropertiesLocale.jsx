import React from 'react';
import PropTypes from 'prop-types';
import { LabeledInput } from 'oskari-ui';
import { LocalizationComponent } from 'oskari-ui/components/LocalizationComponent';

export const PropertiesLocale = ({ locale, update, properties }) => {
    return (
        <LocalizationComponent showDivider onChange={update} value={locale}>
            { properties.map(name => <LabeledInput minimal key={name} label={name} name={name}/>) }
        </LocalizationComponent>
    );
};

PropertiesLocale.propTypes = {
    locale: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired
};
