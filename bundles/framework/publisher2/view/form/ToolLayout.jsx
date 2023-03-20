import React from 'react';
import { Button, Message } from 'oskari-ui';
import { SwapOutlined, EditOutlined, EditFilled } from '@ant-design/icons';
import styled from 'styled-components';

const FieldWithInfo = styled('div')`
    margin-top: 0.5em;
    margin-bottom: 1em;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
`;
export const ToolLayout = ({ isEdit, onEditMode, onSwitch }) => {
    return (
        <FieldWithInfo>
            <Button onClick={onSwitch}><SwapOutlined /> <Message messageKey='BasicView.toollayout.swapUI' /></Button>
            <Button onClick={() => onEditMode(!isEdit)} danger={isEdit}><EditButtonContent isEdit={isEdit} /></Button>
        </FieldWithInfo>
    );
};

const EditButtonContent = ({isEdit}) => {
    if (isEdit) {
        return (<React.Fragment>
            <EditFilled /> <Message messageKey='BasicView.toollayout.usereditmodeoff' />
        </React.Fragment>);
    }
    return (<React.Fragment>
        <EditOutlined /> <Message messageKey='BasicView.toollayout.userlayout' />
    </React.Fragment>);
};
