import React from 'react';
import PropTypes from 'prop-types';
import { FlyoutCollapse, FlyoutFooter } from '../';
import { Message, Divider } from 'oskari-ui';

// Flyout content with tools, outdated and upcoming announcements for admin users
export const TooledContent = ({
    active,
    outdated,
    upcoming,
    tools
}) => {
    const footerTools = tools.filter(tool => tool.getTypes().includes('footer'));
    const announcementTools = tools.filter(tool => tool.getTypes().includes('announcement'));
    return (
        <div>
            <FlyoutCollapse announcements={active} tools={announcementTools}/>
            <Divider orientation='left'>
                <Message messageKey='flyout.outdated'/>
            </Divider>
            <FlyoutCollapse announcements={outdated} tools={announcementTools}/>
            <Divider orientation='left'>
                <Message messageKey='flyout.upcoming'/>
            </Divider>
            <FlyoutCollapse announcements={upcoming} tools={announcementTools}/>
            <FlyoutFooter tools={footerTools} />
        </div>
    );
};

TooledContent.propTypes = {
    active: PropTypes.array.isRequired,
    outdated: PropTypes.array.isRequired,
    upcoming: PropTypes.array.isRequired,
    tools: PropTypes.array.isRequired
};
