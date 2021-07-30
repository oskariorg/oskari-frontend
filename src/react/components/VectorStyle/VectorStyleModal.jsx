import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VectorNameInput } from 'oskari-ui/components/VectorStyle';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { Message, Modal } from 'oskari-ui';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';

export const VectorStyleModal = LocaleConsumer(({editorState, onCancel, onModalOk, setEditorState, nameValidation, setName}) => {
    return (
        <Modal
            visible={ editorState.modalVisibility }
            okButtonPros={ 'disabled' }
            onOk={ () => onModalOk() }
            onCancel={ onCancel }
            cancelText={ <Message messageKey="cancel" /> }
            okText={ <Message messageKey="save" /> }
        >
            <VectorNameInput
                styleName={ editorState.styleName }
                isValid={ nameValidation(editorState.styleName) }
                onChange={ setName }
            />

            <StyleEditor
                oskariStyle={ editorState.currentStyle }
                onChange={ (style) => setEditorState({ ...editorState, currentStyle: style })}
            />
        </Modal>
    );
});