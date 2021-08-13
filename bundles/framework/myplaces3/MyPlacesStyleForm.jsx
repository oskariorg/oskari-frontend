import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider, Controller } from 'oskari-ui/util';
import { Message, Button, Tooltip } from 'oskari-ui';
import { VectorStyleModal } from 'oskari-ui/components/VectorStyle';
import styled from 'styled-components';

const CategoryButton = styled(Button)`
    margin: 0 10px 0 0;
`;

const hasValidName = (name) => {
    return name.length > 0;
};

export const MyPlacesStyleForm = ({ layer, saveCategory, deleteCategory, exportCategory }) => {
    const [editorState, setEditorState] = useState({
        modalVisibility: false,
        currentStyle: layer.style,
        styleId: '',
        styleName: layer.name || '',
        originalName: '',
        validates: false
    });

    const saveStyle = () => saveCategory({ categoryId: layer.categoryId, style: editorState.currentStyle, name: editorState.styleName });
    const onModalCancel = () => setEditorState({ ...editorState, modalVisibility: false });
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
        <LocaleProvider value={{ bundleKey: 'MyPlaces3' }}>
            <CategoryButton onClick={ () => setEditorState({ ...editorState, modalVisibility: true }) }>
                <Message messageKey='tab.editCategory' />
            </CategoryButton>
            <CategoryButton onClick={ () => deleteCategory(layer.categoryId) }>
                <Message messageKey='tab.deleteCategory' />

            </CategoryButton>
            <Tooltip placement='topLeft' title={ <Message messageKey='tab.export.tooltip' /> }>
                <CategoryButton onClick={ () => exportCategory(layer.categoryId) }>
                    <Message messageKey='tab.export.title' />
                </CategoryButton>
            </Tooltip>

            <VectorStyleModal
                editorState={ editorState }
                okButtonPros={ 'disabled' }
                onModalOk={ onModalOk }
                onCancel={ () => onModalCancel() }
                cancelText={ <Message messageKey='buttons.cancel' /> }
                okText={ <Message messageKey='buttons.save' /> }
                nameValidation={ hasValidName }
                setName={ setName }
                setEditorState={ setEditorState }
            />
        </LocaleProvider>
    );
};

MyPlacesStyleForm.propTypes = {
    layer: PropTypes.object.isRequired,
    saveCategory: PropTypes.func.isRequired,
    deleteCategory: PropTypes.func.isRequired,
    exportCategory: PropTypes.func.isRequired,
    controller: PropTypes.instanceOf(Controller)
};
