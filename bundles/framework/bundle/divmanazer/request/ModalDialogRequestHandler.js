/*
 * @class  Oskari.userinterface.bundle.ui.request.ModalDialogRequestHandler
 */
Oskari
    .clazz
    .define('Oskari.userinterface.bundle.ui.request' +
        '.ModalDialogRequestHandler',
        function (ui) {
            "use strict";
            this._ui = ui;
            this._tpl = {};
            this._tpl.modal =
                jQuery('<div id="modaldialog" class="modaldialog">' +
                    '  <div class="modaltitle"></div>' +
                    '  <div class="modalmessage"></div>' +
                    '  <div class="modalbuttons"></div> ' +
                    '</div>');
            this._tpl.button =
                jQuery('<div class="modalbutton">' +
                    '<input type="button" /></input>' +
                    '</div>');
            this._buttons = {};
            this._args = {
                closeClass: 'modalclose',
                overlayId: 'modaloverlay',
                overlayCss: {
                    'background-color': 'lightgrey',
                    'cursor': 'wait'
                },
                containerId: 'modalcontainer',
                containerCss: {
                    'background-color': 'white'
                },
                onClose: function () {
                    this.close();
                },
                zIndex: 80130
            };
        }, {
            handleRequest: function (core, request) {
                "use strict";
                var tpl = this._tpl.modal.clone(),
                    btns,
                    buttondiv,
                    btn,
                    bcont,
                    button,
                    bidx;
                tpl.find('.modaltitle').append(request.getTitle());
                tpl.find('.modalmessage').append(request.getMessage());
                btns = request.getButtons();
                buttondiv = tpl.find('.modalbuttons');
                for (bidx in btns) {
                    if (btns.hasOwnProperty(bidx)) {
                        if (!btns[bidx].name) {
                            continue;
                        }
                        btn = btns[bidx];
                        bcont = this._tpl.button.clone();
                        button = bcont.find('input');
                        button.attr('name', btn.name);
                        button.attr('text', btn.text);
                        button.attr('value', btn.text);
                        button.bind('click', btn.onclick);
                        if (btn.close !== false) {
                            button.addClass(this._args.closeClass);
                        }
                        buttondiv.append(bcont);
                    }
                }
                if (request.onshow) {
                    this._args.onShow = request.onshow;
                }
                $.modal = tpl.modal(this._args);
            }
        }, {
            protocol: ['Oskari.mapframework.core.RequestHandler']
        }
        );
