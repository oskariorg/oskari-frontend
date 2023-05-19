import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { Message, Select, TextInput, Button, Checkbox } from 'oskari-ui';
import { SecondaryButton, IconButton } from 'oskari-ui/components/buttons';
import { FEATUREDATA_BUNDLE_ID } from './FeatureDataContainer';
import { FilterTwoTone, PlusCircleOutlined } from '@ant-design/icons';
import { green } from '@ant-design/colors';

export const FilterTypes = {
    equals: '=',
    like: '~=',
    notEquals: '≠',
    notLike: '~≠',
    greaterThan: '>',
    lessThan: '<',
    greaterThanOrEqualTo: '≥',
    lessThanOrEqualTo: '≤'
};

export const LogicalOperators = {
    AND: 'AND',
    OR: 'OR'
};

const getOptionsFromColumnNames = (columnNames) => {
    return columnNames?.map(key => {
        return {
            label: key,
            value: key
        };
    });
};

const generateFilterTypeOptions = () => {
    return Object.keys(FilterTypes).map(key => {
        const messageKey = 'selectByPropertiesPopup.filterType.' + key;
        return {
            label: <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={messageKey}></Message>,
            value: FilterTypes[key]
        };
    });
};

const generateLogicalOperatorOptions = () => {
    return Object.keys(LogicalOperators).map(key => {
        return {
            label: key,
            value: LogicalOperators[key]
        };
    });
};

const Funnel = styled('div')`
    margin-left: auto;
`;

const StyledSelectMedium = styled(Select)`
    min-width: 15em;
    margin-right: .5em;
`;

const StyledSelectSmall = styled(Select)`
    min-width: 8em;
    margin-right: .5em;
`;

const StyledTextInput = styled(TextInput)`
    margin-right: .5em;
`;

const FlexRow = styled('div')`
    display: flex;
    padding: 0 .5em .5em .5em;
    input.validation-error {
        border 1px solid red;
    }
`;

const ButtonsContainer = styled(FlexRow)`
    justify-content: center;
`;

const StyledButton = styled(Button)`
    margin: 0 .5em 0 .5em
`;

const StyledSecondaryButton = styled(SecondaryButton)`
    margin: 0 .5em 0 .5em
`;

const AddIcon = styled(PlusCircleOutlined)`
    color: ${green.primary}
`;

const Buttons = (props) => {
    const { closePopup, removeFilter, applyFilters, hasErrors } = props;
    return <ButtonsContainer>
        <StyledSecondaryButton type='cancel' onClick={() => { closePopup(); }} />
        <StyledSecondaryButton type='reset' onClick={() => { removeFilter(null, true); }}/>
        <StyledButton type='primary' disabled={hasErrors} onClick={() => { applyFilters(); }}>
            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'selectByPropertiesPopup.buttons.refresh'}/>
        </StyledButton>
    </ButtonsContainer>;
};

Buttons.propTypes = {
    removeFilter: PropTypes.func,
    closePopup: PropTypes.func,
    applyFilters: PropTypes.func,
    hasErrors: PropTypes.bool
};

const FilterRow = (props) => {
    const {
        columnOptions,
        filterTypeOptions,
        index,
        filter,
        updateFilters,
        addFilter,
        removeFilter,
        showFilterOperator,
        showAddRemove,
        showRemove
    } = props;
    return <>
        <FlexRow>
            <Checkbox
                checked={filter.caseSensitive}
                onChange={(event) => { filter.caseSensitive = event?.target?.checked; updateFilters(index, filter); }}
            >
                <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey='selectByPropertiesPopup.caseSensitive'/>
            </Checkbox>
        </FlexRow>
        <FlexRow>
            <StyledSelectMedium
                options={columnOptions}
                value={filter.attribute}
                onChange={((value) => { filter.attribute = value; updateFilters(index, filter); })}/>
            <StyledSelectMedium
                options={filterTypeOptions}
                value={filter.operator}
                onChange={((value) => { filter.operator = value; updateFilters(index, filter); })}/>
            <StyledTextInput
                type='text'
                value={filter.value}
                placeholder={Oskari.getMsg(FEATUREDATA_BUNDLE_ID, 'selectByPropertiesPopup.valueInputPlaceholder')}
                onChange={(event) => { filter.value = event.target.value; updateFilters(index, filter); }}
                className={filter.error ? 'validation-error' : ''}
            />
            { (showFilterOperator && !showAddRemove) &&
                <StyledSelectSmall
                    options={generateLogicalOperatorOptions()}
                    value={filter.logicalOperator}
                    onChange={(value) => { filter.logicalOperator = value; updateFilters(index, filter); }}
                />
            }
            { showAddRemove &&
                <>
                    <IconButton icon={<AddIcon />} bordered={true} onClick={(() => addFilter())}/>
                    { showRemove && <IconButton type='delete' bordered={true} onClick={(() => removeFilter(index))}/> }
                </>
            }
        </FlexRow>
    </>;
};

