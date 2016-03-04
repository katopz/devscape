import { h, render } from 'preact';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/app';
import './style';
//import Playground from 'core/playground';
import Game from './components/game';

render((
	<div id="outer">
		<Provider store={store}>
			<App />
		</Provider>
        <Provider store={store}>
			<Game />
		</Provider>
    </div>
), document.body);