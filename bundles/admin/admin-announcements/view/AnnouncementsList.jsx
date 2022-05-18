import React from "react";
import PropTypes from 'prop-types';
import { Collapse } from "antd";
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import styled from 'styled-components';

/*
Maps all created announcements into a collapse.
*/

const { Panel } = Collapse;

const StyledButton = styled(Button)`
    margin-top: 10px;
`;

const getEditIcon = (edit, announcement) => (
    <EditOutlined
        onClick={event => {
            edit(announcement);
            event.stopPropagation();
        }}
    />
);

const AnnouncementsList = ({controller,  announcements, activeKey, edit }) => {
  const callback = (key) => {
    controller.openCollapse(key);
  }
  return (
    <div>
        <div>
        <Collapse accordion activeKey={activeKey} onChange={callback}>
          {announcements.map((announcement, index) => {
            const { title, content } = Oskari.getLocalized(announcement.locale) || {};
            return (
              <Panel header={title} key={index} extra={getEditIcon(edit, announcement)}>
                <div dangerouslySetInnerHTML={{ __html: content }}/>
              </Panel>
            );
          })}
          </Collapse>
        </div>

        <StyledButton type="primary" onClick={() => edit()}>
          <PlusOutlined />
        </StyledButton>
    </div>
    
  );
};

AnnouncementsList.propTypes = {
  controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(AnnouncementsList);
export { contextWrap as AnnouncementsList };