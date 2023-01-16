import React from 'react';
import { InputNumber } from 'antd';
import 'antd/es/input-number/style/index.js';

export const NumberInput = (props) => (
    <InputNumber
        onKeyDown={(e) => {
            if (!/^[0-9\b]+$/.test(e.key) && e.key !== 'Backspace') {
                e.preventDefault();
            }
        }}
        {...props}
    />
);
