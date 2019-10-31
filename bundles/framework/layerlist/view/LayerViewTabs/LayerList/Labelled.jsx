import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Label = styled('div')`
    margin-right: 5px;
`;

const Elastic = styled('div')`
    display: flex;
    align-items: center;
    > :not(${Label}) {
        flex-grow: 1;
        flex-shrink: 1;
    }
`;

export const Labelled = ({ label, children }) =>
    <Elastic>
        { label &&
            <Label>{ label }</Label>
        }
        { children }
    </Elastic>;

Labelled.propTypes = {
    label: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element
    ]).isRequired
};
