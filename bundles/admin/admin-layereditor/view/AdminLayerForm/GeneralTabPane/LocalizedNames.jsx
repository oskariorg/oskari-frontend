import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, LocalizationComponent } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import styled from 'styled-components';

const PaddedLabel = styled('div')`
    padding-bottom: 5px;
`;
const PaddingTop = styled('div')`
    padding-top: 10px;
`;
const PaddingBottom = styled('div')`
    padding-bottom: 10px;
`;

const getLabels = bundleKey => {
    const getMsg = Oskari.getMsg.bind(null, bundleKey);
    const labels = {};
    Oskari.getSupportedLanguages().forEach(language => {
        const langPrefix = typeof getMsg(language) === 'object' ? language : 'generic';
        labels[language] = {
            name: getMsg(`${langPrefix}.placeholder`, [language]),
            subtitle: getMsg(`${langPrefix}.descplaceholder`, [language])
        };
    });
    // mark mandatory field
    const defaultLanguage = Oskari.getSupportedLanguages()[0];
    labels[defaultLanguage].name = labels[defaultLanguage].name + ' (*)';
    return labels;
};

export const LocalizedNames = LocaleConsumer(({ layer, controller, bundleKey }) => (
    <PaddingBottom>
        <LocalizationComponent
            labels={getLabels(bundleKey)}
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
