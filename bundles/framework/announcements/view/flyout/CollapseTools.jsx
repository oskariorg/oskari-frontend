import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DeleteButton, IconButton } from 'oskari-ui/components/buttons';
import { Message } from 'oskari-ui';
import { EyeOutlined } from '@ant-design/icons';

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
                <IconButton
                    className='t_preview'
                    icon={<EyeOutlined/>}
                    title={<Message messageKey={'tools.preview'}/>}
                    onClick = { () => toolController.preview(announcementId) }/>
            </StyledTool>
            <StyledTool>
                <IconButton
                    type='edit'
                    title={<Message messageKey={'tools.edit'}/>}
                    onClick = { () => toolController.showEditPopup(announcementId) }/>
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
