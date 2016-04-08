import THREE from 'three';

export default class Ground {

    constructor(scene) {
        var _W = 800;
        var _H = 800;

        this._buildRoad(scene, 2, -_W * .5, 240, _H * 4, 240, 64);
        this._buildGrass(scene, -800 * .5, -1600 * .5 + 240 * .5, 800 * 4, 1600, 64);
    }

    _buildGrass(scene, x, z, w, d, h) {
        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: 0xbef567 }); //, emissive: 0x000000, specular: 0x000000, shininess: 0});

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, -h / 2 - 0.3, z);

        scene.add(this.mesh);
    }

    _buildRoad(scene, lane, x, z, w, d, h) {
        // decal : 0x7b8496
        // road : 0x525763
        /*
        var texture = new THREE.TextureLoader().load("textures/road_decal.png", function(texture) {
            // do something with the texture
            var material = new THREE.MeshBasicMaterial({
                map: texture
            });

            var geometry = new THREE.PlaneGeometry(5, 20, 32);
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.set(x, -h / 2 - 0.3, z);
            scene.add(this.mesh);
        });

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        */

        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: 0x525763 });//, emissive: 0x333333, specular: 0x333333 });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, -h / 2 - 0.3, z);
        //scene.add(this.mesh);

        let _SECTION_W = 128;
        var texture = new THREE.TextureLoader().load("textures/road_decal.png", function(texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(w / _SECTION_W, 2);
            var material = new THREE.MeshBasicMaterial({ map: texture });
            var geometry = new THREE.PlaneGeometry(w, _SECTION_W * lane, 1);
            var plane = new THREE.Mesh(geometry, material);
            plane.position.set(x, -h / 2 - 0.3, z);
            plane.rotation.x = -Math.PI / 2;
            scene.add(plane);
        });

        /*
        var textureLoader = new THREE.TextureLoader();
		var decalDiffuse = textureLoader.load( 'textures/road_decal.png' );
        var decalMaterial = new THREE.MeshPhongMaterial( {
			specular: 0x444444,
			map: decalDiffuse,
			normalScale: new THREE.Vector2( 1, 1 ),
			shininess: 30,
			transparent: true,
			depthTest: true,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: - 4,
			wireframe: false
		} );
        */
    }
}