import React from "react";
import PropTypes from 'prop-types';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { Message, Collapse, CollapsePanel, Divider } from 'oskari-ui';
import { AnnouncementsModal } from './AnnouncementsModal';
import moment from 'moment';

//Collapse panel -> set title, content and date range according to announcement

const DATEFORMAT = 'DD/MM/YYYY';

const AnnouncementsCollapse = ({controller, checked, announcements, modals }) => {
      
  return (
    <div>
      {modals.map((modal, index) => {
            return (
              <AnnouncementsModal
              id={modal.id}
              controller={controller}
              title={modal.title}
              content={modal.content}
              key={modal.id}
              index={index}
              checked={checked}
              />
            );
          })}
      <div>
      <Collapse accordion>
          { announcements.map((announcement) => {
            let start = moment(announcement.begin_date).format(DATEFORMAT);
            let end = moment(announcement.end_date).format(DATEFORMAT);
              return (
                <CollapsePanel header={announcement.title} key={announcement.id}>
                    <h3><b>{announcement.title}</b></h3>
                    <p>{announcement.content}</p>
                    <Divider />
                    <b><Message messageKey={'valid'} /></b>
                    <p>{start.toString()} - {end.toString()}</p>
                </CollapsePanel>)
          })}
        </Collapse>
      </div>
    </div>
  );
};

AnnouncementsCollapse.propTypes = {
  controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(AnnouncementsCollapse);
export { contextWrap as AnnouncementsCollapse };