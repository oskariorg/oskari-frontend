import React, { useState } from 'react';
import styled from 'styled-components';
import { Select, Message } from 'oskari-ui';
import PropTypes from 'prop-types';
import { FEATUREDATA_BUNDLE_ID } from './FeatureDataContainer';

const FilterVisibleColumnsContainer = styled('div')`
    margin-left: auto;
    .filter-visible-columns-container-focused .ant-select-selection-overflow-item.ant-select-selection-overflow-item-rest {
        width: 0px!important;
    }

    .ant-select-selection-overflow-item.ant-select-selection-overflow-item-rest >  .ant-select-selection-item {
        background: none;
        border: none;
        padding-left: 0.5em;
    }
`;

const SelectFixedWidth = styled(Select)`
    min-width: 15em;
`;

const BlurredMessage = (props) => {
    const { visibleColumns, allColumns } = props;
    return <div>{visibleColumns?.length}/{allColumns?.length} <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'visibleColumns.propertiesSelected'}/></div>;
};

BlurredMessage.propTypes = {
    allColumns: PropTypes.array,
    visibleColumns: PropTypes.array

};

const createOptions = (allColumns, activeLayerPropertyLabels) => {
    if (!allColumns || !allColumns.length) {
        return;
    }

    return allColumns
        .map(key => {
            return {
                label: activeLayerPropertyLabels && activeLayerPropertyLabels[key] ? activeLayerPropertyLabels[key] : key,
                value: key
            };
        });
};

export const FilterVisibleColumns = (props) => {
    const { allColumns, visibleColumns, updateVisibleColumns, activeLayerPropertyLabels } = props;
    const options = createOptions(allColumns, activeLayerPropertyLabels);
    const [focused, setFocused] = useState();

    return <FilterVisibleColumnsContainer>
        <SelectFixedWidth className={focused ? 'filter-visible-columns-container-focused' : 'filter-visible-columns-container-blurred'}
            mode='multiple'
            options={options}
            defaultValue={visibleColumns}
            value={visibleColumns}
            tagRender={() => null}
            maxTagCount={0}
            maxTagPlaceholder={() => focused ? null : <BlurredMessage allColumns={allColumns} visibleColumns={visibleColumns} /> }
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(value) => updateVisibleColumns(value)}/>
    </FilterVisibleColumnsContainer>;
};

FilterVisibleColumns.propTypes = {
    allColumns: PropTypes.array,
    visibleColumns: PropTypes.array,
    activeLayerPropertyLabels: PropTypes.object,
    updateVisibleColumns: PropTypes.func
};
