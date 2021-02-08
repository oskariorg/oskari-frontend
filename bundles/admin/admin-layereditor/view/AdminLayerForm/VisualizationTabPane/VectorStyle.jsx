import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { VectorStyleSelect } from './VectorStyle/VectorStyleSelect';
import { VectorNameInput } from './VectorStyle/VectorNameInput';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { Button, Message, Modal } from 'oskari-ui';
import { PlusOutlined } from '@ant-design/icons';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';


const hasValidName = (name) => {
    return name.length > 0;
};

export const VectorStyle = LocaleConsumer((props) => {
    const newStyleName = props.getMessage('styles.newStyleName');
    const [editorState, setEditorState] = useState({
        modalVisibility: false,
        currentStyle: {},
        styleName: newStyleName,
        originalName: '',
        validates: false
    });

    const saveStyle = () => props.controller.saveStyleToLayer(editorState.currentStyle, editorState.styleName, editorState.originalName);
    const onModalCancel = () => setEditorState({ ...editorState, modalVisibility: false });
    const resetNewStyle = () => setEditorState({ ...editorState, styleName: newStyleName, originalName: '', currentStyle: {}, modalVisibility: true });
    const onModalOk = () => {
        if (hasValidName(editorState.styleName)) {
            saveStyle();
            setEditorState({ ...editorState, modalVisibility: false });
        }
    };

    const setName = (name) => {
        setEditorState({ ...editorState, styleName: name });
    };

    return (
        <Fragment>
            <Button onClick={ resetNewStyle }>
                <PlusOutlined />
                <Message messageKey="styles.vector.addStyle" />
            </Button>

            <Modal visible={ editorState.modalVisibility } okButtonPros={ 'disabled' } onOk={ onModalOk } onCancel={ onModalCancel }>
                <VectorNameInput
                    styleName={ editorState.styleName }
                    isValid={ hasValidName(editorState.styleName) }
                    onChange={ setName } />

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
});

VectorStyle.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
