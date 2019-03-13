import React from 'react';
import PropTypes from 'prop-types';
import AntSelect from 'antd/lib/select';
import 'antd/lib/select/style/css';

const AntOption = AntSelect.Option;

export const Select = (props) => {
    const {options, ...other} = props;
    return (
        <AntSelect {...other}>
            {options.map((option, key) => (
                <AntOption {...option} key={key}>{option.title}</AntOption>
            ))}
        </AntSelect>
    );
};

Select.propTypes = {
    options: PropTypes.array
};
