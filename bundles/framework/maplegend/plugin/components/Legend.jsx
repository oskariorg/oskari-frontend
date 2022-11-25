import React from 'react';
import PropTypes from 'prop-types';
import { Message, Link } from 'oskari-ui';

export const Legend = ({ url, hasError, setError }) => {
    if (!url || hasError) {
        return (
            <Message messageKey='invalidLegendUrl' />
        );
    }

    return (
        <div>
            <img src={url} onError={ () => setError(true) } />
            <br/>
            <Link url={url}>
                <Message messageKey='newtab'/>
            </Link>
        </div>
    );
};

Legend.propTypes = {
    url: PropTypes.string,
    hasError: PropTypes.bool.isRequired,
    setError: PropTypes.func.isRequired
};
