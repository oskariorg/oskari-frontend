import React from 'react';
import PropTypes from 'prop-types';
import { LabeledInput } from 'oskari-ui';
import { LocalizationComponent } from 'oskari-ui/components/LocalizationComponent';

export const PropertiesLocale = ({ locale, update, properties }) => {
    // TODO: add toggle to show/hide filtered properties
    return (
        <LocalizationComponent showDivider onChange={update} value={locale}>
            { properties.map(prop => <LabeledInput minimal key={prop} label={prop} name={prop}/>) }
        </LocalizationComponent>
    );
};

PropertiesLocale.propTypes = {
    locale: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired
};
