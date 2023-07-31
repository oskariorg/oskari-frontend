import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LabeledInput, Switch, Message } from 'oskari-ui';
import { LocalizationComponent } from 'oskari-ui/components/LocalizationComponent';

const StyledSwitch = styled(Switch)`
    margin-bottom: 24px;
`;

export const PropertiesLocale = ({ locale, update, properties, selected }) => {
    const allSelected = properties.length === selected.length;
    const [showAll, setShowAll] = useState(allSelected);
    const propNames = showAll ? properties : selected;
    return (
        <Fragment>
            { !allSelected &&
                <StyledSwitch checked={showAll} onChange={setShowAll} label={<Message messageKey='attributes.showAll'/>}/>
            }
            <LocalizationComponent showDivider onChange={update} value={locale}>
                { propNames.map(name => <LabeledInput minimal key={name} label={name} name={name}/>) }
            </LocalizationComponent>
        </Fragment>
    );
};

PropertiesLocale.propTypes = {
    locale: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired,
    properties: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired
};
