import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'oskari-ui';

const StyledButton = styled(Button)`
    margin: 10px;
`;
const StyledRootEl = styled('div')`
    padding: 10px;
`;

export const LayerTypeSelection = (props) => {
    const { types, text, onSelect } = props;
    function buttonClick (event) {
        if (onSelect) {
            onSelect(event.target.textContent);
        }
    }

    return (
        <StyledRootEl>
            {text}{text && <br />}
            {types.map((title) => (
                <StyledButton key={title} onClick={buttonClick}>{title}</StyledButton>
            ))}
        </StyledRootEl>
    );
};

LayerTypeSelection.propTypes = {
    text: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string),
    onSelect: PropTypes.func
};
