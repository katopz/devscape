import THREE from 'three';

export default class Box {
    constructor(scene, x, z, w, h, d, color) {
        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: color});//, emissive: 0x111111});
        
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(x, h/2, z);
        
        this.scene = scene;
        this.scene.add(this.mesh);
    }
}