import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Select, Radio, TextInput, Button, Divider } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';

const FILTERS = ['value', 'in', 'notIn', 'like', 'notLike'];
const NUMBER_FILTERS = ['greaterThan', 'atLeast', 'lessThan', 'atMost']; // For range selects array is splitted
const NUMBER_RAW_TYPES = ['int', 'double', 'long', 'float'];

const SEPARATOR = ';';
const BUNDLE_KEY = 'oskariui'

const RowContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-bottom: 20px;
    & ${Select} {
        width: 100%;
    }
    > * :not(:last-child) {
        margin-right: 10px;
    }
`;
const Buttons = styled.div`
    display: flex;
    flex-flow: row nowrap;
    & button {
        margin-right: 10px;
    }
`;
const Margin = styled.div`
    margin-bottom: 24px;
`;

const toNumber = value => {
    const modified = value.replace(',', '.');
    return isNaN(modified) ? value : Number(modified);
};

// For admin: layer.capabilities.featureProperties => [{name, type}] (raw)
// DescribeLayer => response.properties => [{name, type, rawType}]
// wfs layer getPropertyTypes() => { name:type }
const isNumberType = (name, types = []) => {
    const { type } = types.find(p => p.name === name) || {};
    return type === 'number' || NUMBER_RAW_TYPES.includes(type);
};

const cleanFilterValues = (filter, types) => {
    const { key, caseSensitive = false, ...operatorsObj } = filter || {};
    if (!key) {
        return;
    }
    const isNumber = isNumberType(key, types);

    const operators = Object.keys(operatorsObj).reduce((obj, op) => {
        const value = filter[op];
        if(!value) {
            return obj;
        }
        if (op === 'in' || op === 'notIn') {
            const arr = value.split(SEPARATOR);
            const modified = isNumber ? arr.map(toNumber) : arr.map(s => s.trim());
            if (modified.length) {
                obj[op] = modified;
            }
        } else if (isNumber) {
            obj[op] = toNumber(value);
        } else if (value && value.trim().length) {
            obj[op] = value.trim();
        }
        return obj;
    }, {});

    if (!Object.keys(operators).length) {
        return;
    }
    const cleaned = { key, ...operators };
    if (caseSensitive && !isNumber) {
        cleaned.caseSensitive = true;
    }
    return cleaned;
};

export const cleanFilter = (layer, filter) => {
    if (!filter) {
        return {};
    }
    const types = layer.capabilities.featureProperties;
    const AND = filter?.AND.map(f => cleanFilterValues(f, types)).filter(a => a);
    const OR = filter?.OR.map(cleanFilterValues).filter(a => a);
    const property = cleanFilterValues(filter.property);
    if (property && AND.length < 2  && OR.length < 2) {
        return { property };
    } 
    const cleaned = {};
    if (AND.length > 2) {
        cleaned.AND = AND;
    }
    if (OR.length > 2) {
        cleaned.OR = OR;
    }
    return cleaned;
};

const getFilterOptions = list => list.map(value => {
    const label = Oskari.getMsg(BUNDLE_KEY, `FeatureFilter.operators.${value}`)
    return { label, value };
});

const FilterRow = ({properties, labels = {}, filter = {}, onFilterUpdate, onFilterRemove }) => {
    const { key, caseSensitive = false, ...operatorsObj } = filter;
    const operators = Object.keys(operatorsObj);
    const [ isRange, setRange ] = useState(operators.length === 2);
    if (operators.length > 2) {
        // something went wrong
        return null;
    }

    const propertyNames = properties.map(prop => prop.name);
    const isNumber = isNumberType(key, properties);

    const onOperatorChange = (oldOP, newOP) => {
        const updated = { ...filter, [newOP]: filter[oldOP] };
        delete updated[oldOP];
        onFilterUpdate(updated);
    };
    const onKeyChange = (value) => {
        const updated = {...filter, key: value };
        const newIsNumber = isNumberType(value, properties);
        if (newIsNumber !== isNumber) {
            const op = operators[0];
            if (isRange) {
                // reset operators
                operators.forEach(op => delete updated[op]);
                setRange(false);
            } else if (!newIsNumber && NUMBER_FILTERS.includes(op)) {
                // selected operator isn't available for type -> update
                updated[FILTERS[0]] = filter[op];
                delete updated[op]
            }
        }
        onFilterUpdate(updated);
    };
    const onValueChange = (key, value) => {
        onFilterUpdate({...filter, [key]: value });
    };
    const toggleRange = () => {
        const toggled = !isRange;
        const updated = { ...filter };
        // reset operators
        operators.forEach(op => delete updated[op]);
        if (toggled) {
            // auto select
            updated.greaterThan = '';
            updated.lessThan = '';
        }
        onFilterUpdate(updated);
        setRange(toggled);
    };

    let filters = FILTERS;
    if (isRange) {
        filters = NUMBER_FILTERS.slice(0,2);
    } else if (isNumber) {
        filters = [ ...FILTERS, ...NUMBER_FILTERS ];
    }
    const placeholder = operators[0] === 'in' || operators[0] === 'notIn' ? `100${SEPARATOR}200${SEPARATOR}300` : null;
    return (
        <RowContainer>
            <Select value={key} onChange={onKeyChange}
                options={propertyNames.map(name => ({label: labels[name] || name, value: name})) }/>
            <Select value={operators[0]} onChange={value => onOperatorChange(operators[0], value)}
                options={ getFilterOptions(filters)}/>
            <TextInput value={filter[operators[0]]} placeholder={placeholder}
                onChange={evt => onValueChange(operators[0], evt.target.value)}/>
            { isRange && (
                <Fragment>
                    <Select value={operators[1]} onChange={value => onOperatorChange(operators[1], value)}
                        options={ getFilterOptions(NUMBER_FILTERS.slice(2)) }/>
                    <TextInput value={filter[operators[1]]} onChange={evt => onValueChange(operators[1], evt.target.value)}/>
                </Fragment>
            )}
            { !isNumber &&
                <IconButton bordered icon='Aa' active={caseSensitive}
                    title={<Message messageKey={`FeatureFilter.caseSensitive.${caseSensitive}`}/>}
                    onClick={() => onValueChange('caseSensitive', !caseSensitive)}/>
            }
            { isNumber &&
                <IconButton bordered icon='><' active={isRange} onClick={toggleRange}
                    title={<Message messageKey='FeatureFilter.range'/>}/>
            }
            { typeof onFilterRemove === 'function' &&
                <IconButton bordered type='delete' onClick={onFilterRemove} />
            }
        </RowContainer>
    );
};

const FilterList = ({filters, type, onUpdate, ...rest }) => {
    if (!Array.isArray(filters)) {
        return null;
    }
    const onAdd = () => onUpdate(type, [...filters, {}]);
    const onFilterUpdate = (i, filter) => {
        onUpdate(type, [...filters.slice(0, i), filter, ...filters.slice(i+1)]);
    };
    const onFilterRemove = i => {
        onUpdate(type, [...filters.slice(0, i), ...filters.slice(i+1)]);
    };
    return (
        <Fragment>
            <Divider>{type}</Divider>
            { filters.map((filter, i) =>
                <FilterRow key={`filter_${i}`} filter={filter}
                    onFilterRemove={filters.length > 2 ? () => onFilterRemove(i) : null}
                    onFilterUpdate={filter => onFilterUpdate(i, filter)} {...rest} />)
            }
            <IconButton bordered type='add' onClick={onAdd}/>
        </Fragment>
    );
};

const MultiFilter = ({and, or, onUpdate, ...rest}) => {
    const toggle = (key, isAdd) => onUpdate(key, isAdd ? [{},{}] : null);
    return (
        <Fragment>
            <Buttons>
                <Button onClick={() => toggle('AND', !and)}>
                    <Message messageKey={and ? 'buttons.delete' : 'buttons.add'}/>&nbsp;AND
                </Button>
                <Button onClick={() => toggle('OR', !or)}>
                    <Message messageKey={or ? 'buttons.delete' : 'buttons.add'}/>&nbsp;OR
                </Button>
            </Buttons>
            <FilterList type='AND' onUpdate={onUpdate} filters={and} {...rest} />
            <FilterList type='OR' onUpdate={onUpdate} filters={or} {...rest} />
        </Fragment>
    );
};

export const FeatureFilter = ({  filter = {}, onChange, ...rest }) => {
    const [single, setSingle] = useState(!filter.AND && !filter.OR);
    const [state, setState] = useState({ ...filter });

    const onUpdate = (key, value) => {
        setState({...state, [key]: value });
    };
    // TODO: on modal close clean filter and notify if cleaned
    console.log('state', state);
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Radio.Group value={single} onChange={evt => setSingle(evt.target.value)}>
                <Radio.Button value={true}>
                    <Message messageKey='FeatureFilter.single'/>
                </Radio.Button>
                <Radio.Button value={false}>
                    <Message messageKey='FeatureFilter.list'/>
                </Radio.Button>
            </Radio.Group>
            <Margin/>
            { single && <FilterRow filter={state.property} onFilterUpdate={filter => onUpdate('property', filter)} {...rest} /> }
            { !single && <MultiFilter and={state.AND} or={state.OR} onUpdate={onUpdate} {...rest} /> }
        </LocaleProvider>
    );
};

FeatureFilter.propTypes = {
    filter: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired,
    labels: PropTypes.object
};
