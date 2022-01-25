import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, TextInput, Tooltip, Divider } from 'oskari-ui';
import { SecondaryButton, PrimaryButton } from 'oskari-ui/components/buttons';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';
import { OSKARI_BLANK_STYLE } from 'oskari-ui/components/StyleEditor/index';
import { BUNDLE_KEY } from './';

const Content = styled('div')`
    padding: 24px;
    width: 550px;
`;
const Buttons = styled('div')`
    padding: 10px 0px;
    margin-left: auto;
`;

const getMessage = key => <Message messageKey={ `popup.${key}` } />;

export const StyleForm = ({ vectorStyle, onAdd, onClose }) => {
    const [state, setState] = useState({
        featureStyle: vectorStyle.hasDefinitions() ? vectorStyle.getFeatureStyle() : OSKARI_BLANK_STYLE,
        title: vectorStyle.getTitle()
    });

    const updateStyle = featureStyle => setState({ ...state, featureStyle });
    const updateTitle = title => setState({ ...state, title });

    return (
        <Content>
            <Tooltip title={getMessage('name')}>
                <TextInput
                    placeholder={ Oskari.getMsg(BUNDLE_KEY, `popup.name`) }
                    value={ state.title }
                    onChange={ event => updateTitle(event.target.value) }
                />
            </Tooltip>
            <Divider orientation="left">{getMessage('style')}</Divider>
            <StyleEditor
                oskariStyle={ state.featureStyle }
                onChange={ updateStyle }
            />
            <Buttons>
                <SecondaryButton type='cancel' onClick={onClose}/>
                <PrimaryButton type='save' onClick={() => onAdd(state) }/>
            </Buttons>
        </Content>
    );
};

StyleForm.propTypes = {
    onAdd: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    vectorStyle: PropTypes.object.isRequired
};
