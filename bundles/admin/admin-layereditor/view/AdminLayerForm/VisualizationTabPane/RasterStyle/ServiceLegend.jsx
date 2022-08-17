import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Link } from 'oskari-ui';

export const ServiceLegend = ({ url }) => {
    const label = <Message messageKey='styles.raster.serviceLegend' />;
    if (url) {
        return (<Link label={label} url={url} />);
    }
    return (
        <Fragment>
            { label }
            <span>:&nbsp;</span>
            <Message messageKey='serviceNotAvailable' />
        </Fragment>
    );
};

ServiceLegend.propTypes = {
    url: PropTypes.string
};
