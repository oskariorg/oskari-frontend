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
`;

const MoreColors = styled('div')`
    display: inline-block;
`;

const getContent = (props) => {
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
                <HiddenInput ref={colorInput} type='color' { ...props }/>
                <Button type="primary" onClick={onClick}>
                    <Message messageKey='ColorPicker.moreColors' />
                </Button>
            </MoreColors>
        </StyledColorPicker>
    );
};
const getIcon = value => {
    const style = {
        fontSize: '20px',
        color: Oskari.util.isDarkColor(value) ? '#FFFFFF' :'#000000'
    };
    return (
        <BgColorsOutlined style = {style}/>
    );
};


export const ColorPicker = (props) => {
    const { value = '#000000' } = props;
    const [visible, setVisible] = useState(false);
    return (
        <React.Fragment>
            <Popover
                content={getContent(props)}
                trigger="click"
                placement="bottom"
                visible={visible}
                zIndex={zIndex}
                onVisibleChange = {setVisible}
                >
            <Tooltip title={<Message messageKey='ColorPicker.tooltip' />}>
                <ChooseColor style={{background: value}} icon={getIcon(value)}/>
            </Tooltip>
            </Popover>
            <ColorTextInput { ...props }/>
        </React.Fragment>
    );
}

ColorPicker.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
};
