import React from "react";
import PropTypes from 'prop-types';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { Message, Collapse, CollapsePanel, Divider } from 'oskari-ui';
import { AnnouncementsModal } from './AnnouncementsModal';
import moment from 'moment';

//Collapse panel -> set title, locale and date range according to announcement

const DATEFORMAT = 'DD/MM/YYYY';

const AnnouncementsCollapse = ({controller, checked, announcements, modals }) => {
      
  return (
    <div>
      {modals.map((modal, index) => {
            const loc = Oskari.getLocalized(modal.locale);
            return loc.name && (
              <AnnouncementsModal
              id={modal.id}
              controller={controller}
              content={loc.content}
              key={modal.id}
              index={index}
              checked={checked}
              />
            );
          })}
      <div>
          <Collapse accordion>
              { announcements.map((announcement) => {
                const loc = Oskari.getLocalized(announcement.locale);
                let start = moment(announcement.begin_date).format(DATEFORMAT);
                let end = moment(announcement.end_date).format(DATEFORMAT);
                  return loc.name && loc.content && (
                    <CollapsePanel header={loc.name} key={announcement.id}>
                        <div className="announcements-content" dangerouslySetInnerHTML={{__html: loc.content}} />
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