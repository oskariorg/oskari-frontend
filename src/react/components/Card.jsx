import React from 'react';
import { Card as AntCard } from 'antd';
import 'antd/es/card/style/index.js';

export const Card = ({ children, ...other}) => (
    <AntCard { ...other }>
        { children }
    </AntCard>
);
