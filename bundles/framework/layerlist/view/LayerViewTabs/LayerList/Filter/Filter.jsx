import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option, Tooltip } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import { Flex } from '../Flex';

const Filter = ({ filters, activeFilterId, mutator, locale }) => {
    const { title, placeholder } = locale.filter;
    const filterSelect = {
        placeholder,
        onChange: mutator.setActiveFilterId
    };
    let tooltip;

    if (activeFilterId) {
        // Don't set null value to Select. It would replace the placeholder.
        filterSelect.value = activeFilterId;
        // Show tooltip of the active filter.
        const active = filters.find(cur => cur.id === activeFilterId);
        if (active) {
            tooltip = active.tooltip;
        }
    }

    return (
        <Flex label={title}>
            <Tooltip title={tooltip}>
                <Select {...filterSelect} allowClear>
                    {
                        filters.map(filter => {
                            const { id, text } = filter;
                            return <Option key={id} value={id}>{text}</Option>;
                        })
                    }
                </Select>
            </Tooltip>
        </Flex>
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
