import React from 'react';
import PropTypes from 'prop-types';
import AntSteps from 'antd/lib/steps';
import 'antd/lib/steps/style/css';

export const Step = (props) => {
    const {children, ...other} = props;
    return (
        <AntSteps.Step {...other}>{children}</AntSteps.Step>
    );
};

Step.propTypes = {
    children: PropTypes.any
};

export const Steps = (props) => {
    const {children, ...other} = props;
    return (
        <AntSteps {...other}>{children}</AntSteps>
    );
};
Steps.propTypes = {
    children: Step.array
};
