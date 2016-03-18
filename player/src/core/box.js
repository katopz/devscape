import THREE from 'three';

export default class Box {
    constructor(scene, x, z, w, h, color) {
        const d = 32;
        
        var geometry = new THREE.BoxGeometry(d, h, w);
        var material = new THREE.MeshBasicMaterial({ color: color });
        
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(x, h/2, z);
        
        this.scene = scene;
        this.scene.add(this.mesh);
    }
}