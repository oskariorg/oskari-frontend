
import React from 'react';
import PropTypes from 'prop-types';
import { Badge as AntBadge } from 'antd';
import 'antd/es/badge/style/index.js';

export const Badge = ({ count, inversed }) => {
    const style = {
        backgroundColor: inversed ? '#333' : '#999',
        color: '#fff',
        fontWeight: '700',
        whiteSpace: 'nowrap',
        textShadow: '0 -1px 0 rgba(0,0,0,.25)'
    };
    return <AntBadge count={count} style={style} overflowCount={999} />;
};
Badge.propTypes = {
    count: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    inversed: PropTypes.bool
};
