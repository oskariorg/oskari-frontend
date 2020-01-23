import React from 'react';
import PropTypes from 'prop-types';
import { Message, Collapse, CollapsePanel } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { OptionInput } from '../../OptionInput';

export const CesiumIon = ({ layer, controller }) => (
    <Collapse>
        <CollapsePanel header={<Message messageKey='ion.title'/>}>
            <Message messageKey='ion.assetId' />
            <OptionInput layer={layer} controller={controller} propKey='assetId'/>
            <Message messageKey='ion.accessToken' />
            <OptionInput layer={layer} controller={controller} propKey='accessToken'/>
            <Message messageKey='ion.assetServer' />
            <OptionInput layer={layer} controller={controller} propKey='assetServer'/>
        </CollapsePanel>
    </Collapse>
);
CesiumIon.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
