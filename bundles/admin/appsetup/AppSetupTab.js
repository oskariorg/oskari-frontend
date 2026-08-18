import React, { useState } from 'react';
import { Button, TextAreaInput, Link } from 'oskari-ui';
import { Messaging } from 'oskari-ui/util';
import { styled } from 'styled-components';

const BUNDLE_KEY = 'AdminAppSetup';

const Description = styled('div')`
    margin-bottom: 0.375em;
`;

const ResponseData = styled('div')`
    margin-left: 0.75em;
`;

const JsonInput = styled(TextAreaInput)`
    width: 100%;
    max-width: 25em;
    min-height: 15.625em;
    margin-bottom: 0.5em;
`;

const Actions = styled('div')`
    margin-top: 0.5em;
`;

const Result = styled('div')`
    margin-top: 0.75em;
`;

export const AppSetupTab = () => {
    const [json, setJson] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const currentViewUrl = Oskari.urls.getRoute('Views', { uuid: Oskari.app.getUuid() });

    const importJSON = async () => {
        if (!json.trim()) {
            Messaging.error(Oskari.getMsg(BUNDLE_KEY, 'error.checkValue'));
            return;
        }
        let parsed;
        try {
            parsed = JSON.parse(json);
        } catch (e) {
            Messaging.error(Oskari.getMsg(BUNDLE_KEY, 'error.checkValue'));
            return;
        }
        setLoading(true);
        setResult(null);
        try {
            const response = await fetch(Oskari.urls.getRoute('Views'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(parsed)
            });
            if (!response.ok) {
                Messaging.error(Oskari.getMsg(BUNDLE_KEY, 'error.importError'));
            } else {
                const data = await response.json();
                setResult(data);
                setJson('');
            }
        } catch (e) {
            Messaging.error(Oskari.getMsg(BUNDLE_KEY, 'error.importError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Description>
                <div>
                    {Oskari.getMsg(BUNDLE_KEY, 'description.fillJSON')}{' '}
                    (<Link url={currentViewUrl}>{Oskari.getMsg(BUNDLE_KEY, 'description.current')}</Link>).
                </div>
                <div>{Oskari.getMsg(BUNDLE_KEY, 'description.differentUuid')}</div>
            </Description>
            <JsonInput
                value={json}
                onChange={(e) => setJson(e.target.value)}
                placeholder={Oskari.getMsg(BUNDLE_KEY, 'textAreaPlaceholder')}
            />
            <Actions>
                <Button type="primary" loading={loading} onClick={importJSON}>
                    {Oskari.getMsg(BUNDLE_KEY, 'importButtonText')}
                </Button>
            </Actions>
            {result && (
                <Result>
                    <div>{Oskari.getMsg(BUNDLE_KEY, 'success.description')}</div>
                    <ResponseData>
                        <ul>
                            <li><b>{Oskari.getMsg(BUNDLE_KEY, 'success.viewId')}</b>: {result.id}</li>
                            <li><b>{Oskari.getMsg(BUNDLE_KEY, 'success.viewUuid')}</b>: {result.uuid}</li>
                            <li>
                                <b>{Oskari.getMsg(BUNDLE_KEY, 'success.viewUrl')}</b>:{' '}
                                <Link url={result.url}>{result.url}</Link>
                            </li>
                        </ul>
                    </ResponseData>
                </Result>
            )}
        </>
    );
};
