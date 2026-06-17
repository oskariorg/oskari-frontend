import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from 'styled-components';
import { Message, TextInput } from 'oskari-ui';
import { PrimaryButton } from 'oskari-ui/components/buttons';
import { RESERVED_LAYER_PARAMS } from './ServiceUrlInputHelper';

const AddParamContainer = styled('div')`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 0.5em;
`;

const AddParamRow = styled('div')`
    display: flex;
    flex-direction: row;
    column-gap: 1em;
    width: 100%;
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

const Error = styled('div')`
    color: red;
    font-style: italic;
`;

const ENTER_KEY = 'Enter';

const validate = (key, params) => {
    if (!key?.length) {
        return null;
    }

    if (Object.keys(params).includes(key)) {
        return {
            keyExists: true
        };
    }

    if (RESERVED_LAYER_PARAMS.includes(key.toLowerCase())) {
        return {
            reservedKey: true
        };
    }

    return null;
};

const getErrorMessage = (error) => {
    const allKeys = Object.keys(error || {});
    if (allKeys.length) {
        return <Message messageKey={`fields.params.errors.${allKeys[0]}`}/>;
    }
    return null;
};

export const ServiceUrlAddParam = ({ disabled, params = {}, onAdd }) => {
    const [paramKey, setParamKey] = useState('');
    const [paramValue, setParamValue] = useState('');

    const trimmedKey = paramKey.trim();
    const trimmedValue = paramValue.trim();
    const error = validate(trimmedKey, params);
    const canAdd = !disabled && !!trimmedKey && !!trimmedValue && !error;

    const addParam = () => {
        if (!canAdd) {
            return;
        }
        onAdd(trimmedKey, paramValue);
        setParamKey('');
        setParamValue('');
    };

    return (
        <AddParamContainer>
            <AddParamRow>
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
            </AddParamRow>
            {error && <Error>{getErrorMessage(error)}</Error>}
        </AddParamContainer>
    );
};

ServiceUrlAddParam.propTypes = {
    disabled: PropTypes.bool,
    params: PropTypes.object,
    onAdd: PropTypes.func.isRequired
};
