const oldUpdate = Cesium.Model.prototype.update;

Cesium.Model.prototype.update = function (frameState) {
    if (this.gltf) {
        if (Array.isArray(this.gltf.materials)) {
            this.gltf.materials.forEach(function (mat) {
                if (!mat.pbrMetallicRoughness) {
                    return;
                }
                mat.pbrMetallicRoughness.metallicFactor = 0;
                mat.pbrMetallicRoughness.roughnessFactor = 1;
            });
        }
        this.update = oldUpdate;
    }
    oldUpdate.call(this, frameState);
};
