import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, LocalizationComponent } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { StyledComponentGroup } from '../StyledFormComponents';
import styled from 'styled-components';

const PaddedLabel = styled('div')`
    padding-bottom: 5px;
`;
const Padding = styled('div')`
    padding-top: 10px;
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
    return labels;
};

export const LocalizedNames = LocaleConsumer(({ layer, controller, bundleKey }) => (
    <StyledComponentGroup>
        <LocalizationComponent
            labels={getLabels(bundleKey)}
            value={layer.locale}
            languages={Oskari.getSupportedLanguages()}
            onChange={controller.setLocalizedNames}
            LabelComponent={PaddedLabel}
        >
            {/*
                The inputs have to be on direct children for LocalizationComponent.
                Can't wrap them to <StyledComponent>.
            */}
            <TextInput type='text' name='name'/>
            <Padding/>
            <TextInput type='text' name='subtitle'/>
            <Padding/>
        </LocalizationComponent>
    </StyledComponentGroup>
));
LocalizedNames.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
