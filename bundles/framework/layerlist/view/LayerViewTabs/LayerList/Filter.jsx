import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option } from 'oskari-ui';
import { Label } from './Label';

export const Filter = ({ filters, activeFilterId, mutator }) => {
    const props = {
        allowClear: true,
        placeholder: 'locale.filter.placeholder'
    };
    if (activeFilterId) {
        props.value = activeFilterId;
    }
    return (
        <div>
            <Label>locale.filter</Label>
            <Select {...props} onChange={mutator.setActiveFilterId}>
                { filters.map(filter => <Option key={filter.id} value={filter.id}>{filter.text}</Option>) }
            </Select>
        </div>
    );
};

const filterBtnShape = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    tooltip: PropTypes.string
};
Filter.propTypes = {
    filters: PropTypes.arrayOf(PropTypes.shape(filterBtnShape)).isRequired,
    activeFilterId: PropTypes.string,
    mutator: PropTypes.object.isRequired
};
