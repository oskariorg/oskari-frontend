import React from 'react';
import PropTypes from 'prop-types';
import { VectorNameInput } from 'oskari-ui/components/VectorStyle/VectorNameInput';
import { Message, Modal } from 'oskari-ui';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';

export const VectorStyleModal = ({ editorState, onCancel, onModalOk, setEditorState, nameValidation, setName, okText, cancelText }) => {
    return (
        <Modal
            visible={ editorState.modalVisibility }
            okButtonPros={ 'disabled' }
            onOk={ () => editorState.validates && onModalOk() }
            onCancel={ onCancel }
            cancelText={ cancelText }
            okText={ okText }
        >
            <VectorNameInput
                styleName={ editorState.styleName }
                isValid={ editorState.validates }
                onChange={ setName }
                nameFieldHeader={ <Message messageKey={ 'categoryform.name.label' } /> }
                validationErrorMessage={ <Message messageKey={ 'categoryform.name.error' } /> }
            />

            <StyleEditor
                oskariStyle={ editorState.currentStyle }
                onChange={ (style) => setEditorState({ ...editorState, currentStyle: style }) }
            />
        </Modal>
    );
};

VectorStyleModal.propTypes = {
    editorState: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onModalOk: PropTypes.func.isRequired,
    setEditorState: PropTypes.func.isRequired,
    setName: PropTypes.func.isRequired,
    okText: PropTypes.node,
    cancelText: PropTypes.node
};
