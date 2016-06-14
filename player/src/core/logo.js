import THREE from 'three';

export default class Logo {
    constructor(scene) {
        var map = new THREE.TextureLoader().load("textures/devscape_logo.png", function (texture) {
            var material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
            var sprite = new THREE.Sprite(material);
            sprite.position.set(-220, 200, 1);
            sprite.position.normalize();
            scene.add(sprite);
        });
    }
}