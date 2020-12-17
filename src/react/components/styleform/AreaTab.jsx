import React from 'react';
import { SvgRadioButton } from 'oskari-ui';
import { Form, Row } from 'antd';

export const AreaTab = (props) => {
    return (
        <React.Fragment>
            <Row>
                <Form.Item name='lineStyle' label='Line dash' { ...props.formLayout }>
                    <SvgRadioButton
                        options={ props.lineIcons }
                        onChange={ props.lineDashCallback}
                        defaultValue={ props.styleSettings.stroke.area.lineDash } // TO-DO: support for: dash, dashdot, dot, longdash, longdashdot and solid
                        onChange={ (event) => props.onChangeCallback('stroke.lineDash', event.target.value) }
                    />
                </Form.Item>
            </Row>

            <Row>
                <Form.Item label='Fill style' { ...props.formLayout }>
                    <SvgRadioButton
                        options={ props.areaFills }
                        defaultValue={ props.styleSettings.fill.area.pattern }
                        onChange={ (event) => props.onChangeCallback('fill.area.pattern', event.target.value) }
                    />
                </Form.Item>
            </Row>
        </React.Fragment>
    );
};