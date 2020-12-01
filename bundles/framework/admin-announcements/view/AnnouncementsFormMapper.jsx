import React from "react";
import {AnnouncementsForm} from './AnnouncementsForm';
import "antd/dist/antd.css";
import PropTypes from 'prop-types';
import { Button, Collapse } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import styled from 'styled-components';

/*
Maps all created announcements into a collapse.
*/

const { Panel } = Collapse;

const StyledButton = styled(Button)`
    margin-top: 10px;
`;

const AnnouncementsFormMapper = ({controller,  announcements, updated, title, activeKey, checked }) => {

  //TODO(?) Create maybe a better way to handle updating the collapse panels
  if (!updated) {
    controller.getAdminAnnouncements(function(ann){
      var announcements = [];

        ann.data.forEach((announcement) => {
          announcements.push(announcement);
          
        });
        
        controller.pushAnnouncements(announcements);
      });
  }

  const callback = (key) => {
    controller.updateActiveKey(key);
  }


  return (
    <div>
        <div>
        <Collapse accordion activeKey={activeKey} onChange={callback}>
          {announcements.map((form, index) => {
            return (
              <Panel header={form.title} key={index} >
              <AnnouncementsForm
                controller={controller}
                form={form}
                index={index}
                title={title}
                key={index}
              />
              </Panel>
            );
          })}
          </Collapse>
        </div>

        <StyledButton type="primary" onClick={() => controller.addForm()}>
          <PlusOutlined />
        </StyledButton>
    </div>
    
  );
};

AnnouncementsFormMapper.propTypes = {
  controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(AnnouncementsFormMapper);
export { contextWrap as AnnouncementsFormMapper };