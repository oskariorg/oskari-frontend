import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option, Tooltip } from 'oskari-ui';
import { Mutator, withLocale } from 'oskari-ui/util';
import { Labelled } from '../Labelled';

const Filter = ({ filters, activeFilterId, mutator, Message }) => {
    let tooltip;
    let activeFilterProps = {};
    if (activeFilterId) {
        // Don't set null value to Select. It would replace the placeholder.
        activeFilterProps.value = activeFilterId;
        // Show tooltip of the active filter.
        const active = filters.find(cur => cur.id === activeFilterId);
        if (active) {
            tooltip = active.tooltip;
        }
    }

    return (
        <Labelled messageKey='filter.title'>
            <Tooltip title={tooltip}>
                <Select
                    placeholder={<Message messageKey='filter.placeholder'/>}
                    onChange={mutator.setActiveFilterId}
                    allowClear
                    {...activeFilterProps}
                >
                    {
                        filters.map(({ id, text }) => (
                            <Option key={id} value={id}>{text}</Option>
                        ))
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
    Message: PropTypes.elementType.isRequired
};

const memoized = React.memo(withLocale(Filter));
export { memoized as Filter };
