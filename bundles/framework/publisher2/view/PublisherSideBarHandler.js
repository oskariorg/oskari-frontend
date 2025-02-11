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
import { LAYOUT_AVAILABLE_FONTS, PanelLayoutHandler } from '../handler/PanelLayoutHandler';
import { PanelToolStyles } from './PanelToolStyles';
import { ToolLayout } from './form/ToolLayout';
import { PanelToolLayoutHandler } from '../handler/PanelToolLayoutHandler';
import { Info } from 'oskari-ui/components/icons/Info';
import { StatsGridPanelHandler } from '../handler/StatsGridPanelHandler';

export const PUBLISHER_BUNDLE_ID = 'Publisher2';
const PANEL_GENERAL_INFO_ID = 'panelGeneralInfo';
const PANEL_MAPPREVIEW_ID = 'panelMapPreview';
const PANEL_MAPLAYERS_ID = 'panelMapLayers';
const PANEL_MAPTOOLS_ID = 'panelMapTools';
const PANEL_RPC_ID = 'panelRpc';
const PANEL_LAYOUT_ID = 'panelLayout';
const PANEL_TOOL_LAYOUT_ID = 'panelToolLayout';
const PANEL_STATSGRID_ID = 'panelStatsgrid';

class PublisherSidebarUIHandler extends StateHandler {
    constructor () {
        super();
        this.validationErrorMessageDialog = null;
        this.replaceConfirmDialog = null;
        this.state = {
            collapseItems: []
        };
        this.sandbox = Oskari.getSandbox();
    }

