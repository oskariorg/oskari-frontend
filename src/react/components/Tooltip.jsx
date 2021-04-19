import React from 'react';
import { Tooltip as AntTooltip } from 'antd';
import 'antd/es/tooltip/style/index.js';

/*
The children of Tooltip are wrapped in a `span` to prevent JS-errors like this:

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

Check the render method of `styled__IconButton`.
    in Button (created by styled__IconButton)
    in styled__IconButton (created by Trigger)
    in Trigger (created by ForwardRef(Tooltip))
    in ForwardRef(Tooltip) (created by Tooltip)
    in Tooltip (created by Tooltip)
```

There seems to be a problem with tooltips with styled-components as direct children:
https://stackoverflow.com/questions/61450739/understanding-warning-function-components-cannot-be-given-refs
*/
export const Tooltip = ({children, ...restOfProps}) => {
    return (<AntTooltip {...restOfProps}>
        <span>{children}</span>
    </AntTooltip>);
};
