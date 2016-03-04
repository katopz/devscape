export class Egg {
    constructor(x, z, scale, scene) {
        this.hatchtime = (Math.floor(Math.random() * 12) + 4) * 1000;
        var geometry = new THREE.BoxGeometry(15, 24, 15);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(x * scale, -15, z * scale);
        this.scene = scene;
        this.scene.add(this.mesh);
    }

    incubate() {
        let self = this;
        return new Promise((fulfill, reject) => {
            setTimeout(() => {
                fulfill(self.mesh.position);
                self.scene.remove(self.mesh);
            }, self.hatchtime);
        });
    }
}