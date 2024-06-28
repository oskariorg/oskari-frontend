import React from 'react';
import PropTypes from 'prop-types';
import { Spin as AntSpin } from 'antd';
import { Message } from 'oskari-ui';

export const Spin = ({ children, showTip = false, ...other }) => {
    const tip = showTip ? <Message messageKey='Spin.loading' bundleKey='oskariui'/> : null;
    return (
        <AntSpin tip={tip} {...other}>{children}</AntSpin>
    );
};

Spin.propTypes = {
    children: PropTypes.any,
    showTip: PropTypes.bool
};
