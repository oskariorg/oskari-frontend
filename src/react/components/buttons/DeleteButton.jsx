import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Confirm, Button,Tooltip } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { SecondaryButton } from './';
import { DeleteIcon } from '../icons'

const StyledButton = styled(Button)`
    font-size: 16px;
`;

const getButton = (type, disabled ) => {
    const props = {
        className: 't_button t_delete',
        disabled
    }
    if (type === 'icon') {
        return <IconButton icon={<DeleteIcon/>} {...props}/>;
    }
    if (type === 'button') {
        return <StyledButton  {...props}><DeleteIcon/></StyledButton>;
    }
    if (type === 'label') {
        return <SecondaryButton {...props} danger type="delete"/>;
    }
};

export const DeleteButton = ({ 
    onConfirm,
    type,
    title = <Message messageKey='messages.confirmDelete' bundleKey='oskariui'/>,
    tooltip = <Message messageKey={'buttons.delete'} bundleKey='oskariui'/>,
    disabled = false
}) => {
    const placement = tooltip ? 'bottom' : 'top';
    return (
        <Confirm
            overlayClassName='t_confirm'
            title={title}
            onConfirm={onConfirm}
            disabled={disabled}
            okText={<Message messageKey='buttons.delete' bundleKey='oskariui'/>}
            cancelText={<Message messageKey='buttons.cancel' bundleKey='oskariui'/>}
            okButtonProps={{className: 't_button t_delete'}}
            cancelButtonProps={{className: 't_button t_cancel'}}
            okType='danger'
            placement={placement}>
            <Tooltip title={tooltip}>
                {getButton(type, disabled)}
            </Tooltip>
        </Confirm>
    );
};
DeleteButton.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.node,
    tooltip: PropTypes.node,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(['icon', 'button', 'label']).isRequired
};
