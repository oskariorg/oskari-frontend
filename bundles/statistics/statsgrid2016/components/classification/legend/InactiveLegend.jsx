import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';

export const InactiveLegend = ({ error }) => {
    return (
        <div className="legend-noactive">
            <Message messageKey={`legend.${error}`}/>
        </div>
    );
};

InactiveLegend.propTypes = {
    error: PropTypes.string.isRequired
};
