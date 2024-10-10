import React from 'react';
import PropTypes from 'prop-types';
import { Steps as AntSteps } from 'antd';

export const Steps = (props) => {
    const { items, ...other } = props;
    return (
        <AntSteps {...other}/>
    );
};

Steps.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf([PropTypes.object])
        })
    ).isRequired
};
