import React from 'react';
import { Tooltip as AntTooltip } from 'antd';

import { createGlobalStyle } from 'styled-components';

const TooltipStyle = createGlobalStyle`
    body {
        .ant-tooltip {
            max-width: 80%;
        }
    }
`;

/*
Note! The same span-wrapper is done in Confirm.jsx and it has the same issue.
AntD confirm extends AntD tooltip but since we have wrappers for both we need to do the extra span in both.
Children that are NOT created with styled-components wrapper don't need the span but we add it always for now
so the developer doesn't need to care or know that an extra prop should be used to include the wrapper-span.
It shouldn't hurt even if it's not always needed:
https://github.com/oskariorg/oskari-frontend/pull/1550

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
    return (
        <AntTooltip
            styles={{
                root: {
                    pointerEvents: 'none'
                }
            }}
            {...restOfProps}
        >
            <TooltipStyle />
            <span>{children}</span>
        </AntTooltip>
    );
};
