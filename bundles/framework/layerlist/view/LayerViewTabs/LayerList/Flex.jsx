import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Label = styled('div')`
    margin-right: 5px;
`;

const FlexBox = styled('div')`
    display: flex;
    align-items: center;
    > :first-child {
        margin-right: 5px;
    }
    > :last-child {
        flex-grow: 1
    }
`;

export const Flex = ({ label, children }) =>
    <FlexBox>
        <Label>{ label }</Label>
        { children }
    </FlexBox>;

Flex.propTypes = {
    label: PropTypes.string,
    children: PropTypes.element
};
