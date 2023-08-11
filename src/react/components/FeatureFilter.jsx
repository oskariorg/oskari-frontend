import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LocaleProvider } from '../util';
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

const toNumber = value => {
    const modified = value.replace(',', '.');
    return isNaN(modified) ? value : Number(modified);
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
        if(!value) {
            return obj;
        }
        if ((op === 'in' || op === 'notIn') && typeof value === 'string') {
            const arr = value.split(SEPARATOR);
            const modified = isNumber ? arr.map(toNumber) : arr.map(s => s.trim()).filter(s=>s);
            if (modified.length) {
                value = modified;
            }
        } else if (isNumber) {
            value = toNumber(value);
        } else if (typeof value === 'string') {
            value = value.trim();
        }
        if (value) {
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
    const onFilterUpdate = (index, filter) => {
        onUpdate(type, filters.map((f,i) => i === index ? filter : f));
    };
    const onFilterRemove = index => {
        onUpdate(type, filters.filter((f,i) => i !== index));
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
    const [single, setSingle]= useState(!filter.AND && !filter.OR);
    const onUpdate = (key, value) => {
        onChange({...filter, [key]: value });
    };
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <RowContainer>
                <Radio.Group value={single} onChange={evt => setSingle(evt.target.value)}>
                    <Radio.Button value={true}>
                        <Message messageKey='FeatureFilter.single'/>
                    </Radio.Button>
                    <Radio.Button value={false}>
                        <Message messageKey='FeatureFilter.list'/>
                    </Radio.Button>
                </Radio.Group>
                <IconButton bordered type='delete' onClick={() => onChange({})} />
            </RowContainer>
            { single && <FilterRow filter={filter.property} onFilterUpdate={filter => onUpdate('property', filter)} {...rest} /> }
            { !single && <MultiFilter and={filter.AND} or={filter.OR} onUpdate={onUpdate} {...rest} /> }
        </LocaleProvider>
    );
};

FeatureFilter.propTypes = {
    filter: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired,
    types: PropTypes.array,
    labels: PropTypes.object
};
