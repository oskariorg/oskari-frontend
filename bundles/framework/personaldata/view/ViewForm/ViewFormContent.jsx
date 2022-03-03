import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Tooltip, Spin, TextInput, TextAreaInput, Checkbox } from 'oskari-ui';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';


const Content = styled.div`
    margin: 12px 24px 24px;
`;

const Input = styled(TextInput)`
    margin-bottom: 10px;
`;

export const ViewFormContent = ({ values = {}, onOk, onCancel, error, loading }) => {
    const [state, setState] = useState({ ...values });

    const updateState = (newState) => setState({ ...state, ...newState });
    const onOkClick = () => {
        const values = {
            name: state.name,
            description: state.description,
            isDefault: state.isDefault
        };
        onOk(values);
    };

    const hasMandatoryName = state.name?.trim().length > 0;

    const Component = (
        <Content>
            <Message messageKey='tabs.myviews.popup.name_placeholder' />
            <Input type='text' name='name' onChange={e => updateState({[e.target.name]: e.target.value})} value={state.name} isRequired/>
            <Message messageKey='tabs.myviews.popup.description_placeholder' />
            <TextAreaInput name='description' onChange={e => updateState({[e.target.name]: e.target.value})} value={state.description} />
            <Checkbox
                name='isDefault'
                checked={state.isDefault}
                onChange={() => updateState({isDefault: !state.isDefault})}
            >
                <Message messageKey='tabs.myviews.popup.default' />
            </Checkbox>
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={() => onCancel()}/>
                <Tooltip title={<Message messageKey={`tabs.myviews.popup.error_noname`} />}>
                    <PrimaryButton disabled={!hasMandatoryName} type="save" onClick={onOkClick}/>
                </Tooltip>
            </ButtonContainer>
        </Content>
    );
    if (!error && loading) {
        return <Spin showTip={true}>{Component}</Spin>;
    }
    return Component;
};

ViewFormContent.propTypes = {
    values: PropTypes.object,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    error: PropTypes.string
};
