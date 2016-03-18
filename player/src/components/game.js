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

const TOUCH = 'Touch' in window && navigator.maxTouchPoints>1;
const coords = e => ((e = e.touches && e.touches[0] || e), ({ x:e.pageX, y:e.pageY }));

@connect(reduce, bindActions(actions))
export default class Game extends Component {
  constructor() {
    console.log("constructor");
    super();
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
    
	render({}, { zoom=1, rotateX=0, rotateY=0 }) {
		return (
			<div id="game">
				<header>
					<input type="range" value={zoom} min="0" max="10" step="0.00001" onInput={ this.linkState('zoom') } />
				</header>
				<main {...this.events}>
					<Scene {...{zoom, rotateX, rotateY}} />
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
    this.renderer.setSize(800 * 2, 640 * 2);
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
  }

  decorate() {
    var size = 500, step = 50;
    new Grid(size, step, this.scene)
  }

  rerender() {
    let self = this;
    window.requestAnimationFrame(function () { self.rerender(); });

    let delta = this.clock.getDelta();

    this.chickens && this.chickens.forEach(function (model) {
      model.group.children.forEach(function (mesh) {
        mesh.updateAnimation(1000 * delta);
        mesh.translateX(model.speed * delta)
      });
    });
    this.renderer.clear();
    this.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
  }

  renderObject() {
    var self = this;
    self.chickens = [];
    
    var _box = new Box(self.scene, 0, 0, 64, 128, 0xFF0000);
    
    this.reference = new LoadModels();
    this.reference.load().then(function () {
      new Chicken(0, 0, 15, self.reference, self.scene, self.chickens);
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