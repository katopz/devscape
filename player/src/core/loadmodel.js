export class LoadModels {
    constructor() {
        this.foot1 = null;
        this.foot2 = null;
        this.body = null;

    }
    load() {
        let self = this;
        return new Promise(function (fulfill, reject) {
            let loader = new THREE.JSONLoader();
            loader.load('3d/body.json', function (geometry, materials) {
                materials.forEach(function (e) {
                    e.morphTargets = true;
                });
                let material = new THREE.MeshFaceMaterial(materials);
                self.body = new THREE.MorphAnimMesh(geometry, material);
                self.body.duration = 1200;

                loader.load('3d/foot1.json', function (geometry, materials) {
                    materials.forEach(function (e) {
                        e.morphTargets = true;
                    });
                    let material = new THREE.MeshFaceMaterial(materials);
                    self.foot1 = new THREE.MorphAnimMesh(geometry, material);
                    self.foot1.duration = 1200;

                    loader.load('3d/foot2.json', function (geometry, materials) {
                        materials.forEach(function (e) {
                            e.morphTargets = true;
                        });
                        let material = new THREE.MeshFaceMaterial(materials);
                        self.foot2 = new THREE.MorphAnimMesh(geometry, material);
                        self.foot2.duration = 1200;
                        fulfill();
                    });
                });
            });
        });
    }
}