import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Message, TextInput } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import { PrimaryButton, DeleteButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
import { VectorLayerPresentation } from 'oskari-ui/components/VectorLayerPresentation';

const types= ['Boolean', 'Integer', 'Double', 'String', 'Date', 'Timestamp', 'UUID'];

const options = types.map((typename) => {
    return { value: typename, label: <Message messageKey={`featureEditor.types.${typename}`}/>};
});

const StyledSelect = styled(Select)`
    min-width: 15em
`;

const TypeColumn = styled('div')`
    display: flex;
    justify-content: space-between;
`;

const AddFieldContainer = styled('div')`
    display: flex;
    flex-direction: row;
    column-gap: 1em;
    margin-top: 0.25em;
`;

const AddFieldContainerColumn = styled('div')`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5em;
`;

const AddFieldContainerColumnFlexBottom = styled(AddFieldContainerColumn)`
    justify-content: flex-end;
`;

const Error = styled('div')`
    color: red;
    font-style: italic;
`;

const validate = (name, layerFields) => {
    if (!name?.length) {
        return null;
    }
    // field with 'name' already exists?
    const fieldAlreadyExists = layerFields?.map(item => item.name).includes(name);
    if (fieldAlreadyExists) {
        return {
            fieldAlreadyExists
        };
    }

    const isValidJSONKey = Oskari.util.isValidJSONKey(name);
    if (!isValidJSONKey) {
        return {
            isValidJSONKey
        };
    };

    return null;
};

const getErrorMessage = (error) => {
    const allKeys = Object.keys(error);
    if (allKeys?.length) {
        return <Message bundleKey='myfeatures' messageKey={`featureEditor.featureLayer.errors.${allKeys[0]}`}/>;
    }

    return null;
};

const getLayer = (layerId, layerFields, attributes) => {
    const mapLayer = Oskari.getSandbox().findMapLayerFromAllAvailable(layerId);
    const layer = {
        attributes: attributes || {},
        capabilities: {
            featureProperties: layerFields?.map(item => item)
        }
    };

    return layer;
};

export const LayerFieldsTab = ({ id = null, layerFields = [], attributes = { data: {}}, updateLayerFields, updateAttributes }) => {
    const [name, setName] = useState(null);
    const [type, setType] = useState(null);
    const [error, setError] = useState(null);
    const [currentLayer, setCurrentLayer] = useState(getLayer(id, layerFields, attributes));
    const setLayerFields = () => {
        const newLayerFields = layerFields.concat({ name, type });
        setName(null);
        setType(null);
        setError(null);
        updateLayerFields(newLayerFields);
        setCurrentLayer(getLayer(id, newLayerFields));
    };

    const deleteField = (name) => {
        const newLayerFields = layerFields.filter(field => field.name !== name);
        updateLayerFields(newLayerFields);
    };

    const setAttributesData = (attribute, value) => {
        const newAttributes = {
            ...attributes
        };
        if (value) {
            newAttributes.data[attribute] = value;
        }
        updateAttributes(newAttributes);
    };

    const columnSettings = [
        {
            align: 'left',
            title: <Message messageKey='featureEditor.featureLayer.fieldName'/>,
            dataIndex: 'name',
            defaultSortOrder: 'ascend'
        },
        {
            align: 'left',
            title: <Message messageKey='featureEditor.featureLayer.fieldType'/>,
            dataIndex: 'type',
            defaultSortOrder: 'ascend',
            render: (text, item) => {
                return <TypeColumn>
                    {text}
                    {!id && <DeleteButton
                        type='icon'
                        title={<Message messageKey='tab.confirmDeleteFieldMsg' messageArgs={{ name: item.name }} />}
                        onConfirm={() => deleteField(item.name)}
                    />
                    }
                </TypeColumn>;
            }
        }
    ];
    // add key for use with table
    const rows = layerFields.map((field) => {
        return {
            ...field,
            key: field.name + '_' + field.type
        };
    });

    return <>
        {!id && <AddFieldContainer>
            <AddFieldContainerColumn>
                <Message messageKey='featureEditor.featureLayer.fieldName'/>
                <TextInput value={name} onChange={(e) => { setName(e.target.value); setError(validate(e.target.value, layerFields)); }}/>
            </AddFieldContainerColumn>
            <AddFieldContainerColumn>
                <Message messageKey='featureEditor.featureLayer.fieldType'/>
                <StyledSelect
                    options={ options }
                    value={type}
                    onChange={(value) => setType(value)}
                />
            </AddFieldContainerColumn>
            <AddFieldContainerColumnFlexBottom>
                <PrimaryButton type='add' onClick={setLayerFields} disabled={!!error || !(name && type)}/>
            </AddFieldContainerColumnFlexBottom>
        </AddFieldContainer>}
        { error && <Error>{getErrorMessage(error)}</Error> }
        <Table
            columns={columnSettings}
            dataSource={rows}
            pagination={false}
            loading={false}
        />

        <VectorLayerPresentation layer={currentLayer} updateAttributes={setAttributesData}/>
    </>;
};

LayerFieldsTab.propTypes = {
    id: PropTypes.string,
    layerFields: PropTypes.array,
    updateLayerFields: PropTypes.func
};
