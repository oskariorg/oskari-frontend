import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Collapse, CollapsePanel, List, ListItem, Message } from 'oskari-ui';
import { LocaleConsumer } from 'oskari-ui/util';

export const MapLayerGroups = LocaleConsumer(({ layer, mapLayerGroups, service, lang }) => {
    const dataSource = mapLayerGroups.map(group =>
        <Checkbox key={group.id}
            onChange={(evt) => service.setMapLayerGroup(evt.target.checked, group)}
            checked={!!layer.maplayerGroups.find(cur => group.id === cur.id)}>{group.name[lang]}
        </Checkbox>
    );
    const renderItem = item => <ListItem>{item}</ListItem>;
    return (
        <Collapse>
            <CollapsePanel header={<Message messageKey='selectMapLayerGroupsButton'/>}>
                <List dataSource={dataSource} renderItem={renderItem} />
            </CollapsePanel>
        </Collapse>
    );
});

MapLayerGroups.propTypes = {
    layer: PropTypes.object.isRequired,
    mapLayerGroups: PropTypes.array.isRequired,
    service: PropTypes.any.isRequired,
    lang: PropTypes.string.isRequired
};
