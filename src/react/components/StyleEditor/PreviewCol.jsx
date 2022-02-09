import React from 'react';
import PropTypes from 'prop-types'
import { Preview } from './index';
import { Col } from 'antd';

export const PreviewCol = ({ oskariStyle, format }) => {
    return (
        <Col span={ 8 }>
            <Preview
                oskariStyle={ oskariStyle }
                format={ format }
                style={{ border: '1px solid #d9d9d9' }}
            />
        </Col>
    );
};

PreviewCol.propTypes = {
    oskariStyle: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired
};
