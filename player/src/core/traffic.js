import THREE from 'three';
import Config from '../config';

export default class Traffic {
    constructor(scene) {
        
        let self = this;
        self.trucks = [];
        
        var loader = new THREE.OBJMTLLoader();
        loader.load('3d/Truck.obj', '3d/Truck.mtl', function(obj3d) {
            obj3d.scale.set(Config.SCALE *2 , Config.SCALE*2 , Config.SCALE*2 );
            var _obj3d;
            
            // truck 1
            _obj3d = obj3d.clone();
            _obj3d.position.set(400, 0, 320 - 16);
            _obj3d.rotation.y = Math.PI/2;
            scene.add(_obj3d);
            self.trucks.push(_obj3d);
            
            // truck 2
            _obj3d = obj3d.clone();
            _obj3d.position.set(-400, 0, 200 - 16);
            _obj3d.rotation.y = -Math.PI/2;
            scene.add(_obj3d);
            self.trucks.push(_obj3d);
        });
        
        return this
    }
    
    update() {
        let self = this;
        self.trucks.forEach((obj3d) => {
            if(obj3d.position.x < -400)
            {
                obj3d.position.x = 400;
            } else if(obj3d.position.x > 400) {
                obj3d.position.x = -400;
            }
            
            
            //obj3d.position.x--;
            obj3d.translateZ(-1);
        })
    }
}