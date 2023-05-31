import React from 'react';
import PropTypes from 'prop-types';
import { Select, Option, Tooltip } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { Labelled } from '../Labelled';
import styled from 'styled-components';
import { ThemeProvider, ThemeConsumer } from 'oskari-ui/util';
import { DEFAULT_COLORS } from 'oskari-ui/theme/constants';

const StyledSelect = styled(Select)`
    ${props => props.value !== 'all' && (
        `border: 2px solid ${props.$highlightColor || DEFAULT_COLORS.accent}`
    )}
`;

const ThemedFilter = ThemeConsumer(({ theme, filters, activeFilterId, controller }) => {
    return (
        <Labelled messageKey='filter.title'>
            <StyledSelect
                onChange={controller.setActiveFilterId}
                value={activeFilterId}
                className="t_filter"
                $highlightColor={theme.color.accent}
            >
                {
                    filters.map(({ id, text, tooltip }) => (
                        <Option key={id} value={id} >
                            <Tooltip title={tooltip}>{text}</Tooltip>
                        </Option>
                    ))
                }
            </StyledSelect>
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
