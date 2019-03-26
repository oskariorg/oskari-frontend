import queryString from 'query-string';
export class AdminLayerFormService {
    constructor (consumer) {
        this.layer = {};
        this.message = {};
        this.listeners = [consumer];
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
                me.layer.groupId = dataProvider;
                me.notify();
            },
            setMapLayerGroup (checked, id) {
                const allGroups = me.layer.allGroups;
                for (let i = 0; i < allGroups.length; i++) {
                    if (allGroups[i].id === id) {
                        allGroups[i].checked = checked;
                    }
                }
                me.layer.maplayerGroups = me.formatGroupListForBackend(allGroups);
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
            setStyle (style) {
                me.layer.style = style;
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
            },
            setMessage (text, type) {
                me.message = {
                    text: text,
                    type: type
                };
            }
        };
    }

    initLayerState (layer, allGroups, dataProviders) {
        var me = this;
        const groups = layer ? layer.getGroups() : [];
        for (let i = 0; i < allGroups.length; i++) {
            for (let j = 0; j < groups.length; j++) {
                if (allGroups[i].id === groups[j].id) {
                    allGroups[i].checked = true;
                }
            }
        }

        const styles = layer ? layer.getStyles() : [];
        const availableStyles = [];
        for (let i = 0; i < styles.length; i++) {
            availableStyles.push({
                name: styles[i].getName(),
                title: styles[i].getTitle()
            });
        }

        me.layer = {
            version: layer ? layer.getVersion() : '',
            layer_id: layer ? layer.getId() : null,
            layerUrl: layer && layer.admin ? layer.admin.url : '',
            username: layer && layer.admin ? layer.admin.username : '',
            password: layer && layer.admin ? layer.admin.password : '',
            layerName: layer ? layer.getLayerName() : '',
            name_fi: layer ? layer.getName('fi') : '',
            name_en: layer ? layer.getName('en') : '',
            name_sv: layer ? layer.getName('sv') : '',
            groupId: layer ? layer.getOrganizationName() : '',
            maplayerGroups: me.formatGroupListForBackend(allGroups),
            dataProviders: dataProviders,
            allGroups: allGroups,
            opacity: layer ? layer.getOpacity() : 100,
            minScale: layer ? layer.getMinScale() : 1,
            maxScale: layer ? layer.getMaxScale() : 1,
            style: layer ? layer.getCurrentStyle().getName() : '',
            styleTitle: layer ? layer.getCurrentStyle().getTitle() : '',
            styles: availableStyles,
            styleJSON: '', // TODO
            hoverJSON: '', // TODO
            metadataIdentifier: layer ? layer.getMetadataIdentifier() : '',
            gfiContent: layer ? layer.getGfiContent() : '',
            attributes: layer ? layer.getAttributes() : ''
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

    formatGroupListForBackend (allGroups) {
        let groups = '';
        for (let i = 0; i < allGroups.length; i++) {
            if (allGroups[i].checked) {
                if (!groups) {
                    groups = allGroups[i].id.toString();
                } else {
                    groups += ',' + allGroups[i].id;
                }
            }
        }
        return groups;
    }
}
