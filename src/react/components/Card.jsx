import React from 'react';
import { Card as AntCard } from 'antd';

export const Card = ({ children, ...other}) => (
    <AntCard { ...other }>
        { children }
    </AntCard>
);
