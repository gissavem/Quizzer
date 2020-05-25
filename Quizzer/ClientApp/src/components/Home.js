import React, { Component } from 'react';
import {Link } from 'react-router-dom';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
        <h1>Hello, world!</h1>
            <Link className="btn btn-dark" to="/menu"> \,,/ Play this awesome fucking Game! \,,/</Link>
      </div>
    );
    }
}
