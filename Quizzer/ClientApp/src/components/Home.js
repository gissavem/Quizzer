import React, { Component } from 'react';
import {Link } from 'react-router-dom';
import {Button} from 'reactstrap';

export class Home extends Component {
  static displayName = Home.name;

  componentDidMount(){
    document.body.style.background = 'linear-gradient(#f5f7fa    , #c3cfe2)';
    document.body.style.minHeight = '100vh';
    document.body.style.fontFamily = 'Cabin'
  }

  render () {
    return (
      <div className="text-center mx-auto mt-5">
        <h1 className="display-4 lead">WELCOME TO QUIZZER</h1>
          <div className="d-flex flex-column justify-content-center">
              <Link to={"/Highscore"} className="align-self-center w-50 mt-3 btn btn-info">Highscore</Link>
              <Link to={"/Menu"} className="align-self-center w-50 mt-3 btn btn-info">Play Game</Link>
          </div>
          <div className="mt-3">
            <img src='https://media.giphy.com/media/fxk77fLi2ZPQU6kHKx/giphy.gif' className="w-75"></img>
          </div> 
      </div>
    );
    }
}
