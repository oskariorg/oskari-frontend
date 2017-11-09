Oskari.clazz.define("Oskari.mapping.printout2.components.preview",

    function ( instance ) {
        this.loc = instance._localization["BasicView"];
        this.instance = instance;
        this.previewPanel = null;
        this.previewImgDiv = null;
        this.progressSpinner = Oskari.clazz.create(
            'Oskari.userinterface.component.ProgressSpinner'
        );
    }, {      
        _templates: {
            preview: jQuery('<div class="preview"><img /><span></span></div>'),
            help: jQuery('<div class="help icon-info"></div>'),
            previewNotes: jQuery('<div class="previewNotes"><span></span></div>')
        },
        getElement: function () {
            return this.previewPanel;
        },
        setElement: function ( element ) {
            this.previewPanel = element;
        },
        createPreviewPanel: function () {
            var me = this,
                panel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel'
                );

            panel.setTitle(me.loc.preview.label);
            var contentPanel = panel.getContainer(),
                tooltipCont = me._templates.help.clone();

            tooltipCont.attr('title', me.loc.preview.tooltip);
            contentPanel.append(tooltipCont);

            var previewContent = me._templates.preview.clone();

            contentPanel.append(previewContent);

            /* progress */
            me.progressSpinner.insertTo(previewContent);

            var previewImgDiv = previewContent.find('img');
            previewImgDiv.click(function () {
                me.showFullScaleMapPreview();
            });
            var previewSpan = previewContent.find('span');

            me.previewContent = previewContent;
            me.previewImgDiv = previewImgDiv;
            me.previewSpan = previewSpan;
            var p;
            for (p in me.loc.preview.notes) {
                if (me.loc.preview.notes.hasOwnProperty(p)) {
                    var previewNotes = me._templates.previewNotes.clone();
                    previewNotes.find('span').text(me.loc.preview.notes[p]);
                    contentPanel.append(previewNotes);
                }
            }
            this.setElement( panel );
            return this.getElement();
        },
        /**
         * @private @method _cleanMapPreview
         */
        _cleanMapPreview: function () {
            var me = this,
                loc = me.loc,
                previewImgDiv = me.previewImgDiv,
                previewSpan = me.previewSpan;

            previewImgDiv.hide();
            previewSpan.text(loc.preview.pending);
        },

        /**
         * @private @method _updateMapPreview
         */
        _updateMapPreview: function () {
            var me = this,
                selections = me._gatherSelections('image/png'),
                urlBase = me.backendConfiguration.formatProducers[selections.format],
                maplinkArgs = selections.maplinkArgs,
                pageSizeArgs = '&pageSize=' + selections.pageSize,
                previewScaleArgs = '&scaledWidth=200',
                url = urlBase + maplinkArgs + pageSizeArgs + previewScaleArgs;

            me.previewContent.removeClass('preview-portrait');
            me.previewContent.removeClass('preview-landscape');
            me.previewContent.addClass(me.sizeOptionsMap[selections.pageSize].classForPreview);

            var previewImgDiv = me.previewImgDiv,
                previewSpan = me.previewSpan;

            me.progressSpinner.start();
            window.setTimeout(function () {
                previewImgDiv.imagesLoaded(function () {
                    previewSpan.text('');
                    previewImgDiv.fadeIn('slow', function () {
                        me.progressSpinner.stop();

                    });
                });
                previewImgDiv.attr('src', url);

            }, 100);
        },
    }, {

    });