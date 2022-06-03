import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Confirm, Tooltip } from 'oskari-ui';
import { SecondaryButton } from './';
import { DeleteOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors'

const DeleteIcon = styled(DeleteOutlined)`
    color: ${red.primary}
`;

const getMsg = key => <Message messageKey={key} bundleKey='oskariui'/>

export const DeleteButton = ({ 
    onConfirm,
    icon,
    tooltip = getMsg('buttons.delete'),
    title = getMsg('messages.confirmDelete'),
    disabled
}) => {
    const button = icon
        ? <DeleteIcon/>
        : <SecondaryButton disabled={disabled} danger type="delete"/>;
    const placement = tooltip ? 'bottom' : 'top';
    return (
        <Confirm
            title={title}
            onConfirm={onConfirm}
            okButtonProps={{className: 't_confirm'}}
            cancelButtonProps={{className: 't_cancel'}}
            okText={getMsg('buttons.delete')}
            cancelText={getMsg('buttons.cancel')}
            placement={placement}
            disabled={disabled}>
            <Tooltip title={tooltip}>
                {button}
            </Tooltip>
        </Confirm>
    );
};
DeleteButton.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.any,
    tooltip: PropTypes.any,
    icon: PropTypes.bool,
    disabled: PropTypes.bool
};
