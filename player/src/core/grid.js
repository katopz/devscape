import THREE from 'three';

export default class Grid {
    constructor(size, step, scene) {
        var size = 640, step = 64;
        var geometry = new THREE.Geometry();
        for (var i = - size; i <= size; i += step) {
            geometry.vertices.push(new THREE.Vector3(- size, 0, i));
            geometry.vertices.push(new THREE.Vector3(size, 0, i));
            geometry.vertices.push(new THREE.Vector3(i, 0, - size));
            geometry.vertices.push(new THREE.Vector3(i, 0, size));
        }
        var material = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2 });
        var line = new THREE.LineSegments(geometry, material);
        scene.add(line);
    }
}