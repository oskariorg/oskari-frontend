
import React from 'react';
import { TimePicker as AntTimePicker, DatePicker as AntDatePicker } from 'antd';
import 'antd/es/time-picker/style/index.js';
import 'antd/es/date-picker/style/index.js';

export const TimePicker = (props) => (
    <AntTimePicker {...props} />
);

export const DatePicker = (props) => (
    <AntDatePicker {...props} />
);
