import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from './Button';

const StyledButton = styled(Button)`
    margin: 10px;
`;

export const LayerTypeSelection = (props) => {
    const {types, text} = props;
    const StyledRootEl = styled('div')`
        padding: 10px;
    `;

    return (
        <StyledRootEl>
            {text}{text && <br />}
            {types.map((title, key) => (
                <StyledButton key={key}>{title}</StyledButton>
            ))}
        </StyledRootEl>
    );
};

LayerTypeSelection.propTypes = {
    text: PropTypes.string,
    types: PropTypes.array
};
