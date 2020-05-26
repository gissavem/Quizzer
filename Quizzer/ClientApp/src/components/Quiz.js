import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup } from 'reactstrap';
import {
    Spinner, Progress, Jumbotron, Card, CardImg, CardTitle, CardText, CardColumns,
    CardSubtitle, CardBody
} from 'reactstrap';

export class Quiz extends Component {

    constructor(props) {
        super(props);
        this.state = {
            difficulty: null,
            loading: true,
            questionsToRender : [],
            questionIndex : 0,
            answered : false
        };
        this.loadQuestions = this.loadQuestions.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        const difficulty = this.props.location.state.difficulty; 
        this.loadQuestions(difficulty);
    }

    static displayName = Quiz.name;
    render() {
        let content = this.state.loading ?
            <div className="text-center mt-5"><h3 className="mb-5">Loading Questions</h3><Spinner color="primary" /></div>
            : this.renderQuestions(this.state.questionsToRender[this.state.questionIndex]);
        return (      
            <div>
                {content} 
            </div>
        );
    }

    renderQuestions(question) {
        return (
            <div>
                <div className="text-center mb-2 mx-auto">
                    <Progress color="success"
                    value={(this.state.questionIndex / this.state.questionsToRender.length) * 100} animated></Progress>
                </div>
                <Jumbotron>
                    <h2 className="text-center mb-4">{question.text}</h2>
                </Jumbotron>
                <div className="card-deck">
                    {question.answers.map(answer =>
                    <div id={answer.id} className="card bg-info" onClick={() => this.handleClick(answer)}>
                        <div className="card-body text-center">
                            <p className="card-text h5 text-white">{answer.text}</p>
                        </div>
                    </div>
                )}                  
                </div>
                <div className="mx-auto text-center mt-2">
                    <Button id="nextQuestion" color="info" disabled={!this.state.answered} onClick={() => this.nextQuestion()}>Next Question</Button>
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

    async handleClick(answer){
        let div = document.getElementById(answer.id);    
        let isCorrect = await fetch("quiz/answers/" + answer.id)
        .then(response => response.json())
        .then((jsonresponse) =>{return jsonresponse.isCorrect});
        div.classList.remove('bg-info');
        if(isCorrect){
            div.classList.add('bg-success');
        } else {
            div.classList.add('bg-danger');
        }
        this.setState({answered : true});
        
        console.log(this.state.questionIndex);
    }

    nextQuestion(){
        this.setState({questionIndex : this.state.questionIndex + 1, answered : false});
        let answers = document.getElementsByClassName("card");
        for(var i = 0; i < answers.length; i++)
        {
            answers.item(i).classList.remove("bg-danger");
            answers.item(i).classList.remove("bg-success");
            answers.item(i).classList.add("bg-info");
        }
    }
}

