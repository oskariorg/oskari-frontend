import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Collapse, CollapsePanel, List, ListItem, Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledComponent } from '../StyledFormComponents';

export const MapLayerGroups = ({ layer, mapLayerGroups, controller }) => {
    const dataSource = mapLayerGroups.map(group =>
        <Checkbox key={group.id}
            onChange={evt => controller.setMapLayerGroup(evt.target.checked, group)}
            checked={!!layer.maplayerGroups.find(cur => cur === group.id)}
        >
            {group.name[Oskari.getLang()]}
        </Checkbox>
    );
    const renderItem = item => <ListItem>{item}</ListItem>;
    return (
        <Fragment>
            <Message messageKey='mapLayerGroups' />
            <StyledComponent>
                <Collapse>
                    <CollapsePanel header={<Message messageKey='selectMapLayerGroupsButton'/>}>
                        <List dataSource={dataSource} renderItem={renderItem} />
                    </CollapsePanel>
                </Collapse>
            </StyledComponent>
        </Fragment>
    );
};

MapLayerGroups.propTypes = {
    layer: PropTypes.object.isRequired,
    mapLayerGroups: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    lang: PropTypes.string.isRequired
};
