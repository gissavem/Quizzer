import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {authenticationService} from "../services/helpers";
import {Button, Spinner, Table, Jumbotron} from "reactstrap";
import {QuestionEditor} from "./QuestionEditor";

export class AppConfig extends Component {
    static displayName = AppConfig.name;
    
    constructor(props) {
        super(props);
        this.state = 
            {
                loading : true,
                questions : [],
                questionToEdit : null
            };  

            this.loadQuestions = this.loadQuestions.bind(this);
            this.renderQuestions = this.renderQuestions.bind(this);   
            this.editQuestion = this.editQuestion.bind(this);
            this.updateStateToReload = this.updateStateToReload.bind(this);
            this.unmountEditor = this.unmountEditor.bind(this);
        }

    componentDidMount() {
        this.loadQuestions();
    }
    
    loadQuestions() {
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
        
        fetch('/quiz/questions', fetchConfig)
            .then(response => response.json())
            .then((jsondata) => 
            {
                this.setState(
                    {
                        questions : jsondata, 
                        loading : false
                    });
            })        
    }

    renderQuestions(){
        let questionEdit = "";
        if(this.state.questionToEdit != null){
            questionEdit = <QuestionEditor unmountEditor={this.unmountEditor.bind(this)} updateParentState={this.updateStateToReload.bind(this)} question={this.state.questionToEdit}/>
        }

        return(
            <div>             
                <div className="pre-scrollable">
                <Table className="border">
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Question</th>
                        <th>Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.questions.map(question =>
                    <tr key={question.id}>
                        <td >{question.id}</td>
                    <td>{question.text}</td>                      
                        <td className="">
                        <button className="border-0 bg-transparent" onClick={() => this.editQuestion(question)}>
                            <i className={`fas fa-edit`} />
                        </button>
                        <button className="border-0 bg-transparent" onClick={() => this.removeQuestion(question.id)}>
                            <i className={`fas fa-trash`} />
                        </button>
                        </td>
                    </tr>
                    )}
                    </tbody>
                </Table>  
                </div>
                <div>
                    {questionEdit}
                </div>
            </div>
        );
    }  

    unmountEditor(){
        console.log("Unmounting editor..");
        this.setState({questionToEdit : null});
    }

    updateStateToReload(isLoading){
        if(!isLoading){
            this.loadQuestions();
            this.setState({questionToEdit : null});
        }else{
            this.setState({loading : isLoading})
        }
        
    }

    removeQuestion(questionId){    
        this.setState({loading : true});
        let XSRF = authenticationService.getCookie('XSRF-REQUEST-TOKEN');
        let fetchConfig =
            {
                method : 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': XSRF
                },
                credentials : 'include'
            };
        
        fetch('/quiz/questions/' + questionId, fetchConfig)
        .then((response) => {
            if(response.ok){
                this.loadQuestions();
                this.setState({loading : false})
            }
        });
    }

    editQuestion(question){
        this.setState({questionToEdit : question});
    }

    render() {
        let content = "";       
        if(this.state.loading){
            content = <div className="text-center mt-5"><h3 className="mb-5">Loading Questions</h3><Spinner color="primary" /></div>;
        }
        else{
            content = this.renderQuestions();
        }
        return content;
    }
}

