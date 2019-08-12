import React from 'react';
import PropTypes from 'prop-types';
import { Select as AntSelect } from 'antd';
import 'antd/es/select/style/';

const AntOption = AntSelect.Option;

export const Select = ({children, ...other}) => (
    <AntSelect {...other}>
        {children}
    </AntSelect>
);

export const Option = ({children, ...other}) => (
    <AntOption {...other}>
        {children}
    </AntOption>
);

Select.propTypes = {
    children: PropTypes.any
};

Option.propTypes = {
    children: PropTypes.any
};
