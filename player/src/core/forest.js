import THREE from 'three';
import Config from '../config';

export default class Forest {
    constructor(scene, w, h, dens) {
        
        let self = this;
        self.Z0 = 640; 
        
        var loader = new THREE.OBJMTLLoader();
        loader.load('3d/Tree01.obj', '3d/Tree01.mtl', function(tree) {

            tree.scale.set(Config.SCALE, Config.SCALE, Config.SCALE);

            for (var i = 0; i < 10; i++) {
                //for (var j = 0; j < h; i += h/sh) {
                var mesh = tree.clone();
                //mesh.scale = tree.scale + Math.random() * 2;
                mesh.position.set(Math.random() * 2 * w -  2* w, 0, self.Z0 + Math.random() * h/2);
                scene.add(mesh);
                //}
            }
        });
    }
}