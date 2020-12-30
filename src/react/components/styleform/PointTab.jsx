import React from 'react';
import PropTypes from 'prop-types';
import { SvgRadioButton, Preview, SizeControl, ColorPicker } from 'oskari-ui';
import { Form, Row } from 'antd';

export const PointTab = (props) => {
    return (
        <React.Fragment>
            <Row>
                <Form.Item name='stroke.color' label='Pisteen väri' { ...props.formLayout }>
                    <ColorPicker
                        onChange={ (event) => props.onChangeCallback('stroke.color', event.target.value) }
                        defaultValue={ props.styleSettings.stroke.color } />
                </Form.Item>

                <Form.Item name='fill.color' label='Pisteen täyttöväri' { ...props.formLayout }>
                    <ColorPicker
                        onChange={ (event) => props.onChangeCallback('fill.color', event.target.value) }
                        defaultValue={ props.styleSettings.fill.color }
                    />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item name='image.shape' label='Ikoni' { ...props.formLayout }>
                    <SvgRadioButton
                        name='image.shape-radio'
                        options={ props.markers }
                        defaultValue={ props.styleSettings.image.shape }
                        onChange={ (event) => props.onChangeCallback('image.shape', event.target.value) }
                    />
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

PointTab.propTypes = {
    onChangeCallback: PropTypes.func.isRequired,
    styleSettings: PropTypes.object.isRequired,
    formLayout: PropTypes.object.isRequired,
    locSettings: PropTypes.object.isRequired,
    markers: PropTypes.array.isRequired
};
