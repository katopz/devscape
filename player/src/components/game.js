import { h, Component } from 'preact';
import { bind, debounce } from 'decko';
import { connect } from 'react-redux';
import { bindActions } from '../util';
import reduce from '../reducers';
import * as actions from '../actions';
import TodoItem from './todo-item';
import THREE from 'three';
import LoadModels from '../core/loadmodel';
import Chicken from '../core/chicken';
import Egg from '../core/egg';
import Grid from '../core/grid';
import Box from '../core/box';
import Ground from '../core/ground';
import Label from '../core/label';
import papergirl from 'papergirl';
import randomColor from 'randomcolor';

import OBJMTLLoader from '../lib/loaders/OBJMTLLoader';

const TOUCH = 'Touch' in window && navigator.maxTouchPoints > 1;
const coords = e => ((e = e.touches && e.touches[0] || e), ({ x: e.pageX, y: e.pageY }));

@connect(reduce, bindActions(actions))
export default class Game extends Component {
  constructor() {
    super();
  }

  render({}, { zoom = 1, rotateX = 0, rotateY = 0 }) {
    return (
      <div id="game">
        <header>
          <input type="range" value={zoom} min="0" max="10" step="0.00001" onInput={ this.linkState('zoom') } />
        </header>
        <main {...this.events}>
          <Scene {...{ zoom, rotateX, rotateY }} />
        </main>
      </div>
    );
  }
}

