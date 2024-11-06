import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Label, List } from '..';

export const ResponsibleParties = ({ source, dataKey }) => {
    const parties = source[dataKey] || [];
    if (!parties.length) {
        return null;
    }
    return (
        <Fragment>
            <Label labelKey={dataKey} />
            <List>
                {parties.map((party, i) => (
                    <li key={i}>
                        {party.organisationName}
                        <List>
                            {party.electronicMailAddresses?.map((address, i) => <li key={i}>{address}</li>)}
                        </List>
                    </li>
                ))}
            </List>
        </Fragment>
    );
};

ResponsibleParties.propTypes = {
    source: PropTypes.object.isRequired,
    dataKey: PropTypes.string.isRequired
};
