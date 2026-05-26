import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextInput, NumberInput, Select, Message, Tooltip } from 'oskari-ui';
import { StyledContainer, StyledModIndicator } from './styled';
import styled from 'styled-components';
import { DateTimePicker } from 'oskari-ui/components/DateRange';
import dayjs from 'dayjs';
import { FIELD_TYPE_DATE, FIELD_TYPE_DATETIME, FIELD_TYPE_NUMBER_INT, FIELD_TYPE_NUMBER_DOUBLE, FIELD_TYPE_BOOLEAN, FIELD_NAME_ID } from './Helper';

export const StyledFormField = styled('div')`
    padding-top: 5px;
    padding-bottom: 10px;
    width: 100%;
`;

const Label = ({name, children}) => (<label>{name} {children}</label>);

const IntegerField = ({ name, value, disabled, onUpdate }) => (
    <React.Fragment>
        <Label name={name}>
            <NumberInput
                disabled={disabled}
                name={name}
                value={value}
                precision={0}
                onChange={(newValue) => onUpdate(name, newValue)}/>
        </Label><br/>
    </React.Fragment>
);

const DoubleField = ({ name, value, disabled, onUpdate }) => (
    <React.Fragment>
        <Label name={name}>
            <NumberInput
                disabled={disabled}
                name={name}
                value={value}
                onKeyDown={null}
                onChange={(newValue) => onUpdate(name, newValue)}/>
        </Label><br/>
    </React.Fragment>
);

const BOOLEAN_OPTIONS = [
    { value: true, label: 'true' },
    { value: false, label: 'false' }
];

const StyledBooleanSelect = styled(Select)`
    min-width: fit-content;
`;

const BooleanField = ({ name, value, disabled, onUpdate }) => (
    <React.Fragment>
        <Label name={name}>
            <StyledBooleanSelect
                disabled={disabled}
                value={value ?? null}
                options={BOOLEAN_OPTIONS}
                allowClear
                onChange={(val) => onUpdate(name, val ?? null)}/>
        </Label><br/>
    </React.Fragment>
);

const DateTimeField = ({ name, value, disabled, showTime, onUpdate }) => (
    <React.Fragment>
        <Label name={name}>
            <DateTimePicker
                disabled={disabled}
                showTime={showTime}
                value={value ? dayjs(value) : null}
                onChange={(val) => onUpdate(name, val ? val.toISOString() : null)}/>
        </Label><br/>
    </React.Fragment>
);

const getFieldForType = (name, type, value, onUpdate, disabled) => {
    const isDisabled = disabled || name === FIELD_NAME_ID;
    if (type === FIELD_TYPE_NUMBER_INT) {
        return <IntegerField name={name} value={value} disabled={isDisabled} onUpdate={onUpdate}/>;
    }
    if (type === FIELD_TYPE_NUMBER_DOUBLE || type === 'number') {
        return <DoubleField name={name} value={value} disabled={isDisabled} onUpdate={onUpdate}/>;
    }
    if (type === FIELD_TYPE_BOOLEAN) {
        return <BooleanField name={name} value={value} disabled={isDisabled} onUpdate={onUpdate}/>;
    }
    const typeLowerCase = (type || '').toLowerCase();
    const isTimestampField = typeLowerCase.includes(FIELD_TYPE_DATETIME);
    const isDateTimeField = isTimestampField || typeLowerCase.endsWith(FIELD_TYPE_DATE);
    if (isDateTimeField) {
        return <DateTimeField name={name} value={value} disabled={isDisabled} showTime={isTimestampField} onUpdate={onUpdate}/>;
    }
    return (<TextInput
        disabled={isDisabled}
        name={name}
        value={value}
        addonBefore={<Label name={name} />}
        onChange={(evt) => onUpdate(name, evt.target.value)} />);
}

const getDecorated = ({ name, type, value, originalValue, isNew, onUpdate, disabled }) => {
    if (type === 'geometry') {
        return null;
    }
    const hasChanged = !isNew && originalValue !== value;
    let labelForOriginal = originalValue;
    if (!labelForOriginal) {
        labelForOriginal = (<Message messageKey="FeatureEditorView.missingValue" />)
    }
    const noteForOriginal = (<Message messageKey="FeatureEditorView.originalValue">: {labelForOriginal}</Message>);
    return (
        <StyledFormField key={name}>
            { getFieldForType(name, type, value, onUpdate, disabled) }
            { hasChanged && <StyledContainer>
                <Message messageKey="FeatureEditorView.modified" LabelComponent={StyledModIndicator} />
                <Tooltip title={noteForOriginal}>
                    <Button type="link" disabled={disabled} onClick={() => onUpdate(name, originalValue)}>
                        <Message messageKey="FeatureEditorView.restoreOriginal" />
                    </Button>
                </Tooltip>
            </StyledContainer> }
        </StyledFormField>
    );
};

export const FeatureForm = ({config = {}, feature = {}, original = {}, onChange, disabled = false}) => {
    const fieldsTypes = config.fieldTypes || {};
    const featureProperties = feature.properties || {};
    const originalProperties = original.properties || {};

    const onUpdate = (name, value) => {
        onChange({
            ...feature,
            properties: {
                ...feature.properties,
                [name]: value
            }
        });
    };
    const isNew = !feature.id;
    const fields = Object.keys(fieldsTypes)
        .map(field => getDecorated({
            isNew,
            name: field,
            type: fieldsTypes[field],
            value: featureProperties[field],
            originalValue: originalProperties[field],
            onUpdate,
            disabled
        }));
    return (
        <React.Fragment>
            {fields}
        </React.Fragment>);
};

FeatureForm.propTypes = {
    feature: PropTypes.object,
    original: PropTypes.object,
    config: PropTypes.object,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
};
/*
{
    "id":2662,
    "geometryType":"MultiPoint",
    "fieldTypes":{
        "nimi":"string",
        "numero":"number",
        "id":"number",
        "teksti":"string"
    }
}
*/
