import React from 'react';
import PropTypes from 'prop-types';
import Collapse from 'antd/lib/collapse';
import 'antd/lib/collapse/style/css';

const Panel = Collapse.Panel;

export const CollapseComponent = (props) => {
    const {panels, ...other} = props;
    return (
        <Collapse {...other}>
            {panels.map((panel, key) => (
                <Panel {...panel} key={key}>{panel.content}</Panel>
            ))}
        </Collapse>
    );
};

CollapseComponent.propTypes = {
    panels: PropTypes.array
};
