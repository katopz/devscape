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
import xhrz from '../xhrz';
import randomColor from 'randomcolor';

const TOUCH = 'Touch' in window && navigator.maxTouchPoints > 1;
const coords = e => ((e = e.touches && e.touches[0] || e), ({ x: e.pageX, y: e.pageY }));

@connect(reduce, bindActions(actions))
export default class Game extends Component {
  constructor() {
    super();

    // input
    this.events = {
      [TOUCH ? 'onTouchStart' : 'onMouseDown']: ::this.mouseDown,
      [TOUCH ? 'onTouchMove' : 'onMouseMove']: ::this.mouseMove,
      [TOUCH ? 'onTouchEnd' : 'onMouseUp']: ::this.mouseUp
    };
  }

  mouseDown(e) {
    let { rotateX = 0, rotateY = 0 } = this.state;
    this.downState = { rotateX, rotateY }
    this.down = coords(e);
    console.log("mouseDown");
    e.preventDefault();
  }

  mouseMove(e) {
    if (!this.down) return;
    let p = coords(e),
      x = p.x - this.down.x,
      y = p.y - this.down.y,
      { rotateX, rotateY } = this.downState;
    rotateX += x / innerWidth - .5;
    rotateY += y / innerHeight - .5;
    this.setState({ rotateX, rotateY });
  }

  mouseUp() {
    this.downState = null;
    this.down = null;
    console.log("mouseUp");
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
    this.events = {
      [TOUCH ? 'onTouchStart' : 'onMouseDown']: ::this.mouseDown
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps() {
    if (this.base) this.update();
  }

  mouseDown(e) {
    console.log("*scene.mouseDown");
    e.preventDefault();
  }

  //@debounce
  update() {
    console.log(this.props);
    let { events, zoom, rotateX, rotateY } = this.props;
    this.object.rotation.y = rotateX * Math.PI;
    this.object.rotation.z = - rotateY * Math.PI;
    this.scene.scale.addScalar(zoom - this.scene.scale.x);
    this.rerender();
  }

  componentDidMount() {
    setTimeout(() => this.setup(), 1);
  }

  setup() {
    console.log("setup");
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
    this.camera.position.set(900, 900, 900);
    this.camera.target = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(this.camera.target);
    //this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    //this.controls.damping = 0.2;
    //this.controls.maxPolarAngle = Math.PI / 2;
    //this.controls.minDistance = 500;

    this.renderObject();
    this.renderLighting();
    this.rerender();

    this.decorate();
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.chickens && this.chickens.forEach(function(chicken) {
        chicken.update();
      });
    }, Math.floor(Math.random() * 7000) + 3000);
  }

  decorate() {
    let self = this;

    // grid
    var size = 500, step = 50;
    new Grid(size, step, this.scene);

    // ground
    let ground = new Ground(self.scene, 640, 640, 128);

    // label-syle
    let LABEL_X = 64

    // fetch data
    xhrz.get("data/01_infras.json").then(function(jsonString) {
      let json = JSON.parse(jsonString);
      console.log(json);

      // json    
      //var i = 0;
      let group_x = 0;
      let group_h = 64;
      let item_h = 64;

      json.group.forEach(function(group) {

        console.log('////' + group.title + '////' + group_x);
        var j = 0;
        var items_h = group.items.length * item_h;

        group.items.forEach(function(item) {
          // chart
          let trend = 64 * item.trend / 10;
          let w = (trend < 128) ? trend : 128;
          let item_x = -(group_x + group_h + j);
          let box = new Box(self.scene, - w / 2 + 64, item_x, w, 64 + 128 * item.percent / 100, item_h, randomColor({ luminosity: 'bright', format: 'rgb' }));

          // label
          let label = new Label(self.scene, item.title, LABEL_X, 0, item_x, "normal small-caps bold 32px arial", "black", "white", 32);

          j += 64;
          console.log('[' + trend + ']' + item.title);
        });

        //console.log(i + '-' + j);

        // group
        let group_label = new Label(self.scene, group.title, LABEL_X, 0, -group_x, "normal small-caps bold 56px arial", "white", "black");
        group_x += items_h + group_h;
      });

      // label
      //let LABEL_X = 64
      //let label = new Label(self.scene, "HELLO WORLD", LABEL_X, 0, 64, "normal small-caps bold 56px arial", "black", "yellow");
      //let label2 = new Label(self.scene, "LOL", LABEL_X, 0, 0, "normal small-caps normal 56px verdana", "black", "yellow");
    });
  }

  // render ////////////////////////////

  rerender() {
    let self = this;
    window.requestAnimationFrame(function() { self.rerender(); });

    let delta = this.clock.getDelta();

    this.chickens && this.chickens.forEach(function(model) {
      model.group.children.forEach(function(mesh) {
        mesh.updateAnimation(1000 * delta);
        //model.translateX(model.speed * delta)
      });
    });


    // follow camera
    if (this.chickens) {
      //console.log(this.chickens[0].position);
      //this.camera.position.set(900, 900, 900);
      //this.camera.target = this.chickens.position;
      //this.camera.lookAt(this.camera.target);
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
      new Chicken(200, 20, 200, 15, self.reference, self.scene, self.chickens);
    });
  }

  renderLighting() {
    let light = new THREE.PointLight(0xFF0000, 1, 100);
    light.position.set(10, 0, 10);
    this.scene.add(light);

    light = new THREE.PointLight(0xFF0000, 1, 50);
    light.position.set(-20, 15, 10);
    this.scene.add(light);

    this.renderer.setClearColor(0x222222, 1);

    this.ambientLight = new THREE.AmbientLight("#FFFFF3");
    this.scene.add(this.ambientLight);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(1, 0.75, 0.5).normalize();
    this.scene.add(this.directionalLight);
  }

  render() {
    return (<main {...this.events } >
      <div class="scene"/>
    </main>)
  }
}