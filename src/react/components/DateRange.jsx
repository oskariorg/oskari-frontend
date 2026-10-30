import React from 'react';
import { DatePicker } from 'antd';
import { getLocalizedDatePickerProps } from '../util/DateRangeLocaleHelper.js';

const { RangePicker } = DatePicker;

export const DateRange = (props) => <RangePicker {...getLocalizedDatePickerProps(props)} />;

export const DateTimePicker = (props) => <DatePicker {...getLocalizedDatePickerProps(props)} />;
