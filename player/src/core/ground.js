import THREE from 'three';

export default class Ground {
    /*
    constructor(scene) {
        var _W = 800;
        var _H = 240;

        this._buildRoad(scene, 2, -_W, _H, _W * 5, _H, 32);
        this._buildGrass(scene, -_W, -_W + _H * .5, _W * 5, _W * 2, 32);
        this._buildGrass(scene, -_W, _H + 128 * .5 + 128, _W * 5, 128, 32);

        this._buildSoil(scene, -_W, _H + 128 * .5 + 128, _W * 5, 128, 320);
        this._buildSoil2(scene, 1200, - _W * 5 - 128 - 30, 2000 - 20, 128, 320);
    }
    */
    constructor(scene) {
        var _W = 640;
        var _H = 400;
        var _Z0 = 480;

        this.HGAP = 0.5;

        this._buildRail(scene, 2, -_W, _Z0 - 40 - (128*2), _W * 4, _H, 32);
        
        this._buildRoad(scene, 2, -_W, _Z0 - 40, _W * 4, _H, 32);
        this._buildGrass(scene, -_W, -_Z0, _W * 4, _H * 4, 32);
        this._buildGrass(scene, -_W, _Z0 + 40 + _H + 52 , _W * 4, _H * 2, 32);

        this._buildSoil(scene, -_W, _Z0 + 18 + _W + 170, _W * 4, 0, _W);
        this._buildSoil2(scene, _W, 0, _W * 4 + 60, 0, _W);
    }

    _buildGrass(scene, x, z, w, d, h) {
        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: 0xb0e65a }); //, emissive: 0x000000, specular: 0x000000, shininess: 0});

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, -h / 2 - this.HGAP, z);

        scene.add(this.mesh);
    }

    _buildSoil(scene, x, z, w, d, h) {
        let self = this;

        let _SECTION_W = 320;
        var texture = new THREE.TextureLoader().load("textures/soil_decal.png", function(texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(w / _SECTION_W, 1);
            var material = new THREE.MeshBasicMaterial({ map: texture });
            var geometry = new THREE.PlaneGeometry(w, _SECTION_W, 1);
            var plane = new THREE.Mesh(geometry, material);
            plane.position.set(x, -320 * 0.5 - self.HGAP - 32, z + 128 * 0.5);
            //plane.rotation.x = -Math.PI / 2;
            scene.add(plane);
        });
    }

    _buildSoil2(scene, x, z, w, d, h) {
        let self = this;

        let _SECTION_W = 320;
        var texture = new THREE.TextureLoader().load("textures/soil_decal.png", function(texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(w / _SECTION_W, 1);
            var material = new THREE.MeshBasicMaterial({ map: texture });
            var geometry = new THREE.PlaneGeometry(w, _SECTION_W, 1);
            var plane = new THREE.Mesh(geometry, material);
            plane.position.set(x, -320 * 0.5 - self.HGAP - 32, z + 128 * 0.5);
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
            this.mesh.position.set(x, -h / 2 - this.HGAP, z);
            scene.add(this.mesh);
        });

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        */

        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: 0x525763 });//, emissive: 0x333333, specular: 0x333333 });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, -h / 2 - this.HGAP, z);
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
    
    _buildRail(scene, x, z, w, d, h) {
        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: 0x726994 });//, emissive: 0x333333, specular: 0x333333 });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, -h / 2 - this.HGAP, z);
    }
}