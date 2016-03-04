import { h, Component } from 'preact';
import { bind, debounce } from 'decko';
import { connect } from 'react-redux';
import { bindActions } from '../util';
import reduce from '../reducers';
import * as actions from '../actions';
import TodoItem from './todo-item';
import THREE from 'three';

const TOUCH = 'Touch' in window && navigator.maxTouchPoints>1;
const coords = e => ((e = e.touches && e.touches[0] || e), ({ x:e.pageX, y:e.pageY }));

@connect(reduce, bindActions(actions))
export default class Game extends Component {
	constructor() {
        console.log("constructor");
		super();
		this.events = {
			[TOUCH?'onTouchStart':'onMouseDown']: ::this.mouseDown,
			[TOUCH?'onTouchMove':'onMouseMove']: ::this.mouseMove,
			[TOUCH?'onTouchEnd':'onMouseUp']: ::this.mouseUp
		};
	}
	
	mouseDown(e) {
		let { rotateX=0, rotateY=0 } = this.state;
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
		rotateX += x/innerWidth - .5;
		rotateY += y/innerHeight - .5;
		this.setState({ rotateX, rotateY });
	}
	
	mouseUp() {
		this.downState = null;
		this.down = null;
	}
    
	render({}, { zoom=1, rotateX=0, rotateY=0 }) {
		return (
			<div id="game">
				<header>
					<h1>Renderer Example</h1>
					<input type="range" value={zoom} min="0" max="10" step="0.00001" onInput={ this.linkState('zoom') } />
				</header>
				<main {...this.events}>
					<Scene {...{zoom, rotateX, rotateY}} />
				</main>
			</div>
		);
	}
}

class Scene extends Component {
	shouldComponentUpdate() {
		return false;
	}
	
	componentWillReceiveProps() {
		if (this.base) this.update();
	}
	
	//@debounce
	update() {
        console.log("update");
		let { zoom, rotateX, rotateY } = this.props;
		this.object.rotation.y = rotateX * Math.PI;
		this.object.rotation.z = - rotateY * Math.PI;
		this.scene.scale.addScalar( zoom - this.scene.scale.x );
		this.rerender();
	}

	componentDidMount() {
		setTimeout( () => this.setup(), 1);
	}
	
	setup() {
        console.log("setup");
		let { width, height } = this.base.getBoundingClientRect();
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(800*2, 640*2);
		this.base.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		
		this.camera = new THREE.PerspectiveCamera(
			35,         // FOV
			800 / 640,  // Aspect
			0.1,        // Near
			10000       // Far
		);
		this.camera.position.set(-15, 10, 15);
		this.camera.lookAt(this.scene.position);
		
		this.renderObject();
		this.renderLighting();
		this.rerender();
	}
	
	rerender() {
		this.renderer.render(this.scene, this.camera);
	}
	
	renderObject() {
		this.object = new THREE.Mesh(
			new THREE.BoxGeometry(5, 5, 5), 
			new THREE.MeshLambertMaterial({ color: 0xFF0000 })
		);
		this.scene.add(this.object);
	}
	
	renderLighting() {
		let light = new THREE.PointLight(0xFF0000, 1, 100);
		light.position.set( 10, 0, 10 );
		this.scene.add(light);

		light = new THREE.PointLight(0xFF0000, 1, 50);
		light.position.set( -20, 15, 10 );
		this.scene.add(light);

		this.renderer.setClearColor(0x222222, 1);
	}

	render() {
		return <div class="scene" />;
	}
}