import React from 'react';
import PropTypes from 'prop-types';
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
export const ToolLayout = ({ toolLayoutEditMode, controller }) => {
    const onEditMode = isEdit => {
        if (isEdit) {
            controller.editToolLayoutOn();
        } else {
            // remove edit mode
            controller.editToolLayoutOff();
        }
    };
    return (
        <FieldWithInfo>
            <Button className='t_swap_sides' onClick={() => controller.switchControlSides()} icon={<SwapOutlined />}>
                <Message messageKey='BasicView.toolLayout.swapUI' />
            </Button>
            <Button className='t_custom_placement' danger={toolLayoutEditMode}
                onClick={() => onEditMode(!toolLayoutEditMode)}
                icon={toolLayoutEditMode ? <EditFilled /> : <EditOutlined />}>
                <Message messageKey={`BasicView.toolLayout.${toolLayoutEditMode ? 'usereditmodeoff' : 'userlayout'}`} />
            </Button>
        </FieldWithInfo>
    );
};

ToolLayout.propTypes = {
    toolLayoutEditMode: PropTypes.bool.isRequired,
    controller: PropTypes.object.isRequired
};
