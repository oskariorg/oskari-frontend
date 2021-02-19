import React from 'react';
import ReactDOM from 'react-dom';
import { Spin, LocalizationComponent, TextInput, Button, Message, Checkbox, Confirm } from 'oskari-ui';
import { LocaleProvider, handleBinder, StateHandler, controllerMixin, Controller, Messaging  } from 'oskari-ui/util';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const getMessage = (key, args) => <Message messageKey={key} messageArgs={args} bundleKey='admin-layereditor' />;

const ExtraFlyout = Oskari.clazz.get('Oskari.userinterface.extension.ExtraFlyout');

// NOTE: Everything is in the single file for demonstrating purposes.
export class LocalizingFlyout extends ExtraFlyout {
    constructor(instance, title, options = {}, deleteMapLayersText) {
        super(title, options);
        this.instance = instance;
        this.addClass('admin-localizing-flyout');
        this.mountPoint = document.createElement('div');
        this.setContent(this.mountPoint);
        this.deleteMapLayersText = deleteMapLayersText;

        // Create a handler for ui state.
        this.uiHandler = new UIHandler(instance, options.id, options.hasSubgroups);
        // Calling updateState will affect only the properties listed.
        this.uiHandler.updateState({ headerMessageKey: options.headerMessageKey });

        // Bind methods starting with 'on'.
        handleBinder(this, 'on');
        // Now they won't lose their context when called by something else than this LocalizingFlyout.
        this.on('show', this.onShow);
        this.on('hide', this.onHide);
        this.uiHandler.setCancelAction(this.onCancel);
        // State listener is called every time the state changes.
        // Here we are telling the UI to re render on state change, making the UI respond to user actions.
        this.uiHandler.addStateListener(this.onUpdate);
        this.id = options.id;
        this.layerCountInGroup = options.layerCountInGroup;
        this.hasSubgroups = options.hasSubgroups;
        // Fetch data from backend using given id and function if provided
        if (options.id && options.fetch) {
            options.fetch(options.id, this.setLoading.bind(this), this.uiHandler.setValue.bind(this.uiHandler));
        }
    }

    setSaveAction(action) {
        this.uiHandler.setSaveAction(action);
    }
    setDeleteAction(action) {
        this.uiHandler.setDeleteAction(action);
    }
    setLoading(loading) {
        this.uiHandler.updateState({ loading: !!loading });
    }
    onCancel() {
        this.hide();
    }
    onShow() {
        // The UI handler may provide functions that can be accessed outside React Elements.
        this.uiHandler.reset();
    }
    onHide() {
        ReactDOM.unmountComponentAtNode(this.mountPoint);
    }
    onUpdate() {
        // The UI handler itself should never be passed to a component.
        // Instead, the handler should provide a controller object, a subset of the handlers methods.
        // The controller should contain only methods the components require.
        const controller = this.uiHandler.getController();
        let ui = (
            <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                <LocalizedContent {...this.uiHandler.getState()}
                    controller={controller}
                    isNew={!this.id}
                    deleteMapLayersText={this.deleteMapLayersText}
                    layerCountInGroup={this.layerCountInGroup}
                    hasSubgroups={this.hasSubgroups} />
            </LocaleProvider>
        );
        ReactDOM.render(ui, this.mountPoint);
    }
}

// Create a service responsible of the UI state.
class UIService extends StateHandler {
    constructor(instance, id) {
        super();
        const getMsg = Oskari.getMsg.bind(null, instance.getName());
        const labels = {};
        Oskari.getSupportedLanguages().forEach(lang => {
            const locale = getMsg(`fields.locale.${lang}`);
            if (typeof locale === 'object') {
                labels[lang] = locale.lang || lang;
            } else {
                labels[lang] = lang;
            }
        });
        this.initialState = {
            loading: false,
            headerMessageKey: null,
            value: {},
            labels,
            deleteLayers: false,
            deleteGroups: false
        };
        this.setState(this.initialState);
        this.saveAction = null;
        this.cancelAction = null;
        this.id = id;
    }
    setSaveAction(saveAction) {
        this.saveAction = saveAction;
    }
    setCancelAction(cancelAction) {
        this.cancelAction = cancelAction;
    }
    setDeleteAction(deleteAction) {
        this.deleteAction = deleteAction;
    }
    setValue(value) {
        this.updateState({ value });
    }
    setDeleteLayers(value) {
        this.updateState({ deleteLayers: value });
    }
    save() {
        if (typeof this.saveAction !== 'function') {
            return;
        }
        const { value } = this.getState();
        this.updateState({ loading: true });
        this.saveAction(value, this.id);
    }
    cancel() {
        if (typeof this.cancelAction !== 'function') {
            return;
        }
        const { value } = this.getState();
        this.cancelAction(value);
    }
    delete() {
        if (typeof this.deleteAction !== 'function') {
            return;
        }
        this.deleteAction(this.id, this.getState().deleteLayers);
    }
    subgroupError() {
        Messaging.error(getMessage('messages.deleteErrorGroupHasSubgroups'));
    }
    reset() {
        this.setState(this.initialState);
    }
}

