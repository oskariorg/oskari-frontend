import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import styled from 'styled-components';
import { SelectOutlined } from '@ant-design/icons';

const LinkIcon = styled(SelectOutlined)`
    margin-left: 6px;
`;

const Link = ({ url }) => (
    <a href={url} target="_blank" rel="noreferrer noopener">
        <Message messageKey={'externalLink'} />
        <LinkIcon/>
    </a>
);
Link.propTypes = {
    url: PropTypes.string.isRequired
};

export const AnnouncementsContent = ({ announcement }) => {
    const { locale } = announcement;
    const { link, content } = Oskari.getLocalized(locale);
    if (link) {
        return (
            <Link url ={link}/>
        );
    }
    return (
        <div className="announcements-content"
            dangerouslySetInnerHTML={{ __html: content }}/>
    );
};
AnnouncementsContent.propTypes = {
    announcement: PropTypes.object.isRequired
};
