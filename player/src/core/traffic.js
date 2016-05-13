import THREE from 'three';
import Config from '../config';

export default class Traffic {
    constructor(scene) {
        
        let self = this;
        self.MIN_EDGE = -3200;
        self.MAX_EDGE = 1600;
        self.Z0 = 200; 

        // vehicles
        self.vehicles = [];        
        var loader = new THREE.OBJMTLLoader();
        loader.load('3d/Truck.obj', '3d/Truck.mtl', function(obj3d) {
            obj3d.scale.set(Config.SCALE *2 , Config.SCALE*2 , Config.SCALE*2 );
            var _obj3d;
            
            // truck 1 : max -> min
            _obj3d = obj3d.clone();
            _obj3d.position.set(self.MAX_EDGE, 0, self.Z0 + 320 - 16);
            _obj3d.rotation.y = Math.PI/2;
            scene.add(_obj3d);
            self.vehicles.push(_obj3d);
            
            // truck 1.1 : max -> min
            _obj3d = _obj3d.clone();
            _obj3d.position.set(self.MAX_EDGE - 320, 0, self.Z0 + 320 - 16);
            scene.add(_obj3d);
            self.vehicles.push(_obj3d);
            
            // truck 2 : min -> max
            _obj3d = obj3d.clone();
            _obj3d.position.set(self.MIN_EDGE, 0, self.Z0 + 200 - 16);
            _obj3d.rotation.y = -Math.PI/2;
            scene.add(_obj3d);
            self.vehicles.push(_obj3d);
            
            // truck 2.1 : min -> max
            _obj3d = _obj3d.clone();
            _obj3d.position.set(self.MIN_EDGE + 640, 0, self.Z0 + 200 - 16);
            scene.add(_obj3d);
            self.vehicles.push(_obj3d);
        });
        
        // cars
        var loader = new THREE.OBJMTLLoader();
        loader.load('3d/Car.obj', '3d/Car.mtl', function(obj3d) {
            obj3d.scale.set(Config.SCALE*2 , Config.SCALE*2 , Config.SCALE*2 );
            var _obj3d;
            
            // car 1 : max -> min
            _obj3d = obj3d.clone();
            _obj3d.position.set(self.MAX_EDGE - 640, 0, self.Z0 + 320 - 16);
            _obj3d.rotation.y = Math.PI/2;
            scene.add(_obj3d);
            self.vehicles.push(_obj3d);
       });
       
        // train
        var loader = new THREE.OBJMTLLoader();
        loader.load('3d/Train.obj', '3d/Train.mtl', function(obj3d) {
            obj3d.scale.set(Config.SCALE*2 , Config.SCALE*2 , Config.SCALE*2 );
            var _obj3d;
            
            // Train 1 : max -> min
            _obj3d = obj3d.clone();
            _obj3d.position.set(self.MAX_EDGE - 640, 0, self.Z0 + 480 - 16);
            _obj3d.rotation.y = Math.PI/2;
            scene.add(_obj3d);
            self.vehicles.push(_obj3d);
       });
        
       return this
    }
    
    update() {
        let self = this;
        
        self.vehicles.forEach((obj3d) => {
            // bound
            if(obj3d.position.x < self.MIN_EDGE)
            {
                obj3d.position.x = self.MAX_EDGE;
            } else if(obj3d.position.x > self.MAX_EDGE) 
            {
                obj3d.position.x = self.MIN_EDGE;
            }
            
            // move
            obj3d.translateZ(-4);
        })
    }
}