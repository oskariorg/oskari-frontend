import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option, Tooltip } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import { Label } from '../Label';

const Filter = ({ filters, activeFilterId, mutator, locale }) => {
    const props = {
        allowClear: true,
        placeholder: 'locale.filter.placeholder'
    };
    let tooltip;
    if (activeFilterId) {
        // Don't set null value to Select. It would replace the placeholder.
        props.value = activeFilterId;
        // Show tooltip of the active filter.
        const active = filters.find(cur => cur.id === activeFilterId);
        if (active) {
            tooltip = active.tooltip;
        }
    }
    const { title, placeholder } = locale.filter;
    return (
        <div>
            <Label>{title}</Label>
            <Tooltip title={tooltip}>
                <Select {...props} placeholder={placeholder} onChange={mutator.setActiveFilterId}>
                    { filters.map(filter => <Option key={filter.id} value={filter.id}>{filter.text}</Option>) }
                </Select>
            </Tooltip>
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
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    locale: PropTypes.object.isRequired
};

const memoized = React.memo(Filter);
export { memoized as Filter };
