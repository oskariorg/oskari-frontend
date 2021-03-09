import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Tooltip } from 'oskari-ui';
import { InlineBlock } from './styled';
import { Link } from './Link';

export const ServiceLegend = ({ url }) => {
    if (!url) {
        return (
            <Fragment>
                <Message messageKey='styles.raster.serviceLegend' />
                <span>:&nbsp;</span>
                <Message messageKey='styles.raster.serviceNotAvailable' />
            </Fragment>
        );
    }
    return (
        <Tooltip title={url}>
            <Message messageKey='styles.raster.serviceLegend' />
            <InlineBlock>
                <Link url={url}/>
            </InlineBlock>
        </Tooltip>
    );
};

ServiceLegend.propTypes = {
    url: PropTypes.string
};
