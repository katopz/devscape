let self = this;

this.chickens = [];

this.clock = new THREE.Clock()
this.scene = new THREE.Scene();
this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);

this.ambientLight = new THREE.AmbientLight("#FFFFF3");
this.scene.add(this.ambientLight);
this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
this.directionalLight.position.set(1, 0.75, 0.5).normalize();
this.scene.add(this.directionalLight);
this.renderer = new THREE.WebGLRenderer({ antialias: true });
this.camera.position.set(900, 900, 900);
this.camera.target = new THREE.Vector3(0, 0, 0);
this.camera.lookAt(this.camera.target);
this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
this.controls.damping = 0.2;
this.controls.maxPolarAngle = Math.PI / 2;
this.controls.minDistance = 500;

this.scene.add(this.camera);
this.renderer.setClearColor("#CCCCCC");
this.renderer.sortObjects = false;
this.renderer.autoClear = false;
this.renderer.gammaInput = true;
this.renderer.gammaOutput = true;
this.renderer.setPixelRatio(window.devicePixelRatio);
this.renderer.setSize(window.innerWidth, window.innerHeight);
let container = document.createElement('div');
document.body.appendChild(container);
container.appendChild(this.renderer.domElement);

this.reference = new LoadModels();
this.reference.load().then(function () {
    new Chicken(0, 0, 15, self.reference, self.scene, self.chickens);
});

this.draw(){  
    let self = this;
    window.requestAnimationFrame(function () { self.draw(); });

    let delta = this.clock.getDelta();

    this.chickens.forEach(function (model) {
        model.group.children.forEach(function (mesh) {
            mesh.updateAnimation(1000 * delta);
            mesh.translateX(model.speed * delta)
        });
    });
    this.renderer.clear();
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
}