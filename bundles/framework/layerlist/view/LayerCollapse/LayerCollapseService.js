export class LayerCollapseService {
    getMutator () {
        return {
            addLayer (id) {
                if (!id) {
                    return;
                }
                Oskari.getSandbox().postRequestByName('AddMapLayerRequest', [id]);
            },
            removeLayer (id) {
                if (!id) {
                    return;
                }
                Oskari.getSandbox().postRequestByName('RemoveMapLayerRequest', [id]);
            }
        };
    }
}
