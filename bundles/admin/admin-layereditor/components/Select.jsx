import React from 'react';
import PropTypes from 'prop-types';
import AntSelect from 'antd/lib/select';
import 'antd/lib/select/style/css';

const AntOption = AntSelect.Option;

export const Select = (props) => {
    const {options, ...other} = props;
    return (
        <AntSelect {...other}>
            {options.map(({title, ...optionProps}, key) => (
                <AntOption {...optionProps} key={key}>{title}</AntOption>
            ))}
        </AntSelect>
    );
};

Select.propTypes = {
    options: PropTypes.array
};
