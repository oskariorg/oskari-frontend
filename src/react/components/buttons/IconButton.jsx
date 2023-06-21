import React from 'react';
import PropTypes from 'prop-types';
import { Message, Confirm, Button, Tooltip } from 'oskari-ui';
import { ThemeConsumer } from '../../util';
import { getColorEffect, EFFECT } from '../../theme';
import styled from 'styled-components';
import { PlusOutlined, EditOutlined, QuestionCircleOutlined, DeleteOutlined, CheckOutlined, StopOutlined} from '@ant-design/icons';
import { red, green } from '@ant-design/colors'
import { Forward } from '../icons/Forward'
import { Backward } from '../icons/Backward'

// Note! AntD buttons default at 32x32px
//  If the font-size of the icon is > 32px it will be clipped by at least Safari
//  Let the user of this component define the size of the button instead of doing it here.
const BorderlessButton = styled(Button)`
    border: none;
    background: none;
    padding: 0px;
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    font-size: ${props => props.$iconSize}px;
    &:hover {
        color: ${props => props.color};
        background: none;
    }
    &:disabled {
        background: none;
    }
`;
const BorderedButton = styled(Button)`
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    font-size: ${props => props.$iconSize}px;
    &:hover {
        color: ${props => props.color};
        border-color: ${props => props.color};
    }
`;

/**
 * This + pointer-events style on button components are used to fix tooltip
 * not disappearing if the button is disabled. Probably caused by styled-components + antd problem.
 */
const DisabledWrapper = styled('div')`
    cursor: ${props => props.$disabled ? 'not-allowed' : 'default'};
`;

const getPredefinedIcon = (type) => {
    if (type === 'accept') {
        return <CheckOutlined style={{color: green.primary}}/>;
    }
    if (type === 'reject') {
        return <StopOutlined style={{color: red.primary}} />;
    }
    if (type === 'add') {
        return <PlusOutlined/>;
    }
    if (type === 'edit') {
        return <EditOutlined/>;
    }
    if (type === 'info') {
        return <QuestionCircleOutlined style={{ color: '#0290ff', borderRadius: '50%' }}/>;
    }
    if (type === 'next') {
        return <Forward/>;
    }
    if (type === 'previous') {
        return <Backward/>;
    }
    if (type === 'delete') {
        return <DeleteOutlined style={{color: red.primary}} />
    }
    return null;
}

const getConfirmProps = (type) => {
    if (type === 'delete') {
        return {
            okText: <Message messageKey='buttons.delete' bundleKey='oskariui'/>,
            cancelText: <Message messageKey='buttons.cancel' bundleKey='oskariui'/>,
            title: <Message messageKey='messages.confirmDelete' bundleKey='oskariui'/>,
            okType: 'danger'
        };
    }
    return {
        okText: <Message messageKey='buttons.yes' bundleKey='oskariui'/>,
        cancelText: <Message messageKey='buttons.no' bundleKey='oskariui'/>,
        title: <Message messageKey='messages.confirm' bundleKey='oskariui'/>
    };
};

const ThemeButton = ThemeConsumer(({ theme, bordered, iconSize, ...rest }) => {
    let color = theme?.color?.accent;
    if (color && Oskari.util.isDarkColor(color)) {
        color = theme?.color?.primary;
    }
    if (!color) {
        color = '#ffd400';
    } else if (Oskari.util.isDarkColor(color)) {
        color = getColorEffect(color, EFFECT.LIGHTEN);
    }
    if (bordered) {
        return <BorderedButton color={color} $iconSize={iconSize} { ...rest }/>
    }
    // default
    return <BorderlessButton color={color} $iconSize={iconSize} { ...rest }/>
});

export const IconButton = ({
    type,
    title = type ? <Message messageKey={`buttons.${type}`} bundleKey='oskariui'/> : '',
    icon = type ? getPredefinedIcon(type) : null,
    onClick,
    onConfirm,
    disabled = false,
    iconSize = 16,
    ...rest
}) => {
    if (onConfirm) {
        return (
            <Confirm
                overlayClassName='t_confirm'
                onConfirm={onConfirm}
                okButtonProps={{className: `t_button t_${type || 'ok'}`}}
                cancelButtonProps={{className: 't_button t_cancel'}}
                disabled={disabled}
                placement={title ? 'bottom' : 'top'}
                { ...getConfirmProps(type) }>
                    <Tooltip title={title}>
                        <DisabledWrapper $disabled={disabled}>
                            <ThemeButton disabled={disabled} iconSize={iconSize} onClick={onClick} { ...rest }>
                                {icon}
                            </ThemeButton>
                        </DisabledWrapper>
                    </Tooltip>
            </Confirm>
        );
    }
    if (title) {
        return (
            <Tooltip title={title}>
                <DisabledWrapper $disabled={disabled}>
                    <ThemeButton disabled={disabled} iconSize={iconSize} onClick={onClick} { ...rest }>
                        {icon}
                    </ThemeButton>
                </DisabledWrapper>
            </Tooltip>
        );
    }
    return (
        <ThemeButton onClick={onClick} iconSize={iconSize} { ...rest }>
            {icon}
        </ThemeButton>
    );

};

IconButton.propTypes = {
    type: PropTypes.oneOf(['add', 'edit', 'accept', 'reject', 'info', 'next', 'previous', 'delete']),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    onClick: PropTypes.func,
    onConfirm: PropTypes.func
};
