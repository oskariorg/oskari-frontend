import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox} from '../../components/Checkbox';
import {Collapse, Panel} from '../../components/Collapse';
import {List, ListItem} from '../../components/List';
import {withContext} from '../../../../../src/react/util.jsx';

const MapLayerGroups = (props) => {
    const {allGroups, service, lang} = props;
    const dataSource = allGroups.map((group) =>
        <Checkbox key={group.id} onChange={(evt) => service.setMapLayerGroup(evt.target.checked, group.id)} checked={group.checked}>{group.name[lang]}</Checkbox>
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
    handleMapLayerGroupChange: PropTypes.func,
    onChange: PropTypes.func,
    allGroups: PropTypes.array,
    service: PropTypes.any,
    lang: PropTypes.string,
    loc: PropTypes.func
};

const contextWrap = withContext(MapLayerGroups);
export {contextWrap as MapLayerGroups};
