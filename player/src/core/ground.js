import THREE from 'three';

export default class Ground {

    constructor(scene) {
        var _W = 800;
        var _H = 800;
        
        this.scene = scene;

        this.scene.add(this._buildRoad(-_W * .5, 240, _H * 4, 240, 64));
        this.scene.add(this._buildGrass(-800 * .5, -1600 * .5 + 240 * .5, 800 * 4, 1600, 64));
    }

    _buildGrass(x, z, w, d, h) {
        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: 0xbef567 });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, -h / 2 - 0.3, z);

        return this.mesh;
    }

    _buildRoad(x, z, w, d, h) {
        // decal : 0x7b8496
        // road : 0x525763
        var texture = new THREE.TextureLoader().load( "textures/road_decal.png" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );

        var geometry = new THREE.BoxGeometry(w, h, d);
        var material = new THREE.MeshPhongMaterial({ color: 0x525763 });//, emissive: 0x333333, specular: 0x333333 });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(x, -h / 2 - 0.3, z);

        return this.mesh;
    }
}