import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Tooltip } from 'oskari-ui';
import styled from 'styled-components';

const CategoryButton = styled(Button)`
    margin: 0 10px 0 0;
`;

// PersonalData removal
export const MyPlacesLegacyLayerControls = ({ layer, controller }) => {
    return (
        <React.Fragment>
            <CategoryButton onClick={ () => controller.editCategory(layer.categoryId) }>
                <Message messageKey='tab.editCategory' />
            </CategoryButton>
            <CategoryButton onClick={ () => controller.deleteCategory(layer) }>
                <Message messageKey='tab.deleteCategory' />
            </CategoryButton>
            <Tooltip placement='topLeft' title={ <Message messageKey='tab.export.tooltip' /> }>
                <CategoryButton onClick={ () => controller.exportCategory(layer.categoryId) }>
                    <Message messageKey='tab.export.title' />
                </CategoryButton>
            </Tooltip>
        </React.Fragment>
    );
};

MyPlacesLegacyLayerControls.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
};