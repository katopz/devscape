import { h, Component } from 'preact';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { bindActions } from '../util';
import reduce from '../reducers';
import * as actions from '../actions';
import TodoItem from './todo-item';
//import LowlaDB from '../lib/lowladb';
import localforage from 'localforage';
import * as _octo from 'octokat';

@connect(reduce, bindActions(actions))
export default class App extends Component {
  constructor() {
    super();

    /*
    this.lowla = new LowlaDB({ datastore: 'Memory' });
    this.todos = lowla.collection('mydb', 'todos');
    render({ todos });
    */
    
    this.octo = _octo.default();
    this.octo.repos('katopz', 'devscape').fetch().then(function(repo) {
      console.log(repo);
    });
    
    localforage.config({
      name: 'Devscape'
    });

    localforage.setItem('key', {'foo':'bar2'});
    localforage.getItem('key').then(function(value) {
      console.log(value);
    });
  }

  @bind
  addTodos() {
    let { text } = this.state;
    this.setState({ text: '' });
    this.props.addTodo(text);

    // db
    /*
    // db
    var todo = {
      _id: new Date().valueOf(),
      title: text,
      completed: false
    };

    todos.insert(todo).then(function(doc){
      console.log(doc);
    }, function(err){
      console.log(err);
    });
    */
    return false;
  }

  @bind
  removeTodo(todo) {
    this.props.removeTodo(todo);

    // db
    //todos.remove({ _id: todo._id });
  }

  render({ todos }, { text }) {
    return (
      <div id="app">
        <form onSubmit={this.addTodos} action="javascript:">
          <input value={text} onInput={this.linkState('text') } placeholder="New ToDo..." />
        </form>
        <ul>
          { todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} onRemove={this.removeTodo} />
          )) }
        </ul>
      </div>
    );
  }
}
