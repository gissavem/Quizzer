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
                <div className="mx-auto text-center">
                    <h1 className="mb-5">Hello, Quizzers!</h1>
                    <h3>Select a difficulty</h3>
                    <ButtonGroup size='lg' className="mt-2">
                        <div>
                            <Link className="btn btn-success" to=
                                {
                                    { pathname: '/quiz', state: { difficulty: 0 } }
                                }
                            >Easy</Link>
                        </div>
                        <div>
                            <Link className="btn btn-warning" to=
                                {
                                    { pathname: '/quiz', state: { difficulty: 1 } }
                                }
                            >Medium</Link>
                        </div>
                        <div>
                            <Link className="btn btn-danger" to=
                                {
                                    { pathname: '/quiz', state: { difficulty: 2 } }
                                }
                            >Hard</Link>
                        </div>
                    </ButtonGroup>
                </div>
            </div>
        );
    }
}
