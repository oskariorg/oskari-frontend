import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option, Tooltip } from 'oskari-ui';
import { Mutator, withLocale } from 'oskari-ui/util';
import { Labelled } from '../Labelled';

const Filter = ({ filters, activeFilterId, mutator, getMessage }) => {
    const filterSelect = {
        placeholder: getMessage('filter.placeholder'),
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
        <Labelled label={'filter.title'}>
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
        </Labelled>
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
    getMessage: PropTypes.func.isRequired
};

const memoized = React.memo(withLocale(Filter));
export { memoized as Filter };
