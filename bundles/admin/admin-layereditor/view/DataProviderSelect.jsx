import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option } from '../components/Select';

export const DataProviderSelect = (props) => {
    // TODO check language
    const options = props.dataProviders.map((dataProvider) =>
        <Option key={dataProvider.id}>{dataProvider.name['fi']}</Option>
    );
    return (
        <Select defaultValue={props.defaultValue} onChange={(value) => props.onChange(value)}>
            {options}
        </Select>
    );
};

DataProviderSelect.propTypes = {
    onChange: PropTypes.func,
    defaultValue: PropTypes.string,
    dataProviders: PropTypes.arrayOf(PropTypes.object)
};
