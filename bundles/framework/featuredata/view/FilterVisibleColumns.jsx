import React from 'react';
import styled from 'styled-components';
import { Select } from 'oskari-ui';
import PropTypes from 'prop-types';
import { FEATUREDATA_DEFAULT_HIDDEN_FIELDS } from '../plugin/FeatureDataPluginHandler';

const FilterVisibleColumnsContainer = styled('div')`
    margin-left: auto;
`;

const SelectFixedWidth = styled(Select)`
    min-width: 20em;
`;

const createOptions = (allColumns) => {
    if (!allColumns || !allColumns.length) {
        return;
    }

    return allColumns
        .filter(key => !FEATUREDATA_DEFAULT_HIDDEN_FIELDS.includes(key))
        .map(key => {
            return {
                label: key,
                value: key
            };
        });
};

export const FilterVisibleColumns = (props) => {
    const { allColumns, visibleColumns, updateVisibleColumns } = props;
    const options = createOptions(allColumns);

    return <FilterVisibleColumnsContainer>
        <SelectFixedWidth
            mode='multiple'
            options={options}
            defaultValue={visibleColumns}
            value={visibleColumns}
            showArrow='true'
            onChange={(value) => updateVisibleColumns(value)}/>
    </FilterVisibleColumnsContainer>;
};

FilterVisibleColumns.propTypes = {
    allColumns: PropTypes.array,
    visibleColumns: PropTypes.array,
    updateVisibleColumns: PropTypes.func
};
