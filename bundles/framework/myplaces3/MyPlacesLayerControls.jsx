import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Tooltip } from 'oskari-ui';
import styled from 'styled-components';

const CategoryButton = styled(Button)`
    margin: 0 10px 0 0;
`;

export const MyPlacesLayerControls = ({ layer, editCategory, deleteCategory, exportCategory }) => {
    return (
        <React.Fragment>
            <CategoryButton onClick={ () => editCategory(layer.categoryId) }>
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
        </React.Fragment>
    );
};

MyPlacesLayerControls.propTypes = {
    layer: PropTypes.object.isRequired,
    editCategory: PropTypes.func.isRequired,
    deleteCategory: PropTypes.func.isRequired,
    exportCategory: PropTypes.func.isRequired
};
