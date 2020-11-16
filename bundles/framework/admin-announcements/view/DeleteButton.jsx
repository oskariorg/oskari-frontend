import React from "react";
import "antd/dist/antd.css";
import PropTypes from 'prop-types';
import { Button } from "antd";

//TODO: Separate component for deleting announcements. Could not get this to work properly yet.

const DeleteButton = ({ controller, deleteAnnouncement }) => {
    return (
    <Confirm
        title={<React.Fragment>
            <div>
                <Message messageKey='messages.confirmDeleteAnnouncement'/>
            </div>
            { layerCountInGroup > 0 &&
                <DeleteLayersCheckbox checked={deleteLayers} onChange={ evt => controller.setDeleteLayers(evt.target.checked)}>
                    {deleteMapLayersText + ' (' + layerCountInGroup + ')'}
                </DeleteLayersCheckbox>
            }
        </React.Fragment>}
        onConfirm={() => controller.delete()}
        okText={<Message messageKey='ok'/>}
        cancelText={<Message messageKey='cancel'/>}
        placement='bottomLeft'>
        <Button>
            <Message messageKey='delete'/>
        </Button>
    </Confirm>);
  };
  DeleteButton.propTypes = {
    controller: PropTypes.instanceOf(Controller)
  };