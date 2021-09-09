import React, { Fragment, useState } from 'react';
import { Message } from 'oskari-ui';
import PropTypes from 'prop-types';

export const LegendImage = ({ url }) => {
    const [hasError, setError] = useState(false);
    if (hasError) {
        return (<Message messageKey='invalidLegendUrl' />);
    }
    return (<img src={ url } onError={ () => setError(true) } />);
};

LegendImage.propTypes = {
    url: PropTypes.string.isRequired
};
