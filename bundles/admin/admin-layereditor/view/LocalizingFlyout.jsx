import React from 'react';
import ReactDOM from 'react-dom';
import { Spin, LocalizationComponent, TextInput, Button, Message } from 'oskari-ui';
import { LocaleContext, handleBinder, StateHandler, mutatorMixin, Mutator } from 'oskari-ui/util';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ExtraFlyout = Oskari.clazz.get('Oskari.userinterface.extension.ExtraFlyout');

// NOTE: Everything is in the single file for demonstrating purposes.
export class LocalizingFlyout extends ExtraFlyout {
    constructor (instance, title, options = {}) {
        super(title, options);
        this.instance = instance;
        this.addClass('admin-localizing-flyout');
        this.mountPoint = document.createElement('div');
        this.setContent(this.mountPoint);

        // Create a handler for ui state.
        this.uiHandler = new UIHandler(instance);
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
    }
    setSaveAction (action) {
        this.uiHandler.setSaveAction(action);
    }
    setLoading (loading) {
        this.uiHandler.updateState({ loading: !!loading });
    }
    onCancel () {
        this.hide();
    }
    onShow () {
        // The UI handler may provide functions that can be accessed outside React Elements.
        this.uiHandler.reset();
    }
    onHide () {
        ReactDOM.unmountComponentAtNode(this.mountPoint);
    }
    onUpdate () {
        // The UI handler itself should never be passed to a component.
        // Instead, the handler should provide a mutator object, a subset of the handlers methods.
        // The mutator should contain only methods the components require.
        const mutator = this.uiHandler.getMutator();
        let ui = (
            <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                <LocalizedContent { ...this.uiHandler.getState() } mutator={mutator}/>
            </LocaleProvider>
        );
        ReactDOM.render(ui, this.mountPoint);
    }
}

// Create a service responsible of the UI state.
class UIService extends StateHandler {
    constructor (instance) {
        super();
        const getMsg = Oskari.getMsg.bind(null, instance.getName());
        const labels = {};
        Oskari.getSupportedLanguages().forEach(lang => {
            labels[lang] = getMsg(`${lang}.lang`);
        });
        this.setState({
            loading: false,
            headerMessageKey: null,
            value: {},
            labels
        });
        this.saveAction = null;
        this.cancelAction = null;
    }
    setSaveAction (saveAction) {
        this.saveAction = saveAction;
    }
    setCancelAction (cancelAction) {
        this.cancelAction = cancelAction;
    }
    setValue (value) {
        this.updateState({ value });
    }
    save () {
        if (typeof this.saveAction !== 'function') {
            return;
        }
        const { value } = this.getState();
        this.updateState({ loading: true });
        this.saveAction(value);
    }
    cancel () {
        if (typeof this.cancelAction !== 'function') {
            return;
        }
        const { value } = this.getState();
        this.cancelAction(value);
    }
    reset () {
        this.updateState({
            loading: false,
            value: {}
        });
    }
}

// Add getMutator function to the service. List which functions are available for the components.
// mutatorMixin extends the service by adding getMutator function. The function returns a Mutator object.
const UIHandler = mutatorMixin(UIService, [
    'setValue',
    'save',
    'cancel'
]);

// Creating the component
const Container = styled('div')`
    width: 180px;
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

const LocalizedContent = ({ loading, labels, value, headerMessageKey, mutator }) => {
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
                onChange={mutator.setValue}
                LabelComponent={Label}
            >
                <TextInput />
            </LocalizationComponent>
            <Buttons>
                <Button onClick={() => mutator.cancel()}>
                    <Message messageKey='cancel'/>
                </Button>
                <Button onClick={() => mutator.save()} type='primary'>
                    <Message messageKey='save'/>
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
    headerMessageKey: PropTypes.string,
    mutator: PropTypes.instanceOf(Mutator)
};
