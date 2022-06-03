import React from 'react';
import PropTypes from 'prop-types';
import { Message, Collapse, CollapsePanel, Divider } from 'oskari-ui';
import { AnnouncementsContent, CollapseTools } from '../';
import { getDateRange } from '../../service/util';

export const FlyoutCollapse = ({
    announcements,
    toolController
}) => {
    if (!announcements.length) {
        return (
            <Message messageKey={'flyout.noAnnouncements'}/>
        );
    }
    return (
        <Collapse accordion>
            { announcements.map((announcement) => {
                const { locale, id } = announcement;
                const { title } = Oskari.getLocalized(locale);
                const dateRange = getDateRange(announcement);
                return (
                    <CollapsePanel header={title} key={announcement.id}
                        extra={<CollapseTools toolController={toolController} announcementId={id}/>}>
                        <AnnouncementsContent announcement={announcement}/>
                        <Divider />
                        <b><Message messageKey={'valid'} /></b>
                        <p>{dateRange}</p>
                    </CollapsePanel>
                );
            })}
        </Collapse>
    );
};

FlyoutCollapse.propTypes = {
    announcements: PropTypes.array.isRequired,
    toolController: PropTypes.any
};
