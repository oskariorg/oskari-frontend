import queryString from 'query-string';
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
        // Some default values are for storybook testing
        this.layer = {
            layer_id: layer ? layer.getId() : null,
            layerUrl: layer && layer.admin ? layer.admin.url : '',
            username: layer && layer.admin ? layer.admin.username : '',
            password: layer && layer.admin ? layer.admin.password : '',
            layerName: layer ? layer.getLayerName() : '',
            name_fi: layer ? layer.getName('fi') : '',
            name_en: layer ? layer.getName('en') : '',
            name_sv: layer ? layer.getName('sv') : '',
            dataProvider: layer ? layer.getOrganizationName() : '',
            groups: layer ? layer.getGroups() : [],
            opacity: layer ? layer.getOpacity() : 100,
            minScale: layer ? layer.getMinScale() : 1,
            maxScale: layer ? layer.getMaxScale() : 725670,
            styles: layer ? layer.getStyles() : [],
            defaultStyle: layer ? layer.getCurrentStyle() : '',
            styleJSON: '', // TODO
            hoverJSON: '', // TODO
            metadataIdentifier: layer ? layer.getMetadataIdentifier() : '',
            gfiContent: layer ? layer.getGfiContent() : '',
            attributes: '' // TODO
        };
    }

    getCookie (cname) {
        var name = cname + '=';
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        var result = ca.map(function (cook) {
            return cook.trim();
        }).filter(function (cook) {
            return cook.indexOf(name) === 0;
        }).map(function (cook) {
            return cook.substring(name.length, cook.length);
        });
        if (result.length > 0) {
            return result[0];
        }
    }

    saveLayer () {
        // TODO check fields
        const layer = this.getLayer();
        fetch(Oskari.urls.getRoute('SaveLayer'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-XSRF-TOKEN': this.getCookie('XSRF-TOKEN')
            },
            body: queryString.stringify(layer)
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

    getDummyDataProviders () {
        return [
            {id: 1, name: {fi: 'Taustakartat'}},
            {id: 4, name: {fi: 'Museovirasto'}},
            {id: 5, name: {fi: 'Geologian tutkimuskeskus'}}
        ];
    }

    getDummyLayerGroups () {
        return [
            {id: 1, name: {fi: 'Paikannimet'}},
            {id: 2, name: {fi: 'Hallinnolliset yksiköt'}},
            {id: 3, name: {fi: 'Osoitteet'}}
        ];
    }
}