    init (data, publisherTools) {
        this.data = data;
        const layerTools = publisherTools.groups.layers;
        let mapTools = publisherTools.groups.tools;
        mapTools = mapTools ? [...mapTools] : [];
        mapTools = [...mapTools].sort((a, b) => a.index - b.index);
        const rpcTools = publisherTools.groups.rpc;
        this.statsgridTools = publisherTools.groups?.statsgrid || null;
        this.generalInfoPanelHandler = new PanelGeneralInfoHandler();
        this.mapPreviewPanelHandler = new PanelMapPreviewHandler();
        this.mapLayersHandler = new PanelMapLayersHandler(layerTools, this.sandbox);
        this.mapToolsHandler = new ToolPanelHandler(mapTools);
        this.layoutHandler = new PanelLayoutHandler();
        this.toolLayoutPanelHandler = new PanelToolLayoutHandler(publisherTools.tools);
        this.statsGridPanelHandler = new StatsGridPanelHandler(this.statsgridTools, this.sandbox, (visible) => this.toggleStatsGridPanel(visible));
        // we need this state listener set exactly once regardless if the panel is visible at first or not since it might become visible later
        const showStatsGridPanel = this.statsGridPanelHandler.init(data);
        this.statsGridPanelHandler.addStateListener((params) => {
            this.updateStatsgridPanel();
        });

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

        this.layoutHandler.init(data);
        this.layoutHandler.addStateListener(() => this.updateLayoutPanel());

        this.toolLayoutPanelHandler.init(data);
        this.toolLayoutPanelHandler.addStateListener(() => this.updateToolLayoutPanel());

        const collapseItems = [];
        collapseItems.push({
            key: PANEL_GENERAL_INFO_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.domain.title'),
            children: this.renderGeneralInfoPanel()
        });

        collapseItems.push({
            key: PANEL_MAPPREVIEW_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.size.label'),
            children: this.renderMapPreviewPanel(),
            extra: <MapPreviewTooltip/>
        });

        collapseItems.push({
            key: PANEL_MAPLAYERS_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.mapLayers.label'),
            children: this.renderMapLayersPanel()
        });

        collapseItems.push({
            key: PANEL_MAPTOOLS_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.tools.label'),
            children: this.renderMapToolsPanel(),
            extra: <Info title={Oskari.getMsg('Publisher2', 'BasicView.maptools.tooltip')}/>
        });

        collapseItems.push({
            key: PANEL_LAYOUT_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.layout.label'),
            children: this.renderLayoutPanel()
        });

        collapseItems.push({
            key: PANEL_TOOL_LAYOUT_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.toollayout.label'),
            children: this.renderToolLayoutPanel(),
            extra: <Info title={Oskari.getMsg('Publisher2', 'BasicView.domain.title')}/>
        });

        // RPC panel should be the last in line after all other (react collapsified) panels
        if (rpcTools && rpcTools.length) {
            this.rpcPanelHandler = new ToolPanelHandler(rpcTools);
            this.rpcPanelHandler.init(data);
            this.rpcPanelHandler.addStateListener(() => this.updateRpcPanel());
            collapseItems.push({
                key: PANEL_RPC_ID,
                label: Oskari.getMsg('Publisher2', 'BasicView.rpc.label'),
                children: this.renderRpcPanel(),
                extra: <Info title={Oskari.getMsg('Publisher2', 'BasicView.rpc.info')}/>

            });
        }

        if (showStatsGridPanel) {
            collapseItems.push(this.getStatsGridPanelItem());
        }

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
                onChange={(key, value) => this.generalInfoPanelHandler.onChange(key, value)}
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
            <MapPreviewForm
                onChange={(value) => { this.mapPreviewPanelHandler.updateMapSize(value); }}
                mapSizeOptions={MAP_SIZES}
                initialSelection={this.mapPreviewPanelHandler.getSelectedMapSize() || null}/>
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

    updateLayoutPanel () {
        const newCollapseItems = this.getState().collapseItems.map(item => item);
        const panel = newCollapseItems.find(item => item.key === PANEL_LAYOUT_ID);
        panel.children = this.renderLayoutPanel();
        this.updateState({
            collapseItems: newCollapseItems
        });
    }

    renderLayoutPanel () {
        const { theme, infoBoxPreviewVisible } = this.layoutHandler.getState();
        return <div className={'t_style'}>
            <PanelToolStyles
                mapTheme={theme}
                changeTheme={(theme) => this.layoutHandler.updateTheme(theme)}
                fonts={LAYOUT_AVAILABLE_FONTS}
                infoBoxPreviewVisible={infoBoxPreviewVisible}
                updateInfoBoxPreviewVisible={(isOpen) => this.layoutHandler.updateInfoBoxPreviewVisible(isOpen)}
            />
        </div>;
    }

    updateToolLayoutPanel () {
        const newCollapseItems = this.getState().collapseItems.map(item => item);
        const panel = newCollapseItems.find(item => item.key === PANEL_TOOL_LAYOUT_ID);
        panel.children = this.renderToolLayoutPanel();
        this.updateState({
            collapseItems: newCollapseItems
        });
    }

    renderToolLayoutPanel () {
        return <div className={'t_toollayout'}>
            <ToolLayout
                onSwitch={() => this.toolLayoutPanelHandler.switchControlSides()}
                isEdit={this.toolLayoutPanelHandler.getToolLayoutEditMode()}
                onEditMode={(isEdit) => {
                    if (isEdit) {
                        this.toolLayoutPanelHandler.editToolLayoutOn();
                    } else {
                        // remove edit mode
                        this.toolLayoutPanelHandler.editToolLayoutOff();
                    }
                }}/>
        </div>;
    }

    getStatsGridPanelItem () {
        return {
            key: PANEL_STATSGRID_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.statsgrid.label'),
            children: this.renderStatsGridPanel()
        };
    }

    toggleStatsGridPanel (visible) {
        const newCollapseItems = this.getState().collapseItems
            .filter(item => item.key !== PANEL_STATSGRID_ID);

        if (visible) {
            // this is empty when thematic maps was off by default. We gotta gather these tools somehow
            const hasTools = this.statsGridPanelHandler.initTools();
            if (hasTools) {
                const statsGridPanelItem = this.getStatsGridPanelItem();
                newCollapseItems.push(statsGridPanelItem);
            }
        }

        this.updateState({
            collapseItems: newCollapseItems
        });
    }

    updateStatsgridPanel () {
        const newCollapseItems = this.getState().collapseItems.map(item => item);
        const panel = newCollapseItems.find(item => item.key === PANEL_STATSGRID_ID);

        if (!panel) {
            return;
        }
        panel.children = this.renderStatsGridPanel();
        this.updateState({
            collapseItems: newCollapseItems
        });
    }

    renderStatsGridPanel () {
        return <div className={'t_tools t_statsgrid'}>
            <PublisherToolsList
                state={this.statsGridPanelHandler.getState()}
                controller={this.statsGridPanelHandler.getController()}
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
        returnValue = mergeValues(returnValue, this.toolLayoutPanelHandler.getValues());
        returnValue = mergeValues(returnValue, this.layoutHandler.getValues());
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
        this.mapLayersHandler.stop();
        this.mapToolsHandler.stop();
        this.layoutHandler.stop();
        this.toolLayoutPanelHandler.stop();
        if (this.statsGridPanelHandler) {
            this.statsGridPanelHandler.stop();
        }
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
