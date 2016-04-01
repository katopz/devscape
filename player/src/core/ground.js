import THREE from 'three';

export default class Ground {
    constructor(scene, w, d, h) {       
        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
        
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(0, -h/2 - 0.2, 0);
        
        this.scene = scene;
        this.scene.add(this.mesh);
    }
}