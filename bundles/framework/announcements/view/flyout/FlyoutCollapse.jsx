import React from 'react';
import PropTypes from 'prop-types';
import { styled } from 'styled-components';
import { Message, Collapse, Divider, Tooltip } from 'oskari-ui';
import { SelectOutlined } from '@ant-design/icons';
import { AnnouncementsContent, CollapseTools } from '../';
import { getDateRange } from '../../service/util';

const LabelContainer = styled.span`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const ExternalIcon = styled(SelectOutlined)`
    font-size: 14px;
`;

export const FlyoutCollapse = ({
    announcements,
    toolController
}) => {
    const isAdmin = Oskari.user().isAdmin();
    if (!announcements.length) {
        return (
            <Message messageKey={'flyout.noAnnouncements'}/>
        );
    }
    const items = announcements.map((announcement) => {
        const { locale, id } = announcement;
        const { title } = Oskari.getLocalized(locale);
        const hasExternalSource = !!announcement?.options?.externalId;
        const dateRange = getDateRange(announcement);

        return {
            key: announcement.id,
            label: (
                <LabelContainer>
                    <span>{title}</span>
                    {isAdmin && hasExternalSource && (
                        <Tooltip title={announcement.options.externalId}>
                            <ExternalIcon className='t_external_source' />
                        </Tooltip>
                    )}
                </LabelContainer>
            ),
            extra: (
                <CollapseTools toolController={toolController} announcementId={id}/>
            ),
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
