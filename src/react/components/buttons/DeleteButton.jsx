import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Confirm, Button,Tooltip } from 'oskari-ui';

import { SecondaryButton } from './';
import { DeleteOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors'

const DeleteIcon = styled(DeleteOutlined)`
    color: ${red.primary};
    cursor: pointer;
`;


const getButton = (type, disabled ) => {
    if (type === 'icon') {
        return <DeleteIcon/>;
    }
    if (type === 'button') {
        return <Button disabled={disabled}><DeleteIcon/></Button>;
    }
    return <SecondaryButton disabled={disabled} danger type="delete"/>;
};
const getMsg = key => <Message messageKey={key} bundleKey='oskariui'/>


// TODO: update bundles to use type and remove icon
export const DeleteButton = ({ 
    onConfirm,
    icon,
    type = icon ? 'icon' : '',
    title = <Message messageKey='messages.confirmDelete' bundleKey='oskariui'/>,
    tooltip = getMsg('buttons.delete'),
    disabled = false
}) => {
    const placement = tooltip ? 'bottom' : 'top';
    return (
        <Confirm
            title={title}
            onConfirm={onConfirm}
            disabled={disabled}
            okText={<Message messageKey='buttons.delete' bundleKey='oskariui'/>}
            cancelText={<Message messageKey='buttons.cancel' bundleKey='oskariui'/>}
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
    icon: PropTypes.bool,
    tooltip: PropTypes.node,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(['icon', 'button', 'text'])
};
