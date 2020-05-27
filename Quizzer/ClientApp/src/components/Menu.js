import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ButtonGroup } from 'reactstrap';

export class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            difficulty: null
        };
    }

    static displayName = Menu.name;
    render() {
        return (
            <div>
                <div className="mx-auto text-center mt-5">
                    <h3 className="display-4">SELECT A DIFFICULTY</h3>
                        <div className="mt-1 mb-2">
                            <Link className="btn btn-light btn-lg w-50" to=
                                {
                                    { pathname: '/quiz', state: { difficulty: 0 } }
                                }
                            >Easy</Link>
                        </div>
                        <div className="mt-1 mb-2">
                            <Link className="btn btn-secondary btn-lg w-50" to=
                                {
                                    { pathname: '/quiz', state: { difficulty: 1 } }
                                }
                            >Medium</Link>
                        </div>
                        <div className="mt-1 mb-2">
                            <Link className="btn btn-dark btn-lg w-50" to=
                                {
                                    { pathname: '/quiz', state: { difficulty: 2 } }
                                }
                            >Hard</Link>
                        </div>
                </div>
            </div>
        );
    }
}
