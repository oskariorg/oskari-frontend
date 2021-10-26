import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Message, TextInput, Divider, Modal, StyleEditor } from 'oskari-ui';
import { OSKARI_BLANK_STYLE } from 'oskari-ui/components/StyleEditor/index';

export const MyPlacesLayerForm = ({ name, style, onSave, onCancel }) => {
    const [editorState, setEditorState] = useState({
        style: style || OSKARI_BLANK_STYLE,
        name: name
    });
    const updateStyle = (style) => setEditorState({ ...editorState, style });
    const updateName = (name) => setEditorState({ ...editorState, name });
    const hasName = editorState.name.length > 0;
    return (
        <Modal
            title={ <Message messageKey={ 'categoryform.title' } /> }
            visible={ true }
            onOk={ () => onSave(editorState.name, editorState.style) }
            okButtonProps={ { disabled: !hasName } }
            onCancel={ onCancel }
            cancelText={ <Message messageKey="buttons.cancel" /> }
            okText={ <Message messageKey="buttons.save" /> }
        >
            <TextInput
                addonBefore={ <Message messageKey={ 'categoryform.layerName' } /> }
                value={ editorState.name }
                onChange={ (event) => updateName(event.target.value) }
            />
            { !hasName && <Message messageKey='validation.categoryName' /> }
            <Divider orientation="left"><Message messageKey={ 'categoryform.styleTitle' } /></Divider>
            <StyleEditor
                oskariStyle={ editorState.style }
                onChange={ updateStyle }
            />
        </Modal>
    );
};

MyPlacesLayerForm.propTypes = {
    name: PropTypes.string.isRequired,
    style: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};
