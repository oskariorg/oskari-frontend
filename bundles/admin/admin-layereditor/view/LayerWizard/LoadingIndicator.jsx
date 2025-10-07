import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'oskari-ui';

export const LoadingIndicator = ({ loading, children }) => {
    if (loading) {
        return <Spin>{children}</Spin>;
    }
    return children;
};
LoadingIndicator.propTypes = {
    loading: PropTypes.bool,
    children: PropTypes.any
};
