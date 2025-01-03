import React from 'react';
import { showModal } from 'oskari-ui/components/window';
import { ValidationErrorMessage } from './dialog/ValidationErrorMessage';
import { ReplaceConfirmDialogContent } from './dialog/ReplaceConfirmDialogContent';
import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { GeneralInfoForm } from './form/GeneralInfoForm';
import { PanelGeneralInfoHandler } from '../handler/PanelGeneralInfoHandler';
import { MAP_SIZES, PanelMapPreviewHandler } from '../handler/PanelMapPreviewHandler';
import { MapPreviewForm, MapPreviewTooltip } from './form/MapPreviewForm';
import { mergeValues } from '../util/util';
import { PanelMapLayersHandler } from '../handler/PanelMapLayersHandler';
import { MapLayers } from './MapLayers/MapLayers';
import { PublisherToolsList } from './form/PublisherToolsList';
import { ToolPanelHandler } from '../handler/ToolPanelHandler';

export const PUBLISHER_BUNDLE_ID = 'Publisher2';
const PANEL_GENERAL_INFO_ID = 'panelGeneralInfo';
const PANEL_MAPPREVIEW_ID = 'panelMapPreview';
const PANEL_MAPLAYERS_ID = 'panelMapLayers';
const PANEL_MAPTOOLS_ID = 'panelMapTools';
const PANEL_RPC_ID = 'panelRpc';

class PublisherSidebarUIHandler extends StateHandler {
    constructor () {
        super();
        this.validationErrorMessageDialog = null;
        this.replaceConfirmDialog = null;
        this.state = {
            collapseItems: []
        };
    }

    init (data, publisherTools) {
        const layerTools = publisherTools.groups.layers;
        let mapTools = publisherTools.groups.tools;
        mapTools = mapTools ? [...mapTools] : [];
        mapTools = [...mapTools].sort((a, b) => a.index - b.index);

        const rpcTools = publisherTools.groups.rpc;
        this.generalInfoPanelHandler = new PanelGeneralInfoHandler();
        this.mapPreviewPanelHandler = new PanelMapPreviewHandler();
        this.mapLayersHandler = new PanelMapLayersHandler(layerTools, Oskari.getSandbox());
        this.mapToolsHandler = new ToolPanelHandler(mapTools);
        this.rpcPanelHandler = new ToolPanelHandler(rpcTools);

        /** general info - panel */
        this.generalInfoPanelHandler.init(data);
        this.generalInfoPanelHandler.addStateListener(() => this.updateGeneralInfoPanel());

        /** map preview - panel */
        this.mapPreviewPanelHandler.init(data);
        this.mapPreviewPanelHandler.addStateListener(() => this.updateMapPreviewPanel());

        /** map layers - panel */
        this.mapLayersHandler.init(data);
        this.mapLayersHandler.addStateListener(() => this.updateMapLayersPanel());

        /** map tools - panel */
        this.mapToolsHandler.init(data);
        this.mapToolsHandler.addStateListener(() => this.updateMapToolsPanel());

        this.rpcPanelHandler.init(data);
        this.rpcPanelHandler.addStateListener(() => this.updateRpcPanel());

        const collapseItems = [];
        collapseItems.push({
            key: PANEL_GENERAL_INFO_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.domain.title'),
            children: this.renderGeneralInfoPanel()
        });

        collapseItems.push({
            key: PANEL_MAPPREVIEW_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.size.label'),
            children: this.renderMapPreviewPanel()
        });

        collapseItems.push({
            key: PANEL_MAPLAYERS_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.mapLayers.label'),
            children: this.renderMapLayersPanel()
        });

        collapseItems.push({
            key: PANEL_MAPTOOLS_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.tools.label'),
            children: this.renderMapToolsPanel()
        });

        // RPC panel should be the last in line after all other (react collapsified) panels
        collapseItems.push({
            key: PANEL_RPC_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.rpc.label'),
            children: this.renderRpcPanel()
        });

        this.updateState({
            collapseItems
        });
    }

    /**
     * TODO: rethink/refactor the way jsx is rendered and updated
     * In the future we probably do not want to have jsx rendering in handler.
     * As for now, in development mode where we still hava jquery panels and react panels mixed, it's easiest
     * to do partial re-rendering this way (so we won't have to regenerate every panel from scratch each time a keystroke happens in name - field of generalinfo).
     */
    updateGeneralInfoPanel () {
        const newCollapseItems = this.getState().collapseItems.map(item => item);
        const generalInfoPanel = newCollapseItems.find(item => item.key === PANEL_GENERAL_INFO_ID);
        generalInfoPanel.children = this.renderGeneralInfoPanel();
        this.updateState({
            collapseItems: newCollapseItems
        });
    }

    renderGeneralInfoPanel () {
        return <div className={'t_generalInfo'}>
            <GeneralInfoForm
                onChange={(key, value) => this.generalInfoPanelHandler.getController().onChange(key, value)}
                data={this.generalInfoPanelHandler.getState()}
            />
        </div>;
    }

