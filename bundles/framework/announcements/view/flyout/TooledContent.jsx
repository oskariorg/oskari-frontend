import React from 'react';
import PropTypes from 'prop-types';
import { FlyoutCollapse, FlyoutFooter } from '../';
import { Message, Divider } from 'oskari-ui';

// Flyout content with tools, outdated and upcoming announcements for admin users
export const TooledContent = ({
    active,
    outdated,
    upcoming,
    toolController
}) => {
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

TooledContent.propTypes = {
    active: PropTypes.array.isRequired,
    outdated: PropTypes.array.isRequired,
    upcoming: PropTypes.array.isRequired,
    toolController: PropTypes.any.isRequired
};
