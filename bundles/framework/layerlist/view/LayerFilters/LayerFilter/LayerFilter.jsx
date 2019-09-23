import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledFilter = styled.div`
    border: 1px solid #a4a4a4;
    padding: 10px;
    cursor: pointer;
    margin-bottom: 5px;
    margin-left: -1px;
`;

export const LayerFilter = ({ text, tooltip, filterName, classNameDeactive, clickHandler }) => {
    return (
        <StyledFilter>
            <center title={tooltip} filtername={filterName} onClick={(event) => clickHandler(event)}>
                <div className={classNameDeactive}></div>
                <div>{text}</div>
            </center>
        </StyledFilter>
    );
};

LayerFilter.propTypes = {
    text: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
    filterName: PropTypes.string.isRequired,
    classNameDeactive: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired
};
