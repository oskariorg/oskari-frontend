
import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Checkbox, Modal } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import styled from 'styled-components';

//Pop-up functionality for announcements

const StyledCheckbox = styled(Checkbox)`
    position: absolute !important;
    left: 0px !important;
    padding: 4px 15px !important;
`;

const AnnouncementsModal = ({ id, content, controller, index, checked }) => {

    const handleOk = (checked, id) => {
        controller.setAnnouncementAsSeen(checked, id);
    }

    const onCheckboxChange = (e) => {
        controller.onCheckboxChange(e.target.checked);
    }

    return (
        <Modal
              mask={false}
              centered
              visible={true}
              onCancel={() => handleOk(index)}
              footer={[
                <StyledCheckbox key="checkbox" onChange={onCheckboxChange} ><Message messageKey={'dontShow'}/></StyledCheckbox>,
                <Button key="ok" type="primary" onClick={() => handleOk(checked, id)}>
                OK
                </Button>,
              ]}
            >
            <div className="announcements-content" dangerouslySetInnerHTML={{__html: content}} />
        </Modal>
    );
};

AnnouncementsModal.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(AnnouncementsModal);
export { contextWrap as AnnouncementsModal };

