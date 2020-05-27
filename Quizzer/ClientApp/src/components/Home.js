import React, { Component } from 'react';
import {Link } from 'react-router-dom';
import {Button} from 'reactstrap';

export class Home extends Component {
  static displayName = Home.name;

componentDidMount(){
  document.body.style.background = "linear-gradient(#c0c0aa, #1cefff)";
  document.body.style.minHeight = "100vh";
  document.body.style.fontFamily = "Cabin";
}

  render () {
    return (
      <div className="text-center mx-auto mt-5">
        <h1 className="display-3">Welcome to Quizzer</h1>
          <div className="d-flex flex-column justify-content-center">
              <Link to={"/Highscore"} className="align-self-center w-50 mt-5 btn btn-secondary">Highscore</Link>
              <Link to={"/Menu"} className="align-self-center w-50 mt-5 btn btn-secondary">Play Game</Link>
          </div>
      </div>
    );
    }
}
