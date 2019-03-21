export class AdminLayerFormService {
    constructor (consumer) {
        this.layer = {};
        this.listeners = [consumer];
    }
    getDataProviders () {
        return fetch(Oskari.urls.getRoute('GetMapLayerGroups')).then(
            response => response.json()
        );
    }

    getLayerGroups () {
        return fetch(Oskari.urls.getRoute('GetHierarchicalMapLayerGroups')).then(
            response => response.json()
        );
    }
    fetchAsyncData () {
        return Promise.all([this.getDataProviders(), this.getLayerGroups()]);
    }

    getMutator () {
        const me = this;
        return {
            setLayerUrl (url) {
                me.layer.layerUrl = url;
                me.notify();
            },
            setUsername (username) {
                me.layer.username = username;
                me.notify();
            },
            setPassword (password) {
                me.layer.password = password;
                me.notify();
            },
            setLayerName (layerName) {
                me.layer.layerName = layerName;
                me.notify();
            },
            setLayerNameInFinnish (nameFi) {
                me.layer.name_fi = nameFi;
                me.notify();
            },
            setLayerNameInEnglish (layerNameInEnglish) {
                me.layer.name_en = layerNameInEnglish;
                me.notify();
            },
            setLayerNameInSwedish (layerNameInSwedish) {
                me.layer.name_sv = layerNameInSwedish;
                me.notify();
            },
            setDataProvider (dataProvider) {
                me.layer.dataProvider = dataProvider;
                me.notify();
            },
            setMapLayerGroup (checked, id) {
                const allGroups = me.layer.allGroups;
                const groups = me.layer.groups;
                // TODO this could be better
                if (checked) {
                    for (let i = 0; i < allGroups.length; i++) {
                        if (allGroups[i].id === id) {
                            me.layer.groups.push({id: id, name: allGroups[i].name['fi']}); // TODO get language
                        }
                    }
                } else {
                    for (let i = 0; i < groups.length; i++) {
                        if (groups[i].id === id) {
                            groups.splice(i, 1);
                        }
                    }
                }
                me.notify();
            },
            setAllMapLayerGroups (groups) {
                me.layer.allGroups = groups;
            },
            setOpacity (opacity) {
                me.layer.opacity = opacity;
                me.notify();
            },
            setMinAndMaxScale (values) {
                me.layer.minScale = values[0];
                me.layer.maxScale = values[1];
                me.notify();
            },
            setDefaultStyle (defaultStyle) {
                me.layer.style = defaultStyle;
                me.notify();
            },
            setStyleJSON (styleJSON) {
                me.layer.styleJSON = styleJSON;
                me.notify();
            },
            setHoverJSON (hoverJSON) {
                me.layer.hoverJSON = hoverJSON;
                me.notify();
            },
            setMetadataIdentifier (metadataIdentifier) {
                me.layer.metadataIdentifier = metadataIdentifier;
                me.notify();
            },
            setGfiContent (gfiContent) {
                me.layer.gfiContent = gfiContent;
                me.notify();
            },
            setAttributes (attributes) {
                me.layer.attributes = attributes;
                me.notify();
            }
        };
    }

    initLayerState (layer) {
        this.layer = {
            layerUrl: layer.admin ? layer.admin.url : '',
            username: layer.admin ? layer.admin.username : '',
            password: layer.admin ? layer.admin.password : '',
            layerName: layer ? layer.getLayerName() : '',
            name_fi: layer ? layer.getName('fi') : '',
            name_en: layer ? layer.getName('en') : '',
            name_sv: layer ? layer.getName('sv') : '',
            dataProvider: layer ? layer.getOrganizationName() : '',
            groups: layer ? layer.getGroups() : [],
            opacity: layer ? layer.getOpacity() : '',
            minScale: layer ? layer.getMinScale() : '',
            maxScale: layer ? layer.getMaxScale() : '',
            styles: layer ? layer.getStyles() : [],
            defaultStyle: layer ? layer.getCurrentStyle() : '',
            styleJSON: '', // TODO
            hoverJSON: '', // TODO
            metadataIdentifier: layer ? layer.getMetadataIdentifier() : '',
            gfiContent: layer ? layer.getGfiContent() : '',
            attributes: 'Attributes'
        };
    }

    saveLayer (layer) {
        fetch(Oskari.urls.getRoute('SaveLayer'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(layer)
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data);
        });
    }

    addListener (consumer) {
        this.listeners.push(consumer);
    }
    getLayer () {
        return {...this.layer};
    }
    notify () {
        this.listeners.forEach(consumer => consumer());
    }
}
