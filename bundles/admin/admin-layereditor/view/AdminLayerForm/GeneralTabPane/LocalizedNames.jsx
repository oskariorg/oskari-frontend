import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, LocalizationComponent } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import styled from 'styled-components';
import { MandatoryIcon } from '../Mandatory';

const PaddedLabel = styled('div')`
    padding-bottom: 5px;
`;
const PaddingTop = styled('div')`
    padding-top: 10px;
`;
const PaddingBottom = styled('div')`
    padding-bottom: 10px;
`;

const getLabels = (bundleKey, locale = {}) => {
    const getMsg = Oskari.getMsg.bind(null, bundleKey);
    const labels = {};
    Oskari.getSupportedLanguages().forEach(language => {
        const langPrefix = typeof getMsg(`fields.locale.${language}`) === 'object' ? language : 'generic';
        labels[language] = {
            name: getMsg(`fields.locale.${langPrefix}.placeholder`, [language]),
            subtitle: getMsg(`fields.locale.${langPrefix}.descplaceholder`, [language])
        };
    });
    // mark mandatory field
    const defaultLanguage = Oskari.getSupportedLanguages()[0];
    labels[defaultLanguage].name = (<React.Fragment>
        {labels[defaultLanguage].name} <MandatoryIcon isValid={locale[defaultLanguage] && locale[defaultLanguage].name} />
    </React.Fragment>);
    return labels;
};

export const LocalizedNames = LocaleConsumer(({ layer, controller, bundleKey }) => (
    <PaddingBottom>
        <LocalizationComponent
            labels={getLabels(bundleKey, layer.locale)}
            value={layer.locale}
            languages={Oskari.getSupportedLanguages()}
            onChange={controller.setLocalizedNames}
            LabelComponent={PaddedLabel}
        >
            {/*
                The inputs have to be on direct children for LocalizationComponent.
                Can't wrap them to <StyledFormField>.
            */}
            <TextInput type='text' name='name'/>
            <PaddingTop/>
            <TextInput type='text' name='subtitle'/>
            <PaddingTop/>
        </LocalizationComponent>
    </PaddingBottom>
));
LocalizedNames.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
