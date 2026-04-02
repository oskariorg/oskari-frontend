import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Message, TextInput } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import { PrimaryButton, DeleteButton, IconButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
import { VectorLayerPresentation } from 'oskari-ui/components/VectorLayerPresentation';
import { DEFAULT_TYPE } from './LayerFormContent';
import { ArrowDownOutlined, ArrowUpOutlined  } from '@ant-design/icons';

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

const ENTER_KEY = 'Enter';

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

const getLayer = (layerFields, attributes) => {
    const layer = {
        attributes: attributes || {},
        capabilities: {
            featureProperties: layerFields?.map(item => item)
        }
    };

    return layer;
};

export const LayerFieldsTab = ({ id = null, layerFields = [], attributes, updateParentState }) => {
    const [name, setName] = useState(null);
    const [type, setType] = useState(DEFAULT_TYPE);
    const [error, setError] = useState(null);
    const [currentLayer, setCurrentLayer] = useState(getLayer(layerFields, attributes));

    const setLayerFields = () => {
        const newLayerFields = layerFields.concat({ name, type });

        // update default filter as well (visibility, sorting, ...)
        const newAttributes = structuredClone(attributes);
        newAttributes.data.filter.default.push(name);

        setName(null);
        setType(DEFAULT_TYPE);
        setError(null);
        updateParentState({
            layerFields: newLayerFields,
            attributes: newAttributes
        });
        setCurrentLayer(getLayer(newLayerFields, newAttributes));
    };

    const deleteFromAttributes = (name) => {
        const newAttributes = structuredClone(attributes);
        if (!newAttributes || !newAttributes.data) {
            return;
        }

        // delete 'name' from locale
        if (newAttributes.data.locale) {
            Object.keys(newAttributes.data.locale).forEach(lang => {
                if (newAttributes.data.locale[lang][name]) {
                    delete newAttributes.data.locale[lang][name];
                }

                if (!Object.keys(newAttributes.data.locale[lang]).length) {
                    delete newAttributes.data.locale[lang];
                }
            });

            // if locale is empty -> delete
            if (!Object.keys(newAttributes.data.locale).length) {
                delete newAttributes.data.locale;
            }
        }


        // delete 'name' from format
        if (newAttributes.data.format) {
            if (newAttributes.data.format[name]) {
                delete newAttributes.data.format[name];
            }

            // if format is empty -> delete
            if (!Object.keys(newAttributes.data.format).length) {
                delete newAttributes.data.format;
            }
        }

        //delete 'name' from filter
        if (newAttributes.data.filter) {
            Object.keys(newAttributes.data.filter).forEach(filterKey => {
                if (newAttributes.data.filter[filterKey]) {
                    newAttributes.data.filter[filterKey] = newAttributes.data.filter[filterKey].filter(item => item !== name);
                }

                //
                if (!Object.keys(newAttributes.data.filter[filterKey].length)) {
                    delete newAttributes.data.filter[filterKey];
                }
            });

        }

        return newAttributes;

    };
    const deleteField = (name) => {
        const newLayerFields = layerFields.filter(field => field.name !== name);
        const newAttributes = deleteFromAttributes(name);
        setCurrentLayer(getLayer(newLayerFields, newAttributes));
        updateParentState({
            attributes: newAttributes,
            layerFields: newLayerFields
        });
    };

    const setAttributesData = (attribute, value) => {
        const newAttributes = structuredClone(attributes);

        // delete existing and replace with new value if given
        delete newAttributes.data[attribute];
        if (value) {
            newAttributes.data[attribute] = value;
        }
        updateParentState({ attributes: newAttributes });
    };


    const reorder = (item, index) => {
        const selectedProps = attributes?.data?.filter?.default || [];
        if (selectedProps.length === 0 || index < 0 || index > selectedProps.length - 1) {
            return;
        }

        const selectedPropsSorted = selectedProps.filter(name => name !== item.name);
        selectedPropsSorted.splice(index, 0, item.name);

        const newAttributes = structuredClone(attributes);
        delete newAttributes.data.filter.default;
        newAttributes.data.filter.default = structuredClone(selectedPropsSorted);

        const newLayerFields = layerFields.sort((a, b) => {
            return selectedPropsSorted.indexOf(a.name) - selectedPropsSorted.indexOf(b.name);
        });

        updateParentState({
            attributes: newAttributes,
            layerFields: newLayerFields
        });
    };

    const columnSettings = [
        {
            align: 'left',
            render: (text, item, index) => {
                return <>
                    <IconButton
                        icon={<ArrowDownOutlined/>}
                        onClick={() => reorder(item, index + 1)}
                    />
                    <IconButton
                        icon={<ArrowUpOutlined/> }
                        onClick={() => reorder(item, index - 1)}
                    />
                </>;
            }
        },
        {
            align: 'left',
            title: <Message messageKey='featureEditor.featureLayer.fieldName'/>,
            dataIndex: 'name',
            defaultSortOrder: 'ascend',
            render: (text, item) => {
                const locale = attributes?.data?.locale?.[Oskari.getLang()];
                const label = locale && locale[item.name] ? locale[item.name] : text;
                return label;
            }
        },
        {
            align: 'left',
            title: <Message messageKey='featureEditor.featureLayer.fieldType'/>,
            dataIndex: 'type',
            defaultSortOrder: 'ascend',
            render: (text, item) => {
                return <TypeColumn>
                    <Message messageKey={`featureEditor.types.${text}`}/>
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
        <Table
            columns={columnSettings}
            dataSource={rows}
            pagination={false}
            loading={false}
        />
        {!id && <AddFieldContainer>
            <AddFieldContainerColumn>
                <Message messageKey='featureEditor.featureLayer.fieldName'/>
                <TextInput
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError(validate(e.target.value, layerFields));
                    }}
                    onKeyUp={(evt) => { if (evt.key === ENTER_KEY) setLayerFields(); }}
                />
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
        <VectorLayerPresentation layer={currentLayer} updateAttributes={setAttributesData}/>
    </>;
};

LayerFieldsTab.propTypes = {
    id: PropTypes.string,
    layerFields: PropTypes.array,
    attributes: PropTypes.any,
    updateParentState: PropTypes.func
};
