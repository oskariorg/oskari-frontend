import React, { useEffect, useState } from 'react';
import { Collapse } from 'oskari-ui';
import { PropTypes } from 'prop-types';
import { PANEL_GENERAL_INFO_ID } from './PublisherSideBarHandler';

export const CollapseContent = ({ controller }) => {
    const [items, setItems] = useState(controller.getCollapseItems());
    useEffect(() => {
        controller.addStateListener(() => { setItems(controller.getCollapseItems()); });
    }, []);

    return <Collapse defaultActiveKey={[PANEL_GENERAL_INFO_ID]} items={items}/>;
};

CollapseContent.propTypes = {
    controller: PropTypes.object
};
