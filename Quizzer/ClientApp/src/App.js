import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import {Register} from "./components/Register";
import {Login} from "./components/Login";
import {history} from "./services/helpers";

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
          </Layout>
      </Router>
    );
  }
}
