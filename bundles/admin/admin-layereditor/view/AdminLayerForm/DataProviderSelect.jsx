import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option } from 'oskari-ui';

export const DataProviderSelect = (props) => {
    const options = props.dataProviders.map((dataProvider) =>
        <Option key={dataProvider.id}>{dataProvider.name}</Option>
    );
    return (
        <Select defaultValue={props.value} onChange={(value) => props.onChange(value)}>
            {options}
        </Select>
    );
};

DataProviderSelect.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    dataProviders: PropTypes.arrayOf(PropTypes.object)
};
