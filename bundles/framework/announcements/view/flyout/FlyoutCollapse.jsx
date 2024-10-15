import React from 'react';
import PropTypes from 'prop-types';
import { Message, Collapse, Divider } from 'oskari-ui';
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
    const items = announcements.map((announcement) => {
        const { locale, id } = announcement;
        const { title } = Oskari.getLocalized(locale);
        const dateRange = getDateRange(announcement);

        return {
            key: announcement.id,
            label: title,
            extra: <CollapseTools toolController={toolController} announcementId={id}/>,
            children: <>
                <AnnouncementsContent announcement={announcement}/>
                <Divider />
                <b><Message messageKey={'valid'} /></b>
                <p>{dateRange}</p>
            </>
        };
    });

    return (
        <Collapse accordion items={items}/>
    );
};

FlyoutCollapse.propTypes = {
    announcements: PropTypes.array.isRequired,
    toolController: PropTypes.any
};
