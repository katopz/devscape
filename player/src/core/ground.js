import THREE from 'three';

export default class Ground {

    constructor(scene) {
        this.scene = scene;

        this.scene.add(this._buildRoad(-800 * .5, 240, 800 * 4, 240, 64));
        this.scene.add(this._buildGround(-800 * .5, -1600*.5 + 240*.5, 800 * 4, 1600, 64));
    }

    _buildGround(x, z, w, d, h) {
        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: 0x666666, emissive: 0x666666, specular: 0x666666 });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, -h / 2 - 0.3, z);

        return this.mesh;
    }

    _buildRoad(x, z, w, d, h) {
        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: 0x333333, emissive: 0x333333, specular: 0x333333 });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, -h / 2 - 0.3, z);

        return this.mesh;
    }
}