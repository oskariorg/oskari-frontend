import React from 'react';
import { SvgRadioButton } from 'oskari-ui';
import { Form, Row } from 'antd';

export const LineTab = (props) => {
    return (
        <>
            <Row>
                <Form.Item name='lineStyle' label='Line dash' { ...props.formLayout }>
                    <SvgRadioButton
                        options={ props.lineIcons.lineDash }
                        onChange={ props.lineDashCallback }
                    />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item name='lineStyle' label='Line join' { ...props.formLayout }>
                    <SvgRadioButton
                        options={ props.lineIcons.linecaps }
                        onChange={ props.lineCapCallback }
                    />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item name='lineStyle' label='Line endings' { ...props.formLayout }>
                    <SvgRadioButton options={ props.lineIcons.corners } />
                </Form.Item>
            </Row>
        </>
    );
};