    updateMapPreviewPanel () {
        const newCollapseItems = this.getState().collapseItems.map(item => item);
        const panel = newCollapseItems.find(item => item.key === PANEL_MAPPREVIEW_ID);
        panel.children = this.renderMapPreviewPanel();
        this.updateState({
            collapseItems: newCollapseItems
        });
    }

    renderMapPreviewPanel () {
        return <div className={'t_size'}>
            <MapPreviewTooltip/>
            <MapPreviewForm
                onChange={(value) => { this.mapPreviewPanelHandler.getController().updateMapSize(value); }}
                mapSizeOptions={MAP_SIZES}
                initialSelection={this.mapPreviewPanelHandler.getController().getSelectedMapSize() || null}/>
        </div>;
    }

    updateMapLayersPanel () {
        const newCollapseItems = this.getState().collapseItems.map(item => item);
        const panel = newCollapseItems.find(item => item.key === PANEL_MAPLAYERS_ID);
        panel.children = this.renderMapLayersPanel();
        this.updateState({
            collapseItems: newCollapseItems
        });
    }

    renderMapLayersPanel () {
        return <div className={'t_layers'}>
            <MapLayers
                state={this.mapLayersHandler.getState()}
                controller={this.mapLayersHandler.getController()}
            />
        </div>;
    }

    updateMapToolsPanel () {
        const newCollapseItems = this.getState().collapseItems.map(item => item);
        const panel = newCollapseItems.find(item => item.key === PANEL_MAPTOOLS_ID);
        panel.children = this.renderMapToolsPanel();
        this.updateState({
            collapseItems: newCollapseItems
        });
    }

    renderMapToolsPanel () {
        return <div className={'t_tools t_maptools'}>
            <PublisherToolsList
                state={this.mapToolsHandler.getState()}
                controller={this.mapToolsHandler.getController()}
            />
        </div>;
    }

    updateRpcPanel () {
        const newCollapseItems = this.getState().collapseItems.map(item => item);
        const panel = newCollapseItems.find(item => item.key === PANEL_RPC_ID);
        panel.children = this.renderRpcPanel();
        this.updateState({
            collapseItems: newCollapseItems
        });
    }

    renderRpcPanel () {
        return <div className={'t_tools t_rpc'}>
            <PublisherToolsList
                state={this.rpcPanelHandler.getState()}
                controller={this.rpcPanelHandler.getController()}
            />
        </div>;
    }

    getCollapseItems () {
        const { collapseItems } = this.getState();
        return collapseItems;
    }

    getValues () {
        let returnValue = {};
        returnValue = mergeValues(returnValue, this.generalInfoPanelHandler.getValues());
        returnValue = mergeValues(returnValue, this.mapPreviewPanelHandler.getValues());
        return returnValue;
    }

    validate () {
        let errors = [];
        errors = errors.concat(this.generalInfoPanelHandler.validate());
        errors = errors.concat(this.mapPreviewPanelHandler.validate());
        return errors;
    }

    stop () {
        // TODO: stop individual panels that need stopping. Maybe put these into some array or smthng
        this.mapPreviewPanelHandler.stop();
        this.mapToolsHandler.stop();
    }

    /**
     * @private @method showValidationErrorMessage
     * Takes an error array as defined by Oskari.userinterface.component.FormInput validate() and
     * shows the errors on a  Oskari.userinterface.component.Popup
     *
     * @param {Object[]} errors validation error objects to show
     *
     */
    showValidationErrorMessage (errors = []) {
        const content = <ValidationErrorMessage errors={errors} closeCallback={() => this.closeValidationErrorMessage()}/>;
        this.validationErrorMessageDialog = showModal(Oskari.getMsg('Publisher2', 'BasicView.error.title'), content, () => {
            this.validationErrorMessageDialog = null;
        });
    };

    closeValidationErrorMessage () {
        if (this.validationErrorMessageDialog) {
            this.validationErrorMessageDialog.close();
            this.validationErrorMessageDialog = null;
        }
    }

    /**
     * @private @method showReplaceConfirm
     * Shows a confirm dialog for replacing published map
     *
     * @param {Function} continueCallback function to call if the user confirms
     *
     */
    showReplaceConfirm (continueCallback) {
        const content = <ReplaceConfirmDialogContent
            okCallback={() => {
                continueCallback();
                this.closeReplaceConfirm();
            }}
            closeCallback={() => this.closeReplaceConfirm()}/>;

        this.replaceConfirmDialog = showModal(Oskari.getMsg('Publisher2', 'BasicView.confirm.replace.title'), content);
    }

    closeReplaceConfirm () {
        if (this.replaceConfirmDialog) {
            this.replaceConfirmDialog.close();
            this.replaceConfirmDialog = null;
        }
    }
}

const wrapped = controllerMixin(PublisherSidebarUIHandler, [
    'showValidationErrorMessage',
    'closeValidationErrorMessage',
    'showReplaceConfirm',
    'closeReplaceConfirm',
    'validate',
    'getValues',
    'getCollapseItems',
    'stop'
]);

export { wrapped as PublisherSidebarHandler };
