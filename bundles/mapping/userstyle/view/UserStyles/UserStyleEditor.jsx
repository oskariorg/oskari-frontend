import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, TextInput, Tooltip, Divider } from 'oskari-ui';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';
import { OSKARI_BLANK_STYLE } from 'oskari-ui/components/StyleEditor/index';
import { BUNDLE_KEY } from '../constants';

const Content = styled('div')`
    padding: 24px;
    width: 500px;
`;

export const StyleForm = ({ style, onAdd, onCancel }) => {
    const { featureStyle = {}, name } = style;
    const [state, setState] = useState({
        featureStyle: Object.keys(featureStyle).length > 0 ? featureStyle : OSKARI_BLANK_STYLE,
        name
    });

    const updateStyle = featureStyle => setState({ ...state, featureStyle });
    const updateName = name => setState({ ...state, name });

    return (
        <Content>
            <Tooltip title={<Message messageKey='popup.name'/>}>
                <TextInput
                    placeholder={ Oskari.getMsg(BUNDLE_KEY, `popup.name`) }
                    value={ state.title }
                    onChange={ event => updateName(event.target.value) }
                />
            </Tooltip>
            <Divider orientation="left">
                <Message messageKey='popup.style'/>
            </Divider>
            <StyleEditor
                oskariStyle={ state.featureStyle }
                onChange={ updateStyle }
            />
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={onCancel}/>
                <PrimaryButton type='save' onClick={() => onAdd(state)}/>
            </ButtonContainer>
        </Content>
    );
};

StyleForm.propTypes = {
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired
};