// Add getController function to the service. List which functions are available for the components.
// controllerMixin extends the service by adding getController function. The function returns a Controller object.
const UIHandler = controllerMixin(UIService, [
    'setValue',
    'save',
    'cancel',
    'delete',
    'setDeleteLayers',
    'subgroupError'
]);

// Creating the component
const Container = styled('div')`
    width: 100%;
    height: 100%;
`;
const Header = styled('div')`
    font-weight: bold;
`;
const Label = styled('div')`
    margin-top: 8px;
`;
const Buttons = styled('div')`
    display: flex;
    justify-content: space-between;
    padding-top: 15px;
`;

const DeleteLayersCheckbox = styled(Checkbox)`
    padding-top: 15px;
`;
const LocalizedContent = ({ loading, labels, value, headerMessageKey, controller, isNew, deleteMapLayersText, layerCountInGroup, deleteLayers, hasSubgroups }) => {
    const Component = (
        <Container>
            <Header>
                <Message messageKey={headerMessageKey} />
            </Header>
            <LocalizationComponent
                labels={labels}
                collapse={false}
                single={true}
                value={value}
                languages={Oskari.getSupportedLanguages()}
                onChange={controller.setValue}
                LabelComponent={Label}
            >
                <TextInput />
            </LocalizationComponent>
            <Buttons>
                <Button onClick={() => controller.cancel()}>
                    <Message messageKey='cancel' />
                </Button>
                {!isNew && !hasSubgroups ?
                    <DeleteButton
                        controller={controller}
                        deleteMapLayersText={deleteMapLayersText}
                        layerCountInGroup={layerCountInGroup}
                        deleteLayers={deleteLayers} />
                    : 
                    <Button onClick={() => controller.subgroupError()}>
                        <Message messageKey='delete' />
                    </Button>
                }
                <Button onClick={() => controller.save()} type='primary'>
                    <Message messageKey='save' />
                </Button>
            </Buttons>
        </Container>
    );
    if (loading) {
        return <Spin>{Component}</Spin>;
    }
    return Component;
};
LocalizedContent.propTypes = {
    loading: PropTypes.bool,
    labels: PropTypes.object,
    value: PropTypes.object,
    isNew: PropTypes.bool,
    headerMessageKey: PropTypes.string,
    controller: PropTypes.instanceOf(Controller)
};

const DeleteButton = ({ controller, deleteMapLayersText, layerCountInGroup, deleteLayers }) => {
    return (
    <Confirm
        title={<React.Fragment>
            <div>
                <Message messageKey='messages.confirmDeleteGroup' />
            </div>
            {layerCountInGroup > 0 &&
                <DeleteLayersCheckbox checked={deleteLayers} onChange={evt => controller.setDeleteLayers(evt.target.checked)}>
                    {deleteMapLayersText + ' (' + layerCountInGroup + ')'}
                </DeleteLayersCheckbox>
            }
        </React.Fragment>}
        onConfirm={() => controller.delete()}
        okText={<Message messageKey='ok' />}
        cancelText={<Message messageKey='cancel' />}
        placement='bottomLeft'>
        <Button>
            <Message messageKey='delete' />
        </Button>
    </Confirm>);
};
DeleteButton.propTypes = {
    deleteMapLayersText: PropTypes.string,
    layerCountInGroup: PropTypes.number,
    deleteLayers: PropTypes.bool,
    controller: PropTypes.instanceOf(Controller)
};
