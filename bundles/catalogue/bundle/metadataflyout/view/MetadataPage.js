/**
 * @class Oskari.catalogue.bundle.metadataflyout.view.MetadataPage
 *
 *
 * This hosts metadata content loaded via ajax from
 * Geonetwork
 *
 * Embeds preformatted (unstyled) tables of metadata information.
 *
 * Style will be forced with CLASS manipulation ?
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.view.MetadataPage',

    /**
     * @method create called automatically on construction
     * @static
     *
     * Always extend this class, never use as is.
     */
    function (instance, locale) {

        /* @property instance bundle instance */
        this.instance = instance;

        /* @property locale locale for this */
        this.locale = locale;

        /* element references */
        this._tabs = {};
        this._browseGraphicUrl = null;

        /**
         * @property state
         */
        this.state = null;

        this._initialContentState = {
            title: '…',
            metadata: {
                uuid: null,
                RS_Identifier_Code: null,
                RS_Identifier_CodeSpace: null
            },
            view: 'abstract',
            metadataJson: null
        };

        /**
         * @property contentState
         * what is shown and how
         */
         this._contentState = jQuery.extend({}, this._initialContentState);

        /**
         * @property _tabContainer {Oskari.userinterface.component.TabContainer}
         */
        this._tabContainer = null;

    }, {
        /**
         * @property template HTML templates for the User Interface
         * @static
         */
        templates: {
            browseGraphic: '<div class="browseGraphic"></div>'
        },

        _views: ['abstract', 'jhs', 'inspire'],
        _links: ['xml', 'pdf'],

        init: function () {
            var me = this,
                links,
                locale = me.locale,
                entry,
                tabContainerHeader;

            /* Tab container */
            me._tabContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');
            me._tabContainer.insertTo(me.getContainer());
            me._tabContainer.addTabChangeListener(
                function (previousTab, newTab) {
                    me.showMetadataView(newTab.viewId);
                }
            );

            /* let's create view selector tabs */
            me._views.forEach(function (view) {
                entry = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
                entry.setTitle(locale[view]);
                entry.viewId = view;
                me._tabContainer.addPanel(entry);
                me._tabs[view] = entry;
            });

            // FIXME just use a href...
            var linkClick = function () {
                me.openMetadataView(jQuery(this).attr('data-type'));
            };

            me._links.forEach(function (link) {
                entry = jQuery('<a />');
                entry.html(locale[link]);
                entry.attr('data-type', link);
                entry.attr('href', '#');
                entry.click(linkClick);
                if (links) {
                    links = links.add(entry);
                } else {
                    links = entry;
                }
            });

            me._tabContainer.setExtra(links);

            me.setTitle(this._contentState.title);
        },

        setState: function (state) {
            this.state = state;
        },

        /**
         * @method openMetadataView
         *
         * opens a view in new window. this will not change state.
         */
        openMetadataView: function (viewId, target) {
            var me = this,
                metadata;
            if (!me._contentState) {
                return;
            }
            metadata = me._contentState.metadata;

            this.instance.getLoader().openMetadata(
                viewId,
                metadata.uuid,
                metadata.RS_Identifier_Code,
                metadata.RS_Identifier_CodeSpace,
                function () {},
                null,
                target
            );
        },

        /**
         * @method showMetadataView
         *
         * shows metadata subset view. this changes state.
         */
        showMetadataView: function (viewId, target) {
            this.instance.getSandbox().printDebug('ShowMetadataView ' + viewId);
            this._contentState.view = viewId;
            this._loadMetadataForState();
        },

        /**
         * @method _loadMetadataForState
         * @private
         */
        _loadMetadataForState: function () {
            var me = this;

            if (!me._contentState || !me._contentState.metadata ||
                    !me._contentState.metadata.uuid) {
                return false;
            }

            var viewId = me._contentState.view,
                metadata = me._contentState.metadata;

            // FIXME add error handling
            function handler(request) {
                console.log(request);
                /* We'll have to process the text to enhance readability */
                /* We cannot modify the source */
                var newContent;
                if (request.status === 200) {
                    newContent = me._getFormattedContent(request.responseText);
                } else {
                    newContent = me._getErrorContent();
                }

                me._tabs[viewId].setContent(jQuery(me.templates.browseGraphic));
                me._tabs[viewId].getContainer().append(newContent);
                me._resetBrowseGraphic(me._browseGraphicUrl);
                me._updatePanelTitle();
            }

            me.instance.getLoader().loadGeonetworkAjaxHTML(
                handler,
                viewId,
                metadata.uuid,
                metadata.RS_Identifier_Code,
                metadata.RS_Identifier_CodeSpace
            );

        },

        _getFormattedContent: function (content) {
            var newContent = jQuery('<div />');
            newContent.html(content);

            /* Let's split at .\n to DIVs */

            jQuery.each(newContent.find('td.metadataContent'), function (n, p) {

                var part = jQuery(p),
                    parent = part.parent();
                /*parent.remove(part);*/

                var newContainerPart = jQuery('<td class="metadataContent"/>');

                /* hack to fix ultraloooong URLs */
                if (part.hasClass('MD_DigitalTransferOptions')) {
                    newContainerPart.addClass('MD_DigitalTransferOptions');
                }

                var partSplice = part.text().split('.\n');
                jQuery.each(partSplice, function (nn, txtPart) {

                    var trimmed = jQuery.trim(txtPart);
                    if (trimmed.length === 0) {
                        return;
                    }

                    var newPart = jQuery('<div class="metadataflyout_content_section"/>');
                    if (partSplice.length > 1) {
                        newPart.text(trimmed + '.');
                    } else {
                        newPart.text(trimmed);
                    }
                    newContainerPart.append(newPart);
                });
                part.remove();
                parent.append(newContainerPart);
                me._linkify(newContainerPart);
            });
            /* Let's fix HREFs to click events */
            /* We cannot modify the source */

            var links = newContent.find('a[href]'),
                isMetaLink = new RegExp('^\\?.*');

            jQuery.each(links, function (index, ahref) {
                var el = jQuery(ahref),
                    href = el.attr('href');

                if (!href) {
                    return;
                }
                if (!isMetaLink.test(href)) {
                    return;
                }

                var splits = href.split('&'),
                    argMap = {};
                jQuery.each(splits, function (index, part) {
                    var keyVal = part.split('=');
                    argMap[keyVal[0]] = keyVal[1];
                });

                el.attr('href', null);
                el.click({
                    viewId: viewId,
                    uuid: argMap.uuid
                }, function (arg) {
                    var data = arg.data,
                        uuid = data.uuid;
                    me.showMetadata(uuid);
                });
            });
            return newContent;
        },

        _getErrorContent: function (error) {
            var newContent = jQuery('<div />');
            newContent.html(this.locale.notFound);
            return newContent;
        },

        _resetBrowseGraphic: function (url) {
            var bgEl,
                imgEl = jQuery('<img />');

            if (!url) {
                this._browseGraphicUrl = null;
            }

            imgEl.attr('src', url);

            this.getContainer().find('.browseGraphic').each(function () {
                bgEl = jQuery(this);
                bgEl.empty();
                if (url) {
                    bgEl.append(imgEl.clone());
                }
            });
        },

        /**
         * @method processJSON
         */
        processJSON: function (metadataJson) {
            var me = this,
                browseGraphicUrl = metadataJson.browseGraphic,
                extentEnvelope = metadataJson.env;
            
            // Remove old images
            me._resetBrowseGraphic();

            if (browseGraphicUrl) {
                var imgObj = new Image(),
                    url = null;
                // TODO remove dev code
                if (me.instance.getLoader().dev) {
                    url = 'espoo_johtokartta_s.png';
                } else {
                    url = browseGraphicUrl;
                }

                /* DEBUG CODE */
                url = '/Oskari/resources/framework/bundle/mapmodule-plugin/plugin/logo/images/pti_icon.png';
                /* DEBUG CODE */

                // Add new image once it has loaded (apparently this is done so we don't show broken images)
                imgObj.onload = function () {
                    me._browseGraphicUrl = url;
                    me._resetBrowseGraphic(url);
                    imgObj.onload = null;
                };
                imgObj.src = url;
            }

            /*
             * Let's post Envelope to some layer
             */
            if (extentEnvelope) {
                me.instance.showExtentOnMap(
                    me._contentState.metadata.uuid,
                    extentEnvelope,
                    metadataJson
                );
            }

            me._contentState.metadataJson = metadataJson;
            me._updatePanelTitle();
        },

        _updatePanelTitle: function () {
            var me = this,
                metadataJson = me._contentState.metadataJson,
                title;
            if (!metadataJson) {
                return;
            }
            title = metadataJson.title;
            if (title) {
                me.setTitle(title);
            }
        },

        /**
         * @method loadMetadataJSONForState
         */
        loadMetadataJSONForState: function () {
            var me = this,
                metadata;
            if (!me._contentState || !me._contentState.metadata ||
                    !me._contentState.metadata.uuid) {
                return false;
            }
            metadata = me._contentState.metadata;

            me.instance.getLoader().loadMetadata(
                'json',
                metadata.uuid,
                metadata.RS_Identifier_Code,
                metadata.RS_Identifier_CodeSpace,
                function (data) {
                    if (!data || !data.mdcs || !data.mdcs.length ||
                            data.mdcs.length === 0) {
                        return;
                    }
                    var metadataJson = data.mdcs[0];
                    me.processJSON(metadataJson);
                },
                'json'
            );
            return true;
        },

        /**
         * @method showMetadata
         *
         * Launches Ajax requestst to embed metadata descriptions
         * for requested metadata
         *
         * Backend provides HTML setups that will be embedded and
         * styled with bundled CSS.
         */
        showMetadata: function (uuid, RS_Identifier_Code, RS_Identifier_CodeSpace) {
            // Reset _contentState
            this._contentState = jQuery.extend({}, this._initialContentState);
            this._contentState.metadata.uuid = uuid;
            this._contentState.metadata.RS_Identifier_Code = RS_Identifier_Code;
            this._contentState.metadata.RS_Identifier_CodeSpace = RS_Identifier_CodeSpace;
            this.instance.getSandbox().printDebug('showMetadata { uuid=' + uuid + ', view=' + this._contentState.view + '}');
            this.loadMetadataJSONForState();
            this.showMetadataView(this._contentState.view);
        },

        /**
         * @method scheduleShowMetadata
         *
         * this 'schedules' asyncronous loading
         * ( calls directly now )
         * Used to buffer excess calls
         *
         */
        scheduleShowMetadata: function (uuid, RS_Identifier_Code, RS_Identifier_CodeSpace) {
            this.showMetadata(uuid, RS_Identifier_Code, RS_Identifier_CodeSpace);
        },

        /**
         * _linkify:
         *
         * slightly modified  http://code.google.com/p/jquery-linkify/
         *
         */
        _linkify: function (el) {
            var inputText = el.html();

            //URLs starting with http://, https://, or ftp://
            var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,
                replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

            //URLs starting with www. (without // before it, or it'd re-link the ones done above)
            var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
            replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

            //Change email addresses to mailto:: links
            //var replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
            //replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

            el.html(replacedText);
        },

        /**
         * @method destroy
         * Destroys the panel/removes it from document
         */
        destroy: function () {
            this._tabContainer.destroy();
            this.html.remove();
        }
    }, {
        extend: ['Oskari.userinterface.component.AccordionPanel']
    });
