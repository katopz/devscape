import THREE from 'three';
import Egg from '../core/egg';

export default class Chicken {
    constructor(x, y, z, scale, reference, scene, chickens) {
        let self = this;
        this.scale = scale;
        this.position = new THREE.Vector3(x, y, z);
        this.group = new THREE.Group();
        this.scene = scene;
        this.speed = 12;
        this.rotation = 0;
        this.chickens = chickens;
        this.body = reference.body.clone()
        this.foot1 = reference.foot1.clone()
        this.foot2 = reference.foot2.clone()
        /*
        setInterval(() => {
            let randomness = Math.random();
            self.group.children.forEach(function (model) {
                //model.rotation.y += Math.PI / 2 * randomness;
            });
        }, Math.floor(Math.random() * 7000) + 3000);

        setInterval(() => {
            let o = self.body.position;
            let x = self.position.x !== 0 ? self.position.x / self.scale : self.position.x;
            let z = self.position.z !== 0 ? self.position.z / self.scale : self.position.z;
            let egg = new Egg(o.x + x, o.z + z, self.scale, self.scene);
            egg.incubate().then((pos) => {
                //new Chicken(pos.x, pos.z, self.scale, reference, self.scene, self.chickens)
            });
        }, Math.floor(Math.random() * 7000) + 3000);
        */

        this.loadModel();
        this.chickens.push(this);
    }

    loadModel() {
        this.group.add(this.body);
        this.group.add(this.foot1);
        this.group.add(this.foot2);
        this.group.scale.set(this.scale, this.scale, this.scale);
        this.group.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.group);

        this.rotationY = Math.PI * 3 / 2;
    }

    set rotationY(theta) {
        let self = this;
        self.group.children.forEach(function (model) {
            model.rotation.y = theta;
        });
    }

    get rotationY() {
        let self = this;
        return self.group.children[0].rotation.y;
    }

    update() {

    }

    /*
    update() {
        let randomness = Math.random();
        self.group.children.forEach(function(model) {
            console.log("update");
            model.rotation.y += Math.PI / 2 * randomness;
        });
    }
    */
}