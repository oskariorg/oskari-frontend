import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DeleteButton } from 'oskari-ui/components/buttons';
import { Tooltip, Message } from 'oskari-ui';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';

const ToolRow = styled.div`
    margin-left: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;
const StyledTool = styled.span`
    padding-right: 5px;
`;

export const CollapseTools = ({ announcementId, toolController }) => {
    if (!toolController) {
        return null;
    }
    return (
        <ToolRow onClick={(event) => event.stopPropagation()}>
            <StyledTool>
                <Tooltip title={<Message messageKey={'tools.preview'}/>}>
                    <EyeOutlined className='t_button-preview' onClick = { () => toolController.preview(announcementId) }/>
                </Tooltip>
            </StyledTool>
            <StyledTool>
                <Tooltip title={<Message messageKey={'tools.edit'}/>}>
                    <EditOutlined className='t_button-edit' onClick = { () => toolController.showEditPopup(announcementId) }/>
                </Tooltip>
            </StyledTool>
            <StyledTool>
                <DeleteButton
                    type='icon'
                    onConfirm = { () => toolController.deleteAnnouncement(announcementId) }
                    tooltip={<Message messageKey={'tools.delete'}/>}/>
            </StyledTool>
        </ToolRow>
    );
};

CollapseTools.propTypes = {
    announcementId: PropTypes.number.isRequired,
    toolController: PropTypes.any
};
