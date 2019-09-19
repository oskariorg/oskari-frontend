import React from 'react';
import PropTypes from 'prop-types';

export const FilterButton = ({ id, text, tooltip, filterName, clickHandler }) => {
    return ( // TODO: Fix tooltip logic when improving styling
        <button key={id} tooltip={tooltip} filtername={filterName} onClick={(event) => clickHandler(event)}>{text}</button>
    );
};

FilterButton.propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
    filterName: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired
};
