import React from 'react';
import PropTypes from 'prop-types';
import { Message, Tooltip } from 'oskari-ui';
import styled from 'styled-components';
import { Select, Button } from 'antd';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, ExportOutlined } from '@ant-design/icons'
import { red, green } from '@ant-design/colors'

const DELETE_ICON_STYLE = {
    fontSize: '16px',
    color: red.primary
};

const EDIT_ICON_STYLE = {
    fontSize: '16px'
};

const ADD_ICON_STYLE = {
    fontSize: '16px',
    color: green.primary
};

const EXPORT_ICON_STYLE = {
    fontSize: '16px'
};

const StyledControls = styled('div')`
    display: flex;
    width: 100%;
    margin-bottom: 15px;
    align-items: center;
`;

const StyledSelect = styled(Select)`
    margin-left: 10px;
    width: 240px;
`;

const StyledActions = styled('div')`
    display: flex;
`;

const IconButton = styled(Button)`
    cursor: pointer;
    margin-left: 5px;
`;

export const MyPlacesLayerControls = ({ selectedCategory, loading, categories = [], controller }) => {

    const { Option } = Select;

    return (
        <React.Fragment>
            <StyledControls>
                <label><b><Message messageKey='tab.categoryTitle' /></b></label>
                <StyledSelect loading={loading} value={selectedCategory ? selectedCategory.categoryId : null} onChange={controller.selectCategory}>
                    {categories.map(category => (
                        <Option key={category.categoryId} value={category.categoryId}>{category.name}</Option>
                    ))}
                </StyledSelect>
                <StyledActions>
                    <Tooltip title={<Message messageKey='tab.addCategory' />}>
                        <IconButton className='icon category_add' onClick={() => controller.openLayerDialog()}><PlusCircleOutlined style={ADD_ICON_STYLE} /></IconButton>
                    </Tooltip>
                    {selectedCategory && (
                        <React.Fragment>
                            <Tooltip title={<Message messageKey='tab.editCategory' />}>
                                <IconButton className='icon category_edit' onClick={() => controller.editCategory(selectedCategory.categoryId)}><EditOutlined style={EDIT_ICON_STYLE} /></IconButton>
                            </Tooltip>
                            <Tooltip title={<Message messageKey='tab.export.tooltip' />}>
                                <IconButton className='icon category_export' onClick={() => controller.exportCategory(selectedCategory.categoryId)}><ExportOutlined style={EXPORT_ICON_STYLE} /></IconButton>
                            </Tooltip>
                            <Tooltip title={<Message messageKey='tab.deleteCategory' />}>
                                <IconButton className='icon category_delete' onClick={() => controller.deleteCategory(selectedCategory.categoryId)}><DeleteOutlined style={DELETE_ICON_STYLE} /></IconButton>
                            </Tooltip>
                        </React.Fragment>
                    )}
                </StyledActions>
            </StyledControls>
        </React.Fragment>
    );
};

MyPlacesLayerControls.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object),
    selectedCategory: PropTypes.object,
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};
