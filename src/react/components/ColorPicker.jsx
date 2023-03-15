import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Popover, TextInput, Tooltip, Message } from 'oskari-ui'
import { constants, SvgRadioButton } from './StyleEditor/index';
import { BgColorsOutlined } from '@ant-design/icons';

// Use z-index to render popover top of the Modal
const zIndex = 55500;

// Hide input softly to render color picker to correct place
const HiddenInput = styled('input')`
    opacity: 0;
    width: 0px;
    height: 0px;
    padding: 0px;
    border: none;
    left: -10px;
    top: 20px;
    position: relative;
`;

const StyledColorPicker = styled('div')`
    width: 210px;
    margin-left: 7px;
    margin-top: 7px;
`;

const ColorTextInput = styled(TextInput)`
    width: 90px;
    height: 34px;
`;
const ChooseColor = styled(Button)`
    width: 70px;
    height: 34px;
    &:hover {
        -webkit-box-shadow:inset 0px 0px 0px 2px white;
        -moz-box-shadow:inset 0px 0px 0px 2px white;
        box-shadow:inset 0px 0px 0px 2px white;
    }
`;

const MoreColors = styled('div')`
    display: inline-block;
`;

const getContent = (props) => {
    // Don't add id to hidden input to avoid getting duplicate id with ColorTextInput, modify id if needed
    const { id, ...inputProps } = props;
    const colorInput = useRef(null);
    const onClick = () => {
        const el = colorInput.current;
        el.focus(); // Safari might need focus before click
        el.click();
    }
    return (
        <StyledColorPicker>
            <SvgRadioButton options={ constants.PRE_DEFINED_COLORS } { ...props }/>
            <MoreColors>
                <HiddenInput ref={colorInput} type='color' { ...inputProps }/>
                <Button type="primary" onClick={onClick}>
                    <Message messageKey='ColorPicker.moreColors' bundleKey='oskariui'/>
                </Button>
            </MoreColors>
        </StyledColorPicker>
    );
};

export const ColorPicker = (props) => {
    const { value = '#FFFFFF', disabled, hideTextInput } = props;
    const [visible, setVisible] = useState(false);
    const chooseIconStyle = {
        fontSize: '20px',
        color: disabled || Oskari.util.isDarkColor(value) ? '#FFFFFF' :'#000000'
    };
    const chooseTooltip = disabled ? '' : <Message messageKey={`ColorPicker.tooltip`} bundleKey='oskariui'/>;
    const renderTextInput = !hideTextInput && !disabled;
    return (
        <React.Fragment>
            <Popover
                content={getContent(props)}
                trigger="click"
                placement="bottom"
                open={visible}
                zIndex={zIndex}
                onOpenChange = {setVisible}
                >
            <Tooltip title={chooseTooltip}>
                <ChooseColor style={{ background: value }} disabled={disabled} >
                    <BgColorsOutlined style={chooseIconStyle}/>
                </ChooseColor>
            </Tooltip>
            </Popover>
            { renderTextInput && <ColorTextInput { ...props }/> }
        </React.Fragment>
    );
}

ColorPicker.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    hideTextInput: PropTypes.bool
};
