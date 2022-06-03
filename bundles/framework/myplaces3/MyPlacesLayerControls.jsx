import React from 'react';
import PropTypes from 'prop-types';
import { Message, Tooltip } from 'oskari-ui';
import styled from 'styled-components';
import { Select, Button } from 'oskari-ui';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { AddIcon, EditIcon } from 'oskari-ui/components/icons';
import { red } from '@ant-design/colors';

const DELETE_ICON_STYLE = {
    color: red.primary
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
    button {
        font-size: 16px;
    }
`;

const IconButton = styled(Button)`
    cursor: pointer;
    margin-left: 5px;
`;

export const MyPlacesLayerControls = ({ selectedCategory, loading, categories = [], controller }) => {

    const { Option } = Select;

    return (
        <React.Fragment>
            <StyledControls className='t_tools-category'>
                <label><b><Message messageKey='tab.categoryTitle' /></b></label>
                <StyledSelect loading={loading} value={selectedCategory ? selectedCategory.categoryId : null} onChange={controller.selectCategory}>
                    {categories.map(category => (
                        <Option key={category.categoryId} value={category.categoryId}>{category.name}</Option>
                    ))}
                </StyledSelect>
                <StyledActions>
                    <IconButton>
                        <AddIcon onClick={() => controller.openLayerDialog()} tooltip={<Message messageKey='tab.addCategory' />} />
                    </IconButton>
                    {selectedCategory && (
                        <React.Fragment>
                            <Tooltip >
                                <IconButton>
                                    <EditIcon onClick={() => controller.editCategory(selectedCategory.categoryId)} tooltip={<Message messageKey='tab.editCategory' />}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={<Message messageKey='tab.export.tooltip' />}>
                                <IconButton className='icon category_export' onClick={() => controller.exportCategory(selectedCategory.categoryId)}><ExportOutlined/></IconButton>
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
