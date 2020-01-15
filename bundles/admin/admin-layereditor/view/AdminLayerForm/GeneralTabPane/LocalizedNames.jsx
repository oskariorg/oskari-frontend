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

export const LocalizedNames = LocaleConsumer(({ layer, controller, bundleKey }) => {
    const getMsg = Oskari.getMsg.bind(null, bundleKey);
    const localized = {
        labels: {},
        values: {}
    };
    Oskari.getSupportedLanguages().forEach(language => {
        const langPrefix = typeof getMsg(language) === 'object' ? language : 'generic';
        localized.labels[language] = {
            name: getMsg(`${langPrefix}.placeholder`, [language]),
            description: getMsg(`${langPrefix}.descplaceholder`, [language])
        };
        localized.values[language] = {
            name: layer[`name_${language}`],
            description: layer[`title_${language}`]
        };
    });
    return (
        <StyledComponentGroup>
            <LocalizationComponent
                labels={localized.labels}
                value={localized.values}
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
                <TextInput type='text' name='description'/>
                <Padding/>
            </LocalizationComponent>
        </StyledComponentGroup>
    );
});
LocalizedNames.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
