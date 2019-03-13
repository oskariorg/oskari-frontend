import React from 'react';
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';
import 'antd/lib/select/style/css';

const Option = Select.Option;

export const SelectComponent = (props) => {
    const {options, ...other} = props;
    return (
        <Select {...other}>
            {options.map((option, key) => (
                <Option {...option} key={key}>{option.title}</Option>
            ))}
        </Select>
    );
};

SelectComponent.propTypes = {
    options: PropTypes.array
};
