import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, Message } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import { Modal } from 'oskari-ui/components/Modal';
import { Messaging } from 'oskari-ui/util';

const BUNDLE_KEY = 'GenericAdmin';

export const DefaultViewsContent = () => {
    const [views, setViews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [warning, setWarning] = useState(null); // { id, layerNames }
    const sb = Oskari.getSandbox();

    useEffect(() => {
        const loadViews = async () => {
            try {
                const response = await fetch(Oskari.urls.getRoute('SystemViews'));
                const data = await response.json();
                const rows = [{ id: data.viewId, name: Oskari.getMsg(BUNDLE_KEY, 'flyout.defaultviews.globalViewTitle') }];
                (data.roles || []).forEach(role => {
                    if (role.viewId) {
                        rows.push({ id: role.viewId, name: role.name });
                    }
                });
                setViews(rows);
                setLoading(false);
            } catch (e) {
                Messaging.error(Oskari.getMsg(BUNDLE_KEY, 'flyout.defaultviews.notifications.errorLoadingFailed'));
                setLoading(false);
            }
        };
        loadViews();
    }, []);

    const modifyView = async (id, force = false) => {
        const selectedLayers = sb.findAllSelectedMapLayers().map(layer => ({ id: '' + layer.getId() }));
        const params = new URLSearchParams({
            id,
            north: sb.getMap().getY(),
            east: sb.getMap().getX(),
            zoom: sb.getMap().getZoom(),
            srs: sb.getMap().getSrsName(),
            selectedLayers: JSON.stringify(selectedLayers),
            force: !!force
        });
        try {
            const response = await fetch(Oskari.urls.getRoute('SystemViews'), { method: 'POST', body: params });
            if (!response.ok) {
                handleError(await response.text(), id);
                return;
            }
            Messaging.success(Oskari.getMsg(BUNDLE_KEY, 'flyout.defaultviews.notifications.viewUpdated').replace('${id}', id));
        } catch (e) {
            Messaging.error(Oskari.getMsg(BUNDLE_KEY, 'flyout.defaultviews.notifications.errorUpdating').replace('${id}', id));
        }
    };

    const handleError = (responseText, id) => {
        if (!responseText) {
            Messaging.error(Oskari.getMsg(BUNDLE_KEY, 'flyout.defaultviews.notifications.errorUpdating').replace('${id}', id));
            return;
        }
        try {
            const resp = JSON.parse(responseText);
            if (resp.info?.code === 'guest_not_available') {
                const layerNames = (resp.info.selectedLayers || []).map(layerId => {
                    const layer = sb.findMapLayerFromAllAvailable(layerId);
                    return layer ? Oskari.util.sanitize(layer.getName()) : `Layer ID ${layerId}`;
                });
                setWarning({ id, layerNames });
                return;
            }
        } catch (e) {}
        Messaging.error(Oskari.getMsg(BUNDLE_KEY, 'flyout.defaultviews.notifications.errorUpdating').replace('${id}', id));
    };

    const columns = [
        {
            dataIndex: 'name',
            title: <Message messageKey='flyout.defaultviews.headerName' />
        },
        {
            dataIndex: 'id',
            width: 180,
            render: (id) => (
                <Button onClick={() => modifyView(id)}>
                    <Message messageKey='flyout.defaultviews.setButton' />
                </Button>
            )
        }
    ];

    return (
        <>
            <Message messageKey='flyout.defaultviews.desc' />
            <Table
                loading={loading}
                dataSource={views}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
            />
            <Modal
                open={!!warning}
                title={<Message messageKey='flyout.defaultviews.notifications.warningTitle' />}
                onCancel={() => setWarning(null)}
                footer={[
                    <Button key="cancel" onClick={() => setWarning(null)}>
                        <Message messageKey="cancel" bundleKey="oskariui" />
                    </Button>,
                    <Button
                        key="force"
                        type="primary"
                        onClick={() => { modifyView(warning.id, true); setWarning(null); }}
                    >
                        <Message messageKey='flyout.defaultviews.forceButton' />
                    </Button>
                ]}
            >
                <Message messageKey='flyout.defaultviews.notifications.listTitle' />
                <List
                    size="small"
                    dataSource={warning?.layerNames || []}
                    renderItem={(name) => <ListItem>{name}</ListItem>}
                />
            </Modal>
        </>
    );
};