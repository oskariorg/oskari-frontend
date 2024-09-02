import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LocaleProvider } from '../util';
import { Message, Select, Radio, TextInput } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';

const FILTERS = ['value', 'in', 'notIn', 'like', 'notLike'];
const NUMBER_FILTERS = ['greaterThan', 'atLeast', 'lessThan', 'atMost']; // For range selects array is splitted
const NUMBER_RAW_TYPES = ['int', 'double', 'long', 'float'];
const FILTERTYPE_SINGLE = 'single';
const SEPARATOR = ';';
const BUNDLE_KEY = 'oskariui'

const RowContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-top: 20px;
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
        margin-left: 10px;
    }
`;

const Margin = styled.div`
    padding-bottom: 20px;
`;

const toNumber = value => {
    const modified = typeof value === 'string' ? value.replace(',', '.') : value;
    return isNaN(modified) ? undefined : Number(modified);
};

// For admin: layer.capabilities.featureProperties => [{name, type}] (raw)
// DescribeLayer => response.properties => [{name, type, rawType}]
// TODO: wfs layer getPropertyTypes() => { name:type }
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
        let value = filter[op];
        if(!value && value !== 0) {
            return obj;
        }
        // stored value can be string, number, Array
        // new or edited value is string
        if (op === 'in' || op === 'notIn') {
            let modified;
            if (typeof value === 'string') {
                modified = value.split(SEPARATOR);
            } else {
                modified = Array.isArray(value) ? value : [value];
            }
            modified = isNumber
                ? modified.map(toNumber).filter(n => typeof n === 'number')
                : modified.map(s => s.toString().trim()).filter(s=>s);
            if (modified.length) {
                obj[op] = modified;
            }
            return obj;
        }
        if (isNumber) {
            value = toNumber(value);
        } else {
            value = value.toString().trim();
        }
        if (value || value === 0) {
            obj[op] = value;
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

// used to clean values after editor to get valid filter
export const cleanFilter = (filter, types) => {
    if (!filter) {
        return;
    }
    const AND = filter.AND?.map(f => cleanFilterValues(f, types)).filter(a => a) || [];
    const OR = filter.OR?.map(f => cleanFilterValues(f, types)).filter(a => a) || [];
    const property = cleanFilterValues(filter.property, types);
    const validAND = AND.length >= 2;
    const validOR = OR.length >= 2;
    if (property && !validAND && !validOR) {
        return { property };
    }
    if (validAND && validOR) {
        return { AND, OR };
    }
    if (validAND) {
        return { AND };
    }
    if (validOR) {
        return { OR };
    }
};

export const getDescription = filter => {
    const { property, AND = [], OR = [] } = filter;

    const getShortOp = op => {
        if (!op) return '';
        if (FILTERS.includes(op)) {
            return op.includes('not') ? '≠' : '=';
        }
        return op.includes('Than') ? '<' : '≦';
    };
    const getProperty = ({key, caseSensitive, ...opObj}) => {
        if (!key) return '';
        const [ op, range ] = Object.keys(opObj);
        const short = getShortOp(op);
        const val = key => typeof opObj[key] === 'undefined' ? '' : opObj[key];
        if (range) {
            const rShort = getShortOp(range);
            if (val(range) < val(op)) {
                // got operators in wrong order from object
                return `${val(range)} ${rShort} ${key} ${short} ${val(op)}`;
            }
            return `${val(op)} ${short} ${key} ${rShort} ${val(range)}`;
        }
        return `${key} ${short} ${val(op)}`;
    };
    if (property) {
        return getProperty(property);
    }
    const and = AND.map(getProperty).join(' AND ');
    const or  = OR.map(getProperty).join(' OR ');
    if (AND.length && OR.length) {
        return `(${and}) AND (${or})`;
    }
    return `${and}${or}`
};

const getFilterType = filter => {
    if (filter?.AND && Array.isArray(filter.AND) && filter.AND.length > 1) {
        return 'AND';
    }
    if (filter?.OR && Array.isArray(filter.OR) && filter.OR.length > 1) {
        return 'OR';
    }
    return FILTERTYPE_SINGLE;
};

const getFilterOptions = list => list.map(value => {
    const label = Oskari.getMsg(BUNDLE_KEY, `FeatureFilter.operators.${value}`)
    return { label, value };
});

const FilterRow = ({properties, types, labels = {}, filter = {}, onFilterUpdate, onFilterRemove }) => {
    const { key, caseSensitive = false, ...operatorsObj } = filter;
    let operators = Object.keys(operatorsObj);
    const isRange = operators.length === 2;
    const isNumber = isNumberType(key, types);
    if (operators.length > 2) {
        // something went wrong
        return null;
    }
    // filter is object so we have to check that range operators are in right order
    if (isRange && NUMBER_FILTERS.indexOf(operators[0]) > 1) {
        operators.reverse();
    }

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
    };
    const valueForInput = opIndex => {
        const value = filter[operators[opIndex]];
        return Array.isArray(value) ? value.join(SEPARATOR) : value;
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
                options={properties.map(name => ({label: labels[name] || name, value: name})) }/>
            <Select value={operators[0]} onChange={value => onOperatorChange(operators[0], value)}
                options={ getFilterOptions(filters)}/>
            <TextInput value={valueForInput(0)} placeholder={placeholder}
                onChange={evt => onValueChange(operators[0], evt.target.value)}/>
            { isRange && (
                <Fragment>
                    <Select value={operators[1]} onChange={value => onOperatorChange(operators[1], value)}
                        options={ getFilterOptions(NUMBER_FILTERS.slice(2)) }/>
                    <TextInput value={valueForInput(1)} onChange={evt => onValueChange(operators[1], evt.target.value)}/>
                </Fragment>
            )}
            { !isNumber &&
                <IconButton bordered icon='Aa' active={caseSensitive}
                    title={<Message messageKey={`FeatureFilter.caseSensitive.${caseSensitive}`}/>}
                    onClick={() => onValueChange('caseSensitive', !caseSensitive)}/>
            }
            { isNumber &&
                <IconButton bordered icon='><' active={isRange} onClick={toggleRange}
                    title={<Message messageKey={`FeatureFilter.range.${isRange}`}/>}/>
            }
            { typeof onFilterRemove === 'function' &&
                <IconButton bordered type='delete' onClick={onFilterRemove} />
            }
        </RowContainer>
    );
};

const FilterList = ({filters, type, onChange, ...rest }) => {
    const onFilterUpdate = (index, filter) => {
        const updated = filters.map((f,i) => i === index ? filter : f);
        onChange({ [type]: updated });
    };
    const onFilterRemove = index => {
        const updated = filters.filter((f,i) => i !== index)
        onChange({ [type]: updated });
    };
    return (
        <Fragment>
            { filters.map((filter, i) =>
                <FilterRow key={`filter_${i}`} filter={filter}
                    onFilterRemove={filters.length > 2 ? () => onFilterRemove(i) : null}
                    onFilterUpdate={filter => onFilterUpdate(i, filter)} {...rest} />)
            }
        </Fragment>
    );
};

export const FeatureFilter = ({  filter = {}, onChange, disableMultipleMode = false, ...rest }) => {
    const [type, setType]= useState(getFilterType(filter));
    const getFilters = () => {
        const filters = filter[type];
        return filters && filters.length > 1 ? filters : [{},{}];
    };
    const onAdd = () => onChange({ [type]: [...getFilters(), {}] });
    // TODO: onChange ({ invalid, type, filter }) ???
    // const invalid = filters.some(filter => !cleanFilterValues(filter));
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            { !disableMultipleMode && <>
                <RowContainer>
                    <Radio.Group  value={type} onChange={evt => setType(evt.target.value)}>
                        <Radio.Button value={FILTERTYPE_SINGLE}>
                            <Message messageKey='FeatureFilter.single'/>
                        </Radio.Button>
                        <Radio.Button value={'AND'}>
                            <Message messageKey='FeatureFilter.and'/>
                        </Radio.Button>
                        <Radio.Button value={'OR'}>
                            <Message messageKey='FeatureFilter.or'/>
                        </Radio.Button>
                    </Radio.Group>
                    <Buttons>
                        { type !== FILTERTYPE_SINGLE && <IconButton bordered type='add' title={<Message messageKey='FeatureFilter.addTooltip'/>} onClick={onAdd}/> }
                        <IconButton bordered type='delete' title={<Message messageKey='FeatureFilter.clearTooltip'/>} onClick={() => onChange({})} />
                    </Buttons>
                </RowContainer>
                <Margin/>
            </>
            }
            { type === FILTERTYPE_SINGLE && <FilterRow filter={filter.property} onFilterUpdate={property => onChange({ property })} {...rest} /> }
            { type !== FILTERTYPE_SINGLE && <FilterList filters={getFilters()} type={type} onChange={onChange} {...rest} /> }
        </LocaleProvider>
    );
};

FeatureFilter.propTypes = {
    filter: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired,
    types: PropTypes.array,
    labels: PropTypes.object,
    disableMultipleMode: PropTypes.bool
};
