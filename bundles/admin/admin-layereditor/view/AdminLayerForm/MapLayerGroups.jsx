import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Collapse, Panel, List, ListItem } from 'oskari-ui';
import { withContext } from 'oskari-ui/util';

const MapLayerGroups = (props) => {
    const { layer, mapLayerGroups, service, lang } = props;
    const dataSource = mapLayerGroups.map(group =>
        <Checkbox key={group.id}
            onChange={(evt) => service.setMapLayerGroup(evt.target.checked, group)}
            checked={!!layer.maplayerGroups.find(cur => group.id === cur.id)}>{group.name[lang]}
        </Checkbox>
    );
    const renderItem = (item) => {
        return (
            <ListItem>{item}</ListItem>
        );
    };
    return (
        <Collapse>
            <Panel header={props.loc('selectMapLayerGroupsButton')}>
                <List dataSource={dataSource} renderItem={renderItem} />
            </Panel>
        </Collapse>
    );
};

MapLayerGroups.propTypes = {
    layer: PropTypes.object.isRequired,
    mapLayerGroups: PropTypes.array.isRequired,
    service: PropTypes.any.isRequired,
    lang: PropTypes.string.isRequired,
    loc: PropTypes.func.isRequired
};

const contextWrap = withContext(MapLayerGroups);
export { contextWrap as MapLayerGroups };
