import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider } from 'oskari-ui/util';
import { Message, Button, Tooltip } from 'oskari-ui';
import { MyPlacesLayerForm } from './MyPlacesLayerForm';
import styled from 'styled-components';

const CategoryButton = styled(Button)`
    margin: 0 10px 0 0;
`;

export const MyPlacesLayerControls = ({ layer, saveCategory, deleteCategory, exportCategory }) => {
    const [modalVisible, showModal] = useState(false);
    const saveForm = (name, style) => {
        showModal(false);
        saveCategory({ categoryId: layer.categoryId, style: style, name: name });
    };
    return (
        <LocaleProvider value={{ bundleKey: 'MyPlaces3' }}>
            <CategoryButton onClick={ () => showModal(true) }>
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
            { modalVisible &&  <MyPlacesLayerForm
                name={ layer.name }
                style={ layer.style }
                onSave={ saveForm }
                onCancel={ () => showModal(false) }
            /> }
        </LocaleProvider>
    );
};

MyPlacesLayerControls.propTypes = {
    layer: PropTypes.object.isRequired,
    saveCategory: PropTypes.func.isRequired,
    deleteCategory: PropTypes.func.isRequired,
    exportCategory: PropTypes.func.isRequired
};
