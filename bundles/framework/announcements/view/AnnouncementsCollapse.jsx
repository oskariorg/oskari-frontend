import React from "react";
import PropTypes from 'prop-types';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { AnnouncementsModal } from './AnnouncementsModal';
import { Collapse, Divider } from 'antd';

//Collapse panel -> set title, content and date range according to announcement

const { Panel } = Collapse;

const AnnouncementsCollapse = ({controller, updated, panels, modals, checked }) => {

      if (!updated) {
        controller.getAnnouncements(function(ann){

        
          var panels = [];
          var modals = [];
            ann.data.forEach((announcement) => {

              if (announcement.active) {
                //if announcement is active, then show pop-up of the content
                modals.push(announcement);
              }
              panels.push(
                      <Panel header={announcement.title} key={announcement.id}>
                          <h3>{announcement.title}</h3>
                          <p>{announcement.content}</p>
                          <Divider />
                          <b><Message messageKey={'valid'} /></b>
                          <p>{announcement.begin_date} - {announcement.end_date}</p>
                      </Panel>
                );
            });
            controller.updatePanelsModals(panels,modals);
          });
      }
      
      
  return (
    <div>
      {modals.map((modal, index) => {
            const visible = controller.showModal(modal.id);
            return (
              <AnnouncementsModal
              controller={controller}
              title={modal.title}
              content={modal.content}
              key={modal.id}
              index={index}
              id={modal.id}
              checked={checked}
              visible={visible}
              />
            );
          })}
      <div>
        <Collapse accordion >{panels}</Collapse>
      </div>
    </div>
  );
};

AnnouncementsCollapse.propTypes = {
  controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(AnnouncementsCollapse);
export { contextWrap as AnnouncementsCollapse };