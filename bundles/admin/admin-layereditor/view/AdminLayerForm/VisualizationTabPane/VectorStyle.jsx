import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { VectorStyleSelect } from './VectorStyle/VectorStyleSelect';
import { VectorNameInput } from './VectorStyle/VectorNameInput';
import { Controller } from 'oskari-ui/util';
import { Button, Message, Modal } from 'oskari-ui';
import { PlusOutlined } from '@ant-design/icons';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';

export const VectorStyle = (props) => {
    const [editorState, setEditorState] = useState({
        modalVisibility: false,
        currentStyle: {},
        styleName: '',
        originalName: '',
        validates: false
    });

    const saveStyle = () => props.controller.saveStyleToLayer(editorState.currentStyle, editorState.styleName, editorState.originalName);
    const onModalCancel = () => setEditorState({ ...editorState, modalVisibility: false });
    const resetNewStyle = () => setEditorState({ ...editorState, styleName: '', originalName: '', currentStyle: {}, modalVisibility: true });
    const onModalOk = () => {
        if (editorState.validates) {
            saveStyle();
            setEditorState({ ...editorState, modalVisibility: false });
        }
    };

    return (
        <Fragment>
            <Button onClick={ resetNewStyle }>
                <PlusOutlined />
                <Message messageKey="styles.addStyle" />
            </Button>

            <Modal visible={ editorState.modalVisibility } okButtonPros={ 'disabled' } onOk={ onModalOk } onCancel={ onModalCancel }>
                <VectorNameInput editorState={ editorState } styleName={ editorState.styleName } stateSetCallback={ setEditorState } />

                <StyleEditor
                    oskariStyle={ editorState.currentStyle }
                    onChange={ (style) => setEditorState({ ...editorState, currentStyle: style })}
                />
            </Modal>

            <VectorStyleSelect
                layer={ props.layer }
                controller={ props.controller }
                editStyleCallback={ (styleName) => {
                    setEditorState({
                        modalVisibility: true,
                        styleName: styleName,
                        originalName: styleName,
                        currentStyle: props.layer.options.styles[styleName]
                    });
                } }
            />
        </Fragment>
    );
};

VectorStyle.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
