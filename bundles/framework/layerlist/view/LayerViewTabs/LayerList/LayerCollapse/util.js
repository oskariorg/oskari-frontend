/**
 * If both layers have same group, they are ordered by layer.getName()
 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} a comparable layer 1
 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} b comparable layer 2
 * @param {String} method layer method name to sort by
 */
const comparator = (a, b, method) => {
    var nameA = a[method]().toLowerCase();
    var nameB = b[method]().toLowerCase();
    if (nameA === nameB && (a.getName() && b.getName())) {
        nameA = a.getName().toLowerCase();
        nameB = b.getName().toLowerCase();
    }
    return Oskari.util.naturalSort(nameA, nameB);
};

/**
 * Function to construct layer groups based on information included in layers and given grouping method.
 * Possible empty groups are included if allGroups and / or allDataProviders parameters are provided.
 *
 * @param {Oskari.mapframework.domain.AbstractLayer[]} layers layers to group
 * @param {String} method layer method name to sort by
 * @param {Oskari.mapframework.domain.Tool[]} tools tools to group
 * @param {Oskari.mapframework.domain.MaplayerGroup[]} allGroups all user groups available in Oskari
 * @param {Object[]} allDataProviders all dataproviders available in Oskari
 */
export const groupLayers = (layers, method, tools, allGroups = [], allDataProviders = [], noGroupTitle, isUserAdmin) => {
    const groupList = [];
    let group = null;
    let groupForOrphans = null;

    const determineGroupId = (layerGroups = [], layerAdmin) => {
        let groupId;
        if (method === 'getInspireName') {
            if (layerGroups.length) {
                groupId = layerGroups[0] ? layerGroups[0].id : undefined;
            } else {
                groupId = -1;
            }
        } else {
            groupId = layerAdmin ? layerAdmin.organizationId : undefined;
        }
        // My map layers, my places, own analysis and 'orphan' groups don't have id so use negated random number
        // as unique Id (with positive id group is interpret as editable and group tools are shown in layer list).
        return typeof groupId === 'number' ? groupId : -Math.random();
    };

    const recursive = function(group) {
        // group has subgroups
        if (group.hasSubgroups()) {
            // check that group has layers
            if (group.layers && group.layers.length > 0) {
                const lang = Oskari.getLang();
                const name = group.getName();
                let newGroup = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                    group.id, method, name[lang]
                );
                newGroup.setTools(tools);
                // add layer(s) to group
                for (var i in group.layers) {
                    layers.sort((a, b) => comparator(a, b, method))
                    .filter(layer => !layer.getMetaType || layer.getMetaType() !== 'published')
                    .forEach(layer => {
                        if (group.layers[i].id == layer._id) {
                            newGroup.addLayer(layer);
                        }
                    });
                }
                // check possible subgroups
                const mappedSubgroups = group.getGroups().map(subgroup => {
                    return recursive(subgroup);
                });
                // filter out subgroups that don't have a layer nor a subgroup with a layer
                const filteredSubGroups = mappedSubgroups.filter(g => g !== undefined)
                filteredSubGroups.length > 0 && newGroup.setGroups(filteredSubGroups)
                return newGroup;
            } else {
                    return;
                }
        } else {
            if (group.layers && group.layers.length > 0) {
                const subLang = Oskari.getLang();
                const subName = group.getName();
                let newGroup = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                    group.id, method, subName[subLang]
                );
                newGroup.setTools(tools);
                for (var i in group.layers) {
                    layers.sort((a, b) => comparator(a, b, method))
                    .filter(layer => !layer.getMetaType || layer.getMetaType() !== 'published')
                    .forEach(layer => {
                        if (group.layers[i].id == layer._id) {
                            newGroup.addLayer(layer);
                        }
                    });
                }
                return newGroup;
            } else {
                return;
            }
        }
    };

    // sort layers by grouping & name
    layers.sort((a, b) => comparator(a, b, method))
        .filter(layer => !layer.getMetaType || layer.getMetaType() !== 'published')
        .forEach(layer => {
            let groupAttr = layer[method]();
            let groupId = determineGroupId(layer.getGroups(), layer.getAdmin());
            // Create group for orphan layers if not already created and add layer to it
            if (!groupAttr) {
                if (!groupForOrphans) {
                    groupForOrphans = Oskari.clazz.create(
                        'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                        groupId, method, '(' + noGroupTitle + ')'
                    );
                }
                groupForOrphans.addLayer(layer);
            } 
    });
    // recursively map groups and layers together
    allGroups.map(parentGroup => {
            group = recursive(parentGroup);
            if (group != undefined) {
                groupList.push(group);
            }
    });

    let groupsWithoutLayers = [];
    if (method !== 'getInspireName') {
        groupsWithoutLayers = allDataProviders.filter(t => groupList.filter(g => g.id === t.id).length === 0).map(d => {
            const group = Oskari.clazz.create(
                'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                d.id, method, d.name
            );
            group.setTools(tools);
            return group;
        });
    }
    groupsWithoutLayers = groupsWithoutLayers.sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
    return groupForOrphans ? [groupForOrphans, ...groupsWithoutLayers, ...groupList] : [...groupsWithoutLayers, ...groupList];
};

