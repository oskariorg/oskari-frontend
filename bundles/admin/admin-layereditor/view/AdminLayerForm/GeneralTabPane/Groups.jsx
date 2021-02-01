import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Collapse, CollapsePanel, List, ListItem, Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';
import styled from 'styled-components';

const StyledDiv = styled('div')`
    margin-left: 25px !important ;
`;
const StyledListItem = styled(ListItem)`
    border-bottom: 1px solid #f0f0f0 !important ;
`;

// add subgroups on the list recursively and hierarchically
const SubGroupsListItem = ({ group, layer, controller }) => {
    return (
        <List dataSource={group.getGroups().map(subgroup => 
            <StyledDiv>
        <StyledListItem>
            <Checkbox key={subgroup.id}
                onChange={evt => controller.setGroup(evt.target.checked, subgroup)}
                checked={!!layer.groups.find(cur => cur === subgroup.id)}
            >
                {subgroup.name[Oskari.getLang()]}
            </Checkbox>
        </StyledListItem>
        {subgroup.groups.length > 0 && <SubGroupsListItem group={subgroup} layer={layer} controller={controller}/>}
        </StyledDiv>)} renderItem={item => item} />
    );
};

export const Groups = ({ layer, groups, controller }) => {
    const dataSource = groups.map(group =>
        <div>
            <StyledListItem>
                <Checkbox key={group.id}
                    onChange={evt => controller.setGroup(evt.target.checked, group)}
                    checked={!!layer.groups.find(cur => cur === group.id)}
                >
                    {group.name[Oskari.getLang()]}
                </Checkbox>
            </StyledListItem> 
            {group.groups.length > 0 && <SubGroupsListItem group={group} layer={layer} controller={controller}/>}
        </div>
    );
    return (
        <Fragment>
            <Message messageKey='fields.groups' />
            <StyledFormField>
                <Collapse>
                    <CollapsePanel header={<Message messageKey='selectMapLayerGroupsButton'/>}>
                        <List dataSource={dataSource} renderItem={item => item} />
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
