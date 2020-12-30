import React from 'react';
import PropTypes from 'prop-types';
import { SvgRadioButton, Preview, SizeControl, ColorPicker, Message } from 'oskari-ui';
import { Form, Row } from 'antd';

const areaFills = [
    {
        name: 'solid',
        data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="solid" viewBox="0, 0, 4, 4" width="100%" height="100%"><path d="M-1,2 l6,0" stroke="#000000" stroke-width="4"/></pattern></defs><rect width="32" height="32" fill="url(#solid)"/></svg>' 
    },
    {
        name: 'line',
        data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="line" viewBox="0, 0, 4, 4" width="50%" height="50%"> <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#000000" stroke-width="1"/></pattern></defs><rect width="32" height="32" fill="url(#line)"/></svg>'
    },
    {
        name: 'line2',
        data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="line2" viewBox="0, 0, 4, 4" width="80%" height="80%"><path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#000000" stroke-width="1"/></pattern></defs><rect width="32" height="32" fill="url(#line2)"/></svg>'
    },
    {
        name: 'line3',
        data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="line3" viewBox="0, 0, 32, 32" width="100%" height="100%"> <path d="M0,4 l32,0, M0,12 l32,0 M0,20 l32,0 M0,28 l32,0" stroke="#000000" stroke-width="5"/></pattern></defs><rect width="32" height="32" fill="url(#line3)"/></svg>'
    },
    {
        name: 'line4',
        data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="line4" viewBox="0, 0, 32, 32" width="100%" height="100%"> <path d="M0,4 l32,0, M0,15 l32,0 M0,26 l32,0" stroke="#000000" stroke-width="5"/></pattern></defs><rect width="32" height="32" fill="url(#line4)"/></svg>'
    }
];

export const AreaTab = (props) => {
    return (
        <React.Fragment>
            <Row>
                <Form.Item
                    { ...props.formLayout }
                    name='stroke.color'
                    label='Pisteen väri'
                    label={ <Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.area.linecolor.label' /> }
                >
                    <ColorPicker
                        onChange={ (event) => props.onChangeCallback('stroke.color', event.target.value) }
                        defaultValue={ props.styleSettings.stroke.color } />
                </Form.Item>

                <Form.Item
                    { ...props.formLayout }
                    name='fill.color'
                    label={ <Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.area.color.label' /> }
                >
                    <ColorPicker
                        onChange={ (event) => props.onChangeCallback('fill.color', event.target.value) }
                        defaultValue={ props.styleSettings.fill.color }
                    />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item
                    { ...props.formLayout }
                    name='stroke.lineDash'
                    label={ <Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.area.linestyle.label' /> }
                >
                    <SvgRadioButton
                        name='stroke.lineDash-radio'
                        options={ props.lineIcons }
                        defaultValue={ props.styleSettings.stroke.area.lineDash } // TO-DO: support for: dash, dashdot, dot, longdash, longdashdot and solid
                        onChange={ (event) => props.onChangeCallback('stroke.lineDash', event.target.value) }
                    />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item
                    { ...props.formLayout }
                    name='fill.area.pattern'
                    label={ <Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.area.fill.label' /> }
                >
                    <SvgRadioButton
                        name='fill.area.pattern-radio'
                        options={ areaFills }
                        defaultValue={ props.styleSettings.fill.area.pattern }
                        onChange={ (event) => props.onChangeCallback('fill.area.pattern', event.target.value) }
                    />
                </Form.Item>
            </Row>

            <Row>
                <SizeControl
                    formLayout={ props.formLayout }
                    onChangeCallback={ props.onChangeCallback }
                    format={ props.styleSettings.format }
                    locSettings={ props.locSettings }
                />
            </Row>

            <Preview
                styleSettings={ props.styleSettings }
                areaFills={ areaFills }
            />
        </React.Fragment>
    );
};

AreaTab.propTypes = {
    onChangeCallback: PropTypes.func.isRequired,
    styleSettings: PropTypes.object.isRequired,
    formLayout: PropTypes.object.isRequired,
    locSettings: PropTypes.object.isRequired,
    lineIcons: PropTypes.array.isRequired
};
