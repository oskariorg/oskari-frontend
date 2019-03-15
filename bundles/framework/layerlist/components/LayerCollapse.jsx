import React from 'react';
import PropTypes from 'prop-types';
import { ListComponent } from '../../../admin/admin-layereditor/components/List';
import { Collapse } from './LayerCollapse/Collapse';
import { Layer } from './LayerCollapse/Layer';
import { Badge } from '../../../admin/admin-layereditor/components/Badge';
import { Alert } from '../../../admin/admin-layereditor/components/Alert';

const getLayers = (layers, otherProps) => layers.map(
    (lyr, index) => {
        const props = {
            model: lyr,
            even: index % 2 === 0,
            ...otherProps
        };
        return <Layer key={index} {...props}/>;
    }
);
const getPanels = (groups, searchResults, otherProps) => {
    const panels = (searchResults || groups).map(cur => {
        const group = searchResults ? cur.group : cur;
        const filteredLayers = searchResults ? cur.layers : null;

        let badgeText = group.getLayers().length;
        if (filteredLayers && filteredLayers.length !== group.getLayers().length) {
            badgeText = filteredLayers.length + ' / ' + badgeText;
        }
        const badgeProps = {
            inversed: true,
            count: badgeText
        };
        const layers = filteredLayers || group.getLayers();
        const listProps = {
            dataSource: getLayers(layers, otherProps),
            bordered: false
        };
        return {
            header: group.getTitle(),
            extra: <Badge {...badgeProps}/>,
            content: <ListComponent {...listProps}/>
        };
    });
    return panels;
};

const getEmptyMessage = filterKeyword => {
    const alertProps = {
        message: 'No layers found',
        description: 'TODO: Show search keyword used: ' + filterKeyword,
        type: 'info',
        showIcon: true
    };
    return <Alert {...alertProps}/>;
};

const getSearchResults = (groups, keyword) => {
    if (!keyword && keyword !== 0) {
        return null;
    }
    const results = groups.map(group => {
        const layers = group.getLayers()
            .filter(lyr => group.matchesKeyword(lyr.getId(), keyword)); // and some other rule?
        return {group, layers};
    }).filter(result => result.layers.length !== 0);
    return results;
};

export const LayerCollapse = props => {
    const { groups, filterKeyword, ...rest } = props;
    if (!Array.isArray(groups) || groups.length === 0) {
        return getEmptyMessage();
    }
    const filtered = getSearchResults(groups, filterKeyword);
    if (filtered && filtered.length === 0) {
        return getEmptyMessage(filterKeyword);
    }
    const collapseProps = {
        panels: getPanels(groups, filtered, rest),
        accordion: true,
        bordered: false
    };
    return <Collapse {...collapseProps}/>;
};

LayerCollapse.propTypes = {
    groups: PropTypes.array,
    filterKeyword: PropTypes.string
};
