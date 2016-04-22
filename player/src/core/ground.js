import THREE from 'three';

export default class Ground {

    constructor(scene) {
        var _W = 800;
        var _H = 800;

        this._buildRoad(scene, 2, -_W, 240, _H * 5, 240, 32);
        this._buildGrass(scene, -_W, -_H + 240 * .5, _W * 5, _H*2, 32);
        this._buildGrass(scene, -_W, 240 + 128*.5 + 128, _W*5, 128, 32);
        
        this._buildSoid(scene, -_W, 240 + 128*.5 + 128, _W*5, 128, 320);
        this._buildSoid2(scene, _W + _W/2, -_H - 320*2 - 128, _W*5, 128, 320);
    }

    _buildGrass(scene, x, z, w, d, h) {
        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: 0xb0e65a }); //, emissive: 0x000000, specular: 0x000000, shininess: 0});

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, -h / 2 - 0.3, z);

        scene.add(this.mesh);
    }
    
    _buildSoid(scene, x, z, w, d, h) {
        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: 0xbf755a }); //, emissive: 0x000000, specular: 0x000000, shininess: 0});

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, -h / 2 - 0.3 - 32, z);
        //scene.add(this.mesh);
        
        let _SECTION_W = 320;
        var texture = new THREE.TextureLoader().load("textures/soil_decal.png", function(texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(w / _SECTION_W, 1);
            var material = new THREE.MeshBasicMaterial({ map: texture });
            var geometry = new THREE.PlaneGeometry(w, _SECTION_W, 1);
            var plane = new THREE.Mesh(geometry, material);
            plane.position.set(x, -320*0.5 - 0.3 - 32 , z + 128 *0.5);
            //plane.rotation.x = -Math.PI / 2;
            scene.add(plane);
        });
    }

    
    _buildSoid2(scene, x, z, w, d, h) {
        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: 0xbf755a }); //, emissive: 0x000000, specular: 0x000000, shininess: 0});

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, -h / 2 - 0.3 - 32, z);
        //scene.add(this.mesh);
        
        let _SECTION_W = 320;
        var texture = new THREE.TextureLoader().load("textures/soil_decal.png", function(texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(w / _SECTION_W, 1);
            var material = new THREE.MeshBasicMaterial({ map: texture });
            var geometry = new THREE.PlaneGeometry(w, _SECTION_W, 1);
            var plane = new THREE.Mesh(geometry, material);
            plane.position.set(x, -320*0.5 - 0.3 - 32 , z + 128 *0.5);
            plane.rotation.y = Math.PI / 2;
            scene.add(plane);
        });
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