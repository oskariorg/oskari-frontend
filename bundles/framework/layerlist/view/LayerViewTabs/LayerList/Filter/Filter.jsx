import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option, Tooltip } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { Labelled } from '../Labelled';

const Filter = ({ filters, activeFilterId, controller }) => {
    return (
        <Labelled messageKey='filter.title'>
            <Select
                onChange={controller.setActiveFilterId}
                value={activeFilterId}
                className="t_filter"
            >
                {
                    filters.map(({ id, text, tooltip }) => (
                        <Option key={id} value={id} >
                            <Tooltip title={tooltip}>{text}</Tooltip>
                        </Option>
                    ))
                }
            </Select>
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
