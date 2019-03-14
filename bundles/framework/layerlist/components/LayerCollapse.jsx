import React from 'react';
import PropTypes from 'prop-types';
import { ListComponent } from '../../../admin/admin-layereditor/components/List';
import { Collapse } from './LayerCollapse/Collapse';
import { Layer } from './LayerCollapse/Layer';
import { Badge } from '../../../admin/admin-layereditor/components/Badge';
import { Alert } from '../../../admin/admin-layereditor/components/Alert';

const getLayers = (group, otherProps) => group.getLayers().map(
    (lyr, index) => {
        const props = {
            model: lyr,
            even: index % 2 === 0,
            ...otherProps
        };
        return <Layer key={index} {...props}/>;
    }
);
const getPanels = (groups, otherProps) => {
    return groups.map(group => {
        const badgeProps = {
            inversed: true,
            count: group.getLayers().length
        };
        const listProps = {
            dataSource: getLayers(group, otherProps),
            bordered: false
        };
        return {
            header: group.name,
            extra: <Badge {...badgeProps}/>,
            content: <ListComponent {...listProps}/>
        };
    });
};

export const LayerCollapse = props => {
    const { groups, filterKeyword, ...rest } = props;
    if (!Array.isArray(groups) || groups.length === 0) {
        const alertProps = {
            message: 'No layers found',
            description: 'TODO: Show search keyword used: ' + filterKeyword,
            type: 'info',
            showIcon: true
        };
        return <Alert {...alertProps}/>;
    }
    const collapseProps = {
        panels: getPanels(groups, rest),
        accordion: true,
        bordered: false
    };
    return <Collapse {...collapseProps}/>;
};

LayerCollapse.propTypes = {
    groups: PropTypes.array,
    filterKeyword: PropTypes.string
};
