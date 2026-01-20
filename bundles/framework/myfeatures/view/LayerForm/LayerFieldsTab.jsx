import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Message, TextInput } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import { PrimaryButton, DeleteButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
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
`;

const AddFieldContainerColumnFlexBottom = styled(AddFieldContainerColumn)`
    justify-content: flex-end;
`;

const InputLabel = styled('div')`
    font-weight: bold;
`;

export const LayerFieldsTab = ({ id = null, layerFields = [], updateLayerFields }) => {

    const [name, setName] = useState(null);
    const [type, setType] = useState(null);
    const setLayerFields = () => {
        const newLayerFields = layerFields.concat({ name, type });
        setName('');
        setType('');
        updateLayerFields(newLayerFields);
    };

    const deleteField = (name) => {
        const newLayerFields = layerFields.filter(field => field.name !== name);
        updateLayerFields(newLayerFields);
    }
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
    return <>
        {!id && <AddFieldContainer>
            <AddFieldContainerColumn>
                <InputLabel><Message messageKey='featureEditor.featureLayer.fieldName'/></InputLabel>
                <TextInput value={name} onChange={(e) => setName(e.target.value)}/>
            </AddFieldContainerColumn>
            <AddFieldContainerColumn>
                <InputLabel><Message messageKey='featureEditor.featureLayer.fieldType'/></InputLabel>
                <StyledSelect
                    options={ options }
                    value={type}
                    onChange={(value) => setType(value)}
                />
            </AddFieldContainerColumn>
            <AddFieldContainerColumnFlexBottom>
                <PrimaryButton type='add' onClick={setLayerFields} disabled={!(type && name)}/>
            </AddFieldContainerColumnFlexBottom>
        </AddFieldContainer>}
        <Table
            columns={columnSettings}
            dataSource={layerFields}
            pagination={false}
            loading={false}
        />
    </>;
};

LayerFieldsTab.propTypes = {
    layerFields: PropTypes.array,
    updateLayerFields: PropTypes.func
};
