import React from 'react';
import { DatePicker } from 'antd';
import 'antd/es/date-picker/style/index.js';

const { RangePicker } = DatePicker;
export const DateRange = props => <RangePicker {...props}/>;
