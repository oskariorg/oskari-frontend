import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Select, Option } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { StyledFormField } from '../styled';
import { MandatoryIcon } from '../Mandatory';

export const DataProvider = ({ layer, dataProviders, controller }) => (
    <Fragment>
        <Message messageKey='fields.dataproviderId'/>  <MandatoryIcon isValid={layer.dataProviderId && layer.dataProviderId !== -1}/>
        <StyledFormField>
            <Select
                showSearch
                optionFilterProp='children'
                value={layer.dataProviderId}
                onChange={value => controller.setDataProviderId(value)}>
                { dataProviders.map(dataProvider =>
                    <Option value={dataProvider.id} key={dataProvider.id}>{dataProvider.name}</Option>
                )}
            </Select>
        </StyledFormField>
    </Fragment>
);
DataProvider.propTypes = {
    layer: PropTypes.object.isRequired,
    dataProviders: PropTypes.arrayOf(PropTypes.object).isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
