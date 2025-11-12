import React from 'react';
import PropTypes from 'prop-types';
import { Select, Tooltip } from 'oskari-ui';
import { Controller, LocaleConsumer, ThemeProvider, ThemeConsumer } from 'oskari-ui/util';
import { Labelled } from '../Labelled';
import styled from 'styled-components';
import { DEFAULT_COLORS } from 'oskari-ui/theme/constants';

const StyledSelect = styled(Select)`
    ${props => props.value !== 'all' && (
        `border: 2px solid ${props.$highlightColor};`
    )}
`;

const ThemedFilter = ThemeConsumer(({ theme = {}, filters, activeFilterId, controller }) => {
    const highlightColor = theme?.color?.accent || DEFAULT_COLORS.accent;
    const options = filters.map(({ id, text, tooltip }) => ({ value: id, label: <Tooltip title={tooltip}>{text}</Tooltip>})); //
    return (
        <Labelled messageKey='filter.title'>
            <StyledSelect
                onChange={controller.setActiveFilterId}
                value={activeFilterId}
                className="t_filter"
                $highlightColor={highlightColor}
                options={options}
            />
        </Labelled>
    );
});

const Filter = ({ filters, activeFilterId, controller }) => {
    return (
        <ThemeProvider>
            <ThemedFilter
                filters={filters}
                activeFilterId={activeFilterId}
                controller={controller}
            />
        </ThemeProvider>
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
