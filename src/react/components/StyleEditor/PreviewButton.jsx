import React from 'react';
import PropTypes from 'prop-types'
import { Message } from '../Message';
import { Preview } from './index';
import { Radio } from 'antd';

export const PreviewButton = props => {
    const { format } = props;
    const messageKey = `StyleEditor.subheaders.${format}Tab`;
    return (
        <Radio.Button style={{height: '100%'}} value= {format}>
            <Preview { ...props }/>
            <Message messageKey= { messageKey } />
        </Radio.Button>
    );
};

PreviewButton.propTypes = {
    oskariStyle: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired
};