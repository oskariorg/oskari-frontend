import React from 'react';
import PropTypes from 'prop-types';
import { FlyoutCollapse, FlyoutFooter } from '../';
import { Message, Divider } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';

export const FlyoutContent = ({
    active = [],
    outdated = [],
    upcoming = [],
    toolController
}) => {
    if (!toolController) {
        return <FlyoutCollapse announcements={active}/>;
    }
    // Flyout content with tools, outdated and upcoming announcements for admin users
    return (
        <div>
            <FlyoutCollapse announcements={active} toolController={toolController}/>
            <Divider orientation='left'>
                <Message messageKey='flyout.outdated'/>
            </Divider>
            <FlyoutCollapse announcements={outdated} toolController={toolController}/>
            <Divider orientation='left'>
                <Message messageKey='flyout.upcoming'/>
            </Divider>
            <FlyoutCollapse announcements={upcoming} toolController={toolController}/>
            <FlyoutFooter toolController={toolController} />
        </div>
    );
};

FlyoutContent.propTypes = {
    active: PropTypes.array,
    outdated: PropTypes.array,
    upcoming: PropTypes.array,
    toolController: PropTypes.instanceOf(Controller)
};
