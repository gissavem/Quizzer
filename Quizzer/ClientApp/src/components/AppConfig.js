import React, { Component } from 'react';
import {authenticationService} from "../services/helpers";
import {Button, Spinner, Table} from "reactstrap";
import {QuestionEditor} from "./QuestionEditor";
import {QuestionCreator} from "./QuestionCreator";

export class AppConfig extends Component {
    static displayName = AppConfig.name;
    
    constructor(props) {
        super(props);
        this.state = 
            {
                loading : true,
                questions : [],
                questionToEdit : null,
                createQuestion : null
            };  

            this.loadQuestions = this.loadQuestions.bind(this);
            this.renderQuestions = this.renderQuestions.bind(this);   
            this.editQuestion = this.editQuestion.bind(this);
            this.createQuestion = this.createQuestion.bind(this);
            this.updateStateToReload = this.updateStateToReload.bind(this);
            this.unmountEditor = this.unmountEditor.bind(this);
            this.unmountCreator = this.unmountCreator.bind(this);
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
        
        fetch('/api/questions', fetchConfig)
            .then((response) => {
                if(!response.ok){
                    this.props.history.push('/')
                } 
                   return response.json()
            })
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
        let modal = "";
        if(this.state.questionToEdit != null){
            modal = <QuestionEditor unmountEditor={this.unmountEditor.bind(this)} updateParentState={this.updateStateToReload.bind(this)} question={this.state.questionToEdit}/>
        }

        if(this.state.createQuestion != null){
            modal = <QuestionCreator unmountCreator={this.unmountCreator.bind(this)} updateParentState={this.updateStateToReload.bind(this)}/>
        }

        return(
            <div>             
                <Button className="mb-1" onClick={() => this.createQuestion()}>Add new question</Button>
                <div className="pre-scrollable" style={{minHeight : '80vh'}}>
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
                    {modal}
                </div>
            </div>
        );
    }  

    unmountEditor(){
        this.setState({questionToEdit : null});
    }

    unmountCreator(){
        this.setState({createQuestion : null})
    }

    updateStateToReload(isLoading){
        if(!isLoading){
            this.loadQuestions();
            this.setState({questionToEdit : null});
            this.setState({createQuestion : null})
        }else{
            this.setState({loading : isLoading})
        }     
    }

    createQuestion(){
        this.setState({createQuestion : true});
    }
    
    editQuestion(question){
        this.setState({questionToEdit : question});
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
        
        fetch('/api/questions/' + questionId, fetchConfig)
        .then((response) => {
            if(response.ok){
                this.loadQuestions();
                this.setState({loading : false})
            } else {
                this.props.history.push("/");
                Promise.reject(this);
            }
        });
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

