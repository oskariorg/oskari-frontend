import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Tooltip, Spin, LabeledInput, Checkbox } from 'oskari-ui';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { LocaleConsumer } from 'oskari-ui/util';

const Content = styled.div`
    margin: 12px 24px 24px;
`;

const ViewFormContent = ({ values = {}, onOk, onCancel, getMessage }) => {
    const [state, setState] = useState({
        name: getMessage('tabs.myviews.popup.defaultName', { now: Date.now() }),
        ...values
    });
    const updateState = (newState) => setState({ ...state, ...newState });
    const getLabel = name => getMessage(`tabs.myviews.popup.label.${name}`);
    const onSave = () => {
        onOk({ ...state });
        updateState({ loading: true });
    };

    const hasMandatoryName = state.name.trim().length > 0;
    const tooltip = hasMandatoryName ? '' : <Message messageKey={`tabs.myviews.popup.noName`} />;

    const Component = (
        <Content>
            <LabeledInput
                value={state.name}
                onChange={e => updateState({ name: e.target.value })}
                onFocus = {e => e.target.select()}
                label={getLabel('name')}
                mandatory
                autoFocus
            />
            <LabeledInput
                value={state.description}
                type='textarea'
                onChange={e => updateState({ description: e.target.value })}
                label={getLabel('description')}
            />
            <Checkbox
                checked={state.isDefault}
                onChange={() => updateState({ isDefault: !state.isDefault })}
            >
                <Message messageKey='tabs.myviews.popup.label.default' />
            </Checkbox>
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={() => onCancel()}/>
                <Tooltip title={tooltip}>
                    <PrimaryButton disabled={!hasMandatoryName} type="save" onClick={onSave}/>
                </Tooltip>
            </ButtonContainer>
        </Content>
    );
    if (state.loading) {
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

const wrapped = LocaleConsumer(ViewFormContent);
export { wrapped as ViewFormContent };
