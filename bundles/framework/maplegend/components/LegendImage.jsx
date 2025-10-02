import React, { useState } from 'react';
import { Message, Link } from 'oskari-ui';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Image = styled('img')`
    max-width: 100%;
`;

export const LegendImage = ({ url }) => {
    const [hasError, setError] = useState(false);
    if (!url) {
        return (
            <Message messageKey='invalidLegendUrl' />
        );
    }

    return (
        <React.Fragment>
            <Link tooltip={null} url={url}>
                <Message messageKey='newtab'/>
            </Link>
            <br/>
            { hasError && <Message messageKey='invalidLegendUrl' /> }
            { !hasError && <Image src={url} onError={ () => setError(true) } />}
        </React.Fragment>
    );
};

LegendImage.propTypes = {
    url: PropTypes.string.isRequired
};
