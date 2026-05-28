/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextInput, NumberInput, Select, Message, Tooltip } from 'oskari-ui';
import { StyledContainer, StyledModIndicator } from './styled';
import { styled } from 'styled-components';
import { DateTimePicker } from 'oskari-ui/components/DateRange';
import dayjs from 'dayjs';
import { FIELD_TYPE_DATE, FIELD_TYPE_DATETIME, FIELD_TYPE_NUMBER_INT, FIELD_TYPE_NUMBER_DOUBLE, FIELD_TYPE_BOOLEAN, FIELD_NAME_ID } from './Helper';

export const StyledFormField = styled('div')`
    padding-top: 5px;
    padding-bottom: 10px;
    width: 100%;
`;

const FieldNameLabel = ({ label, name }) => {
    if (label === name) {
        return label;
    }
    return <Tooltip title={name}>{label}</Tooltip>;
};

const StyledFieldRow = styled('div')`
    display: flex;
    align-items: center;
    gap: 0.5em;
    > *:last-child {
        flex: 1;
    }
`;

const FieldWrapper = ({ label, name, children }) => (
    <StyledFieldRow>
        <FieldNameLabel label={label} name={name} />
        {children}
    </StyledFieldRow>
);

const BOOLEAN_OPTIONS = [
    { value: true, label: 'true' },
    { value: false, label: 'false' }
];

const StyledBooleanSelect = styled(Select)`
    min-width: fit-content;
`;

const IntegerField = ({ label, name, value, disabled, onUpdate }) => (
    <FieldWrapper label={label} name={name}>
        <NumberInput
            disabled={disabled}
            name={name}
            value={value}
            precision={0}
            onChange={(newValue) => onUpdate(name, newValue)}/>
    </FieldWrapper>
);

const DoubleField = ({ label, name, value, disabled, onUpdate }) => (
    <FieldWrapper label={label} name={name}>
        <NumberInput
            disabled={disabled}
            name={name}
            value={value}
            onKeyDown={null}
            onChange={(newValue) => onUpdate(name, newValue)}/>
    </FieldWrapper>
);

const BooleanField = ({ label, name, value, disabled, onUpdate }) => (
    <FieldWrapper label={label} name={name}>
        <StyledBooleanSelect
            disabled={disabled}
            value={value ?? null}
            options={BOOLEAN_OPTIONS}
            allowClear
            onChange={(val) => onUpdate(name, val ?? null)}/>
    </FieldWrapper>
);

const DateTimeField = ({ label, name, value, disabled, showTime, onUpdate }) => (
    <FieldWrapper label={label} name={name}>
        <DateTimePicker
            disabled={disabled}
            showTime={showTime}
            value={value ? dayjs(value) : null}
            onChange={(val) => onUpdate(name, val ? val.toISOString() : null)}/>
    </FieldWrapper>
);

const getFieldForType = (name, type, value, onUpdate, disabled, fieldLabels = {}) => {
    const isDisabled = disabled || name === FIELD_NAME_ID;
    const label = fieldLabels[name] || name;
    if (type === FIELD_TYPE_NUMBER_INT) {
        return <IntegerField label={label} name={name} value={value} disabled={isDisabled} onUpdate={onUpdate}/>;
    }
    if (type === FIELD_TYPE_NUMBER_DOUBLE || type === 'number') {
        return <DoubleField label={label} name={name} value={value} disabled={isDisabled} onUpdate={onUpdate}/>;
    }
    if (type === FIELD_TYPE_BOOLEAN) {
        return <BooleanField label={label} name={name} value={value} disabled={isDisabled} onUpdate={onUpdate}/>;
    }
    const typeLowerCase = (type || '').toLowerCase();
    const isTimestampField = typeLowerCase.includes(FIELD_TYPE_DATETIME);
    const isDateTimeField = isTimestampField || typeLowerCase.endsWith(FIELD_TYPE_DATE);
    if (isDateTimeField) {
        return <DateTimeField label={label} name={name} value={value} disabled={isDisabled} showTime={isTimestampField} onUpdate={onUpdate}/>;
    }
    return (<FieldWrapper label={label} name={name}>
        <TextInput
            disabled={isDisabled}
            name={name}
            value={value}
            onChange={(evt) => onUpdate(name, evt.target.value)} />
    </FieldWrapper>);
};

const getDecorated = ({ name, type, value, originalValue, isNew, onUpdate, disabled, fieldLabels }) => {
    if (type === 'geometry') {
        return null;
    }
    const hasChanged = !isNew && originalValue !== value;
    let labelForOriginal = originalValue;
    if (!labelForOriginal) {
        labelForOriginal = (<Message messageKey="FeatureEditorView.missingValue" />);
    }
    const noteForOriginal = (<Message messageKey="FeatureEditorView.originalValue">: {labelForOriginal}</Message>);
    return (
        <StyledFormField key={name}>
            { getFieldForType(name, type, value, onUpdate, disabled, fieldLabels) }
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
    const fieldLabels = config.fieldLabels || {};
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
            disabled,
            fieldLabels
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
