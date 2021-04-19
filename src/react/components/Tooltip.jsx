import React from 'react';
import { Tooltip as AntTooltip } from 'antd';
import 'antd/es/tooltip/style/index.js';

export const Tooltip = ({children, ...restOfProps}) => {
    return (<AntTooltip {...restOfProps}>
        <span>{children}</span>
    </AntTooltip>);
};
