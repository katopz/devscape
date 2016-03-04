'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chicken = function () {
	function Chicken(x, z, scale, reference, scene, chickens) {
		_classCallCheck(this, Chicken);

		var self = this;
		this.scale = scale;
		this.position = new THREE.Vector3(x, 0, z);
		this.group = new THREE.Group();
		this.scene = scene;
		this.speed = 3;
		this.rotation = 0;
		this.chickens = chickens;
		this.body = reference.body.clone();
		this.foot1 = reference.foot1.clone();
		this.foot2 = reference.foot2.clone();
		setInterval(function () {
			var randomness = Math.random();
			self.group.children.forEach(function (model) {
				model.rotation.y += Math.PI / 2 * randomness;
			});
		}, Math.floor(Math.random() * 7000) + 3000);

		setInterval(function () {
			var o = self.body.position;
			var x = self.position.x !== 0 ? self.position.x / self.scale : self.position.x;
			var z = self.position.z !== 0 ? self.position.z / self.scale : self.position.z;
			var egg = new Egg(o.x + x, o.z + z, self.scale, self.scene);
			egg.incubate().then(function (pos) {
				new Chicken(pos.x, pos.z, self.scale, reference, self.scene, self.chickens);
			});
		}, Math.floor(Math.random() * 7000) + 3000);

		this.loadModel();
		this.chickens.push(this);
	}

	Chicken.prototype.loadModel = function loadModel() {
		this.group.add(this.body);
		this.group.add(this.foot1);
		this.group.add(this.foot2);
		this.group.scale.set(this.scale, this.scale, this.scale);
		this.group.position.set(this.position.x, this.position.y, this.position.z);
		this.scene.add(this.group);
	};

	return Chicken;
}();

var Egg = function () {
	function Egg(x, z, scale, scene) {
		_classCallCheck(this, Egg);

		this.hatchtime = (Math.floor(Math.random() * 12) + 4) * 1000;
		var geometry = new THREE.BoxGeometry(15, 24, 15);
		var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(x * scale, -15, z * scale);
		this.scene = scene;
		this.scene.add(this.mesh);
	}

	Egg.prototype.incubate = function incubate() {
		var self = this;
		return new Promise(function (fulfill, reject) {
			setTimeout(function () {
				fulfill(self.mesh.position);
				self.scene.remove(self.mesh);
			}, self.hatchtime);
		});
	};

	return Egg;
}();

var LoadModels = function () {
	function LoadModels() {
		_classCallCheck(this, LoadModels);

		this.foot1 = null;
		this.foot2 = null;
		this.body = null;
	}

	LoadModels.prototype.load = function load() {
		var self = this;
		return new Promise(function (fulfill, reject) {
			var loader = new THREE.JSONLoader();
			loader.load('3d/body.json', function (geometry, materials) {
				materials.forEach(function (e) {
					e.morphTargets = true;
				});
				var material = new THREE.MeshFaceMaterial(materials);
				self.body = new THREE.MorphAnimMesh(geometry, material);
				self.body.duration = 1200;

				loader.load('3d/foot1.json', function (geometry, materials) {
					materials.forEach(function (e) {
						e.morphTargets = true;
					});
					var material = new THREE.MeshFaceMaterial(materials);
					self.foot1 = new THREE.MorphAnimMesh(geometry, material);
					self.foot1.duration = 1200;

					loader.load('3d/foot2.json', function (geometry, materials) {
						materials.forEach(function (e) {
							e.morphTargets = true;
						});
						var material = new THREE.MeshFaceMaterial(materials);
						self.foot2 = new THREE.MorphAnimMesh(geometry, material);
						self.foot2.duration = 1200;
						fulfill();
					});
				});
			});
		});
	};

	return LoadModels;
}();

var Playground = function () {
	function Playground() {
		_classCallCheck(this, Playground);

		var self = this;

		this.chickens = [];

		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);

		this.ambientLight = new THREE.AmbientLight("#FFFFF3");
		this.scene.add(this.ambientLight);
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		this.directionalLight.position.set(1, 0.75, 0.5).normalize();
		this.scene.add(this.directionalLight);
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.camera.position.set(600, 600, 600);
		this.camera.target = new THREE.Vector3(0, 0, 0);
		this.camera.lookAt(this.camera.target);
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.damping = 0.2;
		this.controls.maxPolarAngle = Math.PI / 2;
		this.controls.minDistance = 500;

		this.scene.add(this.camera);
		this.setrenderer();

		self.draw();
		window.addEventListener('resize', function () {
			self.onWindowResize();
		}, false);
		this.reference = new LoadModels();
		this.reference.load().then(function () {
			new Chicken(0, 0, 15, self.reference, self.scene, self.chickens);
		});
	}

	Playground.prototype.onWindowResize = function onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	Playground.prototype.setrenderer = function setrenderer() {
		this.renderer.setClearColor("#CCCCCC");
		this.renderer.sortObjects = false;
		this.renderer.autoClear = false;
		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		var container = document.createElement('div');
		document.body.appendChild(container);
		container.appendChild(this.renderer.domElement);
	};

	Playground.prototype.draw = function draw() {
		var self = this;
		window.requestAnimationFrame(function () {
			self.draw();
		});

		var delta = this.clock.getDelta();

		this.chickens.forEach(function (model) {
			model.group.children.forEach(function (mesh) {
				mesh.updateAnimation(1000 * delta);
				mesh.translateX(model.speed * delta);
			});
		});
		this.renderer.clear();
		this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
		this.renderer.render(this.scene, this.camera);
	};

	return Playground;
}();

new Playground();