import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '../../components/Checkbox';
import {Collapse, Panel} from '../../components/Collapse';
import {List, ListItem} from '../../components/List';
import {GenericContext} from '../../../../../src/react/util.jsx';

export const MapLayerGroups = ({allGroups, service, lang}) => {
    const dataSource = allGroups.map((group) =>
        <Checkbox key={group.id} onChange={(evt) => service.setMapLayerGroup(evt.target.checked, group.id)} checked={group.checked}>{group.name[lang]}</Checkbox>
    );
    const renderItem = (item) => {
        return (
            <ListItem>{item}</ListItem>
        );
    };
    return (
        <GenericContext.Consumer>
            {value => {
                const loc = value.loc;
                return (
                    <Collapse>
                        <Panel header={loc('selectMapLayerGroupsButton')}>
                            <List dataSource={dataSource} renderItem={renderItem} />
                        </Panel>
                    </Collapse>
                );
            }}
        </GenericContext.Consumer>
    );
};

MapLayerGroups.propTypes = {
    handleMapLayerGroupChange: PropTypes.func,
    onChange: PropTypes.func,
    allGroups: PropTypes.array,
    service: PropTypes.any,
    lang: PropTypes.string
};
