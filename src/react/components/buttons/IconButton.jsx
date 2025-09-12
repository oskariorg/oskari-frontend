import React from 'react';
import PropTypes from 'prop-types';
import { Message, Confirm, Button, Tooltip } from 'oskari-ui';
import { ThemeConsumer } from '../../util';
import { EFFECT } from '../../../constants';
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
    color:  ${props => props.$active || props.$color};
    border: none;
    background: none;
    box-shadow: none;
    padding: 0px;
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    font-size: ${props => props.$iconSize}px;
    &&&:hover {
        color: ${props => props.$hover};
        background: none;
    }
    &:disabled {
        background: none;
    }
`;
const BorderedButton = styled(Button)`
    color:  ${props => props.$active || props.$color} !important;
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    font-size: ${props => props.$iconSize}px;
    border-color: ${props => props.$active};
    &:hover {
        color: ${props => props.$hover} !important;
        border-color: ${props => props.$hover} !important;
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
        return <DeleteOutlined />;
    }
    return null;
};

const getConfirmProps = (type, title) => {
    if (type === 'delete') {
        return {
            okText: <Message messageKey='buttons.delete' bundleKey='oskariui'/>,
            cancelText: <Message messageKey='buttons.cancel' bundleKey='oskariui'/>,
            title: title || <Message messageKey='messages.confirmDelete' bundleKey='oskariui'/>,
            okType: 'danger'
        };
    }
    return {
        okText: <Message messageKey='buttons.yes' bundleKey='oskariui'/>,
        cancelText: <Message messageKey='buttons.no' bundleKey='oskariui'/>,
        title: title || <Message messageKey='messages.confirm' bundleKey='oskariui'/>
    };
};

const ThemeButton = ThemeConsumer(({
    theme,
    type,
    bordered = false,
    icon = type ? getPredefinedIcon(type) : null,
    iconSize = 16,
    color = TYPE_COLORS[type],
    className = '',
    active = false,
    ...rest
}) => {
    if (type && !className.includes(`t_${type}`)) {
        className = `${className} t_${type}`;
    }
    let hover = theme?.color?.accent;
    if (hover && Oskari.util.isDarkColor(hover)) {
        hover = theme?.color?.primary;
    }
    if (!hover) {
        hover = COLORS.hover;
    } else if (Oskari.util.isDarkColor(hover)) {
        hover = Oskari.util.getColorEffect(hover, EFFECT.LIGHTEN);
    }
    const ButtonNode = bordered ? BorderedButton : BorderlessButton;
    const activeColor = active ? hover : null;
    return (
        <ButtonNode $hover={hover} $color={color} $active={activeColor} $iconSize={iconSize} className={className} { ...rest }>
            {icon}
        </ButtonNode>
    );
});

export const IconButton = ({
    type,
    title = type ? <Message messageKey={`buttons.${type}`} bundleKey='oskariui'/> : '',
    disabled = false,
    onConfirm,
    confirm = {},
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
                { ...getConfirmProps(type, confirm.title) }>
                    <Tooltip title={title}>
                        <DisabledWrapper $disabled={disabled}>
                            <ThemeButton type={type} disabled={disabled} { ...rest }/>
                        </DisabledWrapper>
                    </Tooltip>
            </Confirm>
        );
    }
    if (title) {
        return (
            <Tooltip title={title}>
                <DisabledWrapper $disabled={disabled}>
                    <ThemeButton type={type} disabled={disabled} { ...rest }/>
                </DisabledWrapper>
            </Tooltip>
        );
    }
    return <ThemeButton type={type} disabled={disabled} { ...rest }/>;
};

IconButton.propTypes = {
    type: PropTypes.oneOf(['add', 'edit', 'accept', 'reject', 'info', 'next', 'previous', 'delete']),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    icon: PropTypes.any,
    onClick: PropTypes.func,
    onConfirm: PropTypes.func,
    confirm: PropTypes.object,
    disabled: PropTypes.bool,
    color: PropTypes.string,
    iconSize: PropTypes.number,
    active: PropTypes.bool
};