FilterRow.propTypes = {
    columnOptions: PropTypes.array,
    filterTypeOptions: PropTypes.array,
    index: PropTypes.number,
    filter: PropTypes.object,
    updateFilters: PropTypes.func,
    addFilter: PropTypes.func,
    removeFilter: PropTypes.func,
    closePopup: PropTypes.func,
    showFilterOperator: PropTypes.bool,
    showAddRemove: PropTypes.bool,
    showRemove: PropTypes.bool
};

const Container = styled('div')`
    padding: 1em;
`;

export const SelectByPropertiesPopup = (props) => {
    const { columnNames, filters, updateFilters, addFilter, removeFilter, applyFilters, closePopup } = props;
    let hasErrors = false;
    const rows = filters.map((filter, index) => {
        if (filter?.error) {
            hasErrors = true;
        }
        return <FilterRow
            key={index}
            index={index}
            columnOptions={getOptionsFromColumnNames(columnNames)}
            filterTypeOptions={generateFilterTypeOptions()}
            filter={filter}
            updateFilters={updateFilters}
            addFilter={addFilter}
            removeFilter={removeFilter}
            showFilterOperator={filters?.length > 1}
            showAddRemove={index === filters?.length - 1}
            showRemove={filters?.length > 1}
        />;
    });

    return <Container>
        { rows }
        <Buttons closePopup={closePopup} removeFilter={removeFilter} applyFilters={applyFilters} hasErrors={hasErrors}/>
    </Container>;
};

SelectByPropertiesPopup.propTypes = {
    columnNames: PropTypes.arrayOf(PropTypes.string),
    filters: PropTypes.array,
    updateFilters: PropTypes.func,
    addFilter: PropTypes.func,
    removeFilter: PropTypes.func,
    applyFilters: PropTypes.func,
    closePopup: PropTypes.func
};

export const SelectByPropertiesFunnel = (props) => {
    const { openSelectByPropertiesPopup } = props;
    return props.active ? <Funnel onClick={() => openSelectByPropertiesPopup()}><FilterTwoTone /></Funnel> : <></>;
};

SelectByPropertiesFunnel.propTypes = {
    active: PropTypes.bool,
    openSelectByPropertiesPopup: PropTypes.func
};

const getActiveLayerName = (activeLayerId, layers) => {
    if (!activeLayerId || !layers?.length > 0) {
        return '';
    }

    return layers.find((layer) => layer.getId() === activeLayerId)?.getName();
};

export const showSelectByPropertiesPopup = (state, controller) => {
    const { activeLayerId, layers, selectByPropertiesSettings } = state;
    const content = <SelectByPropertiesPopup
        columnNames={ selectByPropertiesSettings.allColumns }
        filters = { selectByPropertiesSettings.filters }
        updateFilters={controller.updateFilters}
        addFilter={controller.addFilter}
        removeFilter={controller.removeFilter}
        applyFilters={controller.applyFilters}
        closePopup={controller.closePopup}
    />;
    const title = <><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'selectByPropertiesPopup.title'}/> {getActiveLayerName(activeLayerId, layers)}</>;
    const controls = showPopup(title, content, () => { controller.closePopup(); }, {});

    return {
        ...controls,
        update: (state) => {
            controls.update(title,
                <SelectByPropertiesPopup
                    columnNames={ selectByPropertiesSettings.allColumns }
                    filters = { selectByPropertiesSettings.filters }
                    updateFilters={controller.updateFilters}
                    addFilter={controller.addFilter}
                    removeFilter={controller.removeFilter}
                    applyFilters={controller.applyFilters}
                    closePopup={controller.closePopup}
                />);
        }
    };
};
