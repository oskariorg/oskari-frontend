import React from 'react';
import PropTypes from 'prop-types';
import { ColorPicker, Message } from 'oskari-ui';
import { SvgRadioButton, Preview, SizeControl } from './index';
import { Form, Row } from 'antd';

//import * as markerImport from './lineIcons.json';

export const LineTab = (props) => {
    console.log(markerImport);
    return (
        <React.Fragment>
            <Row>
                <Form.Item
                    { ...props.formLayout }
                    name='stroke.color'
                    label={ <Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.line.color.label' /> }
                >
                    <ColorPicker
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
                        options={ props.lineIcons.lineDash }
                        defaultValue={ props.styleSettings.stroke.lineDash }
                    />
                </Form.Item>

                <Form.Item
                    { ...props.formLayout }
                    name='stroke.lineCap'
                    label={ <Message bundleKey={ props.locSettings.localeKey } messageKey='VisualizationForm.line.cap.label' /> }
                >
                    <SvgRadioButton
                        options={ props.lineIcons.linecaps }
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
                        options={ props.lineIcons.corners }
                        defaultValue={ props.styleSettings.stroke.area.lineJoin }
                    />
                </Form.Item>
            </Row>

            <Row>
                <SizeControl
                    formLayout={ props.formLayout }
                    format={ props.format }
                    locSettings={ props.locSettings }
                    name='stroke.width'
                />
            </Row>

            <Preview
                styleSettings={ props.styleSettings }
                format={ props.format }
            />

        </React.Fragment>
    );
};

LineTab.propTypes = {
    styleSettings: PropTypes.object.isRequired,
    formLayout: PropTypes.object.isRequired,
    locSettings: PropTypes.object.isRequired,
    lineIcons: PropTypes.object.isRequired
};
