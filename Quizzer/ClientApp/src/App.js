import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import {Register} from "./components/Register";
import {Login} from "./components/Login";
import { history } from "./services/helpers";
import { Quiz } from "./components/Quiz"
import { Menu } from "./components/Menu";


import './custom.css'

export default class App extends Component {
  static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };

    }
    
  render () {
      return (
      <Router history={history}>
          <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/register' component={Register} />         
            <Route path='/login' component={Login} />
            <Route path='/quiz' component={Quiz} />
            <Route path='/menu' component={Menu}/>
          </Layout>
      </Router>
    );
  }
}
