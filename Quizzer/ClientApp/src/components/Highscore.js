import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {authenticationService} from "../services/helpers";
import {Button, Spinner, Table} from "reactstrap";

export class Highscore extends Component {
    static displayName = Highscore.name;
    
    sortTypes = {
        scoreUp: {
            class: 'sort-up',
            fn: (a, b) => a.score - b.score
        },
        scoreDown: {
            class: 'sort-down',
            fn: (a, b) => b.score - a.score
        },
        dateUp: {
            class: 'sort-up',
            fn: (a, b) => new Date(a.time) - new Date(b.time)
        },
        dateDown: {
            class: 'sort-down',
            fn: (a, b) => new Date(b.time) - new Date(a.time)
        },
        default: {
            class: 'sort',
            fn: (a, b) => a
        }
    };;
    
    constructor(props) {
        super(props);
        this.state = 
            {
                loading : true,
                scores : [],
                currentSort : 'default'
            };
        this.loadHighscores = this.loadHighscores.bind(this);
        this.renderHighScore = this.renderHighScore.bind(this);
        this.onScoreSortChange = this.onScoreSortChange.bind(this);
        this.onDateSortChange = this.onDateSortChange.bind(this);
        
    }

    onScoreSortChange = () => {
        const { currentSort } = this.state;
        let nextSort;

        if (currentSort === 'scoreDown') nextSort = 'scoreUp';
        else if (currentSort === 'scoreUp') nextSort = 'default';
        else if (currentSort === 'default') nextSort = 'scoreDown';
        else  nextSort = 'default';


        this.setState({
            currentSort: nextSort
        });
    };
    
    onDateSortChange = () => {
        const { currentSort } = this.state;
        let nextSort;

        if (currentSort === 'dateDown') nextSort = 'dateUp';
        else if (currentSort === 'dateUp') nextSort = 'default';
        else if (currentSort === 'default') nextSort = 'dateDown';
        else  nextSort = 'default';

        this.setState({
            currentSort: nextSort
        });
    };
    
    componentDidMount() {
        this.loadHighscores();
    }
    

    loadHighscores() {
        let XSRF = authenticationService.getCookie('XSRF-REQUEST-TOKEN');
        let fetchConfig =
            {
                method : 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': XSRF
                },
                credentials : 'include'
            };
        
        fetch('/score', fetchConfig)
            .then(response => response.json())
            .then((jsondata) => 
            {
                this.setState({scores : jsondata, loading : false})
            })
            .catch(error =>  {
                this.props.history.push('/login');
            });
    }

    renderHighScore(){
        return(
            <div>
                <Table size="sm" borderless>
                    <thead>
                    <tr>
                        {/*<th>#</th>*/}
                        <th>Name</th>
                        <th>Difficulty</th>
                        <th>Date
                            <button className="border-0 bg-transparent" onClick={this.onDateSortChange}>
                                <i className={`fas fa-${(this.sortTypes)[this.state.currentSort].class}`} />
                            </button>
                        </th>
                        <th>Score
                            <button className="border-0 bg-transparent" onClick={this.onScoreSortChange}>
                                <i className={`fas fa-${(this.sortTypes)[this.state.currentSort].class}`} />
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...this.state.scores]
                        .sort(this.sortTypes[this.state.currentSort].fn)
                        .map((score, index) =>
                    <tr>
                        {/*<th scope="row">{index + 1}</th>*/}
                        <td>{score.userName}</td>
                        <td>{score.difficulty}</td>
                        <td>{new Date(score.time).getDate()}/
                            {new Date(score.time).getMonth()}/
                            {new Date(score.time).getFullYear()}</td>
                        <td>{score.score}</td>
                    </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        );
    }
    
    render() {
        let content = "";
        
        if(this.state.loading){
            content = <div className="text-center mt-5"><h3 className="mb-5">Loading Highscores</h3><Spinner color="primary" /></div>;
        }
        else{
            content = this.renderHighScore();
        }
        return content;
    }
    
}

