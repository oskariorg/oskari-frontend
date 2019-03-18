import React from 'react';
import styled from 'styled-components';
import { TextInput } from '../components/TextInput';
import { TextAreaInput } from '../components/TextAreaInput';

export const AdditionalTabPane = (props) => {
    const StyledComponent = styled('div')`
        padding-top: 5px;
        padding-bottom 10px;
    `;
    const StyledRootElement = styled('div')`
        & > label {
            font-weight: bold;
        }
    `;

    return (
        <StyledRootElement>
            <label>Metadata file identifier</label>
            <StyledComponent>
                <TextInput placeholder='The metadata file identifier is an XML file identifier.' />
            </StyledComponent>
            <label>Additional GFI info</label>
            <StyledComponent>
                <TextAreaInput />
            </StyledComponent>
            <label>Attributes</label>
            <StyledComponent>
                <TextAreaInput />
            </StyledComponent>
        </StyledRootElement>
    );
};
