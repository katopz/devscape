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
import Forest from '../core/forest';
import Traffic from '../core/traffic';
import Config from '../config';
import Logo from '../core/logo';

import OBJMTLLoader from '../lib/loaders/OBJMTLLoader';

const TOUCH = 'Touch' in window && navigator.maxTouchPoints > 1;
const coords = e => ((e = e.touches && e.touches[0] || e), ({ x: e.pageX, y: e.pageY }));

@connect(reduce, bindActions(actions))
export default class Game extends Component {
  constructor() {
    super();
  }

  render({}, { zoom = 1, rotateX = 0, rotationY = 0 }) {
    return (
      <div id="game">
        <main {...this.events}>
          <Scene {...{ zoom, rotateX, rotationY }} />
        </main>
      </div>
    );
  }
}

@connect(reduce, bindActions(actions))
class Scene extends Component {
  constructor() {
    super();

    this.state = 'wait';
    this.mode = 'manual';

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.mouse_status = 'up';

    this.targetRadian = 0;

    /*
        this.events = {
          [TOUCH ? 'onTouchStart' : 'onMouseDown']: ::this.mouseDown,
          [TOUCH ? 'onTouchMove' : 'onMouseMove']: ::this.mouseMove,
          [TOUCH ? 'onTouchEnd' : 'onMouseUp']: ::this.mouseUp
        };
        */

    let self = this;
    window.oncontextmenu = function (event) {
      console.log('oncontextmenu');
      event.preventDefault();
      event.stopPropagation();

      return false;
    };

    var mousedown = function (e) {
      console.log('mousedown:' + coords(e).x);
      e.preventDefault();

      self.calculateTarget(self, coords(e));
      self.mouse_status = 'down';

      // First click
      if (self.state === 'wait') {
        self.state = 'intro';
      }

      self.mode = 'manual';
    }

    var mousemove = function (e) {
      console.log('mouseMove:' + coords(e).x);
      e.preventDefault();

      if (self.mouse_status !== 'down')
        return;

      self.calculateTarget(self, coords(e));
    }

    var mouseup = function (e) {
      console.log('mouseUp:' + coords(e));
      e.preventDefault();

      self.mouse_status = 'up';

      self.mode = 'autoplay';
    }

    document.addEventListener('mousedown', mousedown, false);
    document.addEventListener('touchstart', mousedown, false);

    document.addEventListener('mousemove', mousemove, false);
    document.addEventListener('touchmove', mousemove, false);

    document.addEventListener('touchend', mouseup, false);
    document.addEventListener('mouseup', mouseup, false);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps() {
    if (this.base) this.update();
  }

  calculateTarget(self, coords) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    self.mouse.x = (coords.x / window.innerWidth) * 2 - 1;
    self.mouse.y = - (coords.y / window.innerHeight) * 2 + 1;

    let radian = Math.atan2(self.mouse.y, self.mouse.x);
    //let theta = radian * 180 / Math.PI;
    //this.targetTheta = Math.floor(theta / 90) * 90;
    //this.targetRadian = this.targetTheta * Math.PI / 180;
    self.targetRadian = radian;
  }

