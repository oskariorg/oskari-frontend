import React from 'react';
import PropTypes from 'prop-types';
import { SvgRadioButton, Preview, SizeControl, ColorPicker, Message } from 'oskari-ui';
import { Form, Row } from 'antd';

export const LineTab = (props) => {
    return (
        <React.Fragment>
            <Row>
                <Form.Item
                    { ...props.formLayout }
                    name='stroke'
                    label={ <Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.line.color.label' /> }
                >
                    <ColorPicker
                        onChange={ (event) => props.onChangeCallback('stroke.color', event.target.value) }
                        defaultValue={ props.styleSettings.stroke.color } />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item
                    { ...props.formLayout }
                    name='stroke.lineDash'
                    label={ <Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.line.style.label' /> }
                >
                    <SvgRadioButton
                        name='stroke.lineDash-radio'
                        options={ props.lineIcons.lineDash }
                        onChange={ (event) => props.onChangeCallback('stroke.lineDash', event.target.value) }
                        defaultValue={ props.styleSettings.stroke.lineDash }
                    />
                </Form.Item>

                <Form.Item
                    { ...props.formLayout }
                    name='stroke.lineCap'
                    label={ <Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.line.cap.label' /> }
                >
                    <SvgRadioButton
                        name='stroke.lineCap-radio'
                        options={ props.lineIcons.linecaps }
                        onChange={ (event) => props.onChangeCallback('stroke.lineCap', event.target.value) }
                        defaultValue={ props.styleSettings.stroke.lineCap }
                    />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item
                { ...props.formLayout }
                name='stroke.area.lineJoin'
                label={ <Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.line.corner.label' /> }
                >
                    <SvgRadioButton
                        name='stroke.area.lineJoin-radio'
                        options={ props.lineIcons.corners }
                        onChange={ (event) => props.onChangeCallback('stroke.area.lineJoin', event.target.value) }
                        defaultValue={ props.styleSettings.stroke.area.lineJoin }
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

            <Preview styleSettings={ props.styleSettings } />

        </React.Fragment>
    );
};

LineTab.propTypes = {
    onChangeCallback: PropTypes.func.isRequired,
    styleSettings: PropTypes.object.isRequired,
    formLayout: PropTypes.object.isRequired,
    locSettings: PropTypes.object.isRequired,
    lineIcons: PropTypes.object.isRequired
};
