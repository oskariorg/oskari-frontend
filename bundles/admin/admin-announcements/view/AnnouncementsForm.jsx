import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Form, Button, Switch, Row } from "antd";
import { Message, Confirm, DateRange, LocalizationComponent, TextInput } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import styled from 'styled-components';
import moment from 'moment';
import {stateToHTML} from 'draft-js-export-html';
import RichEditor from 'oskari-ui/components/RichTextEditor';
import 'draft-js/dist/Draft.css';

/*
This file contains the form for admin-announcements.
This is the main file for creating and editing announcements.
*/
const rangeConfig = {
  rules: [
    {
      type: "array",
      required: true,
      message: <Message messageKey='dateError' />
    }
  ]
};

const PaddingTop = styled('div')`
    padding-top: 24px;
`;

const DATEFORMAT = 'YYYY-MM-DD';

const Label = styled('div')`
    padding-bottom: 8px;
`;

const AnnouncementsForm = ({controller, key, announcement, bundleKey, index}) => {
  const [ locales, setLocales ] = useState({...announcement.locale});
  
  const onFinish  = fieldsValue => {
    // Should format date value before submit.
    const rangeValue = fieldsValue["range_picker"];
    let content = {...locales};
    for (const lang in content) {
      if (content[lang].content && content[lang].content.editorstate) {
        content[lang].content = stateToHTML(content[lang].content.editorstate.editorState.getCurrentContent());
      }
    }

    const values = {
      locale: content,
      begin_date: rangeValue[0].format(DATEFORMAT), 
      end_date: rangeValue[1].format(DATEFORMAT),
      active: fieldsValue["active"]
    };

    if (announcement.id === undefined) {
      controller.saveAnnouncement(values);
    } else {
      values.id = announcement.id;
      controller.updateAnnouncement(values);
    }
  }

  //Return localized labels
  const getLabels = (bundleKey) => {
    const getMsg = Oskari.getMsg.bind(null, bundleKey);
    const labels = {};
    Oskari.getSupportedLanguages().forEach(language => {
        const langPrefix = typeof getMsg(`fields.locale.${language}`) === 'object' ? language : 'generic';
        labels[language] = {
            name: getMsg(`fields.locale.${langPrefix}.name`, [language]),
            content: getMsg(`fields.locale.${langPrefix}.content`, [language])
        };
    });
    return labels;
  };
  
  //Set initial values to date range depending on if we are editing or creating an announcement
  const rangeInitial = () => {

    if (announcement.begin_date && announcement.end_date) {
      return [moment(announcement.begin_date, DATEFORMAT), moment(announcement.end_date, DATEFORMAT)]; 
    } else {
      return [moment(moment(),DATEFORMAT), moment(moment(),DATEFORMAT)];  
    }

  } 

  //Active value set depending on if creating a new announcement or editing an old one
  const activeInitial = () => {
    if(announcement.active === undefined) {
      return true;
    } else {
      return announcement.active;
    }
  }

    return (
      <div>
            <Form layout="vertical" 
              onFinish={onFinish} 
              initialValues={{
                range_picker: rangeInitial(),
                active: activeInitial(),
              }}>
                
              <LocalizationComponent
                  labels={getLabels(bundleKey)}
                  languages={Oskari.getSupportedLanguages()}
                  LabelComponent={Label}
                  onChange={(locale) => setLocales({ ...locales, ...locale })}
                  value={locales}
              >
                
                  
              <TextInput type='text' name='name'/>
              <PaddingTop/>
              <RichEditor name='content'/>
              <PaddingTop/>
              </LocalizationComponent>
                  
              
              <Form.Item
                name="range_picker"
                label={<Message messageKey='fields.date-range' />}
                style={{marginTop: '25px'}}
                {...rangeConfig}
              >
                <DateRange popupStyle={{zIndex: '999999'}} />
              </Form.Item>
              <Form.Item name="active" label={<Message messageKey='fields.show-popup' />} valuePropName="checked">
                <Switch/>
              </Form.Item>
              <Row>
                <Form.Item>
                  <Button type="primary" htmlType="submit" >
                    <Message messageKey={'save'}/>
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Confirm
                      title={<Message messageKey='messages.deleteAnnouncementConfirm'/>}
                      onConfirm={() => controller.deleteAnnouncement(announcement.id)}
                      okText={<Message messageKey='yes'/>}
                      cancelText={<Message messageKey='cancel'/>}
                      placement='top'
                      popupStyle={{zIndex: '999999'}}
                  >
                      <Button key={key}>
                          <Message messageKey='delete'/>
                      </Button>
                  </Confirm>
                </Form.Item>
                <Form.Item>
                  <Confirm
                        title={<Message messageKey='messages.cancelAnnouncementConfirm'/>}
                        onConfirm={() => controller.cancel(announcement.id)}
                        okText={<Message messageKey='yes'/>}
                        cancelText={<Message messageKey='cancel'/>}
                        placement='top'
                        popupStyle={{zIndex: '999999'}}
                    >
                      <Button>
                        <Message messageKey={'cancel'}/>
                      </Button>
                  </Confirm>
                </Form.Item>
              </Row>
            </Form>
      </div>
    );
};

AnnouncementsForm.propTypes = {
  key: PropTypes.number,
  controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(AnnouncementsForm);
export { contextWrap as AnnouncementsForm };