import React from 'react';
import { SvgRadioButton, Preview, SizeControl, ColorPicker } from 'oskari-ui';
import { Form, Row } from 'antd';

export const PointTab = (props) => {
    return (
        <React.Fragment>
            <Row>
                <Form.Item name='stroke' label='Pisteen väri' { ...props.formLayout }>
                    <ColorPicker
                        onChange={ (event) => props.onChangeCallback('stroke.color', event.target.value) }
                        defaultValue={ props.styleSettings.stroke.color } />
                </Form.Item>

                <Form.Item name='fill' label='Pisteen täyttöväri' { ...props.formLayout }>
                    <ColorPicker
                        onChange={ (event) => props.onChangeCallback('fill.color', event.target.value) }
                        defaultValue={ props.styleSettings.fill.color }
                    />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item
                    { ...props.formLayout }
                    name='image'
                    label='Ikoni'
                    onChange={ (event) => props.onChangeCallback('image.shape', event.target.value) }
                >
                    <SvgRadioButton options={ props.markers } defaultValue={ props.styleSettings.image.shape } />
                </Form.Item>
            </Row>

            <Row>
                <Preview
                    markers={ props.markers }
                    styleSettings={ props.styleSettings }
                />
            </Row>

            <SizeControl
                formLayout={ props.formLayout }
                onChangeCallback={ props.onChangeCallback }
                format={ props.styleSettings.format }
                locSettings={ props.locSettings }
            />
        </React.Fragment>
    );
};
