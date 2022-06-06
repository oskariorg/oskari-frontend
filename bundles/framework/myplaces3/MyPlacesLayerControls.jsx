import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Message, Tooltip } from 'oskari-ui';
import styled from 'styled-components';
import { Select, Button, Popover, Option } from 'oskari-ui';
import { SecondaryButton, ButtonContainer, DeleteButton } from 'oskari-ui/components/buttons';
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

const MarginLeft = styled.span`
    margin-left: 5px;
`;

const Content = styled('div')`
    max-width: 500px;
`;
const getDefaultCategoryId = categories => categories.find(cat => cat.isDefault).categoryId;
const DeletePlaces = ({
    categories,
    selectedCategoryId,
    count,
    controller,
    isDefault = false
}) => {
    const [visible, setVisible] = useState(false);
    const [moveToId, setMoveToId] = useState(getDefaultCategoryId(categories));
    const options = categories.filter(cat => cat.categoryId !== selectedCategoryId);
    const { name } = categories.find(cat => cat.categoryId === selectedCategoryId);
    const deleteTooltip = isDefault ? 'tab.deleteDefault' : 'tab.deleteCategory';
    const onConfirm = (move) => {
        if (move) {
            controller.deleteCategory(selectedCategoryId, moveToId);
        } else {
            controller.deleteCategory(selectedCategoryId);
        }
        setVisible(false);
    };
    const content = (
        <Content>
            <b><Message messageKey='tab.deleteWithMove.name'/></b>
            <MarginLeft/>
            {name}
            <br/>
            <Message messageKey='tab.deleteWithMove.count' messageArgs={{ count }}/>
            <br/>
            <Message messageKey='tab.deleteWithMove.delete' messageArgs={{ count }}/>
            <br/>
            <Message messageKey='tab.deleteWithMove.move' messageArgs={{ count }}/>
            <MarginLeft/>
            <Select value={moveToId} onChange={setMoveToId}>
                {options.map(category => (
                    <Option key={category.categoryId} value={category.categoryId}>{category.name}</Option>
                ))}
            </Select>
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={() => setVisible(false)}/>
                <Button onClick={() => onConfirm(false)}>
                    <Message messageKey='buttons.deleteCategoryAndPlaces'/>
                </Button>
                <Button type='primary' onClick={() => onConfirm(true)}>
                    <Message messageKey='buttons.movePlaces'/>
                </Button>
            </ButtonContainer>
        </Content>
    );
    return (
        <Popover trigger="click" placement="bottom" visible={visible} content={content} >
            <Tooltip title={<Message messageKey={deleteTooltip}/>}>
                <Button disabled={isDefault} className='icon category_delete' onClick={() => setVisible(true)}><DeleteOutlined style={DELETE_ICON_STYLE} /></Button>
            </Tooltip>
        </Popover>
    );
};

DeletePlaces.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object),
    selectedCategoryId: PropTypes.number,
    controller: PropTypes.object.isRequired,
    isDefault: PropTypes.bool,
    count: PropTypes.number
};

export const MyPlacesLayerControls = (props) => {
    const { selectedCategoryId, loading, categories = [], controller, places } = props;
    const { isDefault, name } = categories.find(cat => cat.categoryId === selectedCategoryId) || {};
    const deleteTooltip = isDefault ? 'tab.deleteDefault' : 'tab.deleteCategory';
    const hasPlaces = places.length > 0;
    return (
        <React.Fragment>
            <StyledControls>
                <label><b><Message messageKey='tab.categoryTitle' /></b></label>
                <StyledSelect loading={loading} value={selectedCategoryId} onChange={controller.selectCategory}>
                    {categories.map(category => (
                        <Option key={category.categoryId} value={category.categoryId}>{category.name}</Option>
                    ))}
                </StyledSelect>
                <StyledActions>
                    <Tooltip title={<Message messageKey='tab.addCategory' />}>
                        <IconButton className='icon category_add' onClick={() => controller.openLayerDialog()}><PlusCircleOutlined style={ADD_ICON_STYLE} /></IconButton>
                    </Tooltip>
                    {selectedCategoryId && (
                        <React.Fragment>
                            <Tooltip title={<Message messageKey='tab.editCategory' />}>
                                <IconButton className='icon category_edit' onClick={() => controller.editCategory(selectedCategoryId)}><EditOutlined style={EDIT_ICON_STYLE} /></IconButton>
                            </Tooltip>
                            <Tooltip title={<Message messageKey='tab.export.tooltip' />}>
                                <IconButton className='icon category_export' onClick={() => controller.exportCategory(selectedCategoryId)}><ExportOutlined style={EXPORT_ICON_STYLE} /></IconButton>
                            </Tooltip>
                            <MarginLeft/>
                            { !hasPlaces && <DeleteButton type='button' disabled={isDefault}
                                tooltip={<Message messageKey={deleteTooltip}/>}
                                title={<Message messageKey='tab.confirm.deleteCategory' messageArgs={{ name }}/>}
                                onConfirm={() => controller.deleteCategory(selectedCategoryId)}
                            />}
                            { hasPlaces && <DeletePlaces {...props} isDefault={isDefault} count={places.length}/>}
                        </React.Fragment>
                    )}
                </StyledActions>
            </StyledControls>
        </React.Fragment>
    );
};

MyPlacesLayerControls.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.object),
    selectedCategoryId: PropTypes.number,
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    places: PropTypes.array
};
