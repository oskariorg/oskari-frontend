import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option, Tooltip } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { Labelled } from '../Labelled';

const Filter = ({ filters, activeFilterId, controller }) => {
    let tooltip;
    // Show tooltip of the active filter.
    const active = filters.find(cur => cur.id === activeFilterId);
    if (active) {
        tooltip = active.tooltip;
    }
    return (
        <Labelled messageKey='filter.title'>
            <Tooltip title={tooltip}>
                <Select
                    onChange={controller.setActiveFilterId}
                    value={activeFilterId}
                >
                    {
                        filters.map(({ id, text }) => (
                            <Option key={id} value={id} >{text}</Option>
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
    controller: PropTypes.instanceOf(Controller).isRequired
};

const memoized = React.memo(LocaleConsumer(Filter));
export { memoized as Filter };
