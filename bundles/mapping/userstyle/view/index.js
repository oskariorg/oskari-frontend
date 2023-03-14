import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { UserStyleEditor } from './UserStyles/UserStyleEditor';
import { UserStylesContent } from './UserStyles/UserStylesContent';
import { BUNDLE_KEY } from '../constants';
import { VECTOR_STYLE } from '../../mapmodule/domain/constants';

const showStyleEditor = (service, options) => typeof options.id !== 'undefined' || service.getStylesByLayer(options.layerId).length === 0;

const getContent = (service, options, onClose) => {
    const { layerId, id } = options;
    let content;
    if (showStyleEditor(service, options)) {
        const style = service.getStyleById(id) || {};
        const onAdd = ({ name, featureStyle }) => {
            service.saveUserStyle({
                id,
                layerId,
                type: VECTOR_STYLE.OSKARI,
                name,
                style: { featureStyle }
            });
            const hasStyles = service.getStylesByLayer(layerId).length > 0;
            if (hasStyles) {
                // toggle to style list view
                Oskari.getSandbox().postRequestByName('ShowUserStylesRequest', [{ layerId }]);
            } else {
                // style editor is opened on layerId request if no styles. so have to close here.
                onClose();
            }
        };
        content = <UserStyleEditor style={ style } onAdd={ onAdd } onCancel={ onClose }/>;
    } else {
        const styles = service.getStylesByLayer(layerId);
        const onDelete = (id) => service.removeUserStyle(id);
        content = <UserStylesContent layerId={ layerId } styles={ styles } onDelete={ onDelete } />;
    }
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            { content }
        </LocaleProvider>
    );
};

const getTitle = (service, options) => {
    const messageKey = showStyleEditor(service, options) ? 'popup.title' : 'title';
    return (
        <Message bundleKey={ BUNDLE_KEY } messageKey={messageKey} />
    );
};

export const showStylesPopup = (service, options = {}, onClose) => {
    const controls = showPopup(
        getTitle(service, options),
        getContent(service, options, onClose),
        onClose,
        { id: BUNDLE_KEY }
    );
    return {
        ...controls,
        update: (options = {}) => {
            controls.update(getTitle(service, options), getContent(service, options, onClose));
        }
    };
};
