import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Confirm, Button } from 'oskari-ui';
import { SecondaryButton } from './';
import { DeleteOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors'
import { Tooltip } from 'antd';

const DeleteIcon = styled(DeleteOutlined)`
    color: ${red.primary};
    cursor: pointer;
`;

const getButton = type => {
    if (type === 'icon') {
        return <DeleteIcon/>;
    }
    if (type === 'button') {
        return <Button><DeleteIcon/></Button>;
    }
    return <SecondaryButton danger type="delete"/>;
};

// TODO: update bundles to use type and remove icon
export const DeleteButton = ({ 
    onConfirm,
    icon,
    type = icon ? 'icon' : '',
    title = <Message messageKey='messages.confirmDelete' bundleKey='oskariui'/>,
    tooltip,
    disabled
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
                {getButton(type)}
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
