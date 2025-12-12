import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextInput, NumberInput, Message, Tooltip } from 'oskari-ui';
import { StyledContainer, StyledModIndicator } from './styled';
import styled from 'styled-components';

export const StyledFormField = styled('div')`
    padding-top: 5px;
    padding-bottom: 10px;
    width: 100%;
`;

const Label = ({name, children}) => (<label>{name} {children}</label>);

const getFieldForType = (name, type, value, onUpdate) => {
    const attribs = {
        disabled: name === 'id',
        name,
        value
    };
    if (type === 'number') {
        return (<React.Fragment>
                <Label name={name}>
                    <NumberInput {...attribs}
                        onChange={(newValue) => onUpdate(name, newValue)}/>
                </Label><br/>
                </React.Fragment>);
    }
    return (<TextInput {...attribs}
                addonBefore={<Label name={name} />}
                onChange={(evt) => onUpdate(name, evt.target.value)} />);
}

const getDecorated = ({ name, type, value, originalValue, isNew, onUpdate }) => {
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
            { getFieldForType(name, type, value, onUpdate) }
            { hasChanged && <StyledContainer>
                <Message messageKey="FeatureEditorView.modified" LabelComponent={StyledModIndicator} />
                <Tooltip title={noteForOriginal}>
                    <Button type="link" onClick={() => onUpdate(name, originalValue)}>
                        <Message messageKey="FeatureEditorView.restoreOriginal" />
                    </Button>
                </Tooltip>
            </StyledContainer> }
        </StyledFormField>
    );
};

export const FeatureForm = ({config = {}, feature = {}, original = {}, onChange}) => {
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
            onUpdate}));
    return (
        <React.Fragment>
            {fields}
        </React.Fragment>);
};

FeatureForm.propTypes = {
    feature: PropTypes.object,
    original: PropTypes.object,
    config: PropTypes.object,
    onChange: PropTypes.func
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
