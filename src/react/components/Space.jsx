import React from 'react';
import { Space as AntSpace } from 'antd';
import 'antd/es/space/style/index.js';

export const Space = ({ children, ...other}) => (
    <AntSpace { ...other }>
        { children }
    </AntSpace>
);
