import { Messaging } from 'oskari-ui/util';
import { AbstractPublisherTool } from '../../../framework/publisher2/tools/AbstractPublisherTool';
import { AnnouncementToolComponent } from './AnnouncementToolComponent';
import { AnnouncementsToolHandler } from './AnnouncementsToolHandler';

class AnnouncementsTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 160;
        this.group = 'reactTools';
        this.handler = new AnnouncementsToolHandler(this);

        this.sandbox = Oskari.getSandbox();
        this.lang = Oskari.getLang();
        this.localization = Oskari.getLocalization('admin-announcements');
        this.allowedLocations = ['top left', 'top center', 'top right'];
        this.lefthanded = 'top right';
        this.righthanded = 'top left';
    }

    init (data) {
        this.data = data;
        const selectedAnnouncements = [];
        this.noUI = data?.configuration?.announcements?.conf?.plugin?.config?.noUI === true;
        const service = this.sandbox.getService('Oskari.framework.announcements.service.AnnouncementsService');

        if (data?.configuration?.announcements?.conf?.plugin) {
            const enabled = data.configuration.announcements.conf.plugin.id === this.getTool()?.id;
            this.setEnabled(enabled);

            const location = data?.configuration?.announcements?.conf?.plugin?.config?.location?.classes;
            const plugin = this.getPlugin();
            if (plugin && location) {
                plugin.setLocation(location);
            }
        }

        service.fetchAnnouncements((err, data) => {
            if (err) {
                Messaging.error(this.localization.messages.getAdminAnnouncementsFailed);
                return;
            }
            const announcements = data;
            const toolPluginAnnouncementsConf = this.getToolPluginAnnouncementsConf();
            if (toolPluginAnnouncementsConf !== null) {
                this.getPlugin().updateAnnouncements(toolPluginAnnouncementsConf.config.announcements);
                toolPluginAnnouncementsConf.config.announcements.forEach(announcementId => {
                    const announcement = announcements.find(ann => ann.id === announcementId);
                    if (announcement !== undefined && this.isAnnouncementValid(announcement)) {
                        // make sure there are no duplicates
                        const alreadyAdded = selectedAnnouncements.some(ann => ann.id === announcement.id);
                        if (!alreadyAdded) {
                            selectedAnnouncements.push(announcement.id);
                        }
                    }
                });
            }

            this.handler.init({
                noUI: this.noUI,
                announcements,
                selectedAnnouncements
            });
        });
    }

    stop () {
        super.stop();
        this.handler.closePopup();
    }

    getTool () {
        return {
            id: 'Oskari.framework.announcements.plugin.AnnouncementsPlugin',
            title: Oskari.getMsg('admin-announcements', 'publisher.toolLabel'),
            config: this.state.pluginConfig
        };
    }

    getComponent () {
        return {
            component: AnnouncementToolComponent,
            handler: this.handler
        };
    }

    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues () {
        if (!this.isEnabled()) {
            return null;
        }

        const pluginConfig = { id: this.getTool().id, config: this.getPlugin().getConfig() };

        const { noUI, selectedAnnouncements } = this.handler.getState();
        if (noUI) {
            pluginConfig.config.noUI = noUI;
        }
        pluginConfig.config.announcements = selectedAnnouncements;

        return {
            configuration: {
                announcements: {
                    conf: {
                        plugin: pluginConfig
                    }
                }
            }
        };
    }

    /**
     * @private @method _getToolPluginAnnouncementsConf
     * @return {Object / null} config or null if not found
     */
    /*
    getToolPluginAnnouncementsConf () {
        const toolPlugin = !!this.data?.configuration?.announcements?.conf?.plugin || null;
        return toolPlugin;
    }
        */

    /**
     * @private @method _getToolPluginAnnouncementsConf
     * @return {Object / null} config or null if not found
     */
    getToolPluginAnnouncementsConf () {
        const isConfig = !!((this.data && this.data.configuration));
        const isPlugin = !!((isConfig && this.data?.configuration?.announcements?.conf?.plugin));
        let toolPlugin = null;
        if (isPlugin) {
            toolPlugin = this.data.configuration.announcements.conf.plugin;
        }
        return toolPlugin;
    }

    /**
     * Check if Announcement is inside the given timeframe
     * @method @private isAnnouncementValid
     * @param  {Object} announcement announcement
     * @return {Boolean} true if announcement is valid
     */
    isAnnouncementValid (announcement) {
        const announcementEnd = new Date(announcement.endDate);
        const currentDate = new Date();
        return currentDate.getTime() <= announcementEnd.getTime();
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.AnnouncementsTool',
    AnnouncementsTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { AnnouncementsTool };
