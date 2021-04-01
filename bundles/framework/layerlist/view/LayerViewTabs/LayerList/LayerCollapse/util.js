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

const sortGroupsAlphabetically = (group) => {
    if (group.getGroups().length !== 0) {
        group.getGroups().map(subgroup => {
            return sortGroupsAlphabetically(subgroup);
        });
    }
    return group.getGroups().sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
};

const mapGroupsAndLayers = (group, method, layers, tools, admin) => {
    if (!admin && (!group.layers || group.layers.length === 0)) {
        return;
    }
    // check that group has layers
    const lang = Oskari.getLang();
    const name = group.getName();
    let newGroup = Oskari.clazz.create(
        'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
        group.id, method, name[lang]
    );
    newGroup.setTools(tools);
    
    for (var i in group.layers) {
        layers.find(layer => {
                if(typeof layer.getId == 'function') { // To make sure layer has getId() method
                    if(layer.getId() === group.layers[i].id) {
                        newGroup.addLayer(layer); 
                        return layer;
                    }
                }
        });
    }


    // group has subgroups
    if (!group.hasSubgroups()) {
        return newGroup;
    }
    const mappedSubgroups = group.getGroups().map(subgroup => {
        return mapGroupsAndLayers(subgroup, method, layers, tools, admin);
    });
    // filter out subgroups that don't have a layer nor a subgroup with a layer
    if (admin) {
        mappedSubgroups && newGroup.setGroups(mappedSubgroups);
    } else {
        newGroup.setGroups(mappedSubgroups.filter(g => g !== undefined));
    }
    return newGroup;
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
export const groupLayers = (layers, method, tools, allGroups = [], allDataProviders = [], noGroupTitle) => {
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
        parentGroup.sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
        group = mapGroupsAndLayers(parentGroup, method, layers, tools, false);
        if (group != undefined) {
            groupList.push(group);
        }
    });
    // Sort groupList subgroups
    groupList.map(group => {
        sortGroupsAlphabetically(group);
    });
    // Sort maingroup
    groupList.sort((a, b) => Oskari.util.naturalSort(a.name, b.name));

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
        group = mapGroupsAndLayers(parentGroup, method, layers, tools, true);
        groupList.push(group);
    });
    // Sort subgroups
    groupList.map(group => {
        sortGroupsAlphabetically(group);
    });
    // Sort maingroup
    groupList.sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
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