/**
 * Function to construct layer groups based on information included in layers and given grouping method.
 * Possible empty groups are included if allGroups and / or allDataProviders parameters are provided.
 *
 * @param {Oskari.mapframework.domain.AbstractLayer[]} layers layers to group
 * @param {String} method layer method name to sort by
 * @param {Oskari.mapframework.domain.Tool[]} tools tools to group
 * @param {Oskari.mapframework.domain.MaplayerGroup[]} allGroups all user groups available in Oskari
 * @param {Object[]} allDataProviders all dataproviders available in Oskari
 */
export const groupLayersAdmin = (layers, method, tools, allGroups = [], allDataProviders = [], noGroupTitle) => {
    const groupList = [];
    let group = null;
    let groupForOrphans = null;

    const determineGroupId = (layerGroups = [], layerAdmin) => {
        let groupId;
        if (method === 'getInspireName') {
            if (layerGroups.length) {
                groupId = layerGroups[0] ? layerGroups[0].id : undefined;
            } else {
                groupId = -1;
            }
        } else {
            groupId = layerAdmin ? layerAdmin.organizationId : undefined;
        }
        // My map layers, my places, own analysis and 'orphan' groups don't have id so use negated random number
        // as unique Id (with positive id group is interpret as editable and group tools are shown in layer list).
        return typeof groupId === 'number' ? groupId : -Math.random();
    };
    
    const recursive = function(group) {
        if (group.hasSubgroups()) {
            const lang = Oskari.getLang();
            const name = group.getName();
            let newGroup = Oskari.clazz.create(
                'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                group.id, method, name[lang]
            );
            newGroup.setTools(tools);

            for (var i in group.layers) {

                layers.sort((a, b) => comparator(a, b, method))
                .filter(layer => !layer.getMetaType || layer.getMetaType() !== 'published')
                .forEach(layer => {
                    
                    if (group.layers[i].id == layer._id) {
                        newGroup.addLayer(layer);
                    }
                });
            }
            const mappedSubgroups = group.getGroups().map(subgroup => {
                return recursive(subgroup);
            });
            mappedSubgroups && newGroup.setGroups(mappedSubgroups)
            return newGroup;
            
        } else {
                const subLang = Oskari.getLang();
                const subName = group.getName();
                let newGroup = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                    group.id, method, subName[subLang]
                );
                newGroup.setTools(tools);
                for (var i in group.layers) {
    
                    layers.sort((a, b) => comparator(a, b, method))
                    .filter(layer => !layer.getMetaType || layer.getMetaType() !== 'published')
                    .forEach(layer => {
                        
                        if (group.layers[i].id == layer._id) {
                            newGroup.addLayer(layer);
                        }
                    });
                }
                return newGroup;
            
        }
    };

    // sort layers by grouping & name
    layers.sort((a, b) => comparator(a, b, method))
        .filter(layer => !layer.getMetaType || layer.getMetaType() !== 'published')
        .forEach(layer => {
            let groupAttr = layer[method]();
            let groupId = determineGroupId(layer.getGroups(), layer.getAdmin());
            // Create group for orphan layers if not already created and add layer to it
            if (!groupAttr) {
                if (!groupForOrphans) {
                    groupForOrphans = Oskari.clazz.create(
                        'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                        groupId, method, '(' + noGroupTitle + ')'
                    );
                }
                groupForOrphans.addLayer(layer);
            } 
    });

    allGroups.map(parentGroup => {
            group = recursive(parentGroup);
            groupList.push(group);
    });
    
    let groupsWithoutLayers = [];
    const lang = Oskari.getLang();
    if (method !== 'getInspireName') {
        groupsWithoutLayers = allDataProviders.filter(t => groupList.filter(g => g.id === t.id).length === 0).map(d => {
            const group = Oskari.clazz.create(
                'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                d.id, method, d.name
            );
            group.setTools(tools);
            return group;
        });
    }
    groupsWithoutLayers = groupsWithoutLayers.sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
    return groupForOrphans ? [groupForOrphans, ...groupsWithoutLayers, ...groupList] : [...groupsWithoutLayers, ...groupList];
};
