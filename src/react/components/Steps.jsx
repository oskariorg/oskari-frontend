import React from 'react';
import PropTypes from 'prop-types';
import AntSteps from 'antd/es/steps';
import 'antd/es/steps/style/index.js';

export const Step = (props) => {
    const { children, ...other } = props;
    return (
        <AntSteps.Step {...other}>{children}</AntSteps.Step>
    );
};

Step.propTypes = {
    children: PropTypes.any
};

export const Steps = (props) => {
    const { children, ...other } = props;
    return (
        <AntSteps {...other}>{children}</AntSteps>
    );
};

Steps.propTypes = {
    children: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([Step])
        })
    ).isRequired
};
