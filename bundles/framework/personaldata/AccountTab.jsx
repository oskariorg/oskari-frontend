import React from 'react'
import { Message } from 'oskari-ui'


const AccountTab = ({ user, changeInfoUrl }) => {
    const BUNDLE_NAME = 'PersonalData';

    const accountData = [{
        label: <Message messageKey='tabs.account.firstName' bundleKey={BUNDLE_NAME} />,
        value: user.getFirstName()
    }, {
        label: <Message messageKey='tabs.account.lastName' bundleKey={BUNDLE_NAME} />,
        value: user.getLastName()
    }, {
        label: <Message messageKey='tabs.account.nickName' bundleKey={BUNDLE_NAME} />,
        value: user.getNickName()
    }, {
        label: <Message messageKey='tabs.account.email' bundleKey={BUNDLE_NAME} />,
        value: user.getEmail()
    }];

    return (
        <div className="account">
            <table className="info oskari-grid">
                <tbody>
                    {accountData.map((data, i) => (
                        <tr key={`account-data-${i}`} className='dataField'>
                            <th className='label'>{data.label}</th>
                            <td className='value'>{data.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="bottomlinks">
                {changeInfoUrl && (
                    <span><a href={changeInfoUrl}><Message messageKey='tabs.account.changeInfo' bundleKey={BUNDLE_NAME}></Message></a></span>
                )}
            </div>
        </div>
    )
};

export default AccountTab;
