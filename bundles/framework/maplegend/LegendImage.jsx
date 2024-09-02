import React, { useState } from 'react';
import { Message } from 'oskari-ui';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Image = styled('img')`
    max-width: 100%;
`;

export const LegendImage = ({ url }) => {
    const [hasError, setError] = useState(false);
    if (hasError) {
        return (<Message messageKey='invalidLegendUrl' />);
    }
    return (<a href={ url } target='_blank' rel='noopener noreferrer'>
        <Image src={ url } onError={ () => setError(true) } />
    </a>);
};

LegendImage.propTypes = {
    url: PropTypes.string.isRequired
};
