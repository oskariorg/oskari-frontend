import React from 'react';
import { Space as AntSpace } from 'antd';

export const Space = ({ children, ...other}) => (
    <AntSpace { ...other }>
        { children }
    </AntSpace>
);
