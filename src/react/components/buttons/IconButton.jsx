import React from 'react';
import PropTypes from 'prop-types';
import { Message, Confirm, Button, Tooltip } from 'oskari-ui';
import { ThemeConsumer } from '../../util';
import { getColorEffect, EFFECT } from '../../theme';
import styled from 'styled-components';
import { PlusOutlined, EditOutlined, QuestionCircleOutlined, DeleteOutlined, CheckOutlined, StopOutlined} from '@ant-design/icons';
import { Forward } from '../icons/Forward'
import { Backward } from '../icons/Backward'

const COLORS = {
    red: '#f5222d',
    green: '#52c41a',
    blue: '#0290ff',
    hover: '#ffd400'
};

const TYPE_COLORS = {
    accept: COLORS.green,
    reject: COLORS.red,
    delete: COLORS.red,
    info: COLORS.blue
};

// Note! AntD buttons default at 32x32px
//  If the font-size of the icon is > 32px it will be clipped by at least Safari
//  Let the user of this component define the size of the button instead of doing it here.
const BorderlessButton = styled(Button)`
    color:  ${props => props.$color};
    border: none;
    background: none;
    padding: 0px;
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    font-size: ${props => props.$iconSize}px;
    &:hover {
        color: ${props => props.$hover};
        background: none;
    }
    &:disabled {
        background: none;
    }
`;
const BorderedButton = styled(Button)`
    color:  ${props => props.$color};
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    font-size: ${props => props.$iconSize}px;
    &:hover {
        color: ${props => props.$hover};
        border-color: ${props => props.$hover};
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
        return <CheckOutlined />;
    }
    if (type === 'reject') {
        return <StopOutlined />;
    }
    if (type === 'add') {
        return <PlusOutlined/>;
    }
    if (type === 'edit') {
        return <EditOutlined/>;
    }
    if (type === 'info') {
        return <QuestionCircleOutlined />;
    }
    if (type === 'next') {
        return <Forward/>;
    }
    if (type === 'previous') {
        return <Backward/>;
    }
    if (type === 'delete') {
        return <DeleteOutlined />
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

const ThemeButton = ThemeConsumer(({ theme, bordered, iconSize, color, ...rest }) => {
    let hover = theme?.color?.accent;
    if (hover && Oskari.util.isDarkColor(hover)) {
        hover = theme?.color?.primary;
    }
    if (!hover) {
        hover = COLORS.hover;
    } else if (Oskari.util.isDarkColor(hover)) {
        hover = getColorEffect(hover, EFFECT.LIGHTEN);
    }
    if (bordered) {
        return <BorderedButton $hover={hover} $color={color} $iconSize={iconSize} { ...rest }/>
    }
    // default
    return <BorderlessButton $hover={hover} $color={color} $iconSize={iconSize} { ...rest }/>
});

export const IconButton = ({
    type,
    title = type ? <Message messageKey={`buttons.${type}`} bundleKey='oskariui'/> : '',
    icon = type ? getPredefinedIcon(type) : null,
    color = TYPE_COLORS[type],
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
    onConfirm: PropTypes.func,
    disabled: PropTypes.bool,
    color: PropTypes.string,
    iconSize: PropTypes.number
};
