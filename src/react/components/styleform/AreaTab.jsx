import React from 'react';
import { SvgRadioButton } from 'oskari-ui';
import { Form, Row } from 'antd';

export const AreaTab = (props) => {
    return (
        <>
            <Row>
                <Form.Item name='lineStyle' label='Line dash' { ...props.formLayout }>
                    <SvgRadioButton
                        options={ props.lineIcons }
                        onChange={ props.lineDashCallback}
                    />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item label='Viivan tyyli' { ...props.formLayout }>
                    <SvgRadioButton
                        options={ props.areaFills }
                        onChange={ props.lineStyleCallback }
                    />
                </Form.Item>
            </Row>
        </>
    );
};