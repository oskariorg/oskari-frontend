import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Collapse, CollapsePanel, List, ListItem } from 'oskari-ui';
import { withLocale } from 'oskari-ui/util';

const MapLayerGroups = (props) => {
    const { layer, mapLayerGroups, service, lang, getMessage } = props;
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
            <CollapsePanel header={getMessage('selectMapLayerGroupsButton')}>
                <List dataSource={dataSource} renderItem={renderItem} />
            </CollapsePanel>
        </Collapse>
    );
};

MapLayerGroups.propTypes = {
    layer: PropTypes.object.isRequired,
    mapLayerGroups: PropTypes.array.isRequired,
    service: PropTypes.any.isRequired,
    lang: PropTypes.string.isRequired,
    getMessage: PropTypes.func.isRequired
};

const contextWrap = withLocale(MapLayerGroups);
export { contextWrap as MapLayerGroups };
