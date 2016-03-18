import { h, render } from 'preact';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/app';
import './style';
import Game from './components/game';

render((
  <div id="outer">
    <Provider store={store}>
      <Game />
    </Provider>
  </div>
), document.body);
