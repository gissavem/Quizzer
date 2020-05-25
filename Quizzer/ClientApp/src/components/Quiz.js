import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup } from 'reactstrap';
import {
    Card, CardImg, CardTitle, CardText, CardColumns,
    CardSubtitle, CardBody
} from 'reactstrap';

export class Quiz extends Component {

    constructor(props) {
        super(props);
        this.state = {
            difficulty: null,
            loading: true,
            questionsToRender : []
        };
        this.loadQuestions = this.loadQuestions.bind(this);
    }

    componentDidMount() {
        const difficulty = this.props.location.state.difficulty; 
        this.loadQuestions(difficulty);
    }

    static displayName = Quiz.name;
    render() {
        let content = this.state.loading ? <h1>Loading...</h1> : this.renderQuestions(this.state.questionsToRender[0]);
        return (      
            <div>
                {content} 
            </div>
        );
    }

    renderQuestions(question) {
        return (
            <div>
                <h2 className="text-center mb-4">{question.text}</h2>
                <div className="card-deck">
                    {question.answers.map(answer =>
                    <div className="card bg-info">
                        <div className="card-body text-center">
                            <p className="card-text h5 text-white">{answer.text}</p>
                        </div>
                    </div>
                )}                  
                </div> 
            </div>
            );
    }

    async loadQuestions(difficulty) {
        console.log("Hej");
        await fetch('/quiz/questions/' + difficulty)
            .then((fetchResult) => fetchResult.json())
            .then(questions => {
                this.setState(
                    { questionsToRender: questions, loading: false }
                )
            });
    }
}

