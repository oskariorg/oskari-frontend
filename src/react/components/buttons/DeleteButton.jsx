import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Confirm, Tooltip } from 'oskari-ui';
import { SecondaryButton, IconButton } from './';

/**
 * This + pointer-events style on button components are used to fix tooltip
 * not disappearing if the button is disabled. Probably caused by styled-components + antd problem.
 */
const DisabledWrapper = styled('div')`
    cursor: ${props => props.$disabled ? 'not-allowed' : 'default'};
`;

const getButton = (type, disabled) => {
    const props = {
        className: 't_button t_delete',
        disabled,
        type: 'delete',
        title: null
    };
    if (type === 'icon') {
        return <IconButton {...props}/>;
    }
    if (type === 'button') {
        return <IconButton bordered {...props}/>;
    }
    if (type === 'label') {
        return (
            <DisabledWrapper>
                <SecondaryButton danger {...props}/>
            </DisabledWrapper>
        );
    }
};

export const DeleteButton = ({
    onConfirm,
    type,
    title = <Message messageKey='messages.confirmDelete' bundleKey='oskariui'/>,
    tooltip = <Message messageKey={'buttons.delete'} bundleKey='oskariui'/>,
    disabled = false,
    ...rest
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
            placement={placement}
            {...rest}>
            <Tooltip title={tooltip}>
                {getButton(type, disabled)}
            </Tooltip>
        </Confirm>
    );
};
DeleteButton.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.node,
    tooltip: PropTypes.any,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(['icon', 'button', 'label']).isRequired
};
