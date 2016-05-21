import THREE from 'three';
import Config from '../config';

export default class Forest {
    constructor(scene, w, h, dens) {

        let self = this;
        let _W = 640;
        let _H = 400;
        let _Z0 = 480;
        let _X0 = - _W * 2 - 480 - 106;
        let _Y0 = - _H * 3 + 32;
        let _SPAN = 128;

        let maps = [
            0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
            0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0,
            0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0,
            0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0,
            0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0,
            0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
            0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];

        var loader = new THREE.OBJMTLLoader();
        loader.load('3d/Coin.obj', '3d/Coin.mtl', function (coin) {
            coin.scale.set(Config.SCALE * 2, Config.SCALE * 2, Config.SCALE * 2);

            var object = coin;
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.shininess = 100;
                    child.material.blending = THREE.AdditiveBlending;
                }
            });
            //coin.material = new THREE.MeshBasicMaterial({ color: 0xffffff });

            var loader = new THREE.OBJMTLLoader();
            loader.load('3d/Tree01.obj', '3d/Tree01.mtl', function (tree) {

                tree.scale.set(Config.SCALE, Config.SCALE, Config.SCALE);

                for (var i = 0; i < maps.length; i++) {
                    if (maps[i] == 0) {

                        let positionX = _X0 + (i % 20) * _SPAN;
                        let positionY = _Y0 + (Math.floor(i / 20)) * _SPAN;

                        var mesh;
                        if (Math.random() > 0.2) {
                            mesh = tree.clone();
                        } else {
                            mesh = coin.clone();
                        }

                        mesh.position.set(positionX, 0, positionY);
                        scene.add(mesh);
                    }
                }
            });
        });
    }
}