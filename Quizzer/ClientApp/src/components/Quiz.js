import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup } from 'reactstrap';
import {
    Spinner, Progress, Jumbotron, Card, CardImg, CardTitle, CardText, CardColumns,
    CardSubtitle, CardBody
} from 'reactstrap';
import {authenticationService} from "../services/helpers";

export class Quiz extends Component {

    constructor(props) {
        super(props);
        this.state = {
            difficulty: null,
            questionsToRender : [],
            questionIndex : 0,
            score : 0,
            loading: true,
            answered : false,
            finished : false,
            resultSaved : false
        };
        this.loadQuestions = this.loadQuestions.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.renderScoreScreen = this.renderScoreScreen.bind(this);
    }

    componentDidMount() {
        const difficulty = this.props.location.state.difficulty; 
        this.loadQuestions(difficulty);
    }

    static displayName = Quiz.name;
    render() {
        let content = "";
        if(this.state.loading){
            content = <div className="text-center mt-5"><h3 className="mb-5">Loading Questions</h3><Spinner color="primary" /></div>;
        }
        else if(this.state.finished){
            content = this.renderScoreScreen();
        }
        else{
            content = this.renderQuestions(this.state.questionsToRender[this.state.questionIndex]);
        }
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
                        value={((this.state.questionIndex + 1) / this.state.questionsToRender.length) * 100} animated>
                            {this.state.questionIndex + 1} / {this.state.questionsToRender.length}
                    </Progress>
                </div>
                <Jumbotron>
                    <h2 className="text-center mb-2">{question.text}</h2>
                </Jumbotron>
                <div className="card-deck">
                    {question.answers.map(answer =>
                    <div id={answer.id} className="card bg-info shadow rounded zoom" onClick={() => this.handleClick(answer)}>
                        <div className="card-body text-center">
                            <p className="card-text h5 text-white">{answer.text}</p>
                        </div>
                    </div>
                )}                  
                </div>
                <div className="mx-auto text-center mt-2 mb-2">
                    <Button id="nextQuestion" color="info" disabled={!this.state.answered} onClick={() => this.nextQuestion()}>Next Question</Button>
                </div>              
            </div>
            );
    }

    async loadQuestions(difficulty) {
        await fetch('/quiz/questions/' + difficulty)
            .then((fetchResult) => fetchResult.json())
            .then(questions => {
                this.setState(
                    { questionsToRender: questions, loading: false, difficulty : difficulty }
                )
            });
    }

    async handleClick(answer){
        if (this.state.answered){
            return;
        }
        let div = document.getElementById(answer.id);    
        let clickResponse = await fetch("quiz/answers/" + answer.id)
        .then(response => response.json())
        .then((jsonresponse) =>{return jsonresponse});
        div.classList.remove('bg-info');
        
        if(clickResponse.isCorrect){
            div.classList.add('bg-success');
            this.setState({score : this.state.score + 1});
            console.log(this.state.score)
        } else {
            div.classList.add('bg-danger');
            document.getElementById(clickResponse.correctAnswer).classList.remove('bg-info');
            document.getElementById(clickResponse.correctAnswer).classList.add('bg-success');

        }
        this.setState({answered : true});
        
    }

    nextQuestion(){
        if (this.state.questionIndex + 1 >= this.state.questionsToRender.length){
            this.setState({finished : true});
            this.saveScore();
            return;
        }
        this.setState({questionIndex : this.state.questionIndex + 1, answered : false});
        let answers = document.getElementsByClassName("card");
        for(var i = 0; i < answers.length; i++)
        {
            answers.item(i).classList.remove("bg-danger");
            answers.item(i).classList.remove("bg-success");
            answers.item(i).classList.add("bg-info");
        }
    }
    renderScoreScreen(){
        return(
            !this.state.resultSaved ? 
                <div className="text-center mt-5">
                    <h3 className="mb-5">Saving Score</h3>
                    <Spinner color="primary" />
                </div>
                :
            <div>
                <Jumbotron className="text-center mb-2">
                    <h2>Great Job!</h2>
                    <h3> Your Final Score: {this.state.score} </h3>
                </Jumbotron>
                <div className="mx-auto text-center">
                        <div className="mt-5">
                            <Link className="btn btn-info" to=
                                {
                                    { pathname: '/highscore' }
                                }
                            >See High Score!</Link>
                        </div>
                        <div className="mt-2">
                            <Link className="btn btn-success" to=
                                {
                                    { pathname: '/menu' }
                                }
                            >Play Again?</Link>
                        </div>
                </div>
            </div>
        );
    }
    
    async saveScore(){
        let XSRF = authenticationService.getCookie('XSRF-REQUEST-TOKEN');
        let fetchConfig = 
            {
                method : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': XSRF
                },
                credentials : 'include',
                body : JSON.stringify({
                    score : this.state.score,
                    difficulty : this.state.difficulty
                })
            };
        
        await fetch('score', fetchConfig)
            .then((response) => {
                if (response.ok){
                    this.setState({resultSaved : true});
                }
            });
    }
}

