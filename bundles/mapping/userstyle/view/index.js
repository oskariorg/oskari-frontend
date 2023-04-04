import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { UserStyleEditor } from './UserStyles/UserStyleEditor';
import { UserStylesContent } from './UserStyles/UserStylesContent';
import { BUNDLE_KEY } from '../constants';
import { VECTOR_STYLE } from '../../mapmodule/domain/constants';

const getContent = (service, options, onClose) => {
    const { layerId, id, showEditor } = options;
    let content;
    if (showEditor) {
        const wasEditor = true;
        const style = service.getStyleById(id) || {};
        const onAdd = ({ name, featureStyle }) => {
            service.saveUserStyle({
                id,
                layerId: style.layerId || layerId,
                type: VECTOR_STYLE.OSKARI,
                name,
                style: { featureStyle }
            });
            onClose(wasEditor);
        };
        content = <UserStyleEditor style={ style } onAdd={ onAdd } onCancel={ () => onClose(wasEditor) }/>;
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

const getTitle = (options) => {
    const messageKey = options.showEditor ? 'popup.title' : 'title';
    return (
        <Message bundleKey={ BUNDLE_KEY } messageKey={messageKey} />
    );
};

export const showStylesPopup = (service, options = {}, onClose) => {
    const controls = showPopup(
        getTitle(options),
        getContent(service, options, onClose),
        onClose,
        { id: BUNDLE_KEY }
    );
    return {
        ...controls,
        update: (options) => {
            controls.update(getTitle(options), getContent(service, options, onClose));
        }
    };
};
