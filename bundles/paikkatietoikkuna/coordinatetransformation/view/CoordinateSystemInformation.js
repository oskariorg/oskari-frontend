Oskari.clazz.define('Oskari.coordinatetransformation.view.CoordinateSystemInformation', function (system) {
    this.system = system;
    this.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
}, {
    _template: {
        content: jQuery('<div class="oskari-coordinatesystem-info">' +
                        '<h4 class="info-description"></h4>' +
                        '<div class="info-content"></div>' +
                    '</div>'),
        list: jQuery('<ul class="info-list"></ul>'),
        listItem: jQuery('<li></li>'),
        paragraph: jQuery('<p></p>')
    },
    setElement: function (el) {
        this.element = el;
    },
    getElement: function () {
        return this.element;
    },
    show: function (parentElement, key, skipInfo) {
        if (this.dialog) {
            this.dialog.close(true);
            this.dialog = null;
        }
        var title = this._getTitle(key);
        var content = this._createContent(key, skipInfo);
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var btn = dialog.createCloseButton(this.loc('actions.close'));
        btn.addClass('primary');
        dialog.createCloseIcon();
        // dialog.dialog.zIndex(parentElement.zIndex() + 1);
        dialog.show(title, content, [btn]);
        dialog.moveTo(parentElement);
        dialog.makeDraggable();
        this.dialog = dialog;
    },
    _createContent: function (key, skipInfo) {
        var me = this;
        var content = this._template.content.clone();
        var infoLoc = this.loc('infoPopup')[key];
        content.find('.info-description').html(this.loc('infoPopup.description'));
        if (skipInfo !== true) {
            content.find('.info-content').html(infoLoc.info);
        }
        if (Array.isArray(infoLoc.paragraphs) && infoLoc.paragraphs.length !== 0) {
            infoLoc.paragraphs.forEach(function (item) {
                var paragraph = me._template.paragraph.clone();
                paragraph.text(item);
                content.append(paragraph);
            });
        }
        if (Array.isArray(infoLoc.listItems) && infoLoc.listItems.length !== 0) {
            content.find('.info-content').append(this._createList(infoLoc.listItems));
        }
        return content;
    },
    _createList: function (list) {
        var me = this;
        var listElem = this._template.list.clone();
        list.forEach(function (item) {
            var listItem = me._template.listItem.clone();
            listItem.html(item);
            listElem.append(listItem);
        });
        return listElem;
    },
    _getTitle: function (key) {
        return this.loc('infoPopup')[key].title;
    }
}, {
});