@connect(reduce, bindActions(actions))
class Scene extends Component {
  constructor() {
    console.log("Scene.constructor");
    super();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.mouse_status = 'up';

    this.targetRadian = 0;

    this.events = {
      [TOUCH ? 'onTouchStart' : 'onMouseDown']: ::this.mouseDown,
      [TOUCH ? 'onTouchMove' : 'onMouseMove']: ::this.mouseMove,
      [TOUCH ? 'onTouchEnd' : 'onMouseUp']: ::this.mouseUp
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps() {
    if (this.base) this.update();
  }

  mouseDown(e) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    //this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    //this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

    //console.log('*scene.mouseDown : ' + this.mouse.x);
    e.preventDefault();

    this.mouse_status = 'down';
  }

  mouseMove(e) {
    if (this.mouse_status !== 'down')
      return;

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;

    let radian = Math.atan2(this.mouse.y, this.mouse.x);
    //let theta = radian * 180 / Math.PI;
    //this.targetTheta = Math.floor(theta / 90) * 90;
    //this.targetRadian = this.targetTheta * Math.PI / 180;
    this.targetRadian = radian;

    console.log(radian);
  }

  mouseUp(e) {
    this.mouse_status = 'up';
  }

  //@debounce
  update() {
    //console.log(this.props);
    let { events, zoom, rotateX, rotateY } = this.props;
    this.camera.rotation.y = rotateX * Math.PI;
    this.camera.rotation.z = - rotateY * Math.PI;
    this.scene.scale.addScalar(zoom - this.scene.scale.x);
    this.rerender();
  }

  componentDidMount() {
    setTimeout(() => this.setup(), 1);
  }

  setup() {
    let self = this;
    //console.log("setup");
    let { width, height } = this.base.getBoundingClientRect();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(800, 640);
    this.base.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();

    /*
    this.camera = new THREE.PerspectiveCamera(
            35,         // FOV
            800 / 640,  // Aspect
            0.1,        // Near
            10000       // Far
    );
    this.camera.position.set(-15, 10, 15);
    this.camera.lookAt(this.scene.position);
    */

    this.camera = new THREE.PerspectiveCamera(
      40, window.innerWidth / window.innerHeight,
      1, 10000
    );
    
    this.letCameraFollowTarget(new THREE.Vector3(0, 0, 0));

    //this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    //this.controls.damping = 0.2;
    //this.controls.maxPolarAngle = Math.PI / 2;
    //this.controls.minDistance = 500;

    this.onWindowResize(self);
    this.renderObject();
    this.renderLighting();
    this.rerender();

    this.decorate([
      'data/01_infras.json',
      'data/02_dev.json',
      'data/03_deploy.json',
      'data/04_dist.json'
    ]);

    // three
    this.createTree(this.scene);

    this.animate();

    // TODO : move to external?

    window.addEventListener('resize', function() {
      self.onWindowResize(self);
    }, false);
  }
  
  letCameraFollowTarget(target) {
    this.camera.position.set(target.x, target.y, target.z);
    this.camera.rotation.set(-38.2*2, 38.2*0.5, 38.2*0.5);
    this.camera.translateZ(900);
    this.camera.target = target;
    this.camera.lookAt(this.camera.target);
  }

  createTree(scene) {
    var loader = new THREE.OBJMTLLoader();
    loader.load('3d/Tree01.obj', '3d/Tree01.mtl', function(object) {
      object.scale.set(15, 15, 15);
      object.position.set(100, 0, 100);
      scene.add(object);
    });
  }

  animate() {
    setInterval(() => {
      this.chickens && this.chickens.forEach(function(chicken) {
        chicken.update();
      });
    }, Math.floor(Math.random() * 7000) + 3000);
  }

  decorate(sections) {
    let self = this;

    // ground
    let ground = new Ground(self.scene);

    // sections
    var i = 0;
    sections.forEach(function(sectionURL) {
      // TODO : queue load
      papergirl.watch().onSync(function(jsonString, url, options) {
        let json = JSON.parse(jsonString);
        self.build(options.index, json);
      }).request(sectionURL, { index: i++ });
    });
  }

  build(sectionIndex, sectionData) {
    let self = this;

    // label style
    let X0 = - sectionIndex * 800;
    let LABEL_X = 64
    let group_x = 0;
    let group_h = 64;
    let item_h = 64;

    // header
    let header_label = new Label(self.scene, sectionData.title, X0 + 64, 0, 64, "normal small-caps bold 64px arial", "black", "yellow", 0);

    // section
    sectionData.group.forEach(function(group) {

      var j = 0;
      var items_h = group.items.length * item_h;

      group.items.forEach(function(item) {

        // chart
        let trend = 64 * item.trend / 10;
        let w = (trend < 128) ? trend : 128;
        let item_x = -(group_x + group_h + j);
        let box = new Box(self.scene, X0 - w / 2 + 64, item_x, w, 64 + 128 * item.percent / 100, item_h, randomColor({ luminosity: 'bright', format: 'rgb' }));

        // label
        let item_label = new Label(self.scene, item.title, X0 + LABEL_X, 0, item_x, "normal small-caps bold 40px arial", "grey", "black", 32);

        j += 64;
      });

      // group
      let group_label = new Label(self.scene, group.title, X0 + LABEL_X, 0, -group_x, "normal small-caps bold 56px arial", "white", "black", 0);
      group_x += items_h + group_h;
    });
  }

  // render ////////////////////////////

  rerender() {
    let self = this;
    window.requestAnimationFrame(function() { self.rerender(); });

    /*
    // update the picking ray with the camera and mouse position	
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // calculate objects intersecting the picking ray
    var intersects = this.raycaster.intersectObjects(this.scene.children);
    console.log(intersects.length);
    for (var i = 0; i < intersects.length; i++) {
      //intersects[i].object.material.color.set(0xff0000);
    }
    */

    let delta = this.clock.getDelta();

    this.chickens && this.chickens.forEach(function(chicken) {

      //let randomness = Math.random();
      //chicken.rotateY = Math.PI / 2 * randomness;//self.targetTheta;
      if (self.mouse_status === 'down') {

        // console.log("targetRadian : " + self.targetRadian);        
        //chicken.rotateY = self.targetRadian;
        chicken.rotateY = 0;
        var f = chicken.speed * delta * chicken.scale;
        chicken.group.position.set(chicken.group.position.x + f * Math.cos(self.targetRadian), 20, chicken.group.position.z - f * Math.sin(self.targetRadian));
        chicken.rotateY = self.targetRadian;
        chicken.group.children.forEach(function(mesh) {
          mesh.updateAnimation(1000 * delta);
          //mesh.translateX(chicken.speed * delta);
        });
      }
    });

    // follow camera
    if (this.chickens && this.chickens[0] && this.chickens[0].group.children[0]) {
      //console.log(this.chickens[0].group.children[0].position);
      //this.camera.position.set(900, 900, 900);
      //var target = this.chickens[0].group.children[0].position.clone();
      var target = this.chickens[0].group.position.clone();
      this.letCameraFollowTarget(target);
    }

    this.renderer.clear();
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

    // render
    this.renderer.render(this.scene, this.camera);
  }

  renderObject() {
    let self = this;
    self.chickens = [];

    this.reference = new LoadModels();
    this.reference.load().then(function() {
      new Chicken(0, 20, 0, 15, self.reference, self.scene, self.chickens);
    });
  }

  renderLighting() {
    /*
    let light = new THREE.PointLight(0xFF0000, 1, 100);
    light.position.set(10, 0, 10);
    this.scene.add(light);

    light = new THREE.PointLight(0xFF0000, 1, 50);
    light.position.set(-20, 15, 10);
    this.scene.add(light);
    */

    //this.renderer.setClearColor(0x222222, 1);

    this.ambientLight = new THREE.AmbientLight("#FFFFFF");
    this.scene.add(this.ambientLight);

    this.xLight = new THREE.DirectionalLight(0xffffff, 0.382);
    this.xLight.position.set(1, 0, 0).normalize();
    this.scene.add(this.xLight);

    this.yLight = new THREE.DirectionalLight(0xffffff, 0.1);
    this.yLight.position.set(0, 1, 0).normalize();
    this.scene.add(this.yLight);

    this.zLight = new THREE.DirectionalLight(0xff0000, 0.382);
    this.zLight.position.set(0, 0, 1).normalize();
    this.scene.add(this.zLight);

    /*
    var spotLight = new THREE.SpotLight(0x00ff00);
    spotLight.position.set(100, 1000, 100);

    spotLight.castShadow = true;

    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;

    spotLight.shadowCameraNear = 500;
    spotLight.shadowCameraFar = 4000;
    spotLight.shadowCameraFov = 30;

    this.scene.add(spotLight);
    */
  }

  render() {
    return (<main {...this.events } >
      <div class="scene"/>
    </main>)
  }

  onWindowResize(self) {
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
    self.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}