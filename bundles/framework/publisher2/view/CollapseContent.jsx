import React, { useEffect, useState } from 'react';
import { Collapse } from 'oskari-ui';
import { PropTypes } from 'prop-types';

export const CollapseContent = ({ controller }) => {
    const [items, setItems] = useState(controller.getCollapseItems());
    useEffect(() => {
        controller.addStateListener(() => { setItems(controller.getCollapseItems()); });
    }, []);

    return <Collapse items={items}/>;
};

CollapseContent.propTypes = {
    controller: PropTypes.object
};
