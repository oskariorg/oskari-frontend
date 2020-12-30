import React from 'react';
import PropTypes from 'prop-types';
import { SvgRadioButton, Preview, SizeControl, ColorPicker } from 'oskari-ui';
import { Form, Row } from 'antd';

export const LineTab = (props) => {
    return (
        <React.Fragment>
            <Row>
                <Form.Item name='stroke' label='Pisteen väri' { ...props.formLayout }>
                    <ColorPicker
                        onChange={ (event) => props.onChangeCallback('stroke.color', event.target.value) }
                        defaultValue={ props.styleSettings.stroke.color } />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item name='stroke.lineDash' label='Line dash' { ...props.formLayout }>
                    <SvgRadioButton
                        name='stroke.lineDash-radio'
                        options={ props.lineIcons.lineDash }
                        onChange={ (event) => props.onChangeCallback('stroke.lineDash', event.target.value) }
                        defaultValue={ props.styleSettings.stroke.lineDash }
                    />
                </Form.Item>

                <Form.Item name='stroke.lineCap' label='Line endings' { ...props.formLayout }>
                    <SvgRadioButton
                        name='stroke.lineCap-radio'
                        options={ props.lineIcons.linecaps }
                        onChange={ (event) => props.onChangeCallback('stroke.lineCap', event.target.value) }
                        defaultValue={ props.styleSettings.stroke.lineCap }
                    />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item name='stroke.area.lineJoin' label='Line corners' { ...props.formLayout }>
                    <SvgRadioButton
                        name='stroke.area.lineJoin-radio'
                        options={ props.lineIcons.corners }
                        onChange={ (event) => props.onChangeCallback('stroke.area.lineJoin', event.target.value) }
                        defaultValue={ props.styleSettings.stroke.area.lineJoin }
                    />
                </Form.Item>
            </Row>

            <Preview styleSettings={ props.styleSettings } />

            <SizeControl
                formLayout={ props.formLayout }
                onChangeCallback={ props.onChangeCallback }
                format={ props.styleSettings.format }
                locSettings={ props.locSettings }
            />
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
