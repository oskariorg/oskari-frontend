import React from "react";
import PropTypes from 'prop-types';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { Message, Collapse, CollapsePanel, Divider } from 'oskari-ui';
import { AnnouncementsModal } from './AnnouncementsModal';
import moment from 'moment';

//Collapse panel -> set title, locale and date range according to announcement

const DATEFORMAT = 'DD/MM/YYYY';

const AnnouncementsCollapse = ({controller, checked, announcements, modals }) => {
  const lang = Oskari.getLang();
      
  return (
    <div>
      {modals.map((modal, index) => {
            return (
              <AnnouncementsModal
              id={modal.id}
              controller={controller}
              content={modal.locale[lang].content}
              key={modal.id}
              index={index}
              checked={checked}
              />
            );
          })}
      <div>
        { announcements.length > 0 ?
          <Collapse accordion>
              { announcements.map((announcement) => {
                let start = moment(announcement.begin_date).format(DATEFORMAT);
                let end = moment(announcement.end_date).format(DATEFORMAT);
                  return announcement.locale[lang].name && (
                    <CollapsePanel header={announcement.locale[lang].name} key={announcement.id}>
                        <div className="announcements-content" dangerouslySetInnerHTML={{__html: announcement.locale[lang].content}} />
                        <Divider />
                        <b><Message messageKey={'valid'} /></b>
                        <p>{start.toString()} - {end.toString()}</p>
                    </CollapsePanel>)
              })}
            </Collapse>
          :
            <center><h3><Message messageKey={'noAnnouncements'}/></h3></center>
        }
      </div>
    </div>
  );
};

AnnouncementsCollapse.propTypes = {
  controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(AnnouncementsCollapse);
export { contextWrap as AnnouncementsCollapse };