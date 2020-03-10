import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Radio, Tag } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { StyledFormField } from '../../styled';
import { MandatoryIcon } from '../Mandatory';

const commonPropTypes = {
    layer: PropTypes.object.isRequired,
    versions: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const VersionSelect = ({ layer, versions, controller }) => (
    <Radio.Group value={layer.version} buttonStyle='solid' onChange={evt => controller.setVersion(evt.target.value)}>
        { versions.map((v, i) => <Radio.Button key={i} value={v}>{v}</Radio.Button>) }
    </Radio.Group>
);
VersionSelect.propTypes = commonPropTypes;

export const Version = ({ versions, layer, controller }) => {
    const readonly = versions.length < 2 && versions.includes(layer.version);
    const versionInfo = readonly
        ? <Tag>{layer.version}</Tag>
        : <VersionSelect versions={versions} layer={layer} controller={controller} />;
    return (
        <Fragment>
            <Message messageKey='interfaceVersion'/> <MandatoryIcon />
            { !readonly && <InfoTooltip messageKeys='interfaceVersionDesc'/> }
            <StyledFormField>{ versionInfo }</StyledFormField>
        </Fragment>
    );
};
Version.propTypes = commonPropTypes;
