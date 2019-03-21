import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '../components/Checkbox';
import {Collapse, Panel} from '../components/Collapse';
import {List, ListItem} from '../components/List';

export const MapLayerGroups = ({groups, service}) => {
    // TODO get language
    const dataSource = groups.map((group) =>
        <Checkbox key={group.id} onChange={(evt) => service.setMapLayerGroup(evt.target.checked, group.id)}>{group.name['fi']}</Checkbox>
    );
    const renderItem = (item) => {
        return (
            <ListItem>{item}</ListItem>
        );
    };
    return (
        <Collapse>
            <Panel header='Valitse'>
                <List dataSource={dataSource} renderItem={renderItem} />
            </Panel>
        </Collapse>
    );
};

MapLayerGroups.propTypes = {
    handleMapLayerGroupChange: PropTypes.func,
    onChange: PropTypes.func,
    groups: PropTypes.array,
    service: PropTypes.any
};
