import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Collapse, CollapsePanel, List, ListItem, Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';

export const Groups = ({ layer, groups, controller }) => {
    const dataSource = groups.map(group =>
        <Checkbox key={group.id}
            onChange={evt => controller.setGroup(evt.target.checked, group)}
            checked={!!layer.groups.find(cur => cur === group.id)}
        >
            {group.name[Oskari.getLang()]}
        </Checkbox>
    );
    const renderItem = item => <ListItem>{item}</ListItem>;
    return (
        <Fragment>
            <Message messageKey='fields.groups' />
            <StyledFormField>
                <Collapse>
                    <CollapsePanel header={<Message messageKey='selectMapLayerGroupsButton'/>}>
                        <List dataSource={dataSource} renderItem={renderItem} />
                    </CollapsePanel>
                </Collapse>
            </StyledFormField>
        </Fragment>
    );
};

Groups.propTypes = {
    layer: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
