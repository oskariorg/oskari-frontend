import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { Message, TextInput, Tooltip, Divider } from 'oskari-ui';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';
import { PLUGIN_NAME, BUNDLE_KEY, DEFAULT_STYLE, GEOMETRY_TYPE } from '../constants';

const Content = styled('div')`
    padding: 24px;
`;

const getMessage = path => <Message messageKey={ `plugin.${PLUGIN_NAME}.${path}` } bundleKey={BUNDLE_KEY} />;

const getMarkerStyle = state => {
    const style = { ...state.style };
    style.text.offsetX = 8 + 2 * style.image.size;
    style.text.labelText = Oskari.util.sanitize(state.msg);
    return style;
};

const Form = ({ onAdd, onDelete, onClose, marker }) => {
    const [state, setState] = useState({
        style: marker ? {
            ...DEFAULT_STYLE,
            image: {
                shape: marker.shape,
                size: marker.size,
                fill: {
                    color: `#${marker.color}`
                }
            }
        } : DEFAULT_STYLE,
        msg: marker ? marker.msg : ''
    });

    const updateStyle = (style) => setState({ ...state, style });
    const updateMsg = (msg) => setState({ ...state, msg });

    return (
        <Content>
            <Tooltip title={getMessage('form.message.label')}>
                <TextInput
                    placeholder={ Oskari.getMsg(BUNDLE_KEY, `plugin.${PLUGIN_NAME}.form.message.label`) }
                    value={ state.msg }
                    onChange={ (event) => updateMsg(event.target.value) }
                />
            </Tooltip>
            <Divider orientation="left">{getMessage('form.style')}</Divider>
            <StyleEditor
                oskariStyle={state.style}
                onChange={ updateStyle }
                geometryType = {GEOMETRY_TYPE}
            />
            <ButtonContainer>
                {marker && (
                    <SecondaryButton
                        type='delete'
                        onClick={() => onDelete(marker)}
                    />
                )}
                <SecondaryButton type='close' onClick={onClose}/>
                <PrimaryButton type={marker ? 'save' : 'add'} onClick={() => onAdd(getMarkerStyle(state), marker) }/>
            </ButtonContainer>
        </Content>
    );
};
Form.propTypes = {
    onAdd: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};
export const showAddMarkerPopup = (onAdd, onDelete, onClose, marker) => {
    const content = (
        <Form onAdd= { onAdd } onDelete= { onDelete } onClose={ onClose } marker={marker} />
    );
    return showPopup(getMessage('title'), content, onClose, { id: PLUGIN_NAME });
};
