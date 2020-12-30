import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Form, Row, InputNumber } from 'antd';

const sizeFormatter = (number) => Math.abs(number); 


export const SizeControl = (props) => {
    const locKey =
        props.format === 'point' ? 'VisualizationForm.point.size.label'
        : props.format === 'line' ? 'VisualizationForm.line.width.label'
        : 'VisualizationForm.area.linewidth.label'

    return (
        <Form.Item
            name='size'
            label={
                <Message
                    bundleKey={ props.locSettings.localeKey }
                    messageKey={ locKey }
                />
            }
            initialValue={ 3 }
            { ...props.formLayout }
        >
            <InputNumber
                min={ 1 }
                max={ 5 }
                formatter={ sizeFormatter }
                parser={ sizeFormatter }
                onChange={ (value) => {
                    props.onChangeCallback('stroke.width', value);
                    props.onChangeCallback('stroke.area.width', value);
                    props.onChangeCallback('image.size', value);
                } } />
        </Form.Item>
    );
};

SizeControl.propTypes = {
    onChangeCallback: PropTypes.func.isRequired,
    formLayout: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired,
    locSettings: PropTypes.object.isRequired
}