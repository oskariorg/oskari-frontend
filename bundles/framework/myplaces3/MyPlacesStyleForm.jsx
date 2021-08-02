import React, { useState, useEffect } from 'react';
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

const getMessage = (key, args) => <Message messageKey={key} messageArgs={args} bundleKey='MyPlaces3' />;

export const MyPlacesStyleForm = ({layer, saveCategory, deleteCategory, exportCategory}) => {
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
    const resetNewStyle = () => setEditorState({ ...editorState, styleId: '', styleName: '', originalName: '', currentStyle: {}, modalVisibility: true });
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
                { getMessage('tab.editCategory') }
            </CategoryButton>
            <CategoryButton onClick={ () => deleteCategory(layer.categoryId) }>
                { getMessage('tab.deleteCategory') }
            </CategoryButton>
            <Tooltip placement='topLeft' title={ getMessage('tab.export.tooltip') }>
                <CategoryButton onClick={ () => exportCategory(layer.categoryId) }>
                    { getMessage('tab.export.title') }
                </CategoryButton>
            </Tooltip>

            <VectorStyleModal
                editorState={ editorState }
                okButtonPros={ 'disabled' }
                onModalOk={ onModalOk }
                onCancel={ () => onModalCancel() }
                cancelText={ <Message messageKey="cancel" /> }
                okText={ <Message messageKey="save" /> }
                nameValidation={ hasValidName }
                setName={ setName }
                setEditorState={ setEditorState }
            />
        </LocaleProvider>
    );
};

MyPlacesStyleForm.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller)
};
