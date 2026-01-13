import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, Message } from 'oskari-ui';
import { PrimaryButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
const types= ['Boolean', 'Integer', 'Double', 'String', 'Date', 'Timestamp', 'UUID'];

const options = types.map((typename) => {
    return { value: typename, label: <Message messageKey={`featureEditor.types.${typename}`}/>};
});

const StyledSelect = styled(Select)`
    min-width: 15em
`;

export const LayerFieldsTab = ({ layerFields = [], updateLayerFields }) => {

    const [name, setName] = useState(null);
    const [type, setType] = useState(null);
    const setLayerFields = () => {
        const newLayerFields = layerFields.concat({ name, type });
        setName('');
        setType('');
        updateLayerFields(newLayerFields);
    };

    return <>
        <table>
            <thead>
                <th>
                    <Message messageKey='FeatureEditor.featureLayer.fieldName'/>
                </th>
                <th>
                    <Message messageKey='FeatureEditor.featureLayer.fieldType'/>
                </th>
            </thead>
            <tbody>
                {layerFields.map((element) => {
                    return <tr key={element.name + '_' + element.type}>
                        <td>{element.name}</td>
                        <td>{<Message messageKey={`featureEditor.types.${element.type}`}/>}</td>
                    </tr>;
                })}
                <tr>
                    <td>
                        <input type='text' value={name} onChange={(e) => setName(e.target.value)}/>
                    </td>
                    <td>
                        <StyledSelect
                            options={ options }
                            value={type}
                            onChange={(value) => setType(value)}
                        />
                    </td>
                </tr>
                <tr>
                    <td colSpan='2'>
                        <PrimaryButton type='add' onClick={setLayerFields} disabled={!(type && name)}/>
                    </td>
                </tr>
            </tbody>
        </table>
    </>;

};

LayerFieldsTab.propTypes = {
    layerFields: PropTypes.array,
    updateLayerFields: PropTypes.func
};
