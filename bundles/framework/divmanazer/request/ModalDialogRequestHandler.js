/*
 * @class  Oskari.userinterface.bundle.ui.request.ModalDialogRequestHandler
 */
Oskari
    .clazz
    .define('Oskari.userinterface.bundle.ui.request' +
        '.ModalDialogRequestHandler',
        function (ui) {
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
                var tpl = this._tpl.modal.clone();
                tpl.find('.modaltitle').append(request.getTitle());
                tpl.find('.modalmessage').append(request.getMessage());
                var btns = request.getButtons();
                var buttondiv = tpl.find('.modalbuttons');
                for (var bidx in btns) {
                    if (!btns[bidx].name) {
                        continue;
                    }
                    var btn = btns[bidx];
                    var bcont = this._tpl.button.clone();
                    var button = bcont.find('input');
                    button.attr('name', btn.name);
                    button.attr('text', btn.text);
                    button.attr('value', btn.text);
                    button.bind('click', btn.onclick);
                    if (btn.close !== false) {
                        button.addClass(this._args.closeClass);
                    }
                    buttondiv.append(bcont);
                }
                if (request.onshow) {
                    this._args.onShow = onshow;
                }
                $.modal = tpl.modal(this._args);
            }
        }, {
            protocol: ['Oskari.mapframework.core.RequestHandler']
        }
);
