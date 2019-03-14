import React from 'react';
import Input from 'antd/lib/input';
import { Select, Option } from './Select';

const protocols = ['https', 'http'];
const protocolSelect = (
    <Select defaultValue="https://" style={{ width: 90 }}>
        {protocols.map((title, key) => (
            <Option key={key}>{title}://</Option>
        ))}
    </Select>
);
export const UrlInput = (props) => (
    <Input {...props} addonBefore={protocolSelect} />
);
