import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'oskari-ui';

const StyledButton = styled(Button)`
    border: 1px solid #a4a4a4;
    padding: 25px 15px;
    cursor: pointer;
    margin-bottom: 5px;
    margin-left: 5px;
`;

const IconDiv = styled.div`
    margin: 0;
    position: absolute;
    top: 30%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
`;

export const LayerFilter = ({ text, tooltip, filterName, currentStyle, clickHandler }) => {
    return (
        <StyledButton filtername={filterName} title={tooltip} onClick={(event) => clickHandler(event)}>
            <div>
                <IconDiv className={currentStyle}></IconDiv>
                <div>{text}</div>
            </div>
        </StyledButton>
    );
};

LayerFilter.propTypes = {
    text: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
    filterName: PropTypes.string.isRequired,
    currentStyle: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired
};