  //@debounce
  update() {
    //console.log(this.props);
    let { events, zoom, rotateX, rotationY } = this.props;
    this.camera.rotation.y = rotateX * Math.PI;
    this.camera.rotation.z = - rotationY * Math.PI;
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
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
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
    /*
    var aspect = window.innerWidth / window.innerHeight;
    var d = 20;
    this.camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
    this.camera.position.set( 20, 20, 20 ); // all components equal
    this.camera.lookAt( this.scene.position ); // or the origin
    */

    this.camera = new THREE.PerspectiveCamera(
      10,         // FOV
      window.innerWidth / window.innerHeight,  // Aspect
      100,        // Near
      10000       // Far
    );

    // HUD
    this.setupHUD();

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
      'data/01_client.json',
      'data/02_dev.json',
      'data/03_server.json'
    ]);

    // Forest
    new Forest(this.scene, 640, 640, 10);
    this.traffic = new Traffic(this.scene);

    //this.animate();

    // Logo
    this.logo = new Logo(this.scene);

    // TODO : move to external?

    window.addEventListener('resize', function () {
      self.onWindowResize(self);
    }, false);

    // Wait 3 sec for autoplay
    setTimeout(() => this.autoplay(this), 3000);
  }

  autoplay(self) {
    self.state = 'intro';
    self.mode = 'autoplay';

    // Go wild
    this.walkabout(this);
  }

  walkabout(self) {
    self.AI_targetRadian = 2 * Math.PI * Math.random();

    // Retarget every 3 sec
    setTimeout(() => self.walkabout(self), 3000);
  }

  recharge(self, chicken) {
    // Wake up after charged
    chicken.mp += Math.random();
    if (chicken.mp >= 100) {
      self.wakeup(self)
    }
  }

  wakeup(self) {
    self.mode = 'autoplay'
  }

  setupHUD() {
    let self = this;

    let width = window.innerWidth;
    let height = window.innerHeight;
    this.cameraOrtho = new THREE.OrthographicCamera(- width / 2, width / 2, height / 2, - height / 2, 1, 10);
    this.cameraOrtho.position.z = 10;

    this.sceneOrtho = new THREE.Scene();

    new THREE.TextureLoader().load("textures/devscape_logo.png", function (texture) {
      var material = new THREE.SpriteMaterial({ map: texture });
      self.spriteC = new THREE.Sprite(material);
      var tw = material.map.image.width;
      var th = material.map.image.height;

      // media query
      let logo_y = 120;
      if (width <= 320) {
        tw = tw / 2;
        th = th / 2;
      } else if (width <= 414) {
        tw = tw / 1.75;
        th = th / 1.75;
        logo_y = 200;
      }

      self.spriteC.scale.set(tw, th, 1);
      self.sceneOrtho.add(self.spriteC);
      self.spriteC.position.set(0, logo_y, 1); // center
    });
  }

  toRad(degree) {
    return degree * Math.PI / 180;
  }

  letCameraFollowTarget(target) {
    this.camera.position.set(target.x, target.y, target.z);
    this.camera.rotation.set(this.toRad(-45), this.toRad(16), this.toRad(16));
    this.camera.translateZ(4600);
    this.camera.target = target;
    this.camera.lookAt(this.camera.target);

    /*
    // for top view test
    this.camera.position.set(-640, 0, 0);
    this.camera.rotation.set(-Math.PI/2, 0, 0);
    this.camera.translateZ(1600*3);
    //this.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
    */
  }

  animate() {
    setInterval(() => {
      this.chickens && this.chickens.forEach(function (chicken) {
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
    sections.forEach(function (sectionURL) {
      // TODO : queue load
      papergirl.watch().onSync(function (jsonString, url, options) {
        let json = JSON.parse(jsonString);
        self.build(options.index, json);
      }).request(sectionURL, { index: i++ });
    });
  }

  build(sectionIndex, sectionData) {
    let self = this;

    // label style
    let X0 = - sectionIndex * 800 - 100;
    let Z0 = 180;
    let LABEL_X = 64
    let group_x = 0;
    let group_h = 64;
    let item_h = 64;

    // header
    let header_label = new Label(self.scene, sectionData.title, X0 + 64, 0, Z0 + 64, "normal small-caps bold 64px arial", "black", "yellow", 0);

    // section
    sectionData.group.forEach(function (group) {

      var j = 0;
      var items_h = group.items.length * item_h;

      group.items.forEach(function (item) {

        // chart
        let trend = 64 * item.trend / 10;
        let w = (trend < 128) ? trend : 128;
        let item_x = Z0 - (group_x + group_h + j);
        let h = 64 + 128 * item.percent / 100;
        let color = randomColor({ luminosity: 'bright', format: 'rgb' });
        let box = new Box(self.scene, X0 - h / 2 + 64, item_x, h, w, item_h, color);

        // label
        let item_label = new Label(self.scene, item.title, X0 + LABEL_X, 0, item_x, "normal small-caps bold 40px arial", "white", color, 24);

        j += 64;
      });

      // group
      let group_label = new Label(self.scene, group.title, X0 + LABEL_X, 0, Z0 - group_x, "normal small-caps bold 56px arial", "#b0e65a", "#black", 10);
      group_x += items_h + group_h;
    });
  }

  // render ////////////////////////////

  rerender() {
    let self = this;
    window.requestAnimationFrame(function () { self.rerender(); });

    if (this.state === 'intro') {
      // Bye HUD
      if (this.spriteC.position.x < window.innerWidth) {
        this.spriteC.position.x += 16;
        this.spriteC.position.y -= 1;
      } else {
        this.state = 'play'
      }
    }

    self.traffic && self.traffic.update();

    let delta = self.clock.getDelta();

    if (self.chickens) {

      // autoplay?
      if (self.mode === 'autoplay') {
        self.targetRadian = self.AI_targetRadian;
      }

      self.chickens.forEach(function (chicken) {

        switch (self.mode) {
          case 'charge':
            self.recharge(self, chicken)
            break;
          case 'manual':
          case 'autoplay':
            if (self.mouse_status === 'down' || self.mode === 'autoplay') {
              var f = chicken.speed * delta * chicken.scale;

              // Out bound?
              var isGoodToGo = false;
              let dolly_position = chicken.group.position.clone();
              dolly_position.set(dolly_position.x + f * Math.cos(self.targetRadian), 20, dolly_position.z - f * Math.sin(self.targetRadian));

              // First try
              isGoodToGo = !Forest.isOB(dolly_position.x, dolly_position.z);

              if (self.mode === 'autoplay') {
                var try_count = 0;
                while (!isGoodToGo && try_count < 16) {
                  // try again
                  self.targetRadian = self.AI_targetRadian = 2 * Math.PI * Math.random();
                  dolly_position = chicken.group.position.clone();
                  dolly_position.set(dolly_position.x + f * Math.cos(self.targetRadian), 20, dolly_position.z - f * Math.sin(self.targetRadian));

                  // Still OB?
                  isGoodToGo = !Forest.isOB(dolly_position.x, dolly_position.z);
                  try_count++;
                }
              }

              // Good to go
              if (isGoodToGo) {
                if (self.mode === 'autoplay') {
                  chicken.mp -= 0.1;

                  // No more power
                  if (chicken.mp <= 0) {
                    isGoodToGo = false;
                    self.mode = 'charge';
                  }
                }

                chicken.group.position.set(dolly_position.x, dolly_position.y, dolly_position.z);
              }

              chicken.rotationY = self.targetRadian;
              chicken.group.children.forEach(function (mesh) {
                mesh.updateAnimation(1000 * delta);
              });
            }
            break;
        }
      });
    }

    // follow camera
    if (this.chickens && this.chickens[0] && this.chickens[0].group.children[0]) {
      //console.log(this.chickens[0].group.children[0].position);
      //this.camera.position.set(900, 900, 900);
      //var target = this.chickens[0].group.children[0].position.clone();
      var target = this.chickens[0].group.position.clone();
      this.letCameraFollowTarget(target);
    }

    // light
    if (this.traffic_light) {
      this.traffic_light.intensity = Math.sin(this.theta += Math.PI / 15) / 2 + 0.5;
    }

    this.renderer.clear();
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

    // render
    this.renderer.render(this.scene, this.camera);

    if (this.state !== 'play') {
      this.renderer.clearDepth();
      this.renderer.render(this.sceneOrtho, this.cameraOrtho);
    }
  }

  renderObject() {
    let self = this;
    self.chickens = [];

    this.reference = new LoadModels();
    this.reference.load().then(function () {
      new Chicken(-64, 20, 1264, Config.SCALE, self.reference, self.scene, self.chickens);
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

    this.yLight = new THREE.DirectionalLight(0xffffff, 0.2);
    this.yLight.position.set(0, 1, 0).normalize();
    this.scene.add(this.yLight);

    this.zLight = new THREE.DirectionalLight(0x111111, 0.1);
    this.zLight.position.set(0, 0, 1).normalize();
    this.scene.add(this.zLight);

    /*
    // for debug traffic_light
    var geometry = new THREE.SphereGeometry( 4, 16, 16 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    var sphere = new THREE.Mesh( geometry, material );
    this.scene.add( sphere );
    sphere.position.set(-220, 200, 930);
    */

    this.theta = 0;
    // PointLight( color, intensity, distance, decay )
    this.traffic_light = new THREE.PointLight(0xFF0000, Math.sin(this.theta), 500);
    //this.traffic_light.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
    this.traffic_light.position.set(-220, 200, 930);
    this.scene.add(this.traffic_light);

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
    var width = window.innerWidth;
    var height = window.innerHeight;

    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
    self.renderer.setSize(window.innerWidth, window.innerHeight);

    // HUD
    self.cameraOrtho.left = - width / 2;
    self.cameraOrtho.right = width / 2;
    self.cameraOrtho.top = height / 2;
    self.cameraOrtho.bottom = - height / 2;
    self.cameraOrtho.updateProjectionMatrix();
  }
}