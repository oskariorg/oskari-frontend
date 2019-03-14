import React from 'react';
import PropTypes from 'prop-types';
import AntSelect from 'antd/lib/select';
import 'antd/lib/select/style/css';

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
