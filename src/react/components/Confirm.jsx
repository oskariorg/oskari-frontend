import React from 'react';
import PropTypes from 'prop-types';
import { Popconfirm } from 'antd';

// NOTE! z-index is overridden in resources/css/portal.css
// Without the override the confirm is shown behind flyouts (for example in admin)

/*
Note! The same span-wrapper is done in Tooltip.jsx and it has the same issue.
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
export const Confirm = ({ children, cancelButtonProps = {}, okButtonProps = {}, ...other }) => (
    <Popconfirm
        overlayClassName='t_confirm'
        okButtonProps={{
            className: 't_button t_ok',
            ...okButtonProps }}
        cancelButtonProps={{
            className: 't_button t_cancel',
            ...cancelButtonProps }}
        {...other}
        ><span>{children}</span></Popconfirm>
);

Confirm.propTypes = {
    children: PropTypes.any
};
