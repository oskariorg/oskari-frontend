import React from 'react';
import PropTypes from 'prop-types';
import AntCollapse from 'antd/lib/collapse';
import 'antd/lib/collapse/style/css';

const AntPanel = AntCollapse.Panel;

export const Collapse = (props) => {
    const {panels, ...other} = props;
    return (
        <AntCollapse {...other}>
            {panels.map((panel, key) => (
                <AntPanel {...panel} key={key}>{panel.content}</AntPanel>
            ))}
        </AntCollapse>
    );
};

Collapse.propTypes = {
    panels: PropTypes.array
};
