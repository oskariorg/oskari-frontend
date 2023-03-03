import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import styled from 'styled-components';

const StyledTable = styled('table')`
    tbody {
        tr {
            th {
                padding: 8px;
                width: 30%;
            }
            td {
                padding: 8px;
            }
        }
    }
`;

export const AccountTab = ({ state }) => {
    const { user, changeInfoUrl } = state;

    const accountData = [{
        label: <Message messageKey='tabs.account.firstName' />,
        value: user.getFirstName()
    }, {
        label: <Message messageKey='tabs.account.lastName' />,
        value: user.getLastName()
    }, {
        label: <Message messageKey='tabs.account.nickName' />,
        value: user.getNickName()
    }, {
        label: <Message messageKey='tabs.account.email' />,
        value: user.getEmail()
    }];

    return (
        <div className="account">
            <StyledTable className="info oskari-grid">
                <tbody>
                    {accountData.map((data, i) => (
                        <tr key={`account-data-${i}`} className='dataField'>
                            <th className='label'>{data.label}</th>
                            <td className='value'>{data.value}</td>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>
            <div className="bottomlinks">
                {changeInfoUrl && (
                    <span><a href={changeInfoUrl}><Message messageKey='tabs.account.changeInfo'></Message></a></span>
                )}
            </div>
        </div>
    );
};

AccountTab.propTypes = {
    state: PropTypes.object.isRequired
};
