import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from 'styled-components';
import { Message, TextInput } from 'oskari-ui';
import { PrimaryButton } from 'oskari-ui/components/buttons';

const AddParamContainer = styled('div')`
    display: flex;
    flex-direction: row;
    column-gap: 1em;
    margin-top: 0.5em;
`;

const AddParamColumn = styled('div')`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const AddParamButtonColumn = styled(AddParamColumn)`
    justify-content: flex-end;
    flex: 0;
`;

const ENTER_KEY = 'Enter';

export const ServiceUrlAddParam = ({ disabled, params = {}, onAdd }) => {
    const [paramKey, setParamKey] = useState('');
    const [paramValue, setParamValue] = useState('');

    const keyExists = Object.prototype.hasOwnProperty.call(params, paramKey);
    const canAdd = !disabled && !!paramKey && !keyExists;

    const addParam = () => {
        if (!canAdd) {
            return;
        }
        onAdd(paramKey, paramValue);
        setParamKey('');
        setParamValue('');
    };

    return (
        <AddParamContainer>
            <AddParamColumn>
                <Message messageKey='fields.params.key'/>
                <TextInput
                    disabled={disabled}
                    value={paramKey}
                    onChange={(evt) => setParamKey(evt.target.value)}
                    onKeyUp={(evt) => { if (evt.key === ENTER_KEY) addParam(); }}
                />
            </AddParamColumn>
            <AddParamColumn>
                <Message messageKey='fields.params.value'/>
                <TextInput
                    disabled={disabled}
                    value={paramValue}
                    onChange={(evt) => setParamValue(evt.target.value)}
                    onKeyUp={(evt) => { if (evt.key === ENTER_KEY) addParam(); }}
                />
            </AddParamColumn>
            <AddParamButtonColumn>
                <PrimaryButton type='add' onClick={addParam} disabled={!canAdd} />
            </AddParamButtonColumn>
        </AddParamContainer>
    );
};

ServiceUrlAddParam.propTypes = {
    disabled: PropTypes.bool,
    params: PropTypes.object,
    onAdd: PropTypes.func.isRequired
};